import fastjsDom from "./src/fastjsDom/fastjsDom";
import fastjsDomList from "./src/fastjsDomList/fastjsDomList";
import config from "./config";
import _dev from "./src/dev";

let fastjs = {
    selecter(el, place = _dev._dom) {
        let dom = []
        // if place = fastjsDomList
        if (place.constructor === fastjsDomList) {
            place._list.forEach((e) => {
                e._el.querySelectorAll(el).forEach((v) => {
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
            config.dom.specialDom.forEach((v) => {
                if (el.startsWith(v))
                    special = true;
            })
        if (special)
            // -> fastjsDom -> element
            return new fastjsDom(dom[0]);
        // -> fastjsDomList -> fastjsDom -> element
        return new fastjsDomList(dom);
    },
    copy(text) {
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