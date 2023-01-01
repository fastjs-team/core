import _config from "../../src/config";
import _dev from "../../src/dev";

interface data {
    [key: string]: string | number | boolean | Array<any> | null | data;
}

interface config {
    timeout: number;
    datatype: string;
    headers: {
        [key: string]: string;
    };
    shutdown: boolean;
    wait: number;
    failed: Function;
    callback: Function;
    keepalive: boolean;
    keepaliveWait: number;
}

interface selectConfig {
    timeout?: number;
    datatype?: string;
    headers?: {
        [key: string]: string;
    };
    shutdown?: boolean;
    wait?: number;
    failed?: Function;
    callback?: Function;
    keepalive?: boolean;
    keepaliveWait?: number;
}

class FastjsAjax {
  private readonly construct: string;
  private waitId: number;

    constructor(url: string, data?: data, config: selectConfig = {}) {
        this.url = url;
        this.data = data || {};
        this.config = {
            timeout: config.timeout || _config.modules.ajax.timeout,
            datatype: config.datatype || "auto",
            headers: config.headers || {},
            shutdown: config.shutdown || false,
            wait: config.wait || 0,
            failed: config.failed || (() => 0),
            callback: config.callback || (() => 0),
            keepalive: config.keepalive || false,
            keepaliveWait: config.keepaliveWait || 0
        };
        this.response = null;
        this.xhr = null;
        this.waitId = 0;

    // construct
    this.construct = "FastjsAjax";
  }

    url: string;
    data: {
        [key: string]: string | number | boolean | Array<any> | null | data;
    };
    config: config;
    response: any;
    xhr: XMLHttpRequest | null;

    get() {
        return this.send("GET", "FastjsAjax.get()");
    }

    post() {
        return this.send("POST", "FastjsAjax.post()");
    }

    send(method: string, referer: string = "FastjsAjax.send()") {
        const config = _config.modules.ajax;

        return new Promise((resolve, reject) => {
            // method to uppercase
            method = method.toUpperCase();
            const next = () => {
                const tryJson = (data: any) => {
                    try {
                        return JSON.parse(data);
                    } catch (e) {
                        return data;
                    }
                }

                // if xhr and shutdown is true
                if (this.xhr !== null && this.config.shutdown) {
                    return
                }
                // create xhr
                let xhr = new XMLHttpRequest();
                this.xhr = xhr;
                xhr.open(method, this.url, true);
                // set header
                for (let key in this.config.headers) {
                    xhr.setRequestHeader(key, this.config.headers[key]);
                }
                xhr.timeout = this.config.timeout;
                const fail = (from?: string) => {
                    const result = this.xhr?.status === 0 && false || tryJson(this.xhr?.response)
                    // hook
                    if (config.hooks.failed(this) === false) return;
                    // run failed
                    this.config.failed(this);
                    // if keepalive
                    if (this.config.keepalive) {
                        setTimeout(next, this.config.keepaliveWait);
                    }
                    let err
                    switch (true) {
                        case this.xhr?.status === 0:
                            err = "Request failed";
                            break;
                        default:
                            err = `Request failed with status ${this.xhr?.status}`;
                    }
                    const errOutput = _dev.newError("FastjsAjax", err, [
                        err,
                        "trig -> fail()",
                        from || "",
                        referer ? `${referer} -> send()` : "",
                        "url: " + this.url,
                    ]);
                    reject(result || errOutput);
                    console.error(errOutput);
                };
                // xhr failed
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 0) fail("xhr -> onreadystatechange()");
                        else load()
                    }
                }
                xhr.onerror = () => fail;
                xhr.ontimeout = () => fail;
                // xhr load
                const load = () => {
                    if (xhr.status !== 200) {
                        return void fail("xhr -> onreadystatechange() -> load()");
                    }
                    const data = this.config.datatype === "auto" && tryJson(xhr.response) || xhr.response;
                    if (config.hooks.success(this) === false) return;
                    if (config.hooks.callback(this, data) === false) return;
                    this.config.callback(data, this);
                    // if keepalive
                    if (this.config.keepalive) {
                        setTimeout(next, this.config.keepaliveWait);
                    }
                    resolve(data);
                };
                let query = "";
                if (method === "POST") {
                    // data to query
                    for (let key in this.data) {
                        query += `${key}=${this.data[key]}&`;
                    }
                }
                xhr.send(query || null);
            };

            // if wait
            if (this.config.wait > 0) {
                if (this.waitId !== 0) {
                    clearTimeout(this.waitId);
                }
                // do debounce
                this.waitId = Number(
                    setTimeout(() => {
                        next();
                        this.waitId = 0;
                    }, this.config.wait)
                );
            } else next();
        })
    }
}

export default FastjsAjax;
