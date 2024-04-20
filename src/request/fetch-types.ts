import type {
  RequestData,
  RequestReturn,
  RequestMethod,
  FailedParams,
  RequestCallback
} from "./def";
import type { RequestConfig } from "./config";

import type { FastjsModuleBase } from "../base/def";

export interface FastjsRequestAtom {
  readonly construct: "FastjsRequest";
  url: string;
  data: RequestData;
  config: RequestConfig;
  callback: RequestCallback;
  request?: Request;
  response?: Response;
  wait?: NodeJS.Timeout | null;
}

export interface FastjsRequestAPI {
  send: (method: RequestMethod, data?: RequestData) => FastjsRequest;
  get: (data?: RequestData) => FastjsRequest;
  post: (data?: RequestData) => FastjsRequest;
  put: (data?: RequestData) => FastjsRequest;
  delete: (data?: RequestData) => FastjsRequest;
  patch: (data?: RequestData) => FastjsRequest;
  head: (data?: RequestData) => FastjsRequest;
  options: (data?: RequestData) => FastjsRequest;
  then: (
    callback: (data: any, response: RequestReturn) => void
  ) => FastjsRequest;
  catch: (
    callback: (error: FailedParams<Error | number | null>) => void
  ) => FastjsRequest;
  finally: (callback: (request: FastjsRequest) => void) => FastjsRequest;
}

export type FastjsRequest = FastjsRequestAtom &
  FastjsRequestAPI &
  FastjsModuleBase;
