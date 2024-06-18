import {
  BasicElement,
  EachCallback,
  EventCallback,
  InsertTarget,
  PushReturn,
  PushTarget,
  SetStyleObj,
  StyleObj,
  StyleObjKeys
} from "./def";
import type { FastjsDom, FastjsDomAPI } from "./dom-types";

import { FastjsDomList } from "./dom-list-types";
import _dev from "../dev";
import _selector from "./selector-atom";
import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";
import { rand } from "../utils/";

export function createMethods(dom: FastjsDom): FastjsDomAPI {
  function get<T extends keyof BasicElement>(key: T): BasicElement[T] {
    return (dom._el as BasicElement)[key];
  }

  function set<T extends keyof BasicElement>(
    key: T,
    val: BasicElement[T]
  ): FastjsDom {
    if (
      findPropInChain(dom._el.constructor.prototype, key as string)?.writable ||
      findPropInChain(dom._el.constructor.prototype, key as string)?.set
    ) {
      (dom._el as BasicElement)[key] = val;
    } else if (__DEV__)
      _dev.warn(
        "fastjs/dom/set",
        `key **${key as string}** is not writable`,
        [
          "*key: " + (key as string),
          "set<T extends keyof BasicElement>(**key: T**, val: HTMLElement[T]): Dom",
          "super: ",
          dom
        ],
        ["fastjs.warn"]
      );
    return dom;

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

  function text(): string;
  function text(val: string): FastjsDom;
  function text(val?: string): string | FastjsDom {
    if (val === undefined) return dom._el.textContent || "";
    dom._el.textContent = val;
    return dom;
  }

  function html(): string;
  function html(val: string): FastjsDom;
  function html(val?: string): string | FastjsDom {
    if (val === undefined) return dom._el.innerHTML;
    dom._el.innerHTML = val;
    return dom;
  }

  function val(): string;
  function val(val: string): FastjsDom;

  function val(val?: string): string | FastjsDom {
    const key = (
      dom._el.tagName === "TEXTAREA" ? "textContent" : "value"
    ) as keyof HTMLElement;
    if (val === undefined) return dom._el[key] as string;
    set(key, val);
    return dom;
  }

  const el = () => dom._el;

  const remove = () => {
    dom._el.remove();
    return dom;
  };

  const focus = () => {
    dom._el.focus();
    return dom;
  };

  const first = () =>
    dom._el.firstElementChild
      ? createFastjsDom(dom._el.firstElementChild)
      : null;

  const last = () =>
    dom._el.lastElementChild ? createFastjsDom(dom._el.lastElementChild) : null;

  const father = () => {
    const father = dom._el.parentElement;
    return father ? createFastjsDom(father) : null;
  };

  const children = () => createFastjsDomList([...dom._el.children]);

  const next = <
    T extends FastjsDom | FastjsDomList | null =
      | FastjsDom
      | FastjsDomList
      | null
  >(
    selector: string = "*"
  ): T => {
    const result = _selector(selector, dom._el);
    if (result instanceof HTMLElement)
      return createFastjsDom(result) as FastjsDom as T;
    if (result === null) return null as T;
    return createFastjsDomList(result) as FastjsDomList as T;
  };

  const each = (callback: EachCallback, deep: boolean = false): FastjsDom => {
    const children = [...dom._el.children];
    children.forEach((v, i) => {
      callback(createFastjsDom(v), v as HTMLElement, i);
      if (deep) createFastjsDom(v).each(callback, deep);
    });
    return dom;
  };

  function addEvent(
    event: keyof HTMLElementEventMap,
    callback: EventCallback
  ): FastjsDom {
    let eventTrig: EventListener | EventListenerObject = (event: Event) =>
      callback(dom, event);
    dom._events.push({
      type: event,
      callback: callback,
      trigger: eventTrig,
      remove: () => {
        dom.removeEvent(callback);
      }
    });

    dom._el.addEventListener(event, eventTrig);
    return dom;
  }

  function removeEvent(): FastjsDom;
  function removeEvent(type: keyof HTMLElementEventMap): FastjsDom;
  function removeEvent(callback: EventCallback): FastjsDom;
  function removeEvent(type: keyof HTMLElementEventMap, key: number): FastjsDom;

  function removeEvent(
    typeOrCallback?: keyof HTMLElementEventMap | EventCallback,
    key?: number
  ): FastjsDom {
    const attrs = {
      type: typeof typeOrCallback === "string" ? typeOrCallback : undefined,
      callback:
        typeof typeOrCallback === "function" ? typeOrCallback : undefined,
      key
    };

    if (attrs.callback) {
      dom._events.forEach((v, i) => {
        if (v.callback === attrs.callback) {
          dom._el.removeEventListener(v.type, v.trigger);
          dom._events.splice(i, 1);
        }
      });
    } else if (attrs.type) {
      if (attrs.key !== undefined) {
        dom._el.removeEventListener(
          dom._events[attrs.key].type,
          dom._events[attrs.key].trigger
        );
        dom._events.splice(attrs.key, 1);
      } else {
        dom._events.forEach((v) => {
          if (v.type === attrs.type) {
            dom._el.removeEventListener(v.type, v.trigger);
            dom._events.splice(dom._events.indexOf(v), 1);
          }
        });
      }
    }

    return dom;
  }

  function getStyle(): StyleObj;
  function getStyle(key: keyof CSSStyleDeclaration): string;
  function getStyle(
    callback: (style: StyleObj, dom: FastjsDom) => void
  ): FastjsDom;

  function getStyle(
    keyOrCallback?:
      | keyof CSSStyleDeclaration
      | ((style: StyleObj, dom: FastjsDom) => void)
  ) {
    const getStyleProxy = (): StyleObj => {
      return new Proxy(styles, {
        get: (target, key: string) => {
          return (
            target.getPropertyValue(key) ||
            target[key as keyof CSSStyleDeclaration] ||
            null
          );
        },
        set: (target, key: string, value) => {
          dom.setStyle(key as keyof CSSStyleDeclaration, value);
          return Reflect.set(target, key, value);
        }
      });
    };

    const computedStyle = window.getComputedStyle(dom._el);
    const styles: CSSStyleDeclaration = Object.assign(
      computedStyle,
      dom._el.style
    );

    if (typeof keyOrCallback === "string")
      return styles.getPropertyValue(keyOrCallback);
    else if (typeof keyOrCallback === "function")
      keyOrCallback(getStyleProxy(), dom);
    else return getStyleProxy();

    return dom;
  }

  function setStyle(style: SetStyleObj): FastjsDom;
  function setStyle(style: string): FastjsDom;
  function setStyle(
    key: StyleObjKeys,
    val: string,
    important?: boolean
  ): FastjsDom;

  function setStyle(
    strOrObj: string | StyleObjKeys | SetStyleObj,
    val?: string | null,
    important?: boolean
  ): FastjsDom {
    if (val)
      dom._el.style.setProperty(
        strOrObj as string,
        val,
        important ? "important" : ""
      );
    else if (typeof strOrObj === "string") dom._el.style.cssText = strOrObj;
    else {
      let key: StyleObjKeys;
      for (key in strOrObj as StyleObj) {
        dom.setStyle(key, (strOrObj as StyleObj)[key]!);
      }
    }

    return dom;
  }

  function getClass(): string[];
  function getClass(callback: (classNames: string[]) => void): void;

  function getClass(
    callback?: (classNames: string[]) => void
  ): string[] | void {
    const arr = [...dom._el.classList];
    if (callback) callback(arr);
    else return arr;
  }

  function setClass(className: string, value?: boolean): FastjsDom;
  function setClass(classNames: { [key: string]: boolean }): FastjsDom;

  function setClass(
    nameOrObj: string | { [key: string]: boolean },
    value: boolean = true
  ): FastjsDom {
    if (typeof nameOrObj === "string")
      dom._el.classList[value ? "add" : "remove"](nameOrObj);
    else {
      for (const key in nameOrObj) {
        dom.setClass(key, nameOrObj[key]);
      }
    }
    return dom;
  }

  const classOp = (name: string[], op: boolean) => {
    name.forEach((v) => {
      v.split(" ").forEach((v) => {
        dom.setClass(v, op);
      });
    });
  };

  function addClass(className: string[]): FastjsDom;
  function addClass(...className: string[]): FastjsDom;

  function addClass(className: string | string[]): FastjsDom {
    if (typeof className === "string") classOp([...arguments], true);
    else className.forEach((v) => dom.addClass(v));
    return dom;
  }

  function removeClass(className: string[]): FastjsDom;
  function removeClass(...className: string[]): FastjsDom;

  function removeClass(className: string | string[]): FastjsDom {
    if (typeof className === "string") classOp([...arguments], false);
    else className.forEach((v) => dom.removeClass(v));
    return dom;
  }

  const clearClass = () => {
    dom._el.className = "";
    return dom;
  };

  function getAttr(): { [key: string]: string };
  function getAttr(key: string): string;
  function getAttr(
    callback: (attr: { [key: string]: string }, dom: FastjsDom) => void
  ): void;

  function getAttr(
    param?: string | ((attr: { [key: string]: string }, dom: FastjsDom) => void)
  ): { [key: string]: string } | string | null | FastjsDom {
    const getAttrProxy = (): { [key: string]: string } => {
      const arr = [...dom._el.attributes];
      const obj: { [key: string]: string } = {};
      arr.forEach((v) => {
        obj[v.name] = v.value;
      });
      return new Proxy(obj, {
        set: (target, key: string, value) => {
          dom.setAttr(key, value);
          return Reflect.set(target, key, value);
        }
      });
    };

    switch (typeof param) {
      case "string":
        return dom._el.getAttribute(param);
      case "function":
        param(getAttrProxy(), dom);
        return dom;
      default:
        return getAttrProxy();
    }
  }

  function setAttr(attr: { [key: string]: string | null }): FastjsDom;
  function setAttr(key: string, val: string | null): FastjsDom;

  function setAttr(
    keyOrAttr: string | { [key: string]: string | null },
    val?: string | null
  ): FastjsDom {
    const setAttr = (key: string, val: string | null) => {
      if (val === null) dom._el.removeAttribute(key);
      else dom._el.setAttribute(key, val);
    };

    if (typeof keyOrAttr === "string") setAttr(keyOrAttr, val!);
    else {
      for (const key in keyOrAttr) {
        setAttr(key, keyOrAttr[key]);
      }
    }
    return dom;
  }

  function push<T extends PushTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom = document.body,
    target: T,
    clone?: boolean
  ): PushReturn<T> {
    el = el instanceof HTMLElement ? el : el.el();

    type IsReplace<T> = T extends "replaceElement" ? true : false;
    const isReplace = (target === "replaceElement") as IsReplace<T>;

    type ElementReturn<T> = T extends "replaceElement" ? FastjsDom : never;
    const newElement = createFastjsDom(
      clone ? (dom._el.cloneNode(true) as HTMLElement) : dom._el
    );

    if (isReplace) {
      const father = createFastjsDom(dom._el.parentElement!);
      if (father === null) {
        if (__DEV__) {
          throw _dev.error(
            "fastjs/dom/push",
            "father is null",
            [
              "*el: ",
              el,
              "target: ",
              target,
              "push<T extends PushTarget>(**el?: HTMLElement | FastjsDomList | FastjsDom**, target?: T, clone?: boolean): PushReturn<T>"
            ],
            ["fastjs.wrong"]
          );
        }
        throw new Error("father is null");
      }
      father._el.replaceChild(newElement._el, dom._el);
    } else if (typeof target === "number") {
      if (__DEV__) {
        if (target > dom._el.children.length) {
          throw _dev.error(
            "fastjs/dom/push",
            "target is out of range",
            [
              "*dom(container): ",
              dom,
              "target: ",
              target,
              "push<T extends PushTarget>(**el?: HTMLElement | FastjsDomList | FastjsDom**, target?: T, clone?: boolean): PushReturn<T>"
            ],
            ["fastjs.wrong"]
          );
        }
      }
      dom._el.insertBefore(newElement._el, dom._el.children[target]);
    } else {
      type keys = Exclude<PushTarget, "replaceElement" | number>;
      const event: {
        [key in keys]: () => void;
      } = {
        firstElementChild: () => el.prepend(newElement._el),
        lastElementChild: () => el.append(newElement._el),
        randomElementChild,
        beforeElement: () => el.before(newElement._el),
        afterElement: () => el.after(newElement._el)
      };
      event[target as Exclude<PushTarget, "replaceElement" | number>]();
    }

    return {
      isReplace,
      newElement: (isReplace && newElement) as ElementReturn<T>,
      oldElement: isReplace && (dom as ElementReturn<T>),
      index: [...el.children].indexOf(newElement._el),
      el: newElement,
      origin: dom,
      father: newElement.father()
    };

    function randomElementChild() {
      const children = [...(el as HTMLElement).children];
      if (children.length === 0) el.appendChild(dom._el);
      else {
        const pos = rand(0, children.length);
        if (pos === children.length) el.appendChild(dom._el);
        else el.insertBefore(dom._el, children[rand(0, children.length - 1)]);
      }
    }
  }

  function insert<T extends InsertTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom,
    target: T,
    clone?: boolean
  ) {
    el = el instanceof HTMLElement ? el : el.el();
    const newElement = createFastjsDom(
      clone ? (el.cloneNode(true) as HTMLElement) : el
    );
    if (typeof target === "number") {
      if (__DEV__) {
        if (target > el.children.length) {
          throw _dev.error(
            "fastjs/dom/insert",
            "target is **out of range**",
            [
              "*el(container): ",
              el,
              "target: ",
              target,
              "insert<T extends InsertTarget>(**el: HTMLElement | FastjsDomList | FastjsDom**, target: T, clone?: boolean): InsertReturn"
            ],
            ["fastjs.wrong"]
          );
        }
      }
      el.insertBefore(newElement._el, dom._el.children[target]);
    } else {
      type keys = Exclude<InsertTarget, number>;
      const event: {
        [key in keys]: () => void;
      } = {
        first: () => dom._el.prepend(newElement._el),
        last: () => dom._el.append(newElement._el),
        random: randomElementChild,
        before: () => dom._el.before(newElement._el),
        after: () => dom._el.after(newElement._el)
      };
      event[target as Exclude<InsertTarget, number>]();
    }

    return {
      index: Array.from(el.children).indexOf(newElement._el),
      added: newElement,
      origin: dom
    };

    function randomElementChild() {
      const children = [...dom._el.children];
      if (children.length === 0) dom._el.appendChild(newElement._el);
      else
        dom._el.insertBefore(
          newElement._el,
          children[rand(0, children.length - 1)]
        );
    }
  }

  return {
    get,
    set,
    text,
    html,
    val,
    el,
    remove,
    focus,
    first,
    last,
    father,
    children,
    next,
    each,
    addEvent,
    removeEvent,
    getStyle,
    setStyle,
    getClass,
    setClass,
    addClass,
    removeClass,
    clearClass,
    getAttr,
    setAttr,
    push,
    insert
  };
}
