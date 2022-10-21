import _dev from "../dev";

const main = function (el) {
    let _this = {
        _el: el,
        construct: "fastjsDom"
    }

    // import methods
    _this = _dev.initMethod(_this, import("./dataEdit"), import("./domEdit"), import("./event"));

    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default main