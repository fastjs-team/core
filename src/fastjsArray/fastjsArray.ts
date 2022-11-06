import _check from "./check";
import methods from "./methods";

let defaultConfig = {
    type: "Any",
    length: null
}

interface config {
    type?: string | Array<string>,
    length?: number | null
}

class fastjsArray {
    constructor(array: Array<any>, config: config = defaultConfig) {
        /*
        config = {
            type: <string>::type / <array>::type,
            length: <number>::max length
        }
        */

        // init config
        if (config.type === undefined) config.type = defaultConfig.type;
        if (config.length === undefined) config.length = defaultConfig.length;

        const check = _check(this);
        const effect = () => {
            this._array.forEach((v: any, k: number) => {
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
            set: (target: Array<any>, key: string, value) => {
                if (!check(value)) return false
                // @ts-ignore
                target[key] = value;
                effect();
                return true
            }
        });
        // @ts-ignore
        this._config = config;

        // init methods
        Object.entries(methods(this)).forEach(e => {
            this[e[0]] = e[1];
        })

        // init effect
        effect();
    }

    _config: {
        type: string | Array<string>,
        length?: number | null
    }
    // array = Proxy -> Array
    _array: Array<any>

    // methods
    [key: string]: any
}

export default fastjsArray