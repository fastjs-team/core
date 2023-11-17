/** @todo Rewrite this file */

import _dev from "../dev";

interface config {
    type?: string | Array<string>;
    length?: number | null;
}

class FastjsArray<T = any> {
    private readonly construct: string;
    #hooks: Array<Function>;

    constructor(array: Array<T> = [], config: config = {}) {
        /*
            config = {
                type: <string>::type / <array>::type,
                length: <number>::max length
            }
        */

        this._array = new Proxy(array, {
            set: (target: Array<T>, key: string, value: T) => {
                if (!this.#check(value)) return false;
                // @ts-ignore
                target[key] = value;
                // run hooks
                this.#hooks.forEach((e: Function) => {
                    e(this);
                });
                return true;
            },
        });

        config = this._config = {
            type: config.type || "Any",
            length: config.length || null,
        };

        // init hooks
        this.#hooks = [];

        // construct
        this.construct = `<${config.type}>FastjsArray`;

        return new Proxy(this, {
            get: (target: FastjsArray<T>, key: string) => {
                // is number
                if (!isNaN(Number(key))) {
                    return target._array[Number(key)];
                }
                // FastjsArray.prototype --> Array.prototype --> Object.prototype --> null
                else if (target[key] === undefined) {
                    // try find from this._array
                    if (key in Array.prototype) {
                        // is func
                        if (typeof Array.prototype[key as keyof Array<any>] === "function") {
                            return (...args: Array<any>) => {
                                return Array.prototype[key as keyof Array<any>].apply(target._array, args);
                            }
                        }
                        return this._array[key as keyof Array<any>];
                    }
                } else return target[key];
            },
            set: (target: FastjsArray<T>, key: string, value: T) => {
                // find from array
                if (!isNaN(Number(key))) {
                    target._array[Number(key)] = value;
                }
                return true;
            }
        })
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

    add(val: T, key: number = this._array.length): FastjsArray {
        this._array.splice(key, 0, val);
        return this;
    }

    remove(key: number): FastjsArray {
        this._array.splice(key, 1);
        return this;
    }

    each(callback: Function): FastjsArray<T> {
        this._array.forEach((e: T, key: number) => {
            callback(e, key);
        });
        return this;
    }

    toArray(): Array<any> {
        // throw proxy
        return Object.assign([], this._array);
    }

    then(callback: Function, time = 0): FastjsArray {
        if (time)
            setTimeout(() => {
                callback(this);
            }, time);
        else callback(this);
        return this;
    }

    addHook(callback: Function): FastjsArray<T> {
        this.#hooks.push(callback);
        return this;
    }

    // private methods

    #check(item: T): undefined | boolean {
        let cfg = this._config;
        // check length
        if (cfg.length && this._array.length >= cfg.length) {
            return void console.error(
                _dev.newError(
                    "FastjsArray",
                    `Max length of <${cfg.type}>FastjsArray is ` + cfg.length,
                    ["check(item)", "FastjsArray"]
                )
            )
        }

        // check type
        const reject = () => {
            // dev start
            console.error(
                _dev.newError(
                    "FastjsArray",
                    `TypeError: ${type}${item} cannot be a item of <${cfg.type}>FastjsArray`,
                    ["reject()", "check(item)", "FastjsArray"]
                )
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

export default FastjsArray;
