import fastjsBind from "../fastjsBind";

export default {
    each(callback) {
        this._el.children.forEach(callback);
        return this;
    },
    on(event = "click", callback) {
        this._el.addEventListener(event, callback);
        return this;
    },
    bind(bind, key, object = {}, isAttr = false) {
        if (bind === "html") bind = "innerHTML";
        if (bind === "text") bind = "innerText";
        return fastjsBind(this, bind, key, object, isAttr);
    },
}