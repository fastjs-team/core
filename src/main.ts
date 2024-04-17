// all modules
import dom from "./dom";
import date from "./date";
import request from "./request";
import utils from "./utils/index";

import { rand, copy } from "./utils/index";

import { FastjsExpression } from "./base";
import { PushTarget, InsertTarget } from "./dom/def";

import type { FastjsDom, FastjsDomList } from "./dom";
import type { FastjsDate } from "./date";
import type { FastjsRequest } from "./request";

if (__DEV__) {
  console.info(
    "You are running fastjs in development mode.\n" +
      "Make sure to use the production build (*.prod.js) when deploying for production."
  );
}

// export
export {
  dom,
  date,
  request,
  /** @module utils */
  utils,
  rand,
  copy,
  /** @description enums */
  PushTarget,
  InsertTarget,
  FastjsExpression
};
export type { FastjsDom, FastjsDate, FastjsDomList, FastjsRequest };
export type * from "./dom/def";
export type * from "./dom/css";
export type * from "./date/def";
export type * from "./request/config";
