import _dev from "../dev";
import { createModule } from "../base";
import { createConfig, globalConfig } from "./config";
import { addQuery, parse } from "./lib";

import type { FastjsRequest, FastjsRequestAtom } from "./fetch-types";
import type { RequestConfig } from "./config";
import type {
  RequestData,
  RequestCallback,
  RequestMethod,
  RequestReturn,
  FailedParams,
  RequestHooks
} from "./def";

export function createRequest(
  url: string,
  data: RequestData | null = null,
  config?: Partial<RequestConfig>
): FastjsRequest {
  if (__DEV__ && typeof url !== "string") {
    throw _dev.error(
      "fastjs/request",
      "A correct url is **required**.",
      [`***url: ${url}`, "data: ", data, "config: ", config],
      ["fastjs.wrong"]
    );
  }

  const moduleAtom = createModule<FastjsRequestAtom>(() => ({
    construct: "FastjsRequest",
    url,
    data: data || {},
    config: createConfig(config),
    callback: createCallback()
  }));

  const module: FastjsRequest = Object.assign(moduleAtom, {
    send: (method: RequestMethod, data: RequestData = {}) => {
      module.data = Object.assign(module.data, data);
      return sendRequest(module, method);
    },
    get: (data?: RequestData) => module.send("GET", data),
    post: (data?: RequestData) => module.send("POST", data),
    put: (data?: RequestData) => module.send("PUT", data),
    delete: (data?: RequestData) => module.send("DELETE", data),
    patch: (data?: RequestData) => module.send("PATCH", data),
    head: (data?: RequestData) => module.send("HEAD", data),
    options: (data?: RequestData) => module.send("OPTIONS", data),
    then: (callback: (data: any, response: RequestReturn) => void) => {
      module.callback.success.push(callback);
      return module;
    },
    catch: (callback: (err: FailedParams<Error | number | null>) => void) => {
      module.callback.failed.push(callback);
      return module;
    },
    finally: (callback: (request: FastjsRequest) => void) => {
      module.callback.finally.push(callback);
      return module;
    }
  });

  return module;
}

function createCallback(): RequestCallback {
  return {
    success: [],
    failed: [],
    finally: []
  };
}

function sendRequest(
  request: FastjsRequest,
  method: RequestMethod
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

    request.request = new Request(addQuery(request.url, data.query), {
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

        request.callback.success.forEach((func) => func(data, requestReturn));
        request.callback.finally.forEach((func) => func(request));
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
        request.callback.failed.forEach((func) => func(failedParams));
      });
  }
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
  request.callback.failed.forEach((func) => func(failedParams));
  request.callback.finally.forEach((func) => func(request));
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
