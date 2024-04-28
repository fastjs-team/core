import { createConfig, globalConfig } from "./config";
import { createRequest } from "./fetch";

import type { RequestData } from "./def";
import type { RequestConfig } from "./config";
import type { FastjsRequest } from "./fetch-types";

const create = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config);
};
const get = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config).get();
};
const post = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config).post();
};
const put = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config).put();
};
const del = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config).delete();
};
const patch = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config).patch();
};

const head = (
  url: string,
  data?: RequestData,
  config?: Partial<RequestConfig>
): FastjsRequest => {
  return createRequest(url, data, config).head();
};

export default {
  get,
  post,
  put,
  delete: del,
  patch,
  head,
  create,
  request: createConfig,
  config: globalConfig
};

export type * from "./def";
export type * from "./config";
export type * from "./fetch-types";
