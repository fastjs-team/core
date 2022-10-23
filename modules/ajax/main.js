import _config from "../../config";
import send from "./send";

const Ajax = function (url, data, callback, failed, config = {}) {
    if (!url) {
        throw new Error("Fastjs.modules.ajax: url is required in setup");
    }
    const func = () => 0
    let _this = {
        url: url,
        data: data || {},
        callback: callback || func,
        failed: failed || func,
        config: {
            timeout: config.timeout || _config.modules.ajax.timeout,
            datatype: config.datatype || "auto",
            headers: config.headers || {}
        },
        xhr: null,
        send: send(this).send
    }
    Object.assign(this, _this);
}

export default Ajax