import _dev from "../dev";
import moduleConfig from "./config";

import type {data, fetchRequestConfig, fetchReturn, requestConfig} from "./def";
import FastjsRequest from "./base";
import {addQuery} from "./lib";

class FastjsFetchRequest extends FastjsRequest {
    readonly construct: string = "FastjsFetchRequest";
    declare config: fetchRequestConfig;

    constructor(
        public url: string,
        public data: data = {},
        config: Partial<fetchRequestConfig> = {}
    ) {
        super(url, data, config);

        this.config.hooks = {
            before: this.config.hooks?.before || moduleConfig.fetchHooks.before || moduleConfig.hooks.before || (() => true),
            success: this.config.hooks?.success || moduleConfig.fetchHooks.success || moduleConfig.hooks.success || (() => true),
            failed: this.config.hooks?.failed || moduleConfig.fetchHooks.failed || moduleConfig.hooks.failed || (() => true),
            callback: this.config.hooks?.callback || moduleConfig.fetchHooks.callback || moduleConfig.hooks.callback || (() => true)
        }
    }

    send(method: "GET" | "HEAD" | "OPTIONS", data?: data, referer?: string): Promise<fetchReturn>;
    send(method: "POST" | "PUT" | "DELETE" | "PATCH", data?: string | data, referer?: string): Promise<fetchReturn>;
    send(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS", data: data | string = {}, referer: string = "FastjsFetchRequest.send()"): Promise<fetchReturn> {
        return new Promise((resolve, reject) => {
            const hooks = this.config.hooks

            if (__DEV__) {
                // unrecommended method
                if (["OPTIONS"].includes(method) && moduleConfig.check.unrecommendedMethodWarning) {
                    _dev.warn("fastjs/request", `Unrecommended method ${method} used in ${referer}, use GET instead. Set request.config.check.unrecommendedMethodWarning to false to ignore this warning.`, [
                        `url: ${this.url}`,
                        `*method: ${method}`,
                        `*config: `, this.config,
                        "super: ", this
                    ], ["fastjs.warn"])
                }

                // check data
                if (["GET", "HEAD", "OPTIONS"].includes(method) && this.config.body) {
                    _dev.warn("fastjs/request", `Body is not allowed in ${method} request, use POST instead. (HTTP 1.1)`, [
                        `url: ${this.url}`,
                        `*method: ${method}`,
                        `*body: `, this.config.body,
                        "super: ", this
                    ], ["fastjs.warn"])
                    _dev.warn("fastjs/request", `We have deleted the body in ${method} request, if you still want to do this, use FastjsRequest without FastjsFetchRequest.`, [
                        `url: ${this.url}`,
                        `*method: ${method}`,
                        `*body: `, this.config.body,
                        "super: ", this
                    ], ["fastjs.warn"])
                }
            }

            let bodyData: string | null = ["GET", "HEAD", "OPTIONS"].includes(method) ?
                null : (typeof data === "string" ? data : JSON.stringify(data || this.config.body));
            let queryData: data | string | null = ["GET", "HEAD", "OPTIONS"].includes(method) ?
                data || this.config.query : this.config.query;

            const send = () => {
                if (this.request && this.config.shutdown) return

                // use fetch rewrite xhr
                this.request = new Request(addQuery(this.url, queryData), {
                    method: method,
                    headers: this.config.headers,
                    body: bodyData
                });

                if (hooks.before(this, moduleConfig)) {
                    fetch(this.request).then((response) => {
                        if (!moduleConfig.handler.responseCode(response.status, this)) return this.handleBadResponse(send, response);
                        if (!hooks.success(this, moduleConfig)) return reject("hooks.success() interrupted");

                        moduleConfig.handler.fetchReturn(response, this).then((data) => {
                            if (!hooks.callback(this, data, moduleConfig)) return reject("hooks.callback() interrupted");
                            if (this.config.callback) this.config.callback(this, data, moduleConfig);
                            resolve({
                                response: response,
                                data: data,
                                request: this,
                                // @ts-ignore
                                resend: () => this.send(method, data, "FastjsFetchRequest.resend()")
                            } as fetchReturn);
                        }).catch((error) => {
                            return _dev.warn("fastjs/request", `Failed to parse return, if you are using custom handler(config.handler.fetchReturn), please check your hooks. If not, this may be a bug, check server response and submit an issue to https://github.com/fastjs-team/core/issues.`, [
                                `url: ${this.url}`,
                                `method: ${method}`,
                                `*body: `, this.config.body,
                                `*response: `, response,
                                `*error: `, error,
                                "super: ", this
                            ], ["fastjs.wrong"]);
                        })
                    }).catch((error) => {
                        if (!hooks.failed(this, moduleConfig)) return reject("hooks.failed() interrupted");
                        if (this.config.keepalive) setTimeout(send, this.config.keepaliveWait);
                        if (__DEV__) {
                            _dev.warn("fastjs/request", `Request failed with error, if maybe intercepted by CORS or network problem.`, [
                                `url: ${this.url}`,
                                `method: ${method}`,
                                `*body: `, this.config.body,
                                `*error: ${error.message}`,
                                "super: ", this
                            ], ["fastjs.wrong"]);
                            console.error(_dev.error("fastjs/request", `Request failed with error`, [
                                "url: " + this.url]))
                        }
                        throw error;
                    });
                } else {
                    reject(new Error("hooks.before() return false"));
                }
            }

            if (this.config.wait > 0 && this.config.wait !== this.wait) {
                if (this.wait) clearTimeout(this.wait);
                this.wait = setTimeout(() => this.wait = send(), this.config.wait) as unknown as number;
            } else send()
        })

    }
    request: Request | null = null;
}

export default FastjsFetchRequest;