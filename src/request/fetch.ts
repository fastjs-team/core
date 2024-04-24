import _dev from "../dev";
import { createModule } from "../base";
import { createConfig } from "./config";

import type { FastjsRequest, FastjsRequestAtom } from "./fetch-types";
import type { RequestConfig } from "./config";
import type { RequestData, RequestCallback } from "./def";
import { createMethods } from "./fetch-methods";

export function createRequest(
  url: string,
  data: RequestData | null = null,
  config?: Partial<RequestConfig>
): FastjsRequest {
  if (__DEV__ && typeof url !== "string") {
    throw _dev.error(
      "fastjs/request",
      "A correct url is **required**.",
      [`***url: ${url}`, "data: ", data, "config: ", config],
      ["fastjs.wrong"]
    );
  }

  const moduleAtom = createModule<FastjsRequestAtom>(() => ({
    construct: "FastjsRequest",
    url,
    data: data || {},
    config: createConfig(config),
    callback: createCallback()
  }));

  const module: FastjsRequest = Object.assign(
    moduleAtom,
    createMethods(moduleAtom as FastjsRequest)
  );

  return module;
}

function createCallback(): RequestCallback {
  return {
    success: [],
    failed: [],
    finally: []
  };
}
