import selector from "./selector";
import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";

import type { FastjsDomProps } from "./def";
import type { FastjsDom } from "./dom-types";
import type { FastjsDomList } from "./dom-list-types";

export default {
  select: selector,
  newEl: (
    el: FastjsDom | HTMLElement | Element | string,
    properties?: FastjsDomProps
  ) => createFastjsDom(el, properties),
  newElList: (
    list: Array<FastjsDom | HTMLElement | Element | null | undefined>
  ): FastjsDomList => createFastjsDomList(list)
};
export { selector, createFastjsDom, createFastjsDomList };
export type * from "./def";
export type * from "./dom-types";
export type * from "./dom-list-types";
