const fastjsBind = (el, bind, key, object = {}, isAttr = false) => {
    if (!object._event) {
        object._event = {};
        object = new Proxy(object, {
            set(target, p, value) {
                target[key] = value;
                if (object._event[key] && key !== "_event") {
                    object._event[key].forEach((e) => {
                        if (e.attr)
                            e._el.attr(e.bind, value);
                        else
                            e._el[e.bind] = value;
                    })
                }
                return true;
            }
        })
    }

    if (!object._event[key])
        object._event[key] = []

    object._event[key].push({
        attr: isAttr,
        _el: el,
        bind: bind
    });
    return object;
}

export default fastjsBind