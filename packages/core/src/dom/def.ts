import { FastjsDom } from "./dom-types";

export type PushTarget =
  | "firstElementChild"
  | "lastElementChild"
  | "randomElementChild"
  | "beforeElement"
  | "afterElement"
  | "replaceElement"
  | number;

export type PushReturn<T> = {
  isReplace: T extends "replaceElement" ? true : false;
  newElement: T extends "replaceElement" ? FastjsDom : never;
  oldElement: T extends "replaceElement" ? FastjsDom : never;
  /** @description index to parent -> children, start with 0 */
  index: number;
  /** @description FastjsDom point to the new element */
  el: FastjsDom;
  /** @description FastjsDom point to the origin element when you call(this) */
  origin: FastjsDom;
  father: FastjsDom | null;
};

export type InsertTarget =
  | "first"
  | "last"
  | "random"
  | "before"
  | "after"
  | number;

export type InsertReturn = {
  /** @description index to parent -> children, start with 0 */
  index: number;
  /** @description FastjsDom point to the new element */
  added: FastjsDom;
  /** @description FastjsDom point to the origin element when you call(this) */
  origin: FastjsDom;
};

export type EventCallback = (el: FastjsDom, event: Event) => void;
export type EachCallback = (
  el: FastjsDom,
  dom: HTMLElement,
  index: number
) => void;
export type EventList = Array<{
  type: keyof HTMLElementEventMap;
  callback: EventCallback;
  trigger: EventListener;
  remove: () => void;
}>;

export type CustomProps = {
  html?: string;
  text?: string;
  css?: StyleObj | string;
  class?: string[] | string;
  attr?: { [key: string]: string | null };
  value?: string;
};

export type FastjsDomProps = CustomProps & {
  [K in keyof HTMLElement]?:
    | HTMLElement[K]
    | HTMLInputElement[K]
    | HTMLTextAreaElement[K]
    | HTMLButtonElement[K];
};

export type StyleObj = Partial<CSSStyleDeclaration>;
export type StyleObjKeys = keyof StyleObj;
export type SetStyleObj = { [K in StyleObjKeys]?: StyleObj[K] | null };
