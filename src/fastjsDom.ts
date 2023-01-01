import _dev from "./dev";
import FastjsBind from "./fastjsBind";
import {selector as _selecter} from "./methods";
import FastjsDomList from "./fastjsDomList";

class FastjsDom {
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
        this.construct = "FastjsDom";

        return this;
    }

    [key: string]: any;

    _el: HTMLElement

    // methods

    attr(key: string): string | null
    attr(key: string, value: string | null): FastjsDom

    attr(key: string, value?: string | null): string | null | FastjsDom {
        if (value !== undefined) {
            return value ? this._el.setAttribute(key, value.toString()) : this._el.removeAttribute(key), this;
        }
        return this._el.getAttribute(key);
    }

    addAfter(el: HTMLElement): FastjsDom {
        if (!el.parentNode)
            _dev.newWarn("FastjsDom.addAfter", "el.parentNode is null", [
                "addAfter(el: HTMLElement)",
                "domEdit.ts",
                "FastjsDom"
            ]);
        else
            // add this._el after el
            el.parentNode.insertBefore(this._el, el.nextSibling);
        return this;
    }

    addBefore(el: HTMLElement): FastjsDom {
        if (!el.parentNode)
            _dev.newWarn("FastjsDom.addAfter", "el.parentNode is null", [
                "addAfter(el: HTMLElement)",
                "domEdit.ts",
                "FastjsDom"
            ]);
        else
            // add this._el before el
            el.parentNode.insertBefore(this._el, el);

        return this;
    }

    addFirst(el: HTMLElement): FastjsDom {
        // add this._el first in el
        return el.insertBefore(this._el, el.firstChild), this;
    }

    append(el: HTMLElement): FastjsDom {
        return this._el.appendChild(el), this;
    }

    appendTo(el: HTMLElement = _dev._dom.body): FastjsDom {
        return el.appendChild(this._el), this;
    }

    bind(bind: "text" | "html" | keyof HTMLElement, key: string, object: object = {}, isAttr: boolean = false): FastjsBind {
        if (bind === "html") bind = "innerHTML";
        if (bind === "text") bind = "innerText";
        return new FastjsBind(this, bind, key, object, isAttr);
    }

    css(): CSSStyleDeclaration
    css(key: object): FastjsDom
    css(key: string, value: string, other?: string): FastjsDom

    css(key?: string | object, value?: string, other?: string): FastjsDom | CSSStyleDeclaration {
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

    each(callback: Function, defaultElement: boolean = true): FastjsDom {
        // children each
        for (let i = 0; i < this._el.children.length; i++) {
            callback(defaultElement ? this._el.children[i] : new FastjsDom(this._el.children[i] as HTMLElement), i);
        }
        return this;
    }

    focus(): FastjsDom {
        this._el.focus();
        return this;
    }

    first(): FastjsDom | null {
        return this._el.firstElementChild ? new FastjsDom(this._el.firstElementChild as HTMLElement) : null;
    }

    father(): FastjsDom | null {
        return new FastjsDom(this.el().parentNode as HTMLElement);
    }

    get<T extends keyof HTMLElement>(key: T): HTMLElement[T] {
        return this._el[key];
    }

    html(): string
    html(val: string): FastjsDom

    html(val?: string): string | FastjsDom {
        // if null -> not change || String(val)
        this._el.innerHTML = val !== undefined ? val : this._el.innerHTML;
        return val !== undefined ? this : this._el.innerHTML;
    }

    last(): FastjsDom | null {
        return this._el.lastElementChild ? new FastjsDom(this._el.lastElementChild as HTMLElement) : null;
    }

    next(selecter: string): FastjsDom | FastjsDomList {
        return _selecter(selecter, this._el);
    }

    push(el: HTMLElement = _dev._dom.body): FastjsDom {
        return el.appendChild(this._el), this;
    }

    on(event: string = "click", callback: Function): FastjsDom {
        let eventTrig = (...e: any) => void callback(this, ...e);
        this._el.addEventListener(event, eventTrig);
        return this;
    }

    off(event: string = "click", callback: Function): FastjsDom {
        let eventTrig = () => void callback(this);
        this._el.removeEventListener(event, eventTrig);
        return this;
    }

    remove(): FastjsDom {
        return this._el.remove(), this;
    }

    set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): FastjsDom {
        if (Object.getOwnPropertyDescriptor(Element.prototype, key)?.writable ||
            Object.getOwnPropertyDescriptor(HTMLElement.prototype, key)?.set
        ) {
            this._el[key] = val;
        } else
            _dev.newWarn("FastjsDom.set", "key is not writable", [
                "key: " + key,
                "set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T]): FastjsDom",
                "FastjsDom"
            ]);
        return this;
    }

    text(): string
    text(val: string): FastjsDom

    text(val?: string): string | FastjsDom {
        // if null -> not change || String(val)
        this._el.innerText = val !== undefined ? val : this._el.innerText;
        return val !== undefined ? this : this._el.innerText;
    }

    then(callback: Function, time = 0): FastjsDom {
        if (time)
            setTimeout(() => {
                callback(this);
            }, time);
        else
            callback(this);
        return this;
    }

    val(): string
    val(val: string): FastjsDom

    val(val?: string): FastjsDom | string {
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

export default FastjsDom