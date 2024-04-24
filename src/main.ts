import dom from "./dom";
import date from "./date";
import request from "./request";
import utils from "./utils/index";

import type { FastjsDate } from "./date";
import type { FastjsRequest } from "./request";

if (__DEV__ && !__TEST__ && !__ESM_BUNDLER__) {
  console.info(
    "You are running fastjs in development mode.\n" +
      "Make sure to use the production build (*.prod.js) when deploying for production."
  );
}

export {
  date,
  request,
};
export type { FastjsDate, FastjsRequest };

export * as dom from "./dom/index";
export type * from "./dom/index";
export * as cookie from "./cookie/index";
export type * from "./cookie/index";
export type * from "./dom/def";
export type * from "./dom/dom-types";
export type * from "./dom/dom-list-types";
export type * from "./date/def";
export type * from "./date/date-types";
export type * from "./request/def";
export type * from "./request/config";
export type * from "./request/fetch-types";
