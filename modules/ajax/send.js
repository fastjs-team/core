import _config from "../../config";
const config = _config.modules.ajax

const send = method => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, this.url, true);
    xhr.timeout = this.config.timeout;
    xhr.onload = () => {

    }
    const fail = () => {
        if (config.hooks.failed(this) === false) return;
        // cut out xhr
        xhr.abort();
    }
    xhr.onerror = fail;
    xhr.ontimeout = fail;
    xhr.onload = () => {
        const data = xhr.response;
        // if auto
        if (this.config.datatype === "auto") {
            // try to parse json
            try {
                this.data = JSON.parse(xhr.responseText);
            } catch {
                this.data = xhr.responseText;
            }
        }
        if (config.hooks.success(this) === false) return;
        if (config.hooks.callback(this, data) === false) return;
        this.callback(data);
    }
    xhr.send(this.data);
}

export default send