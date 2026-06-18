import type {
  FailedParams,
  RequestCallback,
  RequestReturn,
  RequestReturnData,
  RequestReturnProto
} from "./def";
import type { RequestData, RequestMethod } from "./base-types";

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
  /**
   * Cross-platform timer handle returned by `setTimeout` (`number` in
   * browsers, `NodeJS.Timeout` in Node). Stored when `config.wait` is
   * used to debounce subsequent calls.
   */
  wait?: ReturnType<typeof setTimeout> | null;
  /** Created lazily per in-flight request; call `abort()` to cancel. */
  abortController?: AbortController;
}

type FastjsRequestWrapped = (<
  T extends any = string | RequestReturnData
>() => FastjsRequest<T>) &
  (<T extends any = string | RequestReturnData>(
    url: string
  ) => FastjsRequest<T>) &
  (<T extends any = string | RequestReturnData>(
    data?: RequestData
  ) => FastjsRequest<T>) &
  (<T extends any = string | RequestReturnData>(
    url: string,
    data?: RequestData
  ) => FastjsRequest<T>) &
  (<T extends any = string | RequestReturnData>(
    data?: RequestData,
    url?: string
  ) => FastjsRequest<T>);

export interface FastjsRequestAPI<T extends any = string | RequestReturnData> {
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
  /**
   * Cancel the in-flight request, if any. Cancelling is a no-op when
   * no request has been dispatched yet.
   */
  abort: (reason?: any) => FastjsRequest<T>;
  then: (
    callback: (data: T & RequestReturnProto, response: RequestReturn) => void,
    repeat?: boolean,
    method?: RequestMethod
  ) => FastjsRequest<T>;
  catch: (
    callback: (error: FailedParams<Error | number>) => void,
    repeat?: boolean,
    method?: RequestMethod
  ) => FastjsRequest;
  finally: (callback: (request: FastjsRequest) => void) => FastjsRequest;
}

export type FastjsRequest<T extends any = string | RequestReturnData> =
  FastjsRequestAtom & FastjsRequestAPI<T> & Omit<FastjsModuleBase, "then">;
