import fastjsDom from "../fastjsDom/main";

const main = function (list) {
    let domList = [];
    list.forEach((v) => {
        domList.push(new fastjsDom(v));
    })

    let _this = {
        _list: domList,
        construct: "fastjsDomList"
    }

    // import methods
    _this = Object.assign(_this, import("./dataEdit"));
    _this = Object.assign(_this, import("./domEdit"));
    _this = Object.assign(_this, import("./event"));

    domList.forEach((e, key) => {
        this[key] = e;
    })
    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default main