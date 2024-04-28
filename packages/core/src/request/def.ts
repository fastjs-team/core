import type { FastjsRequest } from "./fetch-types";

export interface RequestData {
  [key: string]: any;
}

export interface RequestReturn {
  headers: Array<[string, string]>;
  headersObj: Record<string, string>;
  response: any;
  data: any;
  status: number;
  request: FastjsRequest;
  resend: () => FastjsRequest;
}

export namespace RequestHooks {
  export type BeforeSend = (request: FastjsRequest) => boolean;
  export type RequestSuccess = (response: RequestReturn) => boolean;
  export type RequestFailed = (
    error: Error | number,
    request: FastjsRequest
  ) => boolean;
}

export interface RequestHookObject {
  before: RequestHooks.BeforeSend[];
  init: RequestHooks.BeforeSend[];
  success: RequestHooks.RequestSuccess[];
  failed: RequestHooks.RequestFailed[];
  runAll: boolean;
}

export interface RequestHookParam {
  before?: RequestHooks.BeforeSend[] | RequestHooks.BeforeSend;
  init?: RequestHooks.BeforeSend[] | RequestHooks.BeforeSend;
  success?: RequestHooks.RequestSuccess[] | RequestHooks.RequestSuccess;
  failed?: RequestHooks.RequestFailed[] | RequestHooks.RequestFailed;
  runAll?: boolean;
}

export type RequestHook =
  | RequestHooks.BeforeSend
  | RequestHooks.RequestSuccess
  | RequestHooks.RequestFailed;

export type RequestHookKey = "before" | "init" | "success" | "failed";

export interface FailedParams<T extends Error | number> {
  error: T;
  request: FastjsRequest;
  intercept: boolean;
  hook: RequestHookKey | null;
  response: RequestReturn | null;
}

export interface CallbackObject<T> {
  func: T;
  once: boolean;
  method?: RequestMethod;
}

export interface RequestCallback {
  success: CallbackObject<(data: any, response: RequestReturn) => void>[];
  failed: CallbackObject<(err: FailedParams<Error | number>) => void>[];
  finally: CallbackObject<(request: FastjsRequest) => void>[];
}

export type RequestMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";
