import _dev from "../dev";
import fastjsArray from "./fastjsArray";

export default (_e: fastjsArray) => {
    return (item: any) => {
        let cfg = _e._config;
        // check length
        if (cfg.length && _e._array.length >= cfg.length) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                _dev.newError("FastjsArray", `Max length of <${cfg.type}>FastjsArray is ` + cfg.length, [
                    "check(item)",
                    "fastjsArray"
                ]);
            }
            // dev end
            return
        }

        // check type
        const reject = () => {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                _dev.newError("FastjsArray", `TypeError: ${type} cannot be a item of <${cfg.type}>FastjsArray`, [
                    "reject()",
                    "check(item)",
                    "fastjsArray"
                ]);
            }
            // dev end
            return false
        }

        let type = _dev.type(item);
        if (cfg.type !== "Any") {
            // if cfg.type is array -> multi type
            if (Array.isArray(cfg.type)) {
                // if type is not in cfg.type ** ignore case
                if (!cfg.type.some(v => v.toLowerCase() === type.toLowerCase())) {
                    return reject();
                }
            }
            // else
            else if (type.toLowerCase() !== cfg.type.toLowerCase()) {
                return reject();
            }
        }
        return true
    }
}