import _config from "../../config";
const config = _config.modules.ajax

// _e = Ajax
export default _e => {
    return {
        send(method) {
            console.log(_e);
            let xhr = new XMLHttpRequest();
            _e.xhr = xhr;
            xhr.open(method, _e.url, true);
            xhr.timeout = _e.config.timeout;
            xhr.onload = () => {

            }
            const fail = () => {
                if (config.hooks.failed(_e) === false) return;
                // cut out xhr
                xhr.abort();
            }
            xhr.onerror = fail;
            xhr.ontimeout = fail;
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
            xhr.send(_e.data);
        }

    }
}