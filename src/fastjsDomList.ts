import fastjsDom from './fastjsDom';
import _dev from "./dev";
import {selecter} from "./methods";

class fastjsDomList {
    readonly #effect: Function;
    private readonly construct: string;

    constructor(list: Array<Element> = []) {
        let domList: Array<fastjsDom> = [];
        list?.forEach((el: Element) => {
            domList.push(new fastjsDom(el as HTMLElement));
        })

        this._list = domList;
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

        this.effect();

        // construct
        this.construct = 'fastjsDomList';

        return this;
    }

    [key: string]: any;
    _list: Array<fastjsDom>
    length: number

    // methods

    toArray(): Array<fastjsDom> {
        return this._list;
    }

    set(key: string, val: any, el?: number): fastjsDomList {
        // set()
        // set a value of element

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

    get(target: string, key?: number): any {
        // get()
        // get a value of element

        return this._list[key || 0].get(target);
    }

    getEl(key: number = 0): fastjsDom {
        // getEl()
        // get a fastjsDom element

        // dev start
        if (process.env.NODE_ENV !== 'production') {
            // overflow
            if (key >= this._list.length)
                _dev.newWarn('fastjsDomList', 'key is overflow', [
                    'getEl(key)',
                    'dataEdit.js',
                    'fastjsDomList'
                ]);
        }
        // dev end
        return this._list[key || 0];
    }

    next(el: string): fastjsDom | fastjsDomList {
        // next()
        // select element in child

        return selecter(el, this);
    }

    attr(key: string, value: string): any {
        // attr()
        // set attribute

        this._list.forEach((e: fastjsDom) => {
            e.attr(key, value);
        })
        return this;
    }

    css(key: string | object, value: string): fastjsDomList {
        // css()
        // set css

        this._list.forEach((e: fastjsDom) => {
            e.css(key, value);
        })
        return this;
    }

    html(val: string): string | fastjsDomList {
        // html()
        // set html

        if (val === undefined)
            // ts ignore for certainly return string
            // @ts-ignore
            return this._list[0].html();
        this._list.forEach((e: fastjsDom) => {
            e.html(val);
        })
        return this;
    }

    text(val?: string): string | fastjsDomList {
        // text()
        // set text

        if (val === undefined)
            // ts ignore for certainly return string
            // @ts-ignore
            return this._list[0].text(val);
        return (this._list.forEach((e: fastjsDom) => {
            e.text(val);
        }), this);
    }

    father(): fastjsDom | null {
        // father()
        // get father element

        return this._list[0].father();
    }

    remove(key?: number, dontDelete: boolean = false): fastjsDomList | null {
        // remove()
        // remove element

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

    each(callback: Function): fastjsDomList {
        // callback: (e: fastjsDom, key: number) => void

        this._list.forEach((e: fastjsDom) => {
            callback(e, e.el());
        })
        return this;
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

    bind(bind: string, key: string | number, object: object = {}, isAttr: boolean = false) {
        this._list.forEach((e: fastjsDom) => {
            object = e.bind(bind, String(key), object, isAttr);
        })
        return object;
    }

    on(event: string = "click", callback: Function) {
        this._list.forEach((e: fastjsDom) => {
            e.on(event, callback);
        })
        return this;
    }

    add(el: fastjsDom | Element) {
        this._list.push(
            el instanceof fastjsDom ? el : new fastjsDom(el as HTMLElement)
        );
        this.#effect();
        return this;
    }

    delete(key: number, deleteDom: boolean = false) {
        if (deleteDom) this._list[key].remove();
        this._list.splice(key, 1);
        this.#effect();
        return this;
    }
}

export default fastjsDomList