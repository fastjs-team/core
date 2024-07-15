import type { EachCallback, ElementList } from "./def";
import type { FastjsDom, FastjsDomAPI, FastjsDomAtom } from "./dom-types";

import { FastjsModuleBase } from "../base/def";

export interface FastjsDomListAtom {
  construct: "FastjsDomList";
  _list: Array<FastjsDom>;
  length: number;
}

export interface FastjsDomListAPI {
  add(el: FastjsDom): FastjsDomList;
  delete(key: number, deleteDom?: boolean): FastjsDomList;
  each(callback: EachCallback<ElementList>): FastjsDomList;
  el(key?: number): ElementList;
  getElement(key?: number): ElementList;
  getDom(key?: number): FastjsDom;
  next<
    T extends FastjsDom<any> | FastjsDomList | null =
      | FastjsDom
      | FastjsDomList
      | null
  >(
    selector: string
  ): T;
  toArray(): FastjsDomList;
  toElArray(): Array<ElementList>;
}

export type FastjsDomList = FastjsDomListAtom &
  FastjsDomListAPI &
  Omit<FastjsDomAtom<ElementList>, "construct"> &
  Omit<FastjsDomAPI<ElementList>, keyof Array<FastjsDom>> &
  FastjsModuleBase &
  Array<FastjsDom>;
