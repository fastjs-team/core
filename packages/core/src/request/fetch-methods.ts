import type { FailedParams, RequestReturn, RequestReturnData } from "./def";
import type { FastjsRequest, FastjsRequestAPI } from "./fetch-types";
import type { RequestData, RequestMethod } from "./base-types";

import { sendRequest } from "./core";

export function createMethods(request: FastjsRequest): FastjsRequestAPI {
  const send = <T extends any = string | RequestReturnData>(
    method: RequestMethod,
    data: RequestData = {},
    url?: string
  ): FastjsRequest<T> => {
    request.data = Object.assign(request.data, data);
    return sendRequest<T>(request as FastjsRequest<T>, method, url);
  };

  function wrappedFunctionHandler<T extends any = string | RequestReturnData>(
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

    return send<T>(method, data, url);
  }

  function unifiedRequest(method: RequestMethod) {
    return <T extends any = string | RequestReturnData>(p1?: RequestData | string, p2?: string | RequestData) =>
      wrappedFunctionHandler<T>(method, p1, p2);
  }

  const methods: FastjsRequestAPI = {
    send,
    get: unifiedRequest("GET"),
    post: unifiedRequest("POST"),
    put: unifiedRequest("PUT"),
    delete: unifiedRequest("DELETE"),
    patch: unifiedRequest("PATCH"),
    head: unifiedRequest("HEAD"),
    options: unifiedRequest("OPTIONS"),
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
