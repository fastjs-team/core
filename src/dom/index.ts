import selector from "./selector";
import FastjsDom from "./dom";
import { createFastjsDomList } from "./dom-list";
import type { FastjsDomProps } from "./def";

export default {
  select: selector,
  newEl: (
    el: FastjsDom | HTMLElement | Element | string,
    properties?: FastjsDomProps
  ) => new FastjsDom(el, properties),
  newElList: (list: Array<FastjsDom | HTMLElement>) =>
    createFastjsDomList(list)
};
export { selector, FastjsDom, createFastjsDomList };
