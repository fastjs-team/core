import type { FastjsRequest, FastjsRequestAtom } from "./fetch-types";

import type { RequestCallback } from "./def";
import type { RequestConfig } from "./config";
import type { RequestData } from "./base-types";
import { createConfig } from "./config";
import { createMethods } from "./fetch-methods";
import { createModule } from "../base";

export function createRequest(
  url?: string,
  data: RequestData | null = null,
  config?: Partial<RequestConfig>
): FastjsRequest {
  const moduleAtom = createModule<FastjsRequestAtom>(() => ({
    construct: "FastjsRequest",
    url,
    data: data || {},
    config: createConfig(config),
    callback: createCallback()
  }));

  const module: FastjsRequest = Object.assign(
    moduleAtom,
    createMethods(moduleAtom as unknown as FastjsRequest)
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
