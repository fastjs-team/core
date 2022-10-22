import _dev from "../dev";
import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

const main = function (el) {
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

export default main