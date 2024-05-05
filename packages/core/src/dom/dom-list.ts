import _dev from "../dev";
import { isUndefined, isDom } from "../utils";

import { createFastjsDom } from "./dom";

import type { FastjsDom } from "./dom-types";
import type { FastjsDomList, FastjsDomListAPI } from "./dom-list-types";
import { createMethods } from "./dom-list-methods";

export function createFastjsDomList(
  list: Array<FastjsDom | HTMLElement | Element | null | undefined>
): FastjsDomList {
  const domList: FastjsDom[] = list
    .filter((e) => e)
    .map((e) => {
      if (!isDom(e)) return createFastjsDom(e as HTMLElement);
      return e;
    });

  const _atom = setupAtom(domList);
  const moduleAtom = new Proxy(_atom, {
    get(target, key) {
      if (key in target) return target[key as keyof FastjsDomList];
      if (key in target._list) return target._list[key as unknown as number];
      if (key in target._list[0]) {
        const val = target._list[0][key as string];
        if (typeof val === "function") {
          return function () {
            for (const dom of target._list) {
              const proto = dom[key as keyof FastjsDom];
              if (typeof proto === "function") {
                const res = proto.bind(dom, ...arguments)();
                if (!isUndefined(res) && res.construct !== "FastjsDom")
                  return res;
              }
            }
            return target;
          };
        } else return val;
      }
      return target[key as keyof FastjsDomList];
    },
    set(target, key, value) {
      target[key as any] = value;
      if (Number.isInteger(Number(key))) {
        _atom._list[key as unknown as number] = value;
        target[key as unknown as number] = value;
      }
      return true;
    }
  }) as FastjsDomList;

  moduleAtom._list = new Proxy(domList, {
    set(target, key, value) {
      target[Number(key)] = value;
      _atom[Number(key)] = value;
      return true;
    }
  });
  domList.forEach((e, i) => {
    moduleAtom[i] = e;
  });

  return Object.assign(moduleAtom, createMethods(moduleAtom as FastjsDomList));
}

export function setupAtom(list: FastjsDom[]): FastjsDomList {
  return {
    construct: "FastjsDomList",
    get length() {
      return list.length;
    },
    set length(value) {
      list.length = value;
    }
  } as FastjsDomList;
}
