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
  RequestHooks,
  CallbackObject
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
    send: (method: RequestMethod, data: RequestData = {}, url?: string) => {
      module.data = Object.assign(module.data, data);
      return sendRequest(module, method, url);
    },
    get: (data?: RequestData, url?: string) => module.send("GET", data, url),
    post: (data?: RequestData, url?: string) => module.send("POST", data, url),
    put: (data?: RequestData, url?: string) => module.send("PUT", data, url),
    delete: (data?: RequestData, url?: string) => module.send("DELETE", data, url),
    patch: (data?: RequestData, url?: string) => module.send("PATCH", data, url),
    head: (data?: RequestData, url?: string) => module.send("HEAD", data, url),
    options: (data?: RequestData, url?: string) => module.send("OPTIONS", data, url),
    then: (
      callback: (data: any, response: RequestReturn) => void,
      repeat: boolean = false,
      method: RequestMethod | null = null
    ) => {
      module.callback.success.push({
        func: callback,
        once: !repeat,
        method
      });
      return module;
    },
    catch: (
      callback: (err: FailedParams<Error | number | null>) => void,
      repeat: boolean = false,
      method: RequestMethod | null = null
    ) => {
      module.callback.failed.push({
        func: callback,
        once: !repeat,
        method
      });
      return module;
    },
    finally: (
      callback: (request: FastjsRequest) => void,
      repeat: boolean = false,
      method: RequestMethod | null = null
    ) => {
      module.callback.finally.push({
        func: callback,
        once: !repeat,
        method
      });
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
  })
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
