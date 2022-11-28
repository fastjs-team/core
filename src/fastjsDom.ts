import _dev from "./dev";
import fastjsBind from "./fastjsBind";
import {selecter as _selecter} from "./methods";
import fastjsDomList from "./fastjsDomList";

class fastjsDom {
    constructor(el: HTMLElement | string) {
        // if string
        if (typeof el === "string") {
            // create
            el = _dev._dom.createElement(el);
        }

        this._el = el
        Object.defineProperty(this, "construct", {
            writable: false,
            value: "fastjsDom"
        })

        return this;
    }

    [key: string]: any;

    _el: HTMLElement

    // methods

    get(key: string): any {
        return this._el[key as keyof Element];
    }

    set(key: string, val: any): fastjsDom {
        // @ts-ignore
        this._el[key as keyof Element] = val;
        return this;
    }

    html(val: string): string | fastjsDom {
        this._el.innerHTML = val ? val : this._el.innerHTML;
        return val ? this : this._el.innerHTML;
    }

    text(val: string): string | fastjsDom {
        this._el.innerText = val ? val : this._el.innerText;
        return val ? this : this._el.innerText;
    }

    next(selecter: string): fastjsDom | fastjsDomList {
        return _selecter(selecter, this._el);
    }

    father(): ParentNode | null {
        return this._el.parentNode;
    }

    attr(key: string, value?: string): any {
        if (value != null)
            value = value.toString()
        if (value)
            this._el.setAttribute(key, value);
        if (value === null)
            this._el.removeAttribute(key);
        return value !== undefined ? this : this._el.getAttribute(key);
    }

    css(key?: string | object, value?: string): fastjsDom | CSSStyleDeclaration {
        if (typeof key === "string") {
            // @ts-ignore
            this._el.style[key as keyof CSSStyleDeclaration] = value;
            return this;
        } else if (!key) {
            return this._el.style;
        } else {
            Object.entries(key).forEach((v) => {
                // @ts-ignore
                this._el.style[v[0] as keyof CSSStyleDeclaration] = v[1];
            })
            return this;
        }
    }

    appendTo(el: Element = _dev._dom.body): fastjsDom {
        el.appendChild(this._el);
        return this;
    }

    push(el: Element = _dev._dom.body): fastjsDom {
        el.appendChild(this._el);
        return this;
    }

    append(el: Element): fastjsDom {
        this._el.appendChild(el);
        return this;
    }

    remove(): null {
        this._el.remove();
        return null;
    }

    addAfter(el: Element): fastjsDom {
        if (!el.parentNode) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                _dev.newWarn("fastjsDom.addAfter", "el.parentNode is null", [
                    "addAfter(el: Element)",
                    "domEdit.ts",
                    "fastjsDom"
                ]);
            }
            // dev end
        } else
            // add this._el after el
            el.parentNode.insertBefore(this._el, el.nextSibling);

        return this;
    }

    addBefore(el: Element): fastjsDom {
        if (!el.parentNode) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                _dev.newWarn("fastjsDom.addAfter", "el.parentNode is null", [
                    "addAfter(el: Element)",
                    "domEdit.ts",
                    "fastjsDom"
                ]);
            }
            // dev end
        } else
            // add this._el before el
            el.parentNode.insertBefore(this._el, el);

        return this;
    }

    addFirst(el: Element): fastjsDom {
        // add this._el first in el
        el.insertBefore(this._el, el.firstChild);
        return this;
    }

    val(val: string | boolean | number): any {
        if (this._el instanceof HTMLInputElement || this._el instanceof HTMLTextAreaElement || this._el instanceof HTMLButtonElement) {
            const btn = this._el instanceof HTMLButtonElement;
            // if val and is button || input || textarea
            if (val != null) {
                val = String(val);
                if (btn)
                    this._el.innerText = val;
                else
                    this._el.value = val;
            } else {
                // if button
                if (btn)
                    return this._el.innerText;
                return this._el.value;
                // <-
            }
        }
        return this;
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

    focus(): fastjsDom {
        this._el.focus();
        return this;
    }

    first(): fastjsDom | null {
        return this._el.firstElementChild ? new fastjsDom(this._el.firstElementChild as HTMLElement) : null;
    }

    last(): fastjsDom | null {
        return this._el.lastElementChild ? new fastjsDom(this._el.lastElementChild as HTMLElement) : null;
    }

    el(): Element {
        return this._el;
    }

    each(callback: Function, defaultElement: boolean = true): fastjsDom {
        // children each
        for (let i = 0; i < this._el.children.length; i++) {
            callback(defaultElement ? this._el.children[i] : new fastjsDom(this._el.children[i] as HTMLElement), i);
        }
        return this;
    }

    on(event: string = "click", callback: Function): fastjsDom {
        let eventTrig = () => void callback(this);
        this._el.addEventListener(event, eventTrig);
        return this;
    }

    bind(bind: string = "text", key: string, object: object = {}, isAttr: boolean = false): fastjsBind {
        if (bind === "html") bind = "innerHTML";
        if (bind === "text") bind = "innerText";
        return new fastjsBind(this, bind, key, object, isAttr);
    }
}

export default fastjsDom