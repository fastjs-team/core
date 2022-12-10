import fastjsDom from "./fastjsDom";

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
                                    e._el.attr(e.bind, value);
                                else
                                    // @ts-ignore
                                    e._el._el[e.bind as keyof HTMLElement] = value;
                            })
                        }
                    }
                    return true;
                }
            })
        }

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
            el.attr(bind, _object[key]);
        else
            // @ts-ignore
            el._el[bind as keyof HTMLElement] = _object[key];

        return _object;
    }
}

export default fastjsBind