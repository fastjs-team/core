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

export type RequestHooks =
  | "before"
  | "init"
  | "success"
  | "failed"
  | "callback";

export interface FailedParams<T extends Error | number | null> {
  error: T;
  request: FastjsRequest;
  intercept: boolean;
  hook: RequestHooks | null;
  response: RequestReturn | null;
}

export interface CallbackObject<T> {
  func: T;
  once: boolean;
  method?: RequestMethod;
}

export interface RequestCallback {
  success: CallbackObject<(data: any, response: RequestReturn) => void>[];
  failed: CallbackObject<(err: FailedParams<Error | number | null>) => void>[];
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
