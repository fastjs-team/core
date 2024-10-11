import * as basic from "./basic";
import * as dom from "./dom";
import * as rand from "./rand";

export default {
  ...basic,
  ...dom,
  ...rand
};
export * from "./dom";
export * from "./rand";
export * from "./basic";
