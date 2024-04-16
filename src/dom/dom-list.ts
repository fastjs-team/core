import FastjsDom from "./dom";
import _dev from "../dev";
import _selector from "./selector-atom";
import type { EachCallback } from "./def";
import { isUndefined, isDom } from "../utils";

export interface FastjsDomList extends FastjsDom {
  construct: "FastjsDomList";
  _list: Array<FastjsDom>;
  length: number;
  add(el: FastjsDom): FastjsDomList;
  delete(key: number, deleteDom?: boolean): FastjsDomList;
  each(callback: EachCallback): FastjsDomList;
  el(key?: number): HTMLElement;
  getElement(key?: number): HTMLElement;
  getDom(key?: number): FastjsDom;
  next(el: string): FastjsDom | FastjsDomList | null;
  toArray(): Array<FastjsDom>;
  toElArray(): Array<HTMLElement>;
  [key: number]: FastjsDom;
}

export function createFastjsDomList(list: Array<FastjsDom | HTMLElement | Element>) {
  const domList: FastjsDom[] = list.map((e) => {
    if (!isDom(e)) return new FastjsDom(e);
    return e;
  });

  return new Proxy(setupAtom(domList), {
    get(target, key) {
      if (key in target) return target[key as keyof FastjsDomList];
      if (key in target._list) return target._list[key as unknown as number];
      if (key in FastjsDom.prototype) {
        const domList = target;
        return function () {
          for (const dom of domList._list) {
            const proto = dom[key as keyof FastjsDom];
            if (typeof proto === "function") {
              const result = proto.bind(dom, ...arguments)();
              if (!isUndefined(result) && result.constructor !== FastjsDom) return result;
            }
          }
          return domList;
        };
      }
      if (key in target._list[0]) return target._list[0][key as string];
    }
  });
}

export function setupAtom(list: FastjsDom[]): FastjsDomList {
  return {
    construct: "FastjsDomList",
    _list: new Proxy(list, {
      set(target, key, value) {
        target[Number(key)] = value;
        return true;
      }
    }),
    get length() {
      return this._list.length;
    },
    add(el: FastjsDom) {
      this._list.push(el);
      return this;
    },
    delete(key: number, deleteDom = true) {
      if (deleteDom) this._list[key].remove();
      this._list.splice(key, 1);
      return this;
    },
    each(callback: EachCallback) {
      this._list.forEach((el, i) => callback(el, el.el(), i));
      return this;
    },
    el(key = 0) {
      return this._list[key].el();
    },
    getElement(key = 0) {
      return this.el(key);
    },
    getDom(key = 0) {
      return this._list[key];
    },
    next(el: string) {
      const result = _selector(el, this.toElArray());
      if (result instanceof HTMLElement) return new FastjsDom(result);
      if (Array.isArray(result)) return createFastjsDomList(result);
      return null;
    },
    toArray() {
      return this._list;
    },
    toElArray() {
      return this._list.map((e) => e.el());
    }
  } as FastjsDomList;
}