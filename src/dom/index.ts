import selector from "./selector";
import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";

export const select = selector;
export const newEl = createFastjsDom;
export const newElList = createFastjsDomList;

export type * from "./def";
export type * from "./dom-types";
export type * from "./dom-list-types";
