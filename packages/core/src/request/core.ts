import type {
  CallbackObject,
  FailedParams,
  RequestHook,
  RequestHookKey,
  RequestHooks,
  RequestReturn,
  RequestReturnData
} from "./def";
import type { FastjsHeaders, RequestMethod } from "./base-types";
import { addQuery, parse, transformPathParams } from "./lib";

import type { FastjsRequest } from "./fetch-types";
import _dev from "../dev";
import { globalConfig } from "./config";

export function sendRequest<T extends any = string | RequestReturnData>(
  request: FastjsRequest<T>,
  method: RequestMethod,
  url: string | undefined = request.url
): FastjsRequest<T> {
  if (__DEV__) {
    if (["GET", "HEAD", "OPTIONS"].includes(method) && request.config.body) {
      _dev.warn(
        "fastjs/request",
        `Body is not allowed in ${method} request, use POST instead. (HTTP 1.1)`,
        [
          `url: ${url || request.url}`,
          `*method: ${method}`,
          `*body: `,
          request.body,
          "super: ",
          request
        ],
        ["fastjs.warn"]
      );
    }
  }

  if (!url) url = request.url;

  if (!url) {
    if (__DEV__) {
      throw _dev.error(
        "fastjs/request",
        "A correct url is **required**.",
        [
          `*url: **undefined**`,
          "data: ",
          request.data,
          "config: ",
          request.config,
          "super: ",
          request
        ],
        ["fastjs.wrong", "fastjs.wrong", "fastjs.wrong"]
      );
    }
    throw new Error("A correct url is required.");
  }

  const data = {
    body: isBodyAllowed(method) ? request.data : null,
    query: (isBodyAllowed(method) ? null : request.data) || request.config.query
  };

  if (request.config.wait) {
    if (request.wait) clearTimeout(request.wait);
    request.wait = setTimeout(() => {
      passthrough();
      request.wait = null;
    }, request.config.wait);
  } else passthrough();

  return request;

  function isBodyAllowed(method: RequestMethod): boolean {
    return !["GET", "HEAD", "OPTIONS"].includes(method);
  }

  async function passthrough() {
    const hooks = request.config.hooks;
    if (!(await runHooks(hooks.before, [request])))
      return hookFailed("before", request, null);

    let pathParamMatches: string[] = [];
    [url, pathParamMatches] = transformPathParams(url!, request.data);
    for (const match of pathParamMatches) {
      delete request.data[match];
    }

    if (typeof data.body === "object") {
      request.config.headers["Content-Type"] = "application/json";
    }

    request.request = new Request(addQuery(url, data.query), {
      method,
      headers: request.config.headers,
      body: data.body ? JSON.stringify(data.body) : undefined
    });

    if (!(await runHooks(hooks.init, [request])))
      return hookFailed("init", request, null);

    const signal = request.config.timeout
      ? AbortSignal.timeout(request.config.timeout)
      : null;

    if (__DEV__ && request.config.timeout && request.config.timeout <= 1000) {
      _dev.warn(
        "fastjs/request",
        "Timeout is too short, it may cause the request to be interrupted.",
        [
          `url: ${url}`,
          `method: ${method}`,
          "body: ",
          request.body,
          `*timeout: ${request.config.timeout}`,
          "super: ",
          request
        ],
        ["fastjs.warn"]
      );
    }

    fetch(request.request, { signal })
      .then(async (response: Response) => {
        const data = await globalConfig.handler.handleResponse(
          response,
          request
        );

        const headers = response.headers as FastjsHeaders;
        headers.toArray = () => [...response.headers.entries()];
        headers.toObject = () => Object.fromEntries(response.headers.entries());

        const returnData = parse(data) as RequestReturnData;

        const requestReturn: RequestReturn = {
          headers,
          response,
          data: returnData,
          status: response.status,
          request,
          resend: () => sendRequest(request, method)
        };

        const proto = Object.create(Object.getPrototypeOf(returnData));
        proto.getFullReturn = () => requestReturn;

        Object.setPrototypeOf(returnData, proto);

        if (!globalConfig.handler.responseCode(response.status, request))
          return await handleBadResponse(requestReturn, request, passthrough);

        if (!(await runHooks(hooks.success, [requestReturn, request])))
          return hookFailed("success", request, requestReturn);

        matchCallback(request.callback.success, [data, requestReturn], method);
        matchCallback(request.callback.finally, [request], method);
      })
      .catch(async (error: Error) => {
        if (__DEV__) {
          if (error.message === "signal timed out") {
            _dev.warn(
              "fastjs/request",
              `${method} Request timed out.`,
              [
                `url: ${url}`,
                "body: ",
                request.body,
                `*timeout: ${request.config.timeout}`,
                "super: ",
                request
              ],
              ["fastjs.warn"]
            );
          }
        } else {
          _dev.warn(
            "fastjs/request",
            "Failed to send request.",
            [
              `url: ${url}`,
              `method: ${method}`,
              `body: `,
              request.body,
              `error: ${error.message}`,
              "super: ",
              request
            ],
            ["fastjs.wrong"]
          );
        }

        if (!(await runHooks(hooks.failed, [error, request])))
          return hookFailed("failed", request, null);

        const failedParams = {
          error,
          request,
          intercept: false,
          hook: null,
          response: null,
          headers: null,
          resend: () =>
            sendRequest(request, request.request?.method as RequestMethod)
        };

        request.config.failed(failedParams);
        matchCallback(request.callback.failed, [failedParams], method);
        matchCallback(request.callback.finally, [request], method);
      });
  }
}

function matchCallback(
  callback: CallbackObject<any>[],
  params: any[],
  method: RequestMethod | null
): void {
  for (let i = 0; i < callback.length; i++) {
    const call = callback[i];
    if (call.method && call.method !== method) continue;
    call.func(...params);
    if (call.once) callback.splice(i, 1), i--;
  }
}

async function handleBadResponse(
  response: RequestReturn,
  request: FastjsRequest,
  resend: Function
) {
  let status = response?.status;
  let res = response.data;
  if (__DEV__) {
    _dev.warn(
      "fastjs/request",
      `Request failed with status code ${status}`,
      [
        `url: ${request.request?.url}`,
        `method: ${request.request?.method}`,
        `*code: ${status}`,
        `*response: `,
        res,
        "super: ",
        request
      ],
      ["fastjs.wrong"]
    );
  }

  if (!(await runHooks(request.config.hooks.failed, [status, request])))
    return hookFailed("failed", request, null);

  const failedParams: FailedParams<number> = {
    error: status,
    request,
    intercept: false,
    hook: null,
    response,
    headers: response.headers,
    resend: () => sendRequest(request, request.request?.method as RequestMethod)
  };

  request.config.failed(failedParams);
  matchCallback(request.callback.failed, [failedParams], null);
  matchCallback(request.callback.finally, [request], null);
}

function hookFailed(
  hook: RequestHookKey,
  request: FastjsRequest,
  response: RequestReturn | null
) {
  const failedParams: FailedParams<Error> = {
    error: new Error(`Request interrupted by ${hook}`),
    request,
    intercept: true,
    hook,
    response,
    headers: response?.headers || null,
    resend: () => sendRequest(request, request.request?.method as RequestMethod)
  };
  request.config.failed(failedParams);
  matchCallback(request.callback.failed, [failedParams], null);
  matchCallback(request.callback.finally, [request], null);
}

async function runHooks<T extends RequestHook[] | RequestHook | undefined>(
  hooks: T,
  params: T extends RequestHooks.BeforeSend
    ? [FastjsRequest]
    : [RequestReturn | Error | number, FastjsRequest]
): Promise<boolean> {
  type FirstParam = ((number & FastjsRequest) | (Error & FastjsRequest)) &
    RequestReturn;
  if (!hooks) return true;
  if (typeof hooks === "function") {
    const result = await hooks(
      params[0] as FirstParam,
      params[1] as FastjsRequest
    );
    return result ?? true;
  }
  let result = true;
  for (const hook of hooks as RequestHook[]) {
    const hookResult = await hook(
      params[0] as FirstParam,
      params[1] as FastjsRequest
    );
    if (hookResult === false) {
      result = false;
      if (!globalConfig.hooks.runAll) break;
    }
  }
  return result;
}
