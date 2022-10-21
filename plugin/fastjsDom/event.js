import fastjsBind from "../fastjsBind";

export default _e => {
    return {
        each(callback) {
            _e._el.children.forEach(callback);
            return _e;
        },
        on(event = "click", callback) {
            _e._el.addEventListener(event, callback);
            return _e;
        },
        bind(bind, key, object = {}, isAttr = false) {
            if (bind === "html") bind = "innerHTML";
            if (bind === "text") bind = "innerText";
            return fastjsBind(_e, bind, key, object, isAttr);
        },
    }
}