import fastjsArray from "./fastjsArray";

export default (_e: fastjsArray) => {
    return {
        first(): any {
            return _e._array[0];
        },
        last(): any {
            return _e._array[_e._array.length - 1];
        },
        length(): number {
            return _e._array.length;
        },
        add(val: any, key: number = _e._array.length): fastjsArray {
            _e._array[key] = val;
            return _e;
        },
        push(): fastjsArray {
            // arguments each
            for (let i = 0; i < arguments.length; i++) {
                _e.add(arguments[i]);
            }
            return _e;
        },
        remove(key: number): fastjsArray {
            _e._array.splice(key, 1);
            return _e;
        },
        get(key: number): any {
            return _e._array[key];
        },
        set(key: number, val: any): fastjsArray {
            _e._array[key] = val;
            return _e;
        },
        each(callback: Function): fastjsArray {
            _e._array.forEach((e: any, key: number) => {
                callback(e, key);
            })
            return _e;
        },
        filter(callback: Function): any {
            return _e._array.filter((e: any, key: number) => {
                return callback(e, key);
            })
        },
        map(callback: Function): any {
            return _e._array.map((e: any, key: number) => {
                return callback(e, key);
            })
        },
        toArray(): Array<any> {
            return _e._array;
        },
        then(callback: Function, time = 0): fastjsArray {
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