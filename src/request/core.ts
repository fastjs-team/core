import _dev from "../dev";
import { addQuery, parse } from "./lib";
import { globalConfig } from "./config";

import type { FastjsRequest } from "./fetch-types";
import type {
  RequestHooks,
  RequestMethod,
  RequestReturn,
  CallbackObject,
  FailedParams
} from "./def";

export function sendRequest(
  request: FastjsRequest,
  method: RequestMethod,
  url?: string
): FastjsRequest {
  if (__DEV__) {
    if (["GET", "HEAD", "OPTIONS"].includes(method) && request.config.body) {
      _dev.warn(
        "fastjs/request",
        `Body is not allowed in ${method} request, use POST instead. (HTTP 1.1)`,
        [
          `url: ${request.url}`,
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

  const data = {
    body: isBodyAllowed(method) ? request.data : null,
    query: (isBodyAllowed(method) ? null : request.data) || request.config.query
  };

  // Debounce
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
    if (!hooks.before(request)) return request.hookFailed("before");

    request.request = new Request(addQuery(url || request.url, data.query), {
      method,
      headers: request.config.headers,
      body: data.body as BodyInit
    });

    if (!hooks.init(request))
      return generateHookFailedResponse("init", request, null);

    fetch(request.request)
      .then(async (response: Response) => {
        const data = await globalConfig.handler.handleResponse(
          response,
          request
        );

        const requestReturn: RequestReturn = {
          headers: [...response.headers.entries()],
          headersObj: Object.fromEntries(response.headers.entries()),
          response,
          data: parse(data),
          status: response.status,
          request,
          resend: () => sendRequest(request, method)
        };

        if (!globalConfig.handler.responseCode(response.status, request))
          return handleBadResponse(requestReturn, request, passthrough);

        if (!hooks.success(requestReturn))
          return generateHookFailedResponse("success", request, requestReturn);

        matchCallback(request.callback.success, [data, requestReturn], method);
        matchCallback(request.callback.finally, [request], method);
      })
      .catch((error: Error) => {
        if (__DEV__)
          _dev.warn(
            "fastjs/request",
            "Failed to send request.",
            [
              `url: ${request.url}`,
              `method: ${method}`,
              `body: `,
              request.body,
              `error: ${error.message}`,
              "super: ",
              request
            ],
            ["fastjs.wrong"]
          );

        if (!hooks.failed(error, request))
          return generateHookFailedResponse("failed", request, null);

        const failedParams = {
          error,
          request,
          intercept: false,
          hook: null,
          response: null
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
  callback.forEach((call) => {
    if (call.method && call.method !== method) return;
    call.func(...params);
    if (call.once) callback.splice(callback.indexOf(call), 1);
  });
}

function handleBadResponse(
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
        `url: ${request.url}`,
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

  if (!request.config.hooks.failed(status, request))
    return generateHookFailedResponse("failed", request, null);

  const failedParams: FailedParams<number> = {
    error: status,
    request,
    intercept: false,
    hook: null,
    response
  };

  request.config.failed(failedParams);
  matchCallback(request.callback.failed, [failedParams], null);
  matchCallback(request.callback.finally, [request], null);
}

function generateHookFailedResponse(
  hook: RequestHooks,
  request: FastjsRequest,
  response: RequestReturn | null
): FailedParams<Error> {
  return {
    error: new Error(`Request interrupted by ${hook}`),
    request,
    intercept: true,
    hook,
    response
  };
}
