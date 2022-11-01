import fastjsDomList from "./fastjsDomList";
import fastjsDom from "../fastjsDom/fastjsDom";

export default (_e: fastjsDomList) => {
    return {
        each(callback: Function): fastjsDomList {
            _e._list.forEach((e: fastjsDom) => {
                callback(e);
            })
            return _e;
        },
        then(callback: Function, time: number = 0): fastjsDomList {
            if (time)
                setTimeout(() => {
                    callback(_e);
                }, time);
            else
                callback(_e);
            return _e;
        },
        bind(bind: string, key: string | number, object: object = {}, isAttr: boolean = false) {
            _e._list.forEach((e: fastjsDom) => {
                object = e.bind(bind, key, object, isAttr);
            })
            return object;
        },
        on(event: string = "click", callback: Function) {
            _e._list.forEach((e: fastjsDom) => {
                e.on(event, callback);
            })
            return _e;
        },
    }
}