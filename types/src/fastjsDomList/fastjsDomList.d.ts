 import fastjsDom from "../fastjsDom/fastjsDom";

declare class fastjsDomList {
    constructor(list?: Array<Element>);
    [key: string]: any;
    toArray(): Array<fastjsDom>;
    set(key: string, val: any, el?: number): fastjsDomList;
    get(target: string, key?: number): any;
    getEl(key?: number): fastjsDom;
    next(el: string): fastjsDom | fastjsDomList;
    attr(key: string, value: string): any;
    css(key: string | object, value: string): fastjsDomList;
    html(val: string): string | fastjsDomList;
    text(val: string): string | fastjsDomList;
    father(): Element;
    remove(key?: number): fastjsDomList | null;
    each(callback: Function): fastjsDomList;
    then(callback: Function, time?: number): fastjsDomList;
    bind(bind: string, key: string | number, object?: object, isAttr?: boolean): object;
    on(event: string | undefined, callback: Function): fastjsDomList;
}
export default fastjsDomList;
