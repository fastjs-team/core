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
        // deep clone object
        let _object = JSON.parse(JSON.stringify(object));
        if (!_object._event) {
            _object._event = {};
        }
        _object = new Proxy(_object, {
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

        if (_object._event === undefined) return

        if (!_object._event[key])
            _object._event[key] = []

        // find same event & dom
        let same = false;
        _object._event[key].forEach((e: event) => {
            if (e._el._el === el._el && e.bind === bind)
                same = true;
        })
        if (same) return

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