import _dev from "./dev";
import fastjsDom from "./fastjsDom/fastjsDom";
import fastjsDomList from "./fastjsDomList/fastjsDomList";
import config from "./config";

let fastjs = {
    selecter(el: string, place: Element | Document | fastjsDomList = _dev._dom) {
        let dom: Array<Element> = []
        // if place = fastjsDomList
        if (place.constructor === fastjsDomList) {
            place._list.forEach((e: fastjsDom) => {
                e._el.querySelectorAll(el).forEach((v: Element) => {
                    // check if v is in dom
                    if (!dom.some((v2) => v2 === v))
                        dom.push(v);
                })
            })
        } else {
            dom = place.querySelectorAll(el);
        }
        // if last selecter is id
        let special = el.split(" ")[el.split(" ").length - 1].startsWith("#");
        // prevent extra forEach
        if (!special)
            config.dom.specialDom.forEach((v: string) => {
                if (el.startsWith(v))
                    special = true;
            })
        if (special)
            // -> fastjsDom -> element
            return new fastjsDom(dom[0]);
        // -> fastjsDomList -> fastjsDom -> element
        return new fastjsDomList(dom);
    },
    copy(text: string) {
        // copy text to clipboard
        let input = new fastjsDom("input");
        input.val(text).push();
        input._el.select();
        document.execCommand("copy");
        console.log(input);
        input.remove();
    }
}

let selecter = fastjs.selecter
let copy = fastjs.copy

export {selecter, copy}
export default fastjs