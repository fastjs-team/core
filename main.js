import fastjsDom from "./plugin/fastjsDom/main";
import fastjsDomList from "./plugin/fastjsDomList/main";
import config from "./config";
import _dev from "./plugin/dev";

let fastjs = {
    dom(el) {
        // el -> element / tagName
        el = el || config.dom.defaultTag;
        if (typeof el == "string") {
            _dev._dom.createElement(el);
        }
        return new fastjsDom(el);
    },
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
        let special = false
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
        input.val(text).push(document.body);
        input._el.select();
        document.execCommand("copy");
        input.remove();
    }
}

let selecter = fastjs.selecter
let copy = fastjs.copy

export {config, selecter, copy}
export default fastjs