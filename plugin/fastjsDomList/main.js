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
    domList.forEach((e, key) => {
        this[key] = e;
    })
    Object.entries(_this).forEach(e => {
        this[e[0]] = e[1];
    })
}

export default main