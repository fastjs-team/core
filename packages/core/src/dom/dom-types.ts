import type {
  EachCallback,
  ElementList,
  EventCallback,
  EventList,
  InsertReturn,
  InsertTarget,
  PushReturn,
  PushTarget,
  SetStyleObj,
  StyleObj,
  StyleObjKeys
} from "./def";

import { FastjsDomList } from "./dom-list-types";
import type { FastjsModuleBase } from "../base/def";

export interface FastjsDomAtom<ElementType extends ElementList> {
  construct: "FastjsDom";
  _events: EventList<ElementType>;
  _el: ElementType;
}

export interface FastjsDomAPI<ElementType extends ElementList> {
  get<T extends keyof ElementType>(key: T): ElementType[T];
  set<T extends keyof ElementType>(
    key: T,
    val: ElementType[T]
  ): FastjsDom<ElementType>;
  text(): string;
  text(val: string): FastjsDom<ElementType>;
  html(): string;
  html(val: string): FastjsDom<ElementType>;
  val(): string;
  val(val: string): FastjsDom<ElementType>;
  el(): ElementType;
  remove(): FastjsDom<ElementType>;
  focus(): FastjsDom<ElementType>;
  first(): FastjsDom<ElementList> | null;
  last(): FastjsDom<ElementList> | null;
  father(): FastjsDom<ElementList> | null;
  children(): FastjsDomList;
  next<
    T extends FastjsDom | FastjsDomList | null =
      | FastjsDom
      | FastjsDomList
      | null
  >(
    selector?: string
  ): T;
  each(
    callback: EachCallback<ElementList>,
    deep?: boolean
  ): FastjsDom<ElementType>;
  addEvent(
    type: keyof HTMLElementEventMap,
    callback: EventCallback<ElementType>
  ): FastjsDom<ElementType>;
  removeEvent(): FastjsDom<ElementType>;
  removeEvent(type: keyof HTMLElementEventMap): FastjsDom<ElementType>;
  removeEvent(callback: EventCallback<ElementType>): FastjsDom<ElementType>;
  removeEvent(
    type: keyof HTMLElementEventMap,
    key: number
  ): FastjsDom<ElementType>;
  getStyle(): StyleObj;
  getStyle(key: keyof CSSStyleDeclaration): string;
  getStyle(
    callback: (style: StyleObj, dom: FastjsDom<ElementType>) => void
  ): FastjsDom<ElementType>;
  setStyle(style: SetStyleObj): FastjsDom<ElementType>;
  setStyle(style: string): FastjsDom<ElementType>;
  setStyle(
    key: StyleObjKeys,
    val: string,
    important?: boolean
  ): FastjsDom<ElementType>;
  getClass(): string[];
  getClass(
    callback: (classNames: string[], dom: FastjsDom<ElementType>) => void
  ): void;
  setClass(className: string, value?: boolean): FastjsDom<ElementType>;
  setClass(classNames: { [key: string]: boolean }): FastjsDom<ElementType>;
  addClass(className: string[]): FastjsDom<ElementType>;
  addClass(...className: string[]): FastjsDom<ElementType>;
  removeClass(className: string[]): FastjsDom<ElementType>;
  removeClass(...className: string[]): FastjsDom<ElementType>;
  clearClass(): FastjsDom<ElementType>;
  getAttr(): { [key: string]: string };
  getAttr(key: string): string;
  getAttr(
    callback: (
      attr: { [key: string]: string },
      dom: FastjsDom<ElementType>
    ) => void
  ): void;
  setAttr(attr: { [key: string]: string | null }): FastjsDom<ElementType>;
  setAttr(key: string, val: string | null): FastjsDom<ElementType>;
  push<T extends PushTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom,
    target: T,
    clone?: boolean
  ): PushReturn<T, ElementType>;
  insert<T extends InsertTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom,
    target: T,
    clone?: boolean
  ): InsertReturn<ElementType>;
}

export type FastjsDom<ElementType extends ElementList = ElementList> =
  FastjsDomAtom<ElementType> & FastjsDomAPI<ElementType> & FastjsModuleBase;
