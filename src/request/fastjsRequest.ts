import _dev from "../dev";

interface data {
    [key: string]: any;
}

interface requestConfig {
    timeout: number;
    /** @deprecated */
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
    hooks?: {
        before: (request: FastjsRequest, config: moduleConfig) => boolean;
        success: (request: FastjsRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    query?: {
        [key: string]: any;
    };
    body?: {
        [key: string]: any;
    } | string;
}

interface moduleConfig {
    timeout: number;
    hooks: {
        before: (request: FastjsRequest, config: moduleConfig) => boolean;
        success: (request: FastjsRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    handler: {
        parseData: (data: any, request: FastjsRequest) => any;
        responseCode: (code: number, request: FastjsRequest) => boolean;
    }
    ignoreFormatWarning: boolean;
    returnFullResponse: boolean;
}

const moduleConfig: moduleConfig = {
    timeout: 5000,
    hooks: {
        before: (): boolean => true,
        success: (): boolean => true,
        failed: (): boolean => true,
        callback: (): boolean => true,
    },
    handler: {
        parseData: (data: any, request: FastjsRequest) => {
            try {
                return JSON.parse(data);
            } catch (e) {
                if (__DEV__ && !moduleConfig.ignoreFormatWarning) {
                    _dev.warn("fastjs/request", "Failed to parse JSON, do you sure you send a request correctly? Set request.config.ignoreFormatWarning to true to ignore this warning.", [
                        `*Received data:`, {
                            data: data,
                            length: data.length,
                            // headers to object
                            headers: getHeaders(request.xhr as XMLHttpRequest),
                        },
                        `url: ${request.url}`,
                        `config:`, request.config,
                        "super:", request
                    ], ["fastjs.warn"])
                }
                return data;
            }
        },
        responseCode: (code: number): boolean => {
            return code >= 200 && code < 300;
        }
    },
    ignoreFormatWarning: false,
    returnFullResponse: false
}

function getHeaders(xhr: XMLHttpRequest): { [key: string]: string } {
    const headers: { [key: string]: string } = {}
    xhr.getAllResponseHeaders()?.split("\n").forEach((e) => {
        e && (headers[e.split(": ")[0]] = e.split(": ")[1]);
    })
    return headers;
}

class FastjsRequest {
    private waitId: number;
    readonly construct: string;

    constructor(url: string, data?: data, config: Partial<requestConfig> = {}) {
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
        this.url = url;
        this.data = data || {};

        if (__DEV__) {
            if (config.datatype)
                _dev.warn("fastjs/request", "Datatype is **deprecated** and already **doesn't effect on anything**, it will be **removed** in the future, Try to use `request.config.hooks.callback` instead.", [
                    `url: ${this.url}`,
                    "data:", this.data,
                    "*config:", config,
                    "super:", this
                ], ["fastjs.warn", "fastjs.warn", "fastjs.wrong", "fastjs.warn"])
        }
        this.config = {
            timeout: config.timeout || moduleConfig.timeout,
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
        this.construct = "FastjsRequest";
    }

    url: string;
    data: {
        [key: string]: any;
    };
    config: requestConfig;
    response: any;
    xhr: XMLHttpRequest | null;

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

            let queryData: data | undefined;
            if (method === "GET") {
                queryData = (typeof data === "object" ? data : undefined) || this.config.query;
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
                if (queryData && Object.keys(queryData).length) {
                    for (const key in queryData) {
                        if (this.data.hasOwnProperty(key)) {
                            const value = this.data[key];
                            url += `${url.includes("?") ? "&" : "?"}${key}=${encodeURIComponent(value)}`;
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
                    if (!hooks.failed(this, moduleConfig)) return;
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
                    if (!hooks.success(this, moduleConfig)) return;
                    if (!hooks.callback(this, data, moduleConfig)) return;
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

                if (!hooks.before(this, moduleConfig)) return;
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