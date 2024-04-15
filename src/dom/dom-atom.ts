import FastjsBaseModule from "../base";
import { isUndefined } from "../utils";
import { ArrayProxyHandler } from "./proxy";
import _dev from "../dev";

import type { EventList, EventCallback } from "./def";
import type { styleObj, styleObjKeys } from "./css";
import type FastjsDom from "./dom";
import type { FastjsDomList } from "./dom-list";

// This is the core(atom) of FastjsDom, user should only see/use FastjsDom(-> DomAtom)
// This design is for TypeScript support and prevent circular dependencies
// Depedencies circular should be: DomAtom -> FastjsDom -> FastjsDomList
// So, following these when design:
// - DomAtom should not depend on FastjsDom / FastjsDomList
// - FastjsDom should not depend on FastjsDomList

class DomAtom<T extends FastjsDom | FastjsDomList> extends FastjsBaseModule<T> {
  public construct: string = "FastjsDom";
  public _events: EventList = [];

  constructor(public _el: HTMLElement) {
    super();
  }

  html(): string;
  html(val: string): FastjsDom;

  html(val?: string): string | FastjsDom {
    if (val === undefined) return this._el.innerHTML;
    this._el.innerHTML = val;
    return this as unknown as FastjsDom;
  }

  text(): string;
  text(val: string): FastjsDom;

  text(val?: string): string | FastjsDom {
    if (val === undefined) return this._el.innerText;
    this._el.innerText = val;
    return this as unknown as FastjsDom;
  }

  el(): HTMLElement {
    return this._el;
  }

  focus(): FastjsDom {
    this._el.focus();
    return this as unknown as FastjsDom;
  }

  last(): FastjsDom | null {
    return this._el.lastElementChild
      ? (new DomAtom(
          this._el.lastElementChild as HTMLElement
        ) as unknown as FastjsDom)
      : null;
  }

  firstChild(): FastjsDom | null {
    return this._el.firstElementChild
      ? (new DomAtom(
          this._el.firstElementChild as HTMLElement
        ) as unknown as FastjsDom)
      : null;
  }

  lastChild(): FastjsDom | null {
    return this._el.lastElementChild
      ? (new DomAtom(
          this._el.lastElementChild as HTMLElement
        ) as unknown as FastjsDom)
      : null;
  }

  getAttr(): { [key: string]: string };
  getAttr(key: string): string | null;
  getAttr(callback: (attr: { [key: string]: string }) => void): FastjsDom;
  getAttr(key: string, callback: (value: string | null) => void): FastjsDom;

  getAttr(
    keyOrCallback?: string | ((attr: { [key: string]: string }) => void),
    callback?: (value: string | null) => void
  ): { [key: string]: string } | string | null | FastjsDom {
    const getAttrProxy = (): { [key: string]: string } => {
      const arr = [...this._el.attributes];
      const obj: { [key: string]: string } = {};
      arr.forEach((v) => {
        obj[v.name] = v.value;
      });
      return new Proxy(obj, {
        set: (target, key: string, value) => {
          this.setAttr(key, value);
          return Reflect.set(target, key, value);
        }
      });
    };

    if (typeof keyOrCallback === "string")
      if (callback) callback(this._el.getAttribute(keyOrCallback));
      else return this._el.getAttribute(keyOrCallback);
    else if (typeof keyOrCallback === "function") keyOrCallback(getAttrProxy());
    else return getAttrProxy();

    return this as unknown as FastjsDom;
  }

  setAttr(map: { [key: string]: string | null }): FastjsDom;
  setAttr(key: string, value: string): FastjsDom;
  setAttr(key: string, value: null): FastjsDom;
  setAttr(key: string, value: string | null): FastjsDom;

  setAttr(
    keyOrMap: string | { [key: string]: string | null },
    value?: string | null
  ): FastjsDom {
    if (typeof keyOrMap === "object") {
      for (let key in keyOrMap) {
        this.setAttr(key, keyOrMap[key]);
      }
    } else {
      const key = keyOrMap;
      if (value === null) this._el.removeAttribute(key);
      else this._el.setAttribute(key, value as string);
    }
    return this as unknown as FastjsDom;
  }

  addEvent(
    event: keyof HTMLElementEventMap = "click",
    callback: EventCallback
  ): FastjsDom {
    let eventTrig: EventListener | EventListenerObject = (event: Event) =>
      callback(this as unknown as FastjsDom, event);
    this._events.push({
      type: event,
      callback: callback,
      trigger: eventTrig,
      remove: () => {
        this.removeEvent(callback);
      }
    });

    this._el.addEventListener(event, eventTrig);
    return this as unknown as FastjsDom;
  }

  getStyle(): styleObj;
  getStyle(key: styleObjKeys): string;
  getStyle(callback: (style: styleObj) => void): FastjsDom;
  getStyle(key: styleObjKeys, callback: (value: string) => void): FastjsDom;

  getStyle(
    keyOrCallback?: styleObjKeys | ((style: styleObj) => void),
    callback?: (value: string) => void
  ): styleObj | string | FastjsDom {
    const getStyleProxy = (): styleObj => {
      const handler: ProxyHandler<CSSStyleDeclaration> = {
        set: (target, key: PropertyKey, value) => {
          if (!Number.isNaN(Number(key)))
            this.setStyle(key as styleObjKeys, value);
          return Reflect.set(target, key, value);
        }
      };
      return new Proxy(this._el.style, handler);
    };

    if (typeof keyOrCallback === "string")
      if (callback) callback(this._el.style.getPropertyValue(keyOrCallback));
      else return this._el.style.getPropertyValue(keyOrCallback);
    else if (typeof keyOrCallback === "function")
      keyOrCallback(getStyleProxy());
    else return getStyleProxy();

    return this as unknown as FastjsDom;
  }

  setStyle(css: string): FastjsDom;
  setStyle(map: styleObj): FastjsDom;
  setStyle(key: styleObjKeys, value: string, important?: boolean): FastjsDom;

  setStyle(
    keyOrMapOrString: styleObjKeys | styleObj | string,
    value?: string,
    other: boolean = false
  ): FastjsDom {
    if (typeof keyOrMapOrString === "object") {
      let k: styleObjKeys;
      for (k in keyOrMapOrString) {
        this.setStyle(k, keyOrMapOrString[k]);
      }
    } else if (!value) {
      this._el.style.cssText = keyOrMapOrString as string;
    } else {
      const key = keyOrMapOrString as keyof styleObj;
      this._el.style.setProperty(
        key as string,
        value,
        other ? "important" : ""
      );
    }
    return this as unknown as FastjsDom;
  }

  get<T extends keyof HTMLElement>(key: T): HTMLElement[T] {
    return this._el[key];
  }

  getEvent(): EventList;
  getEvent(type: keyof HTMLElementEventMap): EventCallback | null;
  getEvent(callback: (eventList: EventList) => void): FastjsDom;
  getEvent(
    type: keyof HTMLElementEventMap,
    callback: (event: EventCallback | null) => void
  ): FastjsDom;

  getEvent(
    typeOrCallback?:
      | keyof HTMLElementEventMap
      | ((eventList: EventList) => void),
    callback?: (event: EventCallback | null) => void
  ): EventList | EventCallback | null | FastjsDom {
    if (typeof typeOrCallback === "string")
      if (callback)
        callback(
          this._events.find((v) => v.type === typeOrCallback)?.callback || null
        );
      else
        return (
          this._events.find((v) => v.type === typeOrCallback)?.callback || null
        );
    else if (typeof typeOrCallback === "function") typeOrCallback(this._events);
    else return this._events;

    return this as unknown as FastjsDom;
  }

  removeEvent(): FastjsDom;
  removeEvent(type: keyof HTMLElementEventMap): FastjsDom;
  removeEvent(key: number): FastjsDom;
  removeEvent(type: keyof HTMLElementEventMap, key: number): FastjsDom;
  removeEvent(callback: EventCallback): FastjsDom;

  removeEvent(
    typeOrKeyOrCallback?: keyof HTMLElementEventMap | number | EventCallback,
    key?: number
  ): FastjsDom {
    if (__DEV__) {
      if (isUndefined(typeOrKeyOrCallback)) {
        _dev.warn(
          "fastjs/dom/removeEvent",
          "You are removing **all events**, make sure you want to do this.",
          ["***No Any Argument", "*removeEvent(): Dom", "super: ", this],
          ["fastjs.warn"]
        );
      }
      if (typeof typeOrKeyOrCallback === "string" && isUndefined(key)) {
        _dev.warn(
          "fastjs/dom/removeEvent",
          "You are removing **all events** with type " +
            typeOrKeyOrCallback +
            ", make sure you want to do this.",
          [
            "*type: " + typeOrKeyOrCallback,
            "*removeEvent(key: keyof HTMLElementEventMap): Dom",
            "super: ",
            this
          ],
          ["fastjs.warn"]
        );
      }
    }

    if (typeof typeOrKeyOrCallback === "string")
      if (!isUndefined(key)) {
        this._el.removeEventListener(
          typeOrKeyOrCallback,
          this._events.filter((v) => v.type === typeOrKeyOrCallback)[key]
            .trigger as Function as EventListener
        );
        this._events.splice(key, 1);
      } else
        this._events
          .filter((v) => v.type === typeOrKeyOrCallback)
          .forEach((v) => {
            this._el.removeEventListener(
              v.type,
              v.trigger as Function as EventListener
            );
            this._events.splice(this._events.indexOf(v), 1);
          });
    else if (typeof typeOrKeyOrCallback === "number") {
      this._el.removeEventListener(
        this._events[typeOrKeyOrCallback].type,
        this._events[typeOrKeyOrCallback].trigger as Function as EventListener
      );
      this._events.splice(typeOrKeyOrCallback, 1);
    } else if (typeof typeOrKeyOrCallback === "function") {
      this._events
        .filter((v) => v.callback === typeOrKeyOrCallback)
        .forEach((v) => {
          this._el.removeEventListener(
            v.type,
            v.trigger as Function as EventListener
          );
          this._events.splice(this._events.indexOf(v), 1);
        });
    } else {
      this._events.forEach((v) => {
        v.remove();
      });
      this._events = [];
    }

    return this as unknown as FastjsDom;
  }

  set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): FastjsDom {
    if (
      findPropInChain(this._el.constructor.prototype, key)?.writable ||
      findPropInChain(this._el.constructor.prototype, key)?.set
    ) {
      this._el[key] = val;
    } else if (__DEV__)
      _dev.warn(
        "fastjs/dom/set",
        `key **${key}** is not writable`,
        [
          "*key: " + key,
          "set<T extends keyof HTMLElement>(**key: T**, val: HTMLElement[T]): Dom",
          "super: ",
          this
        ],
        ["fastjs.warn"]
      );
    return this as unknown as FastjsDom;

    function findPropInChain(
      obj: object,
      prop: string
    ): PropertyDescriptor | null {
      while (obj !== null) {
        const desc = Object.getOwnPropertyDescriptor(obj, prop);
        if (desc) return desc;
        obj = Object.getPrototypeOf(obj);
      }
      return null;
    }
  }

  remove(): FastjsDom {
    this._el.remove();
    return this as unknown as FastjsDom;
  }

  val(): string;
  val(val: string): FastjsDom;

  val(val?: string): FastjsDom | string {
    const btn = this._el instanceof HTMLButtonElement;
    if (
      this._el instanceof HTMLInputElement ||
      this._el instanceof HTMLTextAreaElement ||
      this._el instanceof HTMLButtonElement
    ) {
      // if val and is button || input || textarea
      if (isUndefined(val)) return btn ? this._el.innerText : this._el.value;
      else this._el[btn ? "innerText" : "value"] = val;
    } else if (__DEV__) {
      _dev.warn(
        "fastjs/dom/val",
        `This element is not a **input or textarea or button**, instanceof **${this._el.constructor.name}**`,
        [
          "*super._el: ",
          this._el,
          "val(): string",
          "val(val: string): Dom",
          "super: ",
          this
        ],
        ["fastjs.right", "fastjs.warn"]
      );
    }
    return this as unknown as FastjsDom;
  }

  addClass(className: string[]): FastjsDom;
  addClass(...className: string[]): FastjsDom;

  addClass(className: string | string[]): FastjsDom {
    if (typeof className === "string") {
      [...arguments].forEach((v: string) => {
        v.split(" ").forEach((v) => {
          this.setClass(v, true);
        });
      });
    } else this.setClass(className);
    return this as unknown as FastjsDom;
  }

  clearClass(): FastjsDom {
    return this.removeClass(...this._el.classList);
  }

  removeClass(className: string[]): FastjsDom;
  removeClass(...className: string[]): FastjsDom;

  removeClass(className: string | string[]): FastjsDom {
    const classList: string[] = Array.isArray(className)
      ? className
      : [...arguments];
    classList.forEach((v) => {
      this.setClass(v, false);
    });
    return this as unknown as FastjsDom;
  }

  setClass(): FastjsDom;
  setClass(className: string, value?: boolean): FastjsDom;
  setClass(classNames: string[]): FastjsDom;
  setClass(classNames: { [key: string]: boolean }): FastjsDom;

  setClass(
    classNames?: string | string[] | { [key: string]: boolean },
    value: boolean = true
  ): FastjsDom {
    if (typeof classNames === "string")
      this._el.classList[value ? "add" : "remove"](classNames);
    else if (Array.isArray(classNames))
      classNames.forEach((v) => {
        this._el.classList.add(v);
      });
    else if (typeof classNames === "object")
      Object.entries(classNames).forEach((v) => {
        this._el.classList[v[1] ? "add" : "remove"](v[0]);
      });
    else this._el.classList.remove(...this._el.classList);

    return this as unknown as FastjsDom;
  }

  getClass(): string[];
  getClass(className: string): boolean;
  getClass(callback: (classNames: string[]) => void): FastjsDom;
  getClass(className: string, callback: (value: boolean) => void): FastjsDom;

  getClass(
    classNameOrCallback?: string | ((classNames: string[]) => void),
    callback?: (value: boolean) => void
  ): string[] | boolean | FastjsDom {
    const getClassProxy = (): string[] => {
      const handler: ArrayProxyHandler<string> = {
        set: (target, key: PropertyKey, value) => {
          if (!Number.isNaN(Number(key))) this.setClass(value);
          return Reflect.set(target, key, value);
        }
      };
      return new Proxy([...this._el.classList], handler);
    };

    if (typeof classNameOrCallback === "string")
      if (callback) callback(this._el.classList.contains(classNameOrCallback));
      else return this._el.classList.contains(classNameOrCallback);
    else if (typeof classNameOrCallback === "function")
      classNameOrCallback(getClassProxy());
    else return getClassProxy();

    return this as unknown as FastjsDom;
  }
}

export default DomAtom;
