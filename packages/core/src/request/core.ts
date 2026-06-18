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

const NO_BODY_METHODS = new Set<RequestMethod>(["GET", "HEAD", "OPTIONS"]);

function isBodyAllowed(method: RequestMethod): boolean {
  return !NO_BODY_METHODS.has(method);
}

function isPlainBody(body: unknown): body is Record<string, any> {
  if (body === null || typeof body !== "object") return false;
  if (typeof FormData !== "undefined" && body instanceof FormData) return false;
  if (typeof Blob !== "undefined" && body instanceof Blob) return false;
  if (typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams)
    return false;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView(body))
    return false;
  if (typeof ArrayBuffer !== "undefined" && body instanceof ArrayBuffer)
    return false;
  if (typeof ReadableStream !== "undefined" && body instanceof ReadableStream)
    return false;
  return true;
}

function ensureFetchAvailable(): boolean {
  if (typeof fetch === "function") return true;
  if (__DEV__) {
    _dev.warn(
      "fastjs/request",
      "global fetch is not available; install a polyfill or upgrade to Node >= 18.",
      []
    );
  }
  return false;
}

export function sendRequest<T extends any = string | RequestReturnData>(
  request: FastjsRequest<T>,
  method: RequestMethod,
  url: string | undefined = request.url
): FastjsRequest<T> {
  if (__DEV__) {
    if (NO_BODY_METHODS.has(method) && request.config.body) {
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

  async function passthrough() {
    if (!ensureFetchAvailable()) {
      const error = new Error("global fetch is not available");
      const failedParams: FailedParams<Error> = {
        error,
        request,
        intercept: false,
        hook: null,
        response: null,
        headers: null,
        resend: () => sendRequest(request, method)
      };
      request.config.failed(failedParams);
      matchCallback(request.callback.failed, [failedParams], method);
      matchCallback(request.callback.finally, [request], method);
      return;
    }

    const hooks = request.config.hooks;
    if (!(await runHooks(hooks.before, [request], hooks.runAll)))
      return hookFailed("before", request, null);

    let pathParamMatches: string[] = [];
    [url, pathParamMatches] = transformPathParams(url!, request.data);
    for (const match of pathParamMatches) {
      delete request.data[match];
    }

    const headers: Record<string, string> = { ...request.config.headers };
    let serializedBody: BodyInit | undefined = undefined;
    if (isBodyAllowed(method) && data.body !== null && data.body !== undefined) {
      if (isPlainBody(data.body)) {
        serializedBody = JSON.stringify(data.body);
        if (!hasHeader(headers, "Content-Type")) {
          headers["Content-Type"] = "application/json";
        }
      } else if (typeof data.body === "string") {
        serializedBody = data.body;
      } else {
        // Pass-through for FormData, Blob, URLSearchParams, ArrayBuffer, etc.
        serializedBody = data.body as BodyInit;
      }
    }

    const controller =
      typeof AbortController !== "undefined" ? new AbortController() : null;
    if (controller) request.abortController = controller;
    const timeoutSignal =
      request.config.timeout && typeof AbortSignal !== "undefined" &&
      typeof AbortSignal.timeout === "function"
        ? AbortSignal.timeout(request.config.timeout)
        : null;
    const signal = pickSignal(controller?.signal, timeoutSignal);

    request.request = new Request(addQuery(url, data.query), {
      method,
      headers,
      body: serializedBody
    });

    if (!(await runHooks(hooks.init, [request], hooks.runAll)))
      return hookFailed("init", request, null);

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

    fetch(request.request, signal ? { signal } : undefined)
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

        if (returnData !== null && typeof returnData === "object") {
          const proto = Object.create(Object.getPrototypeOf(returnData));
          proto.getFullReturn = () => requestReturn;
          Object.setPrototypeOf(returnData, proto);
        }

        if (!globalConfig.handler.responseCode(response.status, request))
          return await handleBadResponse(requestReturn, request, passthrough);

        if (
          !(await runHooks(
            hooks.success,
            [requestReturn, request],
            hooks.runAll
          ))
        )
          return hookFailed("success", request, requestReturn);

        matchCallback(request.callback.success, [data, requestReturn], method);
        matchCallback(request.callback.finally, [request], method);
      })
      .catch(async (error: Error) => {
        if (__DEV__) {
          if (
            error.name === "TimeoutError" ||
            error.message === "signal timed out"
          ) {
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
        }

        if (!(await runHooks(hooks.failed, [error, request], hooks.runAll)))
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

function hasHeader(headers: Record<string, string>, name: string): boolean {
  const target = name.toLowerCase();
  return Object.keys(headers).some((key) => key.toLowerCase() === target);
}

function pickSignal(
  ...signals: Array<AbortSignal | null | undefined>
): AbortSignal | null {
  const valid = signals.filter(Boolean) as AbortSignal[];
  if (valid.length === 0) return null;
  if (valid.length === 1) return valid[0];
  if (typeof (AbortSignal as any)?.any === "function") {
    return (AbortSignal as any).any(valid) as AbortSignal;
  }
  return valid[0];
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

  if (
    !(await runHooks(
      request.config.hooks.failed,
      [status, request],
      request.config.hooks.runAll
    ))
  )
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
    : [RequestReturn | Error | number, FastjsRequest],
  runAll: boolean | undefined
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
      if (!runAll) break;
    }
  }
  return result;
}
