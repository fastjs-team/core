import { createConfig, globalConfig } from "./config";
import { createRequest } from "./fetch";

import type { RequestData, RequestMethod } from "./base-types";
import type { RequestConfig } from "./config";
import type { FastjsRequest } from "./fetch-types";
import { RequestReturnData } from "./def";

const create = (
  url?: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config);
};

function unifiedRequest(method: RequestMethod) {
  return <T extends any = string | RequestReturnData>(
    url: string,
    data?: RequestData,
    config?: Partial<RequestConfig>
  ): FastjsRequest<T> => {
    return createRequest(url, data, config)[
      method.toLowerCase()
    ]() as FastjsRequest<T>;
  };
}

export default {
  get: unifiedRequest("GET"),
  post: unifiedRequest("POST"),
  put: unifiedRequest("PUT"),
  delete: unifiedRequest("DELETE"),
  patch: unifiedRequest("PATCH"),
  head: unifiedRequest("HEAD"),
  create,
  request: createConfig,
  config: globalConfig
};

export type * from "./base-types";
export type * from "./def";
export type * from "./config";
export type * from "./fetch-types";
