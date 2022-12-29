import _dev from "./dev";
import fastjsBind from "./fastjsBind";
import {selecter as _selecter} from "./methods";
import fastjsDomList from "./fastjsDomList";

class fastjsDom {
    private readonly construct: string;

    constructor(el: HTMLElement | string) {
        // if string
        if (typeof el === "string") {
            // create element
            el = _dev._dom.createElement(el);
        }

        // define _el
        this._el = el

        // construct
        this.construct = "fastjsDom";

        return this;
    }

    [key: string]: any;

    _el: HTMLElement

    // methods

    attr(key: string): string | null
    attr(key: string, value: string | null): fastjsDom

    attr(key: string, value?: string | null): string | null | fastjsDom {
        if (value !== undefined) {
            return value ? this._el.setAttribute(key, value.toString()) : this._el.removeAttribute(key), this;
        }
        return this._el.getAttribute(key);
    }

    addAfter(el: HTMLElement): fastjsDom {
        if (!el.parentNode)
            _dev.newWarn("fastjsDom.addAfter", "el.parentNode is null", [
                "addAfter(el: HTMLElement)",
                "domEdit.ts",
                "fastjsDom"
            ]);
        else
            // add this._el after el
            el.parentNode.insertBefore(this._el, el.nextSibling);
        return this;
    }

    addBefore(el: HTMLElement): fastjsDom {
        if (!el.parentNode)
            _dev.newWarn("fastjsDom.addAfter", "el.parentNode is null", [
                "addAfter(el: HTMLElement)",
                "domEdit.ts",
                "fastjsDom"
            ]);
        else
            // add this._el before el
            el.parentNode.insertBefore(this._el, el);

        return this;
    }

    addFirst(el: HTMLElement): fastjsDom {
        // add this._el first in el
        return el.insertBefore(this._el, el.firstChild), this;
    }

    append(el: HTMLElement): fastjsDom {
        return this._el.appendChild(el), this;
    }

    appendTo(el: HTMLElement = _dev._dom.body): fastjsDom {
        return el.appendChild(this._el), this;
    }

    bind(bind: "text" | "html" | keyof HTMLElement, key: string, object: object = {}, isAttr: boolean = false): fastjsBind {
        if (bind === "html") bind = "innerHTML";
        if (bind === "text") bind = "innerText";
        return new fastjsBind(this, bind, key, object, isAttr);
    }

    css(): CSSStyleDeclaration
    css(key: object): fastjsDom
    css(key: string, value: string, other?: string): fastjsDom

    css(key?: string | object, value?: string, other?: string): fastjsDom | CSSStyleDeclaration {
        if (typeof key === "string") {
            // @ts-ignore
            this._el.style.setProperty(key, value, other);
        } else if (!key) {
            return this._el.style;
        } else {
            Object.entries(key).forEach((v) => {
                // @ts-ignore
                this._el.style[v[0] as keyof CSSStyleDeclaration] = v[1];
            })
        }
        return this;
    }

    el(): HTMLElement {
        return this._el;
    }

    each(callback: Function, defaultElement: boolean = true): fastjsDom {
        // children each
        for (let i = 0; i < this._el.children.length; i++) {
            callback(defaultElement ? this._el.children[i] : new fastjsDom(this._el.children[i] as HTMLElement), i);
        }
        return this;
    }

    focus(): fastjsDom {
        this._el.focus();
        return this;
    }

    first(): fastjsDom | null {
        return this._el.firstElementChild ? new fastjsDom(this._el.firstElementChild as HTMLElement) : null;
    }

    father(): fastjsDom | null {
        return new fastjsDom(this.el().parentNode as HTMLElement);
    }

    get<T extends keyof HTMLElement>(key: T): HTMLElement[T] {
        return this._el[key];
    }

    html(): string
    html(val: string): fastjsDom

    html(val?: string): string | fastjsDom {
        // if null -> not change || String(val)
        this._el.innerHTML = val !== undefined ? val : this._el.innerHTML;
        return val !== undefined ? this : this._el.innerHTML;
    }

    last(): fastjsDom | null {
        return this._el.lastElementChild ? new fastjsDom(this._el.lastElementChild as HTMLElement) : null;
    }

    next(selecter: string): fastjsDom | fastjsDomList {
        return _selecter(selecter, this._el);
    }

    push(el: HTMLElement = _dev._dom.body): fastjsDom {
        return el.appendChild(this._el), this;
    }

    on(event: string = "click", callback: Function): fastjsDom {
        let eventTrig = (...e: any) => void callback(this, ...e);
        this._el.addEventListener(event, eventTrig);
        return this;
    }

    off(event: string = "click", callback: Function): fastjsDom {
        let eventTrig = () => void callback(this);
        this._el.removeEventListener(event, eventTrig);
        return this;
    }

    remove(): fastjsDom {
        return this._el.remove(), this;
    }

    set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): fastjsDom {
        if (Object.getOwnPropertyDescriptor(this._el, key)?.writable) {
            this._el[key] = val;
        } else
            _dev.newWarn("fastjsDom.set", "key is not writable", [
                "key: " + key,
                "set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): fastjsDom",
                "FastjsDom"
            ]);
        return this;
    }

    text(): string
    text(val: string): fastjsDom

    text(val?: string): string | fastjsDom {
        // if null -> not change || String(val)
        this._el.innerText = val !== undefined ? val : this._el.innerText;
        return val !== undefined ? this : this._el.innerText;
    }

    then(callback: Function, time = 0): fastjsDom {
        if (time)
            setTimeout(() => {
                callback(this);
            }, time);
        else
            callback(this);
        return this;
    }

    val(): string
    val(val: string): fastjsDom

    val(val?: string): fastjsDom | string {
        const btn = this._el instanceof HTMLButtonElement;
        if (this._el instanceof HTMLInputElement || this._el instanceof HTMLTextAreaElement || this._el instanceof HTMLButtonElement) {
            // if val and is button || input || textarea
            if (val === undefined) {
                return btn ? this._el.innerText : this._el.value;
            } else {
                if (btn)
                    this._el.innerText = val;
                else
                    this._el.value = val;
            }
        }
        return this;
    }
}

export default fastjsDom