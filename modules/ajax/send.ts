import _config from "../../src/config";
import fastjsAjax from "./main";

const config = _config.modules.ajax

// _e = Ajax
export default (_e: fastjsAjax) => {
    return function (method: string) {
        // method to uppercase
        method = method.toUpperCase();

        // create xhr
        let xhr = new XMLHttpRequest();
        _e.xhr = xhr;
        xhr.open(method, _e.url, true);
        xhr.timeout = _e.config.timeout;
        xhr.onload = () => {

        }
        const fail = () => {
            // hook
            if (config.hooks.failed(_e) === false) return;
            // cut out xhr
            xhr.abort();
        }
        // xhr failed
        xhr.onerror = fail;
        xhr.ontimeout = fail;
        // xhr success
        xhr.onload = () => {
            const data = xhr.response;
            // if auto
            if (_e.config.datatype === "auto") {
                // try to parse json
                try {
                    _e.response = JSON.parse(xhr.responseText);
                } catch {
                    _e.response = xhr.responseText;
                }
            }
            if (config.hooks.success(_e) === false) return;
            if (config.hooks.callback(_e, data) === false) return;
            _e.callback(data);
        }
        let query = "";
        if (method === "POST") {
            // data to query
            for (let key in _e.data) {
                query += `${key}=${_e.data[key]}&`;
            }
        }
        xhr.send(query || null);
    }
}