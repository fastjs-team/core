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
    newEl: (el: HTMLElement | string) => new FastjsDom(el),
    newElList: (list: Array<HTMLElement>) => new FastjsDomList(list)
}