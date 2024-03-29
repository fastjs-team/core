import _dev from "../dev";
import _selector from "./selector";
import FastjsDomList from "./dom-list";
import type {styleObj, styleObjKeys} from "./css";
import {ArrayProxyHandler} from "./proxy";
import type {EventCallback, EventList, InsertReturn, PushReturn, FastjsDomProps, EachCallback} from "./def";
import FastjsBaseModule from "../base";
import {InsertTarget, PushTarget} from "./def";
import {isUndefined} from "../utils";

class FastjsDom extends FastjsBaseModule<FastjsDom>{
    public readonly construct: string = "FastjsDom";
    _events: EventList = [];

    constructor(el: FastjsDom | HTMLElement | Element | string, p?: FastjsDomProps) {
        super()
        
        if (__DEV__)
            _dev.browserCheck("fastjs/dom/Dom")

        el = el instanceof FastjsDom ? el.el() : el;
        // if string
        if (typeof el === "string") {
            // create element
            this._el = document.createElement(el);
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
                        case "class": {
                            if (typeof value === "string") this.setClass(value.split(" "));
                            else if (Array.isArray(value)) this.setClass(value);
                        }
                            break;
                        case "attr": {
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
        } else if (el instanceof HTMLElement) {
            this._el = el
        } else {
            if (__DEV__) {
                throw _dev.error("fastjs/dom/Dom", `el is not **HTMLElement or string**, instead of **${typeof el}**`, [
                    "*el: ", el,
                    "properties: ", p,
                    "constructor(**el: Dom | HTMLElement | Element | string**, properties?: FastjsDomProps)",
                    "super: ", this
                ], ["fastjs.right", "fastjs.wrong"]);
            }
            throw "6e2s"
        }

        return this;
    }

    _el: HTMLElement

    // methods

    getAttr(): { [key: string]: string }
    getAttr(key: string): string | null
    getAttr(callback: (attr: { [key: string]: string }) => void): FastjsDom
    getAttr(key: string, callback: (value: string | null) => void): FastjsDom

    getAttr(keyOrCallback?: string | ((attr: { [key: string]: string }) => void), callback?: (value: string | null) => void): { [key: string]: string } | string | null | FastjsDom {
        const getAttrProxy = (): { [key: string]: string } => {
            const arr = [...this._el.attributes];
            const obj: { [key: string]: string } = {};
            arr.forEach((v) => {
                obj[v.name] = v.value;
            })
            return new Proxy(obj, {
                set: (target, key: string, value) => {
                    this.setAttr(key, value);
                    return Reflect.set(target, key, value);
                }
            })
        }

        if (typeof keyOrCallback === "string")
            if (callback)
                callback(this._el.getAttribute(keyOrCallback));
            else
                return this._el.getAttribute(keyOrCallback);
        else if (typeof keyOrCallback === "function")
            keyOrCallback(getAttrProxy());
        else
            return getAttrProxy()

        return this;
    }

    setAttr(map: { [key: string]: string | null }): FastjsDom
    setAttr(key: string, value: string): FastjsDom
    setAttr(key: string, value: null): FastjsDom
    setAttr(key: string, value: string | null): FastjsDom

    setAttr(keyOrMap: string | { [key: string]: string | null }, value?: string | null): FastjsDom {
        if (typeof keyOrMap === "object") {
            for (let key in keyOrMap) {
                this.setAttr(key, keyOrMap[key]);
            }
        } else {
            const key = keyOrMap;
            if (value === null) this._el.removeAttribute(key);
            else this._el.setAttribute(key, value as string);
        }
        return this;
    }

    getStyle(): styleObj
    getStyle(key: styleObjKeys): string
    getStyle(callback: (style: styleObj) => void): FastjsDom
    getStyle(key: styleObjKeys, callback: (value: string) => void): FastjsDom

    getStyle(keyOrCallback?: styleObjKeys | ((style: styleObj) => void), callback?: (value: string) => void): styleObj | string | FastjsDom {
        const getStyleProxy = (): styleObj => {
            const handler: ProxyHandler<CSSStyleDeclaration> = {
                set: (target, key: PropertyKey, value) => {
                    if (!Number.isNaN(Number(key))) this.setStyle(key as styleObjKeys, value);
                    return Reflect.set(target, key, value);
                }
            }
            return new Proxy(this._el.style, handler)
        }

        if (typeof keyOrCallback === "string")
            if (callback)
                callback(this._el.style.getPropertyValue(keyOrCallback));
            else
                return this._el.style.getPropertyValue(keyOrCallback);
        else if (typeof keyOrCallback === "function")
            keyOrCallback(getStyleProxy());
        else
            return getStyleProxy()

        return this;
    }

    setStyle(css: string): FastjsDom
    setStyle(map: styleObj): FastjsDom
    setStyle(key: styleObjKeys, value: string, important?: boolean): FastjsDom

    setStyle(keyOrMapOrString: styleObjKeys | styleObj | string, value?: string, other: boolean = false): FastjsDom {
        if (typeof keyOrMapOrString === "object") {
            let k: styleObjKeys;
            for (k in keyOrMapOrString) {
                this.setStyle(k, keyOrMapOrString[k]);
            }
        } else if (!value) {
            this._el.style.cssText = keyOrMapOrString as string;
        } else {
            const key = keyOrMapOrString as keyof styleObj;
            this.get("style").setProperty(key as string, value, other ? "important" : "");
        }
        return this;
    }

    el(): HTMLElement {
        return this._el;
    }

    eachChild(callback: EachCallback, deep: boolean = false): FastjsDom {
        const each = (el: HTMLElement, index: number) => {
            callback(new FastjsDom(el), el, index);
            if (deep)
                for (let i = 0; i < el.children.length; i++) {
                    each(el.children[i] as HTMLElement, i);
                }
        }
        each(this._el, 0);
        return this;
    }

    focus(): FastjsDom {
        this._el.focus();
        return this;
    }

    firstChild(): FastjsDom | null {
        return this._el.firstElementChild ? new FastjsDom(this._el.firstElementChild as HTMLElement) : null;
    }

    lastChild(): FastjsDom | null {
        return this._el.lastElementChild ? new FastjsDom(this._el.lastElementChild as HTMLElement) : null;
    }

    children(): FastjsDomList {
        return new FastjsDomList([...this._el.children]);
    }

    father(): FastjsDom | null {
        return new FastjsDom(this.get("parentElement") as HTMLElement);
    }

    get<T extends keyof HTMLElement>(key: T): HTMLElement[T] {
        return this._el[key];
    }

    html(): string
    html(val: string): FastjsDom

    html(val?: string): string | FastjsDom {
        // @ts-ignore
        return this[isUndefined(val) ? "get" : "set"]("innerHTML", val);
    }

    last(): FastjsDom | null {
        return this._el.lastElementChild ? new FastjsDom(this._el.lastElementChild as HTMLElement) : null;
    }

    next(selector: string): FastjsDom | FastjsDomList | null {
        return _selector(selector, this._el);
    }

    push<T extends PushTarget>(el?: HTMLElement | FastjsDomList | FastjsDom, target?: T, clone?: boolean): PushReturn<T>
    push<T extends PushTarget>(el?: HTMLElement | FastjsDomList | FastjsDom, callback?: (pushReturn: PushReturn<T>) => void, target?: T, clone?: boolean): FastjsDom

    push<T extends PushTarget>(el: HTMLElement | FastjsDomList | FastjsDom = document.body, callbackOrTarget: ((pushReturn: PushReturn<T>) => void) | T = PushTarget.lastElementChild as T, target: T | boolean = PushTarget.lastElementChild as T, clone: boolean = false): PushReturn<T> | FastjsDom {
        const solve = (result: PushReturn<T>): FastjsDom | PushReturn<T> => {
            if (typeof callbackOrTarget !== "function") return result;
            callbackOrTarget(result);
            return this;
        }

        const _target: T = typeof callbackOrTarget === "function" ? target as T : callbackOrTarget;
        el = (el instanceof HTMLElement ? el : (el instanceof FastjsDomList ? el.el()[0] : el.el())) as HTMLElement;
        let node: HTMLElement;
        if (typeof target === "boolean" ? target : clone) {
            node = this._el.cloneNode(true) as HTMLElement;
            // copy events
            this._events.forEach((v) => {
                node.addEventListener(v.type, v.trigger);
            })
        } else node = this._el;
        if (el.parentElement === null) {
            if (__DEV__) {
                let callback = typeof callbackOrTarget === "function" ? callbackOrTarget : undefined;
                throw _dev.error("fastjs/dom/push", "el.parentElement is null, did you pass the **document object** or is this element **exist in document**?", [
                    "*el: ", el,
                    "target: Fastjs.PushTarget." + target,
                    "clone: " + clone,
                    "callback: " + callback,
                    "push<T extends PushTarget>(**el?: HTMLElement | FastjsDomList | Dom**, target?: T, clone?: boolean): PushReturn<T>",
                ], ["fastjs.warn", "fastjs.warn", "fastjs.wrong"]);
            }
            throw "hg42"
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
                index: newEl.father()?.children().toElArray().indexOf(added as HTMLElement),
                el: newEl,
                origin: this,
                father: newEl.father()
            } as unknown as PushReturn<T>);
        }
    }

    insert<T extends InsertTarget>(el?: HTMLElement | FastjsDomList | FastjsDom, target?: T, clone?: boolean): InsertReturn
    insert<T extends InsertTarget>(el?: HTMLElement | FastjsDomList | FastjsDom, callback?: (insertReturn: InsertReturn) => void, target?: T, clone?: boolean): FastjsDom

    insert<T extends InsertTarget>(el: HTMLElement | FastjsDomList | FastjsDom = document.body, callbackOrTarget: ((insertReturn: InsertReturn) => void) | T = InsertTarget.last as T, target: T | boolean = InsertTarget.last as T, clone: boolean = true): InsertReturn | FastjsDom {
        const solve = (result: InsertReturn): FastjsDom | InsertReturn => {
            if (typeof callbackOrTarget !== "function") return result;
            callbackOrTarget(result);
            return this;
        }

        const _target: T = typeof callbackOrTarget === "function" ? target as T : callbackOrTarget;
        el = (el instanceof HTMLElement ? el : (el instanceof FastjsDomList ? el.el()[0] : el.el())) as HTMLElement;
        const node = (typeof target === "boolean" ? target : clone) ? el.cloneNode(true) as HTMLElement : el;

        let added;
        switch (_target) {
            case InsertTarget.first:
                added = this._el.insertBefore(node, this._el.firstElementChild);
                break;
            case InsertTarget.last:
                added = this._el.appendChild(node);
                break;
            case InsertTarget.random:
                added = this._el.insertBefore(node, this._el.children[Math.floor(Math.random() * this._el.children.length)]);
                break;
        }
        const newEl = new FastjsDom(added as HTMLElement);
        return solve({
            index: this.children().toElArray().indexOf(added as HTMLElement),
            added: newEl,
            origin: this
        } as unknown as InsertReturn);
    }


    addEvent(event: keyof HTMLElementEventMap = "click", callback: EventCallback): FastjsDom {
        let eventTrig: EventListener | EventListenerObject = (event: Event) => callback(this, event);
        this._events.push({
            type: event,
            callback: callback,
            trigger: eventTrig,
            remove: () => {
                this.removeEvent(callback)
            }
        });

        this._el.addEventListener(event, eventTrig);
        return this;
    }

    getEvent(): EventList
    getEvent(type: keyof HTMLElementEventMap): EventCallback | null
    getEvent(callback: (eventList: EventList) => void): FastjsDom
    getEvent(type: keyof HTMLElementEventMap, callback: (event: EventCallback | null) => void): FastjsDom

    getEvent(typeOrCallback?: keyof HTMLElementEventMap | ((eventList: EventList) => void), callback?: (event: EventCallback | null) => void): EventList | EventCallback | null | FastjsDom {
        if (typeof typeOrCallback === "string")
            if (callback)
                callback(this._events.find((v) => v.type === typeOrCallback)?.callback || null);
            else
                return this._events.find((v) => v.type === typeOrCallback)?.callback || null;
        else if (typeof typeOrCallback === "function")
            typeOrCallback(this._events);
        else
            return this._events;

        return this;
    }

    removeEvent(): FastjsDom
    removeEvent(type: keyof HTMLElementEventMap): FastjsDom
    removeEvent(key: number): FastjsDom
    removeEvent(type: keyof HTMLElementEventMap, key: number): FastjsDom
    removeEvent(callback: EventCallback): FastjsDom

    removeEvent(typeOrKeyOrCallback?: keyof HTMLElementEventMap | number | EventCallback, key?: number): FastjsDom {
        if (__DEV__) {
            if (isUndefined(typeOrKeyOrCallback)) {
                _dev.warn("fastjs/dom/removeEvent", "You are removing **all events**, make sure you want to do this.", [
                    "***No Any Argument",
                    "*removeEvent(): Dom",
                    "super: ", this
                ], ["fastjs.warn"]);
            }
            if (typeof typeOrKeyOrCallback === "string" && isUndefined(key)) {
                _dev.warn("fastjs/dom/removeEvent", "You are removing **all events** with type " + typeOrKeyOrCallback + ", make sure you want to do this.", [
                    "*type: " + typeOrKeyOrCallback,
                    "*removeEvent(key: keyof HTMLElementEventMap): Dom",
                    "super: ", this
                ], ["fastjs.warn"]);
            }
        }

        if (typeof typeOrKeyOrCallback === "string")
            if (!isUndefined(key)) {
                this._el.removeEventListener(typeOrKeyOrCallback, this._events.filter((v) => v.type === typeOrKeyOrCallback)[key].trigger as Function as EventListener);
                this._events.splice(key, 1);
            } else
                this._events.filter((v) => v.type === typeOrKeyOrCallback).forEach((v) => {
                    this._el.removeEventListener(v.type, v.trigger as Function as EventListener);
                    this._events.splice(this._events.indexOf(v), 1);
                });
        else if (typeof typeOrKeyOrCallback === "number") {
            this._el.removeEventListener(this._events[typeOrKeyOrCallback].type, this._events[typeOrKeyOrCallback].trigger as Function as EventListener);
            this._events.splice(typeOrKeyOrCallback, 1);
        } else if (typeof typeOrKeyOrCallback === "function") {
            this._events.filter((v) => v.callback === typeOrKeyOrCallback).forEach((v) => {
                this._el.removeEventListener(v.type, v.trigger as Function as EventListener);
                this._events.splice(this._events.indexOf(v), 1);
            });
        } else {
            this._events.forEach((v) => {
                v.remove();
            });
            this._events = [];
        }

        return this;
    }


    remove(): FastjsDom {
        this._el.remove();
        return this;
    }

    set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): FastjsDom {
        if (findPropInChain(this._el.constructor.prototype, key)?.writable ||
            findPropInChain(this._el.constructor.prototype, key)?.set
        ) {
            this._el[key] = val;
        } else if (__DEV__)
            _dev.warn("fastjs/dom/set", `key **${key}** is not writable`, [
                "*key: " + key,
                "set<T extends keyof HTMLElement>(**key: T**, val: HTMLElement[T]): Dom",
                "super: ", this
            ], ["fastjs.warn"]);
        return this;

        function findPropInChain(obj: object, prop: string): PropertyDescriptor | null {
            while (obj !== null) {
                const desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc) return desc;
                obj = Object.getPrototypeOf(obj);
            }
            return null;
        }
    }

    text(): string
    text(val: string): FastjsDom

    text(val?: string): string | FastjsDom {
        // @ts-ignore
        return this[isUndefined(val) ? "get" : "set"]("innerText", val);
    }

    val(): string
    val(val: string): FastjsDom

    val(val?: string): FastjsDom | string {
        const btn = this._el instanceof HTMLButtonElement;
        if (this._el instanceof HTMLInputElement || this._el instanceof HTMLTextAreaElement || this._el instanceof HTMLButtonElement) {
            // if val and is button || input || textarea
            if (isUndefined(val)) return btn ? this._el.innerText : this._el.value;
            else this._el[btn ? "innerText" : "value"] = val;
        } else if (__DEV__) {
            _dev.warn("fastjs/dom/val", `This element is not a **input or textarea or button**, instanceof **${this._el.constructor.name}**`, [
                "*super._el: ", this._el,
                "val(): string",
                "val(val: string): Dom",
                "super: ", this
            ], ["fastjs.right", "fastjs.warn"]);
        }
        return this;
    }

    /** @description Class Functions */

    addClass(className: string[]): FastjsDom
    addClass(...className: string[]): FastjsDom

    addClass(className: string | string[]): FastjsDom {
        if (typeof className === "string") {
            [...arguments].forEach((v: string) => {
                v.split(" ").forEach((v) => {
                    this.setClass(v, true);
                })
            })
        } else this.setClass(className);
        return this;
    }

    clearClass(): FastjsDom {
        return this.removeClass(...this._el.classList);
    }

    removeClass(className: string[]): FastjsDom
    removeClass(...className: string[]): FastjsDom

    removeClass(className: string | string[]): FastjsDom {
        const classList: string[] = Array.isArray(className) ? className : [...arguments];
        classList.forEach((v) => {
            this.setClass(v, false);
        });
        return this;
    }

    setClass(): FastjsDom
    setClass(className: string, value?: boolean): FastjsDom
    setClass(classNames: string[]): FastjsDom
    setClass(classNames: { [key: string]: boolean }): FastjsDom

    setClass(classNames?: string | string[] | { [key: string]: boolean }, value: boolean = true): FastjsDom {
        if (typeof classNames === "string")
            this._el.classList[value ? "add" : "remove"](classNames);
        else if (Array.isArray(classNames))
            classNames.forEach((v) => {
                this._el.classList.add(v);
            })
        else if (typeof classNames === "object")
            Object.entries(classNames).forEach((v) => {
                this._el.classList[v[1] ? "add" : "remove"](v[0]);
            })
        else this._el.classList.remove(...this._el.classList);

        return this;
    }

    getClass(): string[]
    getClass(className: string): boolean
    getClass(callback: (classNames: string[]) => void): FastjsDom
    getClass(className: string, callback: (value: boolean) => void): FastjsDom

    getClass(classNameOrCallback?: string | ((classNames: string[]) => void), callback?: (value: boolean) => void): string[] | boolean | FastjsDom {
        const getClassProxy = (): string[] => {
            const handler: ArrayProxyHandler<string> = {
                set: (target, key: PropertyKey, value) => {
                    if (!Number.isNaN(Number(key))) this.setClass(value);
                    return Reflect.set(target, key, value);
                }
            }
            return new Proxy([...this._el.classList], handler)
        }

        if (typeof classNameOrCallback === "string")
            if (callback)
                callback(this._el.classList.contains(classNameOrCallback));
            else
                return this._el.classList.contains(classNameOrCallback);
        else if (typeof classNameOrCallback === "function")
            classNameOrCallback(getClassProxy());
        else
            return getClassProxy()

        return this;
    }

    // ==== DomList Base Function Support ==== //

    getDom(key: number): FastjsDom {
        if (__DEV__)
            _dev.experimentFeatureWarning("dom-with-domlist", "DomList Base Function Support", "FastjsDom.getDom");
        return this;
    }

    getElement(key: number): HTMLElement {
        if (__DEV__)
            _dev.experimentFeatureWarning("dom-with-domlist", "DomList Base Function Support", "FastjsDom.getElement");
        return this.el();
    }

    toArray(): Array<FastjsDom> {
        if (__DEV__)
            _dev.experimentFeatureWarning("dom-with-domlist", "DomList Base Function Support", "FastjsDom.toArray")
        return [this];
    }

    toElArray(): Array<HTMLElement> {
        if (__DEV__)
            _dev.experimentFeatureWarning("dom-with-domlist", "DomList Base Function Support", "FastjsDom.toElArray")
        return [this._el];
    }

    each(callback: EachCallback): FastjsDomList {
        if (__DEV__)
            _dev.experimentFeatureWarning("dom-with-domlist", "DomList Base Function Support", "FastjsDom.each")
        return new FastjsDomList([this]).each(callback);
    }
}

export default FastjsDom