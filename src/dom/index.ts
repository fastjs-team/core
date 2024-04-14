import selector from "./selector";
import FastjsDom from "./dom";
import FastjsDomList from "./dom-list";
import type {FastjsDomProps} from "./def";


export default {
    select: selector,
    newEl: (el: FastjsDom | HTMLElement | Element | string, properties?: FastjsDomProps) => new FastjsDom(el, properties),
    newElList: (list: Array<FastjsDom | HTMLElement>) => new FastjsDomList(...list)
}
export {
    selector,
    FastjsDom,
    FastjsDomList
}