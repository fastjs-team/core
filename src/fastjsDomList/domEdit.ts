import fastjsDom from "../fastjsDom/fastjsDom";
import {selecter} from "../main";
import fastjsDomList from "./fastjsDomList";

export default (_e: fastjsDomList) => {
    return {
        next(el: string): fastjsDom | fastjsDomList {
            // next()
            // select element in child

            return selecter(el, _e);
        },
        attr(key: string, value: string): any {
            // attr()
            // set attribute

            _e._list.forEach((e: fastjsDom) => {
                e.attr(key, value);
            })
            return _e;
        },
        css(key: string | object, value: string): fastjsDomList {
            // css()
            // set css

            _e._list.forEach((e: fastjsDom) => {
                e.css(key, value);
            })
            return _e;
        },
        html(val: string): string | fastjsDomList {
            // html()
            // set html

            if (val === undefined)
                return _e._list[0].html();
            _e._list.forEach((e: fastjsDom) => {
                e.html(val);
            })
            return _e;
        },
        text(val: string): string | fastjsDomList {
            // text()
            // set text

            if (val === undefined)
                return _e._list[0].text(val);
            _e._list.forEach((e: fastjsDom) => {
                e.text(val);
            })
            return _e;
        },
        father(): Element {
            // father()
            // get father element

            return _e._list[0].father();
        },
        remove(key?: number): fastjsDomList | null {
            // remove()
            // remove element

            if (key !== undefined) {
                _e._list[key].remove();
                return _e;
            }

            _e._list.forEach((e: fastjsDom) => {
                e.remove();
            })
            return null;
        }
    }
}