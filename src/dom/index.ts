import selector from "./selector";
import FastjsDom from "./fastjsDom";
import FastjsDomList from "./fastjsDomList";

export {
    selector,
    FastjsDom,
    FastjsDomList
}

export default {
    select: selector,
    newEl: (el: HTMLElement | string, properties?: Partial<HTMLElement>) => new FastjsDom(el, properties),
    newElList: (list: Array<HTMLElement>) => new FastjsDomList(list)
}