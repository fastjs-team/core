import _dev from "../dev";
import moduleConfig from "./config";
import FastjsBaseModule from "../base";

import type {data, requestConfig} from "./def";

export function getHeaders(xhr: XMLHttpRequest): { [key: string]: string } {
    const headers: { [key: string]: string } = {}
    xhr.getAllResponseHeaders()?.split("\n").forEach((e) => {
        e && (headers[e.split(": ")[0]] = e.split(": ")[1]);
    })
    return headers;
}

class FastjsRequest extends FastjsBaseModule<FastjsRequest> {
    private waitId: number = 0;
    readonly construct: string = "FastjsXhrRequest";

    constructor(public url: string, public data: data = {}, config: Partial<requestConfig> = {}) {
        super();

        if (__DEV__ && !url) {
            _dev.warn("fastjs/request", "A correct url is **required**.", [
                `***url: ${url}`,
                "data:", data,
                "config:", config,
                "super:", this
            ], ["fastjs.wrong"])
            throw _dev.error("fastjs/request", "A correct url is required.", [
                "constructor(url: string, data?: data, config: Partial<requestConfig> = {})",
                "FastjsRequest.constructor"
            ]);
        }

        this.config = {
            timeout: config.timeout || moduleConfig.timeout,
            headers: config.headers || {},
            shutdown: config.shutdown || false,
            wait: config.wait || 0,
            failed: config.failed || (() => 0),
            callback: config.callback || (() => 0),
            keepalive: config.keepalive || false,
            keepaliveWait: config.keepaliveWait || 0,
            hooks: config.hooks || moduleConfig.hooks,
            query: config.query || null,
            body: config.body || null
        };
    }

    config: requestConfig;
    response: any = null;
    xhr: XMLHttpRequest | null = null;

    get(data: data = {}) {
        return this.send("GET", data, "FastjsRequest.get()");
    }

    post(data: data = {}) {
        return this.send("POST", data, "FastjsRequest.post()");
    }

    put(data: data = {}) {
        return this.send("PUT", data, "FastjsRequest.put()");
    }

    delete(data: data = {}) {
        return this.send("DELETE", data, "FastjsRequest.delete()");
    }

    patch(data: data = {}) {
        return this.send("PATCH", data, "FastjsRequest.patch()");
    }

    send(method: "GET", data?: data, referer?: string): Promise<any>;
    send(method: "POST" | "PUT" | "DELETE" | "PATCH", data?: string | data, referer?: string): Promise<any>;
    send(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", data: data | string = {}, referer: string = "FastjsRequest.send()") {
        return new Promise((resolve, reject) => {
            const hooks = {
                before: this.config.hooks?.before || moduleConfig.hooks.before || (() => true),
                success: this.config.hooks?.success || moduleConfig.hooks.success || (() => true),
                failed: this.config.hooks?.failed || moduleConfig.hooks.failed || (() => true),
                callback: this.config.hooks?.callback || moduleConfig.hooks.callback || (() => true)
            };
            let bodyData: string | null = null;
            let _bodyData = method === "GET" ? this.config.body : data || this.config.body;
            if (_bodyData) {
                if (typeof _bodyData === "string") {
                    this.config.headers["Content-Type"] = "text/plain";
                    bodyData = _bodyData;

                    if (__DEV__) {
                        _dev.warn("fastjs/request", "Sending a string body data is not recommended.", [
                            `string url: ${this.url}`,
                            `data Data: ${data}`,
                            `Partial<config> Config: ${this.config}`,
                        ]);
                    }
                } else {
                    this.config.headers["Content-Type"] = "application/json";
                    bodyData = JSON.stringify(_bodyData);
                }

                if (__DEV__ && method === "GET") {
                    _dev.warn("fastjs/request", "Sending a body data with **GET** method should be **avoided**. (HTTP 1.1)", [
                        `url: ${this.url}`,
                        `data: ${data}`,
                        `*config: ${this.config}`,
                    ], ["fastjs.warn"]);
                }
            }

            let queryData: data | string | null;
            if (method === "GET") {
                queryData = (data ? data : null) || this.config.query;
            } else {
                queryData = this.config.query;
            }

            const sendRequest = () => {
                if (this.xhr !== null && this.config.shutdown) {
                    return
                }

                let xhr = new XMLHttpRequest();
                this.xhr = xhr;
                let url = this.url;
                if (queryData) {
                    if (typeof queryData === "string") {
                        url += (url.includes("?") ? "" : "?") + queryData;
                    } else {
                        for (const key in queryData) {
                            if (queryData.hasOwnProperty(key)) {
                                const value = queryData[key];
                                url += `${url.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
                            }
                        }
                    }
                }
                xhr.open(method, url, true);
                // set header
                for (let key in this.config.headers) {
                    xhr.setRequestHeader(key, this.config.headers[key]);
                }
                xhr.timeout = this.config.timeout;
                const fail = (from?: string) => {
                    const result = this.xhr?.status === 0 ?
                        false : moduleConfig.handler.parseData(this.xhr?.response, this);
                    // hook
                    if (!hooks.failed(this, moduleConfig)) return reject("hooks.failed() interrupted");
                    // run failed
                    this.config.failed(this);
                    // if keepalive
                    if (this.config.keepalive) {
                        setTimeout(sendRequest, this.config.keepaliveWait);
                    }
                    if (__DEV__) {
                        let err
                        switch (true) {
                            case this.xhr?.status === 0:
                                err = "Request failed";
                                break;
                            default:
                                err = `Request failed with status ${this.xhr?.status}`;
                        }

                        console.log(from)
                        _dev.warn("fastjs/request", err, [
                            "*status: **" + (this.xhr?.status || "Unable to send request") + "**",
                            from ? ("*" + from) : "",
                            referer ? `${referer} -> send()` : "",
                            "url: " + this.url,
                            "global config:", moduleConfig,
                            "super:", this,
                        ], ["fastjs.wrong"]);

                        const errOutput = _dev.error("fastjs/request", err, [
                            from || "",
                            referer ? `${referer} -> send()` : "",
                            "url: " + this.url,
                        ]);
                        reject(result || errOutput);
                        console.error(errOutput);
                    } else {
                        reject("Request failed");
                    }
                };
                // xhr failed
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 0) fail("xhr -> onreadystatechange()");
                        else requestFinish()
                    }
                }
                xhr.onerror = () => fail;
                xhr.ontimeout = () => fail;
                // xhr load
                const requestFinish = () => {
                    if (xhr.status !== 200) {
                        return void fail("xhr -> onreadystatechange() -> load()");
                    }
                    const data = moduleConfig.handler.parseData(xhr.response, this);
                    if (!hooks.success(this, moduleConfig)) return reject("hooks.success() interrupted");
                    if (!hooks.callback(this, data, moduleConfig)) return reject("hooks.callback() interrupted");
                    const response = {
                        status: xhr.status,
                        statusText: xhr.statusText,
                        headers: getHeaders(xhr),
                        body: xhr.response,
                        data: data,
                        xhr: xhr,
                        request: this,
                        resend: () => {
                            // @ts-ignore
                            return this.send(method, data, referer);
                        }
                    }
                    this.config.callback(response);
                    // if keepalive
                    if (this.config.keepalive) {
                        setTimeout(sendRequest, this.config.keepaliveWait);
                    }
                    resolve(response);
                };

                if (!hooks.before(this, moduleConfig)) return reject("hooks.before() interrupted");
                xhr.send(bodyData || null);
            };

            // if wait
            if (this.config.wait > 0) {
                if (this.waitId !== 0) {
                    clearTimeout(this.waitId);
                }
                // do debounce
                this.waitId = Number(
                    setTimeout(() => {
                        sendRequest();
                        this.waitId = 0;
                    }, this.config.wait)
                );
            } else sendRequest();
        })
    }
}

export type {data, requestConfig}
export {FastjsRequest as request, moduleConfig}
export default FastjsRequest;