import _dev from "../dev";
import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

class fastjsDom {
    constructor(el: Element | string) {
        // if string
        if (typeof el === "string") {
            // create
            el = _dev._dom.createElement(el);
        }

        let _this: object = {
            _el: el,
            construct: "fastjsDom"
        }

        // import methods
        _this = _dev.initMethod(_this, dataEdit, domEdit, event);

        interface _this {
            0: string,
            1: any
        }

        // mount _this -> this
        Object.entries(_this).forEach((e: _this) => {
            this[e[0]] = e[1];
        })

        return this;
    }

    [key: string]: any;
}



export default fastjsDom