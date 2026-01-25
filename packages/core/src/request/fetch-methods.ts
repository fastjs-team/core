import type { FailedParams, RequestReturn, RequestReturnData } from "./def";
import type { FastjsRequest, FastjsRequestAPI } from "./fetch-types";
import type { RequestData, RequestMethod } from "./base-types";

import { sendRequest } from "./core";

export function createMethods(request: FastjsRequest): FastjsRequestAPI {
  const send = (
    method: RequestMethod,
    data: RequestData = {},
    url?: string
  ) => {
    request.data = Object.assign(request.data, data);
    return sendRequest(request, method, url);
  };

  function wrappedFunctionHandler(
    method: RequestMethod,
    p1?: RequestData | string,
    p2?: string | RequestData
  ) {
    let data: RequestData = {};
    let url: string = "";

    if (p1) {
      if (typeof p1 === "string") url = p1;
      else data = p1;

      if (p2) {
        if (typeof p2 === "string") url = p2;
        else data = p2;
      }
    }

    return send(method, data, url);
  }

  const methods: FastjsRequestAPI = {
    send,
    get: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("GET", p1, p2),
    post: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("POST", p1, p2),
    put: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("PUT", p1, p2),
    delete: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("DELETE", p1, p2),
    patch: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("PATCH", p1, p2),
    head: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("HEAD", p1, p2),
    options: (p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler("OPTIONS", p1, p2),
    then: (
      callback: (data: RequestReturnData, response: RequestReturn) => void,
      repeat: boolean = false,
      method?: RequestMethod
    ) => {
      request.callback.success.push({
        func: callback,
        once: !repeat,
        method
      });
      return request;
    },
    catch: (
      callback: (err: FailedParams<Error | number>) => void,
      repeat: boolean = false,
      method?: RequestMethod
    ) => {
      request.callback.failed.push({
        func: callback,
        once: !repeat,
        method
      });
      return request;
    },
    finally: (
      callback: (request: FastjsRequest) => void,
      repeat: boolean = false,
      method?: RequestMethod
    ) => {
      request.callback.finally.push({
        func: callback,
        once: !repeat,
        method
      });
      return request;
    }
  };

  return methods;
}
