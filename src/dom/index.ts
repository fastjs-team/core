import selector from "./selector";
import FastjsDom from "./dom";
import { createFastjsDomList } from "./dom-list";

import type { FastjsDomProps } from "./def";
import type { FastjsDomList } from "./dom-list";

export default {
  select: selector,
  newEl: (
    el: FastjsDom | HTMLElement | Element | string,
    properties?: FastjsDomProps
  ) => new FastjsDom(el, properties),
  newElList: (list: Array<FastjsDom | HTMLElement>): FastjsDomList => createFastjsDomList(list)
};
export { selector, FastjsDom, createFastjsDomList };
