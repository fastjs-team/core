import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

const main = function (el) {
    let _this = {
        _el: el,
        construct: "fastjsDom"
    }
    _this = Object.assign(_this, dataEdit);
    _this = Object.assign(_this, domEdit);
    _this = Object.assign(_this, event);
    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default main