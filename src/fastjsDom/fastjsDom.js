import _dev from "../dev";
import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

const fastjsDom = function (el) {
    // if string
    if (typeof el === "string") {
        // create
        el = _dev._dom.createElement(el);
    }

    let _this = {
        _el: el,
        construct: "fastjsDom"
    }

    // import methods
    _this = _dev.initMethod(_this, dataEdit, domEdit, event);

    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default fastjsDom