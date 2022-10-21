const main = function (el) {
    let _this = {
        _el: el,
        construct: "fastjsDom"
    }

    // import methods
    _this = Object.assign(_this, import("./dataEdit"));
    _this = Object.assign(_this, import("./domEdit"));
    _this = Object.assign(_this, import("./event"));

    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default main