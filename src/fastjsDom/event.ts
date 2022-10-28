import fastjsBind from "../fastjsBind";
import fastjsDom from "./fastjsDom";

export default (_e: fastjsDom) => {
    return {
        each(callback: Function) {
            _e._el.children.forEach(callback);
            return _e;
        },
        on(event: string = "click", callback: Function) {
            _e._el.addEventListener(event, callback);
            return _e;
        },
        bind(bind: string = "text", key: string, object: object = {}, isAttr: boolean = false) {
            if (bind === "html") bind = "innerHTML";
            if (bind === "text") bind = "innerText";
            return new fastjsBind(_e, bind, key, object, isAttr);
        },
    }
}