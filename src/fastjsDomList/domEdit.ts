import fastjsDom from "../fastjsDom/fastjsDom";
import {selecter} from "../main";
import fastjsDomList from "./fastjsDomList";

export default (_e: fastjsDomList) => {
    return {
        next(el: string) {
            // next()
            // select element in child

            return selecter(el, _e);
        },
        attr(key: string, value: string) {
            // attr()
            // set attribute

            _e._list.forEach((e: fastjsDom) => {
                e.attr(key, value);
            })
            return _e;
        },
        css(key: string | object, value: string) {
            // css()
            // set css

            _e._list.forEach((e: fastjsDom) => {
                e.css(key, value);
            })
            return _e;
        },
        html(val: string) {
            // html()
            // set html

            if (val === undefined)
                return _e._list[0].html();
            _e._list.forEach((e: fastjsDom) => {
                e.html(val);
            })
            return _e;
        },
        text(val: string) {
            // text()
            // set text

            if (val === undefined)
                return _e._list[0].text(val);
            _e._list.forEach((e: fastjsDom) => {
                e.text(val);
            })
            return _e;
        },
        father() {
            // father()
            // get father element

            return _e._list[0].father();
        },
        remove() {
            // remove()
            // remove element

            _e._list.forEach((e: fastjsDom) => {
                e.remove();
            })
            return null;

        }
    }
}