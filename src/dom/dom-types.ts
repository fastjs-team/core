import type {
  EventCallback,
  EventList,
  InsertReturn,
  InsertTarget,
  PushReturn,
  PushTarget
} from "./def";

import type { FastjsModuleBase } from "../base/def";
import { FastjsDomList } from "./dom-list-types";

export interface FastjsDomAtom {
  construct: "FastjsDom";
  _events: EventList;
  _el: HTMLElement;
}

export interface FastjsDomAPI {
  set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): FastjsDom;
  text: {
    (): string;
    (val: string): FastjsDom;
  };
  html: {
    (): string;
    (val: string): FastjsDom;
  };
  el(): HTMLElement;
  focus(): FastjsDom;
  first(): FastjsDom | null;
  last(): FastjsDom | null;
  father(): FastjsDom | null;
  addEvent(
    type: keyof HTMLElementEventMap,
    callback: EventCallback
  ): FastjsDom;
  getAttr: {
    (): { [key: string]: string };
    (key: string): string;
    (callback: (attr: { [key: string]: string }) => void): void;
    (key: string, callback: (val: string | null) => void): void;
  };
  setAttr: {
    (attr: { [key: string]: string | null }): FastjsDom;
    (key: string, val: string | null): FastjsDom;
  };
  push<T extends PushTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom,
    target: T,
    clone?: boolean
  ): PushReturn<T>;
  insert<T extends InsertTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom,
    target: T,
    clone?: boolean
  ): InsertReturn;
}

export type FastjsDom = FastjsDomAtom & FastjsDomAPI & FastjsModuleBase;
