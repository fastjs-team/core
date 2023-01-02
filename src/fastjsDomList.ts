import FastjsDom from './fastjsDom';
import _dev from "./dev";
import {selector} from "./methods";

class FastjsDomList {
    readonly #effect: Function;
    private readonly construct: string;

    constructor(list: Array<HTMLElement> = []) {
        let domList: Array<FastjsDom> = [];
        list?.forEach((el: HTMLElement) => {
            domList.push(new FastjsDom(el as HTMLElement));
        })

        this._list = new Proxy(domList, {
            set: (target, key, value) => {
                target[Number(key)] = value;
                this.#effect();
                return true;
            }
        });
        this.length = 0;

        // effect
        this.#effect = () => {
            // mount domList: Array<Element> -> this
            this._list.forEach((e: FastjsDom, key: number) => {
                this[key] = e;
            })
            // length
            this.length = this._list.length;
        }
        this.#effect();

        // construct
        this.construct = 'FastjsDomList';

        return this;
    }

    [key: string]: any;

    _list: Array<FastjsDom>
    length: number

    // methods

    add(el: FastjsDom | HTMLElement): FastjsDomList {
        this._list.push(
            el instanceof FastjsDom ? el : new FastjsDom(el as HTMLElement)
        );
        return this;
    }

    attr(key: string, value: string | null): any {
        this._list.forEach((e: FastjsDom) => {
            e.attr(key, value);
        })
        return this;
    }

    bind(bind: "text" | "html" | keyof HTMLElement, key: string | number, object: object = {}, isAttr: boolean = false): object {
        this._list.forEach((e: FastjsDom) => {
            object = e.bind(bind, String(key), object, isAttr);
        })
        return object;
    }

    css(key: object): FastjsDomList
    css(key: string, value?: string, other?: string): FastjsDomList

    css(key: string | object, value?: string, other?: string): FastjsDomList {
        this._list.forEach((e: FastjsDom) => {
            if (typeof key === 'object')
                e.css(key);
            else {
                e.css(key, value || "", other);
            }
        })
        return this;
    }

    delete(key: number, deleteDom: boolean = false): FastjsDomList {
        if (deleteDom) this._list[key].remove();
        this._list.splice(key, 1);
        return this;
    }

    each(callback: Function): FastjsDomList {
        this._list.forEach((e: FastjsDom) => {
            callback(e, e.el());
        })
        return this;
    }

    el(key: number = 0): HTMLElement {
        return this._list[key].el();
    }

    father(): FastjsDom | null {
        return this._list[0].father();
    }

    get<T extends keyof HTMLElement>(key: T, index: number = 0): HTMLElement[T] {
        // get()
        // get a value of element

        return this._list[index || 0].get(key);
    }

    getEl(key: number = 0): FastjsDom {
        // overflow
        if (key >= this._list.length)
            _dev.newWarn('FastjsDomList', 'key is overflow', [
                'getEl(key)',
                'dataEdit.js',
                'FastjsDomList'
            ]);
        return this._list[key || 0];
    }

    html(): string
    html(val: string): FastjsDomList

    html(val?: string): string | FastjsDomList {
        if (val === undefined)
            return this._list[0].html();
        this._list.forEach((e: FastjsDom) => {
            e.html(val);
        })
        return this;
    }

    next(el: string): FastjsDom | FastjsDomList {
        return selector(el, this);
    }

    on(event: string = "click", callback: Function) {
        this._list.forEach((e: FastjsDom) => {
            e.on(event, callback);
        })
        return this;
    }

    off(event: string = "click", callback: Function) {
        this._list.forEach((e: FastjsDom) => {
            e.off(event, callback);
        })
        return this;
    }

    remove(): null
    remove(key: number, dontDelete: boolean): FastjsDomList

    remove(key?: number, dontDelete: boolean = false): FastjsDomList | null {
        if (key !== undefined) {
            // remove in dom
            this._list[key].remove();
            // delete this[key];
            if (!dontDelete) this._list.splice(key, 1);
            return this;
        }

        this._list.forEach((e: FastjsDom) => {
            e.remove();
        })
        return null;
    }

    set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T], el?: number): FastjsDomList {
        if (el === undefined)
            // set for all elements
            this.each((e: FastjsDom) => {
                e.set(key, val);
            })
        else
            // getEl(key) -> FastjsDom -> set val
            this.getEl(el).set(key, val);
        return this;
    }

    text(): string
    text(val: string): FastjsDomList

    text(val?: string): string | FastjsDomList {
        if (val === undefined)
            return this._list[0].text();
        return this._list.forEach((e: FastjsDom) => {
            e.text(val);
        }), this;
    }

    toArray(): Array<FastjsDom> {
        return this._list;
    }

    then(callback: Function, time: number = 0): FastjsDomList {
        if (time)
            setTimeout(() => {
                callback(this);
            }, time);
        else
            callback(this);
        return this;
    }

    val(): string
    val(val: string): FastjsDomList

    val(val?: string): FastjsDomList | string {
        const btn = this._el instanceof HTMLButtonElement;
        if (this._el instanceof HTMLInputElement || this._el instanceof HTMLTextAreaElement || this._el instanceof HTMLButtonElement) {
            // if val and is button || input || textarea
            if (val === undefined) {
                return btn ? this._list[0].text() : this._el.value;
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

export default FastjsDomList