import type { FastjsHeaders, RequestData, RequestMethod } from "./base-types";

import type { FastjsRequest } from "./fetch-types";

export type RequestReturnData =
  | string
  | {
      [key: string]: any;
      getFullReturn: () => RequestReturn;
    };

export interface RequestReturn {
  headers: FastjsHeaders;
  response: Response;
  data: RequestReturnData;
  status: number;
  request: FastjsRequest;
  resend: () => FastjsRequest;
}

export namespace RequestHooks {
  export type BeforeSend = (
    request: FastjsRequest
  ) => boolean | undefined | Promise<boolean | undefined>;
  export type RequestSuccess = (
    response: RequestReturn
  ) => boolean | undefined | Promise<boolean | undefined>;
  export type RequestFailed = (
    error: Error | number,
    request: FastjsRequest
  ) => boolean | undefined | Promise<boolean | undefined>;
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
  headers: FastjsHeaders | null;
  resend: () => FastjsRequest;
}

export interface CallbackObject<T> {
  func: T;
  once: boolean;
  method?: RequestMethod;
}

export interface RequestCallback {
  success: CallbackObject<
    (data: RequestReturnData, response: RequestReturn) => void
  >[];
  failed: CallbackObject<(err: FailedParams<Error | number>) => void>[];
  finally: CallbackObject<(request: FastjsRequest) => void>[];
}
