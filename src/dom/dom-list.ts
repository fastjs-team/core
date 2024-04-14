import FastjsDom from "./dom";
import _dev from "../dev";
import selector from "./selector";
import type { EachCallback } from "./def";
import FastjsBaseModule from "../base";
import { isUndefined } from "../utils";

import DomAtom from "./dom-atom";

class FastjsDomList extends DomAtom<FastjsDomList> {
  readonly #effect: Function;

  constructor(list: Array<HTMLElement | Element | FastjsDom> = []) {
    if (__DEV__) _dev.browserCheck("fastjs/dom/FastjsDomList");

    // this param is not used, just for super
    super(document.body);

    let domList: Array<FastjsDom> = [];
    for (let el of list) {
      domList.push(new FastjsDom(el));
    }

    this._list = new Proxy(domList, {
      set: (target, key, value) => {
        target[Number(key)] = value;
        this.#effect();
        return true;
      },
    });
    this.length = 0;

    // effect
    this.#effect = () => {
      // mount domList: Array<Element> -> this
      this._list.forEach((e: FastjsDom, key: number) => {
        this[key] = e;
      });
      // length
      this.length = this._list.length;
    };
    this.#effect();

    // construct
    this.construct = "FastjsDomList";

    // return this;
    return new Proxy(this, {
      get: (target, key) => {
        if (key in target) return target[key as string];
        if (key in target._list) return target._list[key as unknown as number];
        // if param in FastjsDom
        if (key in FastjsDom.prototype) {
          const domList = this;
          return function () {
            for (const dom of domList._list) {
              const proto = dom[key as keyof DomAtom<FastjsDom>];
              if (typeof proto === "function") {
                const result = proto.bind(dom, ...arguments)();
                if (!isUndefined(result) && result.constructor !== FastjsDom)
                  return result;
              }
            }
            return domList;
          };
        }
        if (key in this._list[0]) return this._list[0][key as string];
      },
    });
  }

  [key: string]: any;

  _list: Array<FastjsDom>;
  length: number;

  // methods

  add(el: FastjsDom | HTMLElement): FastjsDomList {
    this._list.push(
      el instanceof FastjsDom ? el : new FastjsDom(el as HTMLElement)
    );
    return this;
  }

  delete(key: number, deleteDom: boolean = false): FastjsDomList {
    if (deleteDom) this._list[key].remove();
    this._list.splice(key, 1);
    return this;
  }

  each(callback: EachCallback): FastjsDomList {
    this._list.forEach((e: FastjsDom, index: number) => {
      callback(e, e._el, index);
    });
    return this;
  }

  getElement(key: number = 0): HTMLElement {
    if (key >= this._list.length)
      if (__DEV__)
        _dev.warn(
          "FastjsDomList",
          "key is overflow",
          [
            "*key: " + key,
            "*length: " + this._list.length,
            "getElement(key: number): FastjsDom",
            "super",
            this,
          ],
          ["fastjs.warn"]
        );
    return this._list[key]._el;
  }

  getDom(key: number = 0): FastjsDom {
    if (key >= this._list.length)
      if (__DEV__)
        _dev.warn(
          "FastjsDomList",
          "key is overflow",
          [
            "*key: " + key,
            "*length: " + this._list.length,
            "getDom(key: number): FastjsDom",
            "super",
            this,
          ],
          ["fastjs.warn"]
        );
    return this._list[key || 0];
  }

  next(el: string): FastjsDom | FastjsDomList | null {
    return selector(
      el,
      this.toArray().map((e: FastjsDom) => e._el)
    );
  }

  toArray(): Array<FastjsDom> {
    return this._list;
  }

  toElArray(): Array<HTMLElement> {
    return this._list.map((e: FastjsDom) => e._el);
  }
}

export default FastjsDomList;
