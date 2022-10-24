import _dev from "../dev";

const fastjsArray = function (array, config = {}) {
    /*
    config = {
        type: <string>::type / <array>::type,
        length: <number>::max length
    }
    */

    config = {
        type: config.type || "Any",
        length: config.length || null
    }

    const check = item => {
        // check length
        if (config.length && this._array.length >= config.length) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                _dev.newError("FastjsArray", `Max length of <${config.type}>FastjsArray is ` + config.length);
            }
            // dev end
            else return
        }
        // check type
        const reject = () => {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                _dev.newError("FastjsArray", `TypeError: ${type} cannot be a item of <${config.type}>FastjsArray`);
            }
            // dev end
        }
        let type = _dev.type(item);
        if (config.type !== "Any") {
            // if config.type is array -> multi type
            if (Array.isArray(config.type)) {
                // if type is not in config.type ** ignore case
                if (!config.type.some(v => v.toLowerCase() === type.toLowerCase())) {
                    reject();
                }
            }
            // else
            else if (type.toLowerCase() !== config.type.toLowerCase()) {
                reject();
            }
        }
    }
    const setKey = () => {
        this._array.forEach((v, k) => {
            this[k] = v;
        })
        // check is there an invalid key
        let i = this._array.length;
        while (this[i] !== undefined) {
            delete this[i];
            i++;
        }
    }

    this._array = [];
    this._config = config;

    let _e = this
    const methods = {
        // copy from above
        first() {
            return _e._array[0];
        },
        last() {
            return _e._array[_e._array.length - 1];
        },
        length() {
            return _e._array.length;
        },
        add(val, key) {
            check(val);
            if (key)
                _e._array[key] = val;
            else
                _e._array.push(val);
            setKey();
            return _e;
        },
        push() {
            // arguments each
            for (let i = 0; i < arguments.length; i++) {
                _e.add(arguments[i]);
            }
            return _e;
        },
        remove(key) {
            _e._array.splice(key, 1);
            setKey();
            return _e;
        },
        get(key) {
            return _e._array[key];
        },
        set(key, val) {
            check(val);
            _e._array[key] = val;
            setKey();
            return _e;
        },
        each(callback) {
            _e._array.forEach((e, key) => {
                callback(e, key);
            })
            return _e;
        },
        filter(callback) {
            return _e._array.filter((e, key) => {
                return callback(e, key);
            })
        },
        map(callback) {
            return _e._array.map((e, key) => {
                return callback(e, key);
            })
        },
        toArray() {
            return _e._array;
        },
        then(callback, time = 0) {
            if (time)
                setTimeout(() => {
                    callback(this);
                }, time);
            else
                callback(this);
            return this;
        },
        construct: `<${config.type}>FastjsArray`,
    }
    Object.entries(methods).forEach(e => {
        this[e[0]] = e[1];
    })

    array.forEach((v, k) => {
        this.add(v);
        this[k] = v;
    })
}

export default fastjsArray