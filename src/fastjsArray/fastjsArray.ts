import _check from "./check";
import methods from "./methods";

let defaultConfig = {
    type: "Any",
    length: null
}

interface config {
    type: string | Array<string>,
    length: number | null
}

class fastjsArray {
    constructor(array: Array<any>, config: config = defaultConfig) {
        /*
        config = {
            type: <string>::type / <array>::type,
            length: <number>::max length
        }
        */

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
                target[Number(key)] = value;
                effect();
                return true
            }
        });
        this._config = config;

        // init methods
        console.log(methods(this));
        Object.entries(methods(this)).forEach(e => {
            this[e[0]] = e[1];
        })

        // init effect
        effect();
    }

    _config: config
    // array = Proxy -> Array
    _array: Array<any>

    // methods
    [key: string]: any
}

export default fastjsArray