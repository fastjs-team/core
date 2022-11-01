import fastjsBind from "../fastjsBind";
import fastjsDomList from "../../../dist/src/fastjsDomList/fastjsDomList";

declare class fastjsDom {
    constructor(el: Element | string);
    [key: string]: any;
    each(callback: Function): fastjsDom;
    on(event: string | undefined, callback: Function): fastjsDom;
    bind(bind: string | undefined, key: string, object?: object, isAttr?: boolean): fastjsBind;
    html(val: string): string | fastjsDom;
    text(val: string): string | fastjsDom;
    next(selecter: string): fastjsDom | fastjsDomList;
    father(): Element;
    attr(key: string, value?: string): any;
    css(key: string | object, value?: string): fastjsDom;
    appendTo(el?: Element): fastjsDom;
    push(el?: Element): fastjsDom;
    append(el: Element): fastjsDom;
    remove(): null;
    addAfter(el: Element): fastjsDom;
    addBefore(el: Element): fastjsDom;
    addFirst(el: Element): fastjsDom;
    val(val: string | boolean | number): any;
    then(callback: Function, time?: number): fastjsDom;
    focus(): fastjsDom;
    first(): fastjsDom;
    last(): fastjsDom;
    el(): Element;
    get(key: string | number): any;
    set(key: string | number, val: any): fastjsDom;
}
export default fastjsDom;
