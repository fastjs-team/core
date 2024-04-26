import _dev from "../dev";

import type { FastjsRequest } from "./fetch-types";
import type { FailedParams, RequestHooks } from "./def";
import type { RequestReturn } from "./def";

export interface GlobalConfig {
  timeout: number;
  hooks: {
    before?: RequestHooks.BeforeSend;
    init?: RequestHooks.BeforeSend;
    success?: RequestHooks.RequestSuccess;
    failed?: RequestHooks.RequestFailed;
  };
  handler: {
    handleResponse: (
      response: Response,
      request: FastjsRequest
    ) => Promise<any>;
    responseCode: (code: number, request: FastjsRequest) => boolean;
  };
  check: {
    ignoreFormatWarning: boolean;
    stringBodyWarning: boolean;
    unrecommendedMethodWarning: boolean;
  };
}

export const globalConfig: GlobalConfig = {
  timeout: 5000,
  hooks: {},
  handler: {
    handleResponse: async (
      response: Response,
      request: FastjsRequest
    ): Promise<object | string> => {
      if (response.headers.get("Content-Type")?.includes("application/json"))
        return await response.json();
      return await response.text();
    },
    responseCode: (code: number): boolean => {
      return code >= 200 && code < 300;
    }
  },
  check: {
    ignoreFormatWarning: false,
    stringBodyWarning: true,
    unrecommendedMethodWarning: true
  }
};

export function createConfig(
  config: Partial<RequestConfig> = {}
): RequestConfig {
  return {
    timeout: config.timeout || globalConfig.timeout,
    headers: config.headers || {},
    wait: config.wait || 0,
    failed: config.failed || (() => 0),
    callback: config.callback || (() => 0),
    query: config.query || null,
    body: config.body || null,
    hooks: {
      before: config.hooks?.before || globalConfig.hooks.before || (() => true),
      init: config.hooks?.init || globalConfig.hooks.init || (() => true),
      success:
        config.hooks?.success || globalConfig.hooks.success || (() => true),
      failed: config.hooks?.failed || globalConfig.hooks.failed || (() => true)
    }
  };
}

export interface RequestConfig {
  timeout: number;
  headers: {
    [key: string]: string;
  };
  wait: number;
  failed: (error: FailedParams<Error | number | null>) => void;
  callback: (data: any, response: RequestReturn) => void;
  query:
    | {
        [key: string]: any;
      }
    | string
    | null;
  body:
    | {
        [key: string]: any;
      }
    | string
    | null;
  hooks: {
    before: RequestHooks.BeforeSend;
    init: RequestHooks.BeforeSend;
    success: RequestHooks.RequestSuccess;
    failed: RequestHooks.RequestFailed;
  };
}
