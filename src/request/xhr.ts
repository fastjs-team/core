import _dev from "../dev";
import moduleConfig from "./config";

import type {data, xhrRequestConfig, xhrReturn} from "./def";
import {addQuery} from "./lib";
import FastjsRequest from "./base";

export function getHeaders(xhr: XMLHttpRequest): { [key: string]: string } {
    const headers: { [key: string]: string } = {}
    xhr.getAllResponseHeaders()?.split("\n").forEach((e) => {
        e && (headers[e.split(": ")[0]] = e.split(": ")[1]);
    })
    return headers;
}

class FastjsXhrRequest extends FastjsRequest {
    readonly construct: string = "FastjsXhrRequest";
    declare config: xhrRequestConfig;

    constructor(
        public url: string,
        public data: data = {},
        config: Partial<xhrRequestConfig> = {}
    ) {
        super(url, data, config);

        this.config.hooks = {
            before: this.config.hooks?.before || moduleConfig.xhrHooks.before || (() => true),
            init: this.config.hooks?.init || moduleConfig.xhrHooks.init || (() => true),
            success: this.config.hooks?.success || moduleConfig.xhrHooks.success || (() => true),
            failed: this.config.hooks?.failed || moduleConfig.xhrHooks.failed || (() => true),
            callback: this.config.hooks?.callback || moduleConfig.xhrHooks.callback || (() => true)
        }
    }

    send(method: "GET" | "HEAD" | "OPTIONS", data?: data, referer?: string): Promise<xhrReturn>;
    send(method: "POST" | "PUT" | "DELETE" | "PATCH", data?: string | data, referer?: string): Promise<xhrReturn>;
    send(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS", data: data | string = {}, referer: string = "FastjsRequest.send()"): Promise<xhrReturn> {
        return new Promise((resolve, reject) => {
            const hooks = this.config.hooks

            if (__DEV__) {
                // unrecommended method
                if (["OPTIONS"].includes(method) && moduleConfig.check.unrecommendedMethodWarning) {
                    _dev.warn("fastjs/request", `Unrecommended method ${method} used in ${referer}, use GET instead. Set request.config.check.unrecommendedMethodWarning to false to ignore this warning.`, [
                        `url: ${this.url}`,
                        `*method: ${method}`,
                        `config: `, this.config,
                        "super: ", this
                    ], ["fastjs.warn"])
                }

                // check data
                if (["GET", "HEAD", "OPTIONS"].includes(method) && this.config.body) {
                    _dev.warn("fastjs/request", `Sending a body data with **GET** method should be **avoided**, use POST instead. (HTTP 1.1)`, [
                        `url: ${this.url}`,
                        `*method: ${method}`,
                        `*config: `, this.config,
                        "super: ", this
                    ], ["fastjs.warn"])
                }

                if (
                    (this.config.body && moduleConfig.check.stringBodyWarning) ||
                    ((!["GET", "HEAD", "OPTIONS"].includes(method)) && typeof data === "string" && moduleConfig.check.stringBodyWarning)
                ) {
                    _dev.warn("fastjs/request", `Sending a string body data is not recommended.`, [
                        `url: ${this.url}`,
                        `*data: ${data}`,
                        `*method: ${method}`,
                        `config: `, this.config,
                        "super: ", this
                    ], ["fastjs.warn"])
                }
            }

            const send = () => {
                if (this.xhr && this.config.shutdown) return
                if (!hooks.init(this, moduleConfig)) return reject("hooks.init() interrupted");

                let bodyData: string | null = ["GET", "HEAD", "OPTIONS"].includes(method) ?
                    null : (typeof data === "string" ? data : JSON.stringify(data || this.config.body));
                let queryData: data | string | null = ["GET", "HEAD", "OPTIONS"].includes(method) ?
                    data || this.config.query : this.config.query;

                let xhr = this.xhr = new XMLHttpRequest();
                xhr.open(method, addQuery(this.url, queryData), true);
                // set header
                for (let key in this.config.headers) {
                    xhr.setRequestHeader(key, this.config.headers[key]);
                }
                xhr.timeout = this.config.timeout;
                const fail = () => {
                    if (!hooks.failed(this, moduleConfig)) return reject("hooks.failed() interrupted");
                    if (this.config.keepalive) setTimeout(send, this.config.keepaliveWait);
                    return reject(xhr);
                };
                // xhr failed
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 0) fail();
                        else requestFinish()
                    }
                }
                xhr.onerror = () => fail;
                xhr.ontimeout = () => fail;
                // xhr load
                const requestFinish = () => {
                    if (!moduleConfig.handler.responseCode(xhr.status, this)) return this.handleBadResponse(send);
                    if (!hooks.success(this, moduleConfig)) return reject("hooks.success() interrupted");

                    let data: any;
                    try {
                        data = moduleConfig.handler.parseData(xhr.response, this);
                    } catch (e) {
                        return _dev.warn("fastjs/request", `Failed to parse return, if you are using custom handler(config.handler.parseData), please check your hooks. If not, this may be a bug, check server response and submit an issue to https://github.com/fastjs-team/core/issues.`, [
                            `url: ${this.url}`,
                            `method: ${method}`,
                            `*body: `, this.config.body,
                            `*response: `, xhr.response,
                            `*error: `, e,
                            "super: ", this
                        ], ["fastjs.wrong"]);
                    }
                    if (!hooks.callback(this, data, moduleConfig)) return reject("hooks.callback() interrupted");
                    const response: xhrReturn = {
                        headers: getHeaders(xhr),
                        body: xhr.response,
                        data: data,
                        xhr: xhr,
                        request: this,
                        // @ts-ignore
                        resend: () => this.send(method, data, "FastjsXhrRequest.resend()")
                    }
                    // if keepalive
                    if (this.config.keepalive) {
                        setTimeout(send, this.config.keepaliveWait);
                    }
                    if (this.config.callback) this.config.callback(response);
                    resolve(response);
                };

                if (!hooks.before(this, moduleConfig)) return reject("hooks.before() interrupted");
                xhr.send(bodyData || null);
            };

            if (this.config.wait > 0 && this.config.wait !== this.wait) {
                if (this.wait) clearTimeout(this.wait);
                this.wait = setTimeout(() => this.wait = send(), this.config.wait) as unknown as number;
            } else send()
        })
    }
}

export default FastjsXhrRequest;
