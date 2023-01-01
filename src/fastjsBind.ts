import FastjsDom from "./fastjsDom";

interface target {
    _event: {
        // string = bind key of object(target)
        [key: string]: Array<event>;
    };

    [key: string]: any;
}

interface event {
    attr: boolean;
    _el: FastjsDom;
    bind: keyof HTMLElement;
}

class FastjsBind {
    constructor(
        el: FastjsDom,
        bind: keyof HTMLElement,
        key: string | number,
        object: { [key: string]: any } = {},
        isAttr: boolean = false
    ) {
        let effect = (target: target) => {
            return new Proxy(target, {
                set(target: target, p: string, value: any): boolean {
                    if (target._event) {
                        // set value -> pass
                        target[key] = value;
                        // do event
                        if (target._event[key] && key !== "_event") {
                            target._event[key].forEach((e: event) => {
                                if (e.attr) {
                                    e._el.attr(e.bind, value);
                                } else {
                                    e._el.set(e.bind, value);
                                }
                            })
                        }
                    }
                    return true;
                }
            })
        }

        if (!object._event) {
            object._event = {};

            // init effect
            // @ts-ignore
            object = effect(object);
        }

        if (!object._event[key])
            object._event[key] = []

        // find same event & dom
        let same = false;
        object._event[key].forEach((e: { [key: string]: any }) => {
            // is same dom & bind
            if (e.bind === bind && e._el._el.isEqualNode(el._el)) same = true;
        });
        if (same) return object;

        object._event[key].push({
            attr: isAttr,
            _el: el,
            bind: bind
        });

        // init
        if (isAttr)
            el.attr(bind, object[key]);
        else
            // @ts-ignore
            el._el[bind as keyof HTMLElement] = object[key];

        return object;
    }
}

export default FastjsBind