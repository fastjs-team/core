import fastjsArray from "./fastjsArray";

const methods: Function = (_e: fastjsArray) => {
    return {
        first() {
            return _e._array[0];
        },
        last() {
            return _e._array[_e._array.length - 1];
        },
        length() {
            return _e._array.length;
        },
        add(val: any, key: number = _e._array.length) {
            _e._array[key] = val;
            return _e;
        },
        push() {
            // arguments each
            for (let i = 0; i < arguments.length; i++) {
                _e.add(arguments[i]);
            }
            return _e;
        },
        remove(key: number) {
            _e._array.splice(key, 1);
            return _e;
        },
        get(key: number | string) {
            return _e._array[key];
        },
        set(key: number | string, val: any) {
            _e._array[key] = val;
            return _e;
        },
        each(callback: Function) {
            _e._array.forEach((e: any, key: number) => {
                callback(e, key);
            })
            return _e;
        },
        filter(callback: Function) {
            return _e._array.filter((e: any, key: number) => {
                return callback(e, key);
            })
        },
        map(callback: Function) {
            return _e._array.map((e: any, key: number) => {
                return callback(e, key);
            })
        },
        toArray() {
            return _e._array;
        },
        then(callback: Function, time = 0) {
            if (time)
                setTimeout(() => {
                    callback(_e);
                }, time);
            else
                callback(_e);
            return _e;
        },
        construct: `<${_e._config.type}>FastjsArray`,
    }
}

export default methods