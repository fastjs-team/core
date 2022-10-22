import fastjsDom from "../fastjsDom/fastjsDom";
import _dev from "../dev";
import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

const fastjsDomList = function (list) {
    let domList = [];
    list.forEach((v) => {
        domList.push(new fastjsDom(v));
    })

    let _this = {
        _list: domList,
        construct: "fastjsDomList"
    }

    // import methods
    _this = _dev.initMethod(_this, dataEdit, domEdit, event);

    domList.forEach((e, key) => {
        this[key] = e;
    })
    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default fastjsDomList