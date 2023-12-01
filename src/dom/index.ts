import selector from "./selector";
import FastjsDom from "./fastjsDom";
import FastjsDomList from "./fastjsDomList";
import type {FastjsDomProps} from "./fastjsDom";

export {
    selector,
    FastjsDom,
    FastjsDomList
}

export default {
    select: selector,
    newEl: (el: FastjsDom | HTMLElement | Element | string, properties?: FastjsDomProps) => new FastjsDom(el, properties),
    newElList: (list: Array<HTMLElement>) => new FastjsDomList(list)
}