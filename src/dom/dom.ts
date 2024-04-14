import _dev from "../dev";
import _selector from "./selector";
import FastjsDomList from "./dom-list";
import type { styleObj } from "./css";
import type {
  EventList,
  InsertReturn,
  PushReturn,
  FastjsDomProps,
  EachCallback
} from "./def";
import { isUndefined } from "../utils";
import { PushTarget, InsertTarget } from "./def";
import DomAtom from "./dom-atom";

// Everything don't need to use FastjsDomList | FastjsDom, should be put in DomAtom

class FastjsDom extends DomAtom<FastjsDom> {
  _events: EventList = [];

  constructor(
    el: FastjsDom | HTMLElement | Element | string = document.body,
    p?: FastjsDomProps
  ) {
    if (__DEV__) _dev.browserCheck("fastjs/dom/Dom");

    if (el instanceof FastjsDom) {
      el = el._el;
    } else if (el instanceof HTMLElement || el instanceof Element) {
    }
    if (typeof el === "string") {
      // create element
      el = document.createElement(el);
    } else if (!(el instanceof HTMLElement) && !(el instanceof Element)) {
      if (__DEV__) {
        throw _dev.error(
          "fastjs/dom/Dom",
          `el is not **FastjsDom | HTMLElement | Element | string**, instead of **${typeof el}**`,
          [
            "*el: ",
            el,
            "properties: ",
            p,
            "constructor(**el: Dom | HTMLElement | Element | string**, properties?: FastjsDomProps)",
            "super: --"
          ],
          ["fastjs.right", "fastjs.wrong"]
        );
      }
      throw "6e2s";
    }

    super(el as HTMLElement);

    if (p) {
      let key: keyof FastjsDomProps;
      for (key in p) {
        const value = p[key];

        if (isUndefined(value)) continue;

        switch (key) {
          case "html":
            this.html(p[key] as string);
            break;
          case "text":
            this.text(p[key] as string);
            break;
          case "css":
            this.setStyle(p[key] as styleObj);
            break;
          case "class":
            {
              if (typeof value === "string") this.setClass(value.split(" "));
              else if (Array.isArray(value)) this.setClass(value);
            }
            break;
          case "attr":
            {
              let attrKey: string;
              for (attrKey in p[key]) {
                this.setAttr(attrKey, p[key]?.[attrKey] as string);
              }
            }
            break;
          case "value":
            this.val(p[key] as string);
            break;
          default:
            this.set(key, p[key]);
            break;
        }
      }
    }

    return this;
  }

  children(): FastjsDomList {
    return new FastjsDomList([...this._el.children]);
  }

  father(): FastjsDom | null {
    return new FastjsDom(this.get("parentElement") as HTMLElement);
  }

  next(selector: string): FastjsDom | FastjsDomList | null {
    return _selector(selector, this._el);
  }

  each(callback: EachCallback): FastjsDomList {
    if (__DEV__)
      _dev.experimentFeatureWarning(
        "dom-with-domlist",
        "DomList Base Function Support",
        "FastjsDom.each"
      );
    return new FastjsDomList([this]).each(callback);
  }

  eachChild(callback: EachCallback, deep: boolean = false): FastjsDom {
    const each = (el: HTMLElement, index: number) => {
      callback(new FastjsDom(el), el, index);
      if (deep)
        for (let i = 0; i < el.children.length; i++) {
          each(el.children[i] as HTMLElement, i);
        }
    };
    each(this._el, 0);
    return this;
  }

  push<T extends PushTarget>(
    el?: HTMLElement | FastjsDomList | FastjsDom,
    target?: T,
    clone?: boolean
  ): PushReturn<T>;
  push<T extends PushTarget>(
    el?: HTMLElement | FastjsDomList | FastjsDom,
    callback?: (pushReturn: PushReturn<T>) => void,
    target?: T,
    clone?: boolean
  ): FastjsDom;

  push<T extends PushTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom = document.body,
    callbackOrTarget:
      | ((pushReturn: PushReturn<T>) => void)
      | T = PushTarget.lastElementChild as T,
    target: T | boolean = PushTarget.lastElementChild as T,
    clone: boolean = false
  ): PushReturn<T> | FastjsDom {
    const solve = (result: PushReturn<T>): FastjsDom | PushReturn<T> => {
      if (typeof callbackOrTarget !== "function") return result;
      callbackOrTarget(result);
      return this as unknown as FastjsDom;
    };

    const _target: T =
      typeof callbackOrTarget === "function" ? (target as T) : callbackOrTarget;
    el = (
      el instanceof HTMLElement
        ? el
        : el instanceof FastjsDom
          ? el._list[0]
          : el._el
    ) as HTMLElement;
    let node: HTMLElement;
    if (typeof target === "boolean" ? target : clone) {
      node = this._el.cloneNode(true) as HTMLElement;
      // copy events
      this._events.forEach((v) => {
        node.addEventListener(v.type, v.trigger);
      });
    } else node = this._el;
    if (el.parentElement === null) {
      if (__DEV__) {
        let callback =
          typeof callbackOrTarget === "function" ? callbackOrTarget : undefined;
        throw _dev.error(
          "fastjs/dom/push",
          "el.parentElement is null, did you pass the **document object** or is this element **exist in document**?",
          [
            "*el: ",
            el,
            "target: Fastjs.PushTarget." + target,
            "clone: " + clone,
            "callback: " + callback,
            "push<T extends PushTarget>(**el?: HTMLElement | FastjsDomList | Dom**, target?: T, clone?: boolean): PushReturn<T>"
          ],
          ["fastjs.warn", "fastjs.warn", "fastjs.wrong"]
        );
      }
      throw "hg42";
    }
    // if replace
    if (_target === PushTarget.replaceElement) {
      const replaced = el.parentElement.replaceChild(node, el);
      const newEl = new FastjsDom(node as HTMLElement);

      return solve({
        isReplace: true,
        newElement: newEl,
        oldElement: new FastjsDom(replaced),
        index: newEl.father()?.children().toElArray().indexOf(node),
        el: newEl,
        origin: this,
        father: newEl.father()
      } as unknown as PushReturn<T>);
    } else {
      let added;
      switch (_target) {
        case PushTarget.firstElementChild:
          added = el.insertBefore(node, el.firstElementChild);
          break;
        case PushTarget.lastElementChild:
          added = el.appendChild(node);
          break;
        case PushTarget.beforeElement:
          added = el.parentElement.insertBefore(node, el);
          break;
        case PushTarget.afterElement:
          added = el.parentElement.insertBefore(node, el.nextSibling);
          break;
      }
      const newEl = new FastjsDom(added as HTMLElement);
      return solve({
        isReplace: false,
        index: newEl
          .father()
          ?.children()
          .toElArray()
          .indexOf(added as HTMLElement),
        el: newEl,
        origin: this,
        father: newEl.father()
      } as unknown as PushReturn<T>);
    }
  }

  insert<T extends InsertTarget>(
    el?: HTMLElement | FastjsDomList | FastjsDom,
    target?: T,
    clone?: boolean
  ): InsertReturn;
  insert<T extends InsertTarget>(
    el?: HTMLElement | FastjsDomList | FastjsDom,
    callback?: (insertReturn: InsertReturn) => void,
    target?: T,
    clone?: boolean
  ): FastjsDom;

  insert<T extends InsertTarget>(
    el: HTMLElement | FastjsDomList | FastjsDom = document.body,
    callbackOrTarget:
      | ((insertReturn: InsertReturn) => void)
      | T = InsertTarget.last as T,
    target: T | boolean = InsertTarget.last as T,
    clone: boolean = true
  ): InsertReturn | FastjsDom {
    const solve = (result: InsertReturn): FastjsDom | InsertReturn => {
      if (typeof callbackOrTarget !== "function") return result;
      callbackOrTarget(result);
      return this;
    };

    const _target: T =
      typeof callbackOrTarget === "function" ? (target as T) : callbackOrTarget;
    el = (
      el instanceof HTMLElement
        ? el
        : el instanceof FastjsDomList
          ? el._list[0]
          : el._el
    ) as HTMLElement;
    const node = (typeof target === "boolean" ? target : clone)
      ? (el.cloneNode(true) as HTMLElement)
      : el;

    let added;
    switch (_target) {
      case InsertTarget.first:
        added = this._el.insertBefore(node, this._el.firstElementChild);
        break;
      case InsertTarget.last:
        added = this._el.appendChild(node);
        break;
      case InsertTarget.random:
        added = this._el.insertBefore(
          node,
          this._el.children[
            Math.floor(Math.random() * this._el.children.length)
          ]
        );
        break;
    }
    const newEl = new FastjsDom(added as HTMLElement);
    return solve({
      index: this.children()
        .toElArray()
        .indexOf(added as HTMLElement),
      added: newEl,
      origin: this
    } as unknown as InsertReturn);
  }
}

export default FastjsDom;
