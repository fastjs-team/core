import {selecter} from "../../main";

export default {
    next(el) {
        return selecter(el, this);
    },
    attr(key, value) {
        this._list.forEach((e) => {
            e.attr(key, value);
        })
        return this;
    },
    css(key, value) {
        this._list.forEach((e) => {
            e.css(key, value);
        })
        return this;
    },
    html(val) {
        this._list.forEach((e) => {
            e.html(val);
        })
        return this;
    },
    text(val) {
        this._list.forEach((e) => {
            e.text(val);
        })
        return this;
    },
    father() {
        return this._list[0].father();
    },
}