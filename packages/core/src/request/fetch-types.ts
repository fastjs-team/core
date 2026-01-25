import type { RequestData, RequestMethod } from "./base-types";
import type {
  FailedParams,
  RequestCallback,
  RequestReturn,
  RequestReturnData
} from "./def";

import type { FastjsModuleBase } from "../base/def";
import type { RequestConfig } from "./config";

export interface FastjsRequestAtom {
  readonly construct: "FastjsRequest";
  url?: string;
  data: RequestData;
  config: RequestConfig;
  callback: RequestCallback;
  request?: Request;
  response?: Response;
  wait?: NodeJS.Timeout | null;
}

type FastjsRequestWrapped = (() => FastjsRequest) &
  ((url: string) => FastjsRequest) &
  ((data?: RequestData) => FastjsRequest) &
  ((url: string, data?: RequestData) => FastjsRequest) &
  ((data?: RequestData, url?: string) => FastjsRequest);

export interface FastjsRequestAPI {
  send: (
    method: RequestMethod,
    data?: RequestData,
    url?: string
  ) => FastjsRequest;
  get: FastjsRequestWrapped;
  post: FastjsRequestWrapped;
  put: FastjsRequestWrapped;
  delete: FastjsRequestWrapped;
  patch: FastjsRequestWrapped;
  head: FastjsRequestWrapped;
  options: FastjsRequestWrapped;
  then: (
    callback: (data: RequestReturnData, response: RequestReturn) => void,
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
  Omit<FastjsModuleBase, "then">;
