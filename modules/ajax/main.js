import _config from "../../config";
import send from "./send";

const Ajax = function (url, data, callback, failed, config = {}) {
    if (!url) {
        throw new Error("Fastjs.modules.ajax: url is required in setup");
    }
    this.url = url;
    this.data = data || {};
    const func = () => 0
    this.callback = callback || func;
    this.failed = failed || func;
    this.config = {
        timeout: config.timeout || _config.modules.ajax.timeout,
        datatype: config.datatype || "auto",
        headers: config.headers || {}
    };
}

Ajax.prototype.send = send;

export default Ajax