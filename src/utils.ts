import type { FastjsDom } from "./dom/dom-types";
import type { FastjsDomList } from "./dom/dom-list-types";

export function isUndefined(value: any): value is undefined {
  return value === undefined;
}

export function isDom(value: any): value is FastjsDom {
  return value.construct === "FastjsDom";
}

export function isDomList(value: any): value is FastjsDomList {
  return value.construct === "FastjsDomList";
}
