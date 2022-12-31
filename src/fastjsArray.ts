import _dev from "./dev";

interface config {
    type?: string | Array<string>;
    length?: number | null;
}

class fastjsArray<T = any> {
    private readonly construct: string;
    #hooks: Array<Function>;

    constructor(array: Array<T>, config: config) {
    /*
        config = {
        type: <string>::type / <array>::type,
        length: <number>::max length
        }
    */

    const effect = () => {
        this._array.forEach((v: T, k: number) => {
            this[k] = v;
        })
        // check is there an invalid key
        let i = this._array.length;
        while (this[i] !== undefined) {
            delete this[i];
            i++;
        }
    }

    this._array = new Proxy(array, {
        set: (target: Array<T>, key: string, value: T) => {
        if (!this.#check(value)) return false;
        // @ts-ignore
        target[key] = value;
        effect();
        // run hooks
        this.#hooks.forEach((e: Function) => {
            e(this);
        });
        return true;
        },
    });

    this._config = {
        type: config.type || "Any",
        length: config.length || null,
    };

    // init hooks
    this.#hooks = [];

    // construct
    this.construct = `<${config.type}>FastjsArray`;

    // init effect
    effect();
    }

    _config: {
    type: string | Array<string>;
    length?: number | null;
    };
    // array = Proxy -> Array
    _array: Array<T>;

    // methods
    [key: string]: T | config | Function;

    first(): T {
    return this._array[0];
    }

    last(): T {
    return this._array[this._array.length - 1];
    }

    length(): number {
    return this._array.length;
    }

    add(val: T, key: number = this._array.length): fastjsArray {
    this._array.splice(key, 0, val);
    return this;
    }

    push(...val: Array<T>): fastjsArray {
    // arguments each
    for (let i = 0; i < arguments.length; i++) {
        this.add(arguments[i]);
    }
    return this;
    }

    remove(key: number): fastjsArray {
    this._array.splice(key, 1);
    return this;
    }

    get(key: number): T {
    return this._array[key];
    }

    set(key: number, val: T): fastjsArray<T> {
    this._array[key] = val;
    return this;
    }

    each(callback: Function): fastjsArray<T> {
    this._array.forEach((e: T, key: number) => {
        callback(e, key);
    });
    return this;
    }

    filter(callback: Function): Array<T> {
    return this._array.filter((e: T, key: number) => {
        return callback(e, key);
    });
    }

    map(callback: Function): Array<T> {
    return this._array.map((e: T, key: number) => {
        return callback(e, key);
    });
    }

    toArray(): Array<T> {
    return this._array;
    }

    then(callback: Function, time = 0): fastjsArray<T> {
    if (time)
        setTimeout(() => {
        callback(this);
        }, time);
    else callback(this);
    return this;
    }

    addHook(callback: Function): fastjsArray<T> {
        this.#hooks.push(callback);
        return this;
    }

    // private methods

    #check(item: T) {
    let cfg = this._config;
    // check length
    if (cfg.length && this._array.length >= cfg.length) {
        // dev start
        _dev.newError(
        "FastjsArray",
        `Max length of <${cfg.type}>FastjsArray is ` + cfg.length,
        ["check(item)", "fastjsArray"]
        );

        // dev end
        return;
    }

    // check type
    const reject = () => {
        // dev start
        _dev.newError(
        "FastjsArray",
        `TypeError: ${type}${item} cannot be a item of <${cfg.type}>FastjsArray`,
        ["reject()", "check(item)", "fastjsArray"]
        );
        // dev end
        return false;
    };

    let type = _dev.type(item);
    if (cfg.type !== "Any") {
        // if cfg.type is array -> multi type
        if (Array.isArray(cfg.type)) {
        // if type is not in cfg.type ** ignore case
        if (!cfg.type.some((v) => v.toLowerCase() === type.toLowerCase())) {
            return reject();
        }
        }
        // else
        else if (type.toLowerCase() !== cfg.type.toLowerCase()) {
        return reject();
        }
    }
    return true;
    }
}

export default fastjsArray;
