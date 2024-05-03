import _selector from "./selector-atom";
import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";

import type { EachCallback } from "./def";

import type { FastjsDom } from "./dom-types";
import type { FastjsDomList, FastjsDomListAPI } from "./dom-list-types";

export function createMethods(list: FastjsDomList): FastjsDomListAPI {
  return {
    add(el: FastjsDom) {
      list.push(el);
      return list;
    },
    delete(key: number, deleteDom = true) {
      if (deleteDom) list[key].remove();
      list.splice(key, 1);
      return list;
    },
    each(callback: EachCallback) {
      list.forEach((el: FastjsDom, i: number) => callback(el, el.el(), i));
      return list;
    },
    el(key = 0) {
      return list[key].el();
    },
    getElement(key = 0) {
      return this.el(key);
    },
    getDom(key = 0) {
      return list[key];
    },
    next<
      T extends FastjsDom | FastjsDomList | null =
      | FastjsDom
      | FastjsDomList
      | null
    >(el: string = "*"): T {
      const result = _selector(el, this.toElArray());
      if (result instanceof HTMLElement)
        return createFastjsDom(result) as FastjsDom as T;
      if (result === null) return null as T;
      return createFastjsDomList(result) as FastjsDomList as T;
    },
    toArray() {
      return list;
    },
    toElArray() {
      return list.map((e: FastjsDom) => e.el());
    }
  };
}
