import _dev from "../dev";
import { sendRequest } from "./core";

import type { FastjsRequest, FastjsRequestAPI } from "./fetch-types";
import type {
  RequestData,
  RequestMethod,
  RequestReturn,
  FailedParams
} from "./def";

export function createMethods(request: FastjsRequest): FastjsRequestAPI {
  const send = (method: RequestMethod, data: RequestData = {}, url?: string) => {
    request.data = Object.assign(request.data, data);
    return sendRequest(request, method, url);
  };

  const methods: FastjsRequestAPI = {
    send,
    get: (data?: RequestData, url?: string) => send("GET", data, url),
    post: (data?: RequestData, url?: string) => send("POST", data, url),
    put: (data?: RequestData, url?: string) => send("PUT", data, url),
    delete: (data?: RequestData, url?: string) => send("DELETE", data, url),
    patch: (data?: RequestData, url?: string) => send("PATCH", data, url),
    head: (data?: RequestData, url?: string) => send("HEAD", data, url),
    options: (data?: RequestData, url?: string) => send("OPTIONS", data, url),
    then: (
      callback: (data: any, response: RequestReturn) => void,
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
