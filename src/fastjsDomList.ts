import fastjsDom from './fastjsDom';
import _dev from "./dev";
import {selecter} from "./methods";

class fastjsDomList {
    readonly #effect: Function;
    private readonly construct: string;

    constructor(list: Array<HTMLElement> = []) {
        let domList: Array<fastjsDom> = [];
        list?.forEach((el: HTMLElement) => {
            domList.push(new fastjsDom(el as HTMLElement));
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
            this._list.forEach((e: fastjsDom, key: number) => {
                this[key] = e;
            })
            // length
            this.length = this._list.length;
        }


        // construct
        this.construct = 'fastjsDomList';

        return this;
    }

    [key: string]: any;

    _list: Array<fastjsDom>
    length: number

    // methods

    add(el: fastjsDom | HTMLElement): fastjsDomList {
        this._list.push(
            el instanceof fastjsDom ? el : new fastjsDom(el as HTMLElement)
        );
        return this;
    }

    attr(key: string, value: string | null): any {
        this._list.forEach((e: fastjsDom) => {
            e.attr(key, value);
        })
        return this;
    }

    bind(bind: "text" | "html" | keyof HTMLElement, key: string | number, object: object = {}, isAttr: boolean = false): object {
        this._list.forEach((e: fastjsDom) => {
            object = e.bind(bind, String(key), object, isAttr);
        })
        return object;
    }

    css(key: object): fastjsDomList
    css(key: string, value?: string, other?: string): fastjsDomList

    css(key: string | object, value?: string, other?: string): fastjsDomList {
        this._list.forEach((e: fastjsDom) => {
            if (typeof key === 'object')
                e.css(key);
            else {
                e.css(key, value || "", other);
            }
        })
        return this;
    }

    delete(key: number, deleteDom: boolean = false): fastjsDomList {
        if (deleteDom) this._list[key].remove();
        this._list.splice(key, 1);
        return this;
    }

    each(callback: Function): fastjsDomList {
        this._list.forEach((e: fastjsDom) => {
            callback(e, e.el());
        })
        return this;
    }

    el(key: number = 0): HTMLElement {
        return this._list[key].el();
    }

    father(): fastjsDom | null {
        return this._list[0].father();
    }

    get<T extends keyof HTMLElement>(key: T, index: number = 0): HTMLElement[T] {
        // get()
        // get a value of element

        return this._list[index || 0].get(key);
    }

    getEl(key: number = 0): fastjsDom {
        // overflow
        if (key >= this._list.length)
            _dev.newWarn('fastjsDomList', 'key is overflow', [
                'getEl(key)',
                'dataEdit.js',
                'fastjsDomList'
            ]);
        return this._list[key || 0];
    }

    html(): string
    html(val: string): fastjsDomList

    html(val?: string): string | fastjsDomList {
        if (val === undefined)
            return this._list[0].html();
        this._list.forEach((e: fastjsDom) => {
            e.html(val);
        })
        return this;
    }

    next(el: string): fastjsDom | fastjsDomList {
        return selecter(el, this);
    }

    on(event: string = "click", callback: Function) {
        this._list.forEach((e: fastjsDom) => {
            e.on(event, callback);
        })
        return this;
    }

    off(event: string = "click", callback: Function) {
        this._list.forEach((e: fastjsDom) => {
            e.off(event, callback);
        })
        return this;
    }

    remove(): null
    remove(key: number, dontDelete: boolean): fastjsDomList

    remove(key?: number, dontDelete: boolean = false): fastjsDomList | null {
        if (key !== undefined) {
            // remove in dom
            this._list[key].remove();
            // delete this[key];
            if (!dontDelete) this._list.splice(key, 1);
            return this;
        }

        this._list.forEach((e: fastjsDom) => {
            e.remove();
        })
        return null;
    }

    set<T extends keyof HTMLElement>(key: T, val: HTMLElement[T], el?: number): fastjsDomList {
        if (el === undefined)
            // set for all elements
            this.each((e: fastjsDom) => {
                e.set(key, val);
            })
        else
            // getEl(key) -> fastjsDom -> set val
            this.getEl(el).set(key, val);
        return this;
    }

    text(): string
    text(val: string): fastjsDomList

    text(val?: string): string | fastjsDomList {
        if (val === undefined)
            return this._list[0].text();
        return this._list.forEach((e: fastjsDom) => {
            e.text(val);
        }), this;
    }

    toArray(): Array<fastjsDom> {
        return this._list;
    }

    then(callback: Function, time: number = 0): fastjsDomList {
        if (time)
            setTimeout(() => {
                callback(this);
            }, time);
        else
            callback(this);
        return this;
    }

    val(): string
    val(val: string): fastjsDomList

    val(val?: string): fastjsDomList | string {
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

export default fastjsDomList