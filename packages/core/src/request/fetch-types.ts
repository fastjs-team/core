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
  send: (
    method: RequestMethod,
    data?: RequestData,
    url?: string
  ) => FastjsRequest;
  get: (data?: RequestData, url?: string) => FastjsRequest;
  post: (data?: RequestData, url?: string) => FastjsRequest;
  put: (data?: RequestData, url?: string) => FastjsRequest;
  delete: (data?: RequestData, url?: string) => FastjsRequest;
  patch: (data?: RequestData, url?: string) => FastjsRequest;
  head: (data?: RequestData, url?: string) => FastjsRequest;
  options: (data?: RequestData, url?: string) => FastjsRequest;
  then: (
    callback: (data: any, response: RequestReturn) => void,
    repeat?: boolean,
    method?: RequestMethod
  ) => FastjsRequest;
  catch: (
    callback: (error: FailedParams<Error | number>) => void,
    repeat?: boolean,
    method?: RequestMethod
  ) => FastjsRequest;
  finally: (callback: (request: FastjsRequest) => void) => FastjsRequest;
}

export type FastjsRequest = FastjsRequestAtom &
  FastjsRequestAPI &
  FastjsModuleBase;
