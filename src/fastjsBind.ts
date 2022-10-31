import fastjsDom from "./fastjsDom/fastjsDom";

interface config {
    _event?: {
        [key: string]: Array<{
            attr: boolean,
            _el: fastjsDom,
            bind: string,
        }>
    }

    [key: string]: any
}

interface target {
    [key: string]: any;
}

interface event {
    attr: boolean,
    _el: fastjsDom,
    bind: string,
}

class fastjsBind {
    constructor(el: fastjsDom, bind: string, key: string | number, object: config = {}, isAttr: boolean = false) {
        let effect = (target: { [key: string]: any }) => {
            return new Proxy(target, {
                set(target: target, p: string, value: any): boolean {
                    if (_object._event) {
                        // set value -> pass
                        target[key] = value;
                        // do event
                        if (_object._event[key] && key !== "_event") {
                            _object._event[key].forEach((e: event) => {
                                if (e.attr)
                                    e._el._el.attr(e.bind, value);
                                else
                                    e._el._el[e.bind] = value;
                            })
                        }
                    }
                    return true;
                }
            })
        }

        // deep clone object
        // const deepClone = (source: { [key: string | number]: any }, superCall: boolean = true) => {
        //     if (typeof source !== 'object' || source == null) {
        //         return source;
        //     }
        //
        //     let target: { [key: string | number]: any } | Array<any>
        //
        //     if (superCall)
        //         target = effect(source);
        //     else
        //         target = Array.isArray(source) ? [] : {};
        //
        //     let key: string | number;
        //     for (key in source) {
        //         if (Object.prototype.hasOwnProperty.call(source, key)) {
        //             // if key = string, target != array
        //             if (typeof key === "string" && !Array.isArray(target)) {
        //                 // if source[key] = element
        //                 if (source[key].nodeType) {
        //                     target[key] = source[key].cloneNode(true);
        //                 } else if (typeof source[key] === 'object' && source[key] !== null) {
        //                     target[key] = deepClone(source[key], false);
        //                 }
        //             } else if (typeof key === "number" && Array.isArray(target)) {
        //                 target[key] = source[key];
        //             }
        //         }
        //     }
        //     return target;
        // }
        // deep clone
        // let _object = deepClone(object);
        let _object = object;

        if (!_object._event) {
            _object._event = {};

            // init effect
            _object = effect(_object);
        }

        if (_object._event === undefined) return

        if (!_object._event[key])
            _object._event[key] = []

        // find same event & dom
        let same = false;

        _object._event[key].forEach((e: { [key: string]: any }) => {
            // is same dom & bind
            if (e.bind === bind && e._el._el.isEqualNode(el._el))
                same = true;
        });

        if (same) return _object;

        _object._event[key].push({
            attr: isAttr,
            _el: el,
            bind: bind
        });

        // init
        if (isAttr)
            el._el.attr(bind, _object[key]);
        else
            el._el[bind] = _object[key];

        return _object;
    }
}

export default fastjsBind