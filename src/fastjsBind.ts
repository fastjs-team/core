import fastjsDom from "./fastjsDom/fastjsDom";

interface config {
    _event?: {
        [key: string]: Array<{
            attr: boolean,
            _el: fastjsDom,
            bind: string,
        }>
    }
}

interface target {
    [key: string]: any;
}

class fastjsBind {
    constructor(el: fastjsDom, bind: string, key: string | number, object: config = {}, isAttr: boolean = false) {
        if (!object._event) {
            object._event = {};
            object = new Proxy(object, {
                set(target: target, p: string, value: any): boolean {
                    if (object._event) {
                        // set value -> pass
                        target[key] = value;
                        // do event
                        if (object._event[key] && key !== "_event") {
                            object._event[key].forEach((e) => {
                                if (e.attr)
                                    e._el.attr(e.bind, value);
                                else
                                    e._el[e.bind] = value;
                            })
                        }
                    }
                    return true;
                }
            })
        }

        if (object._event === undefined) return

        if (!object._event[key])
            object._event[key] = []

        object._event[key].push({
            attr: isAttr,
            _el: el,
            bind: bind
        });
        return object;
    }
}

export default fastjsBind