import _dev from "../dev";
import moduleConfig from "./config";
import FastjsBaseModule from "../base";

import {addQuery, parse} from "./lib";

import type {data, requestConfig, requestReturn, failedParams} from "./def";

class FastjsRequest extends FastjsBaseModule<FastjsRequest> {
    readonly construct: string = "FastjsRequest";
    declare config: requestConfig;
    
    private callbacks: {
        success: ((data: any, response: requestReturn) => void)[],
        failed: ((err: failedParams<Error | number | null>) => void)[]
        finally: ((request: requestReturn) => void)[]
    } = {
        success: [],
        failed: [],
        finally: []
    };
    request?: Request;

    constructor(
        public url: string,
        public data: data = {},
        config: Partial<requestConfig> = {}
    ) {
        super();

        if (__DEV__ && !url) {
            throw _dev.error("fastjs/request", "A correct url is **required**.", [
                `***url: ${url}`,
                "data: ", data,
                "config: ", config,
                "super: ", this
            ], ["fastjs.wrong"])
        }

        this.config = {
            timeout: config.timeout || moduleConfig.timeout,
            headers: config.headers || {},
            wait: config.wait || 0,
            failed: config.failed || (() => 0),
            callback: config.callback || (() => 0),
            keepalive: config.keepalive || false,
            keepaliveWait: config.keepaliveWait || 0,
            query: config.query || null,
            body: config.body || null,
            hooks: {
                before: config.hooks?.before || moduleConfig.hooks.before || (() => true),
                init: config.hooks?.init || moduleConfig.hooks.init || (() => true),
                success: config.hooks?.success || moduleConfig.hooks.success || (() => true),
                failed: config.hooks?.failed || moduleConfig.hooks.failed || (() => true),
                callback: config.hooks?.callback || moduleConfig.hooks.callback || (() => true)
            }
        };
    }

    /*   Custom promise   */

    then(callback: (data: any, response: requestReturn) => void): this {
        this.callbacks.success.push(callback);
        return this;
    }

    catch(callback: (err: failedParams<Error | number | null>) => void): this {
        this.callbacks.failed.push(callback);
        return this;
    }

    finally(callback: (response: requestReturn) => void): this {
        this.callbacks.finally.push(callback);
        return this;
    }

    /*   Custom promise   */

    send(method: "GET" | "HEAD" | "OPTIONS", data?: data): this;
    send(method: "POST" | "PUT" | "DELETE" | "PATCH", data?: string | data): this;
    send(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS", data?: data | string): this {
        const hooks = this.config.hooks

        if (__DEV__) {
            // unrecommended method
            if (["OPTIONS"].includes(method) && moduleConfig.check.unrecommendedMethodWarning) {
                _dev.warn("fastjs/request", `Unrecommended method ${method} used, use GET instead. Set request.config.check.unrecommendedMethodWarning to false to ignore this warning.`, [
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

        const send = (): void => {
            if (!hooks.before(this, moduleConfig)) return this.hookFailed("before");

            this.request = new Request(addQuery(this.url, queryData), {
                method: method,
                headers: this.config.headers,
                body: bodyData
            });

            if (hooks.init(this, moduleConfig)) {
                fetch(this.request).then(async (response) => {
                    if (!moduleConfig.handler.responseCode(response.status, this)) return this.handleBadResponse(this.generateResponse(parse(await response.text()), method, response));
                    if (!hooks.success(response, this, moduleConfig)) return this.hookFailed("success", response);

                    moduleConfig.handler.fetchReturn(response, this).then((data) => {
                        if (!hooks.callback(response, this, data, moduleConfig)) return this.hookFailed("callback", response);

                        const fullReturn: requestReturn = this.generateResponse(data, method, response)
                        if (this.config.callback) this.config.callback(data, fullReturn);
                        this.callbacks.success.forEach((callback) => callback(data, fullReturn));
                    }).catch((error) => {
                        if (__DEV__) {
                            _dev.warn("fastjs/request", `Failed to **parse** return, if you are using custom handler(config.handler.fetchReturn), please check your hooks. If not, this may be a bug, check server response and submit an issue with this error output to https://github.com/fastjs-team/core/issues.`, [
                                `url: ${this.url}`,
                                `method: ${method}`,
                                `*body: `, this.config.body,
                                `*response: `, response,
                                `*error: `, error,
                                "super: ", this
                            ], ["fastjs.wrong"])
                        }
                        return;
                    })
                }).catch((error: Error) => {
                    if (!hooks.failed(error, this, moduleConfig)) return this.hookFailed("failed");

                    if (this.config.keepalive) setTimeout(() => this.resend(method, data), this.config.keepaliveWait);
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

                    if (this.config.failed) this.config.failed(error, this);
                    this.callbacks.failed.forEach((callback) => callback({
                        error: error,
                        request: this,
                        intercept: false,
                        hook: null,
                        response: null
                    }));
                });
            } else {
                this.hookFailed("init");
            }
        }

        if (this.config.wait > 0) {
            if (this.wait) clearTimeout(this.wait);
            this.wait = setTimeout(() => this.wait = send(), this.config.wait) as unknown as number;
        } else send()

        return this;
    }



    protected handleBadResponse(response: requestReturn) {
        let status = response?.status;
        let res = response.data
        if (__DEV__) {
            _dev.warn("fastjs/request", `Request failed with status code ${status}`, [
                "url: " + this.url,
                "config: ", this.config,
                "*code: " + status,
                "*response: ", res,
                "global config: ", moduleConfig,
                "super: ", this,
            ], ["fastjs.wrong"]);
        }
        // run failed
        this.config.failed(status, res)
        this.callbacks.failed.forEach((callback: ((error: Error | any, response: any) => void)) => callback(status, res));
        // if keepalive
        if (this.config.keepalive) setTimeout(response.resend, this.config.keepaliveWait);
    }

    protected hookFailed(hook: "before" | "init" | "success" | "failed" | "callback", response: Response | null = null) {
        if (__DEV__) {
            _dev.warn("fastjs/request", `Request **interrupted** by ${hook}`, [
                "url: " + this.url,
                "config: ", this.config,
                "global config: ", moduleConfig,
                "super: ", this,
            ], ["fastjs.warn"]);
        }

        if (this.config.failed) this.config.failed(new Error(`Request interrupted by ${hook}`), this);
        // this.callbacks.failed.forEach((callback: ((error: Error | any, response: Request) => void)) => callback(new Error(`Request interrupted by ${hook}`), this));
        this.callbacks.failed.forEach(callback => {
            callback({
                error: new Error(`Request interrupted by ${hook}`),
                request: this,
                intercept: true,
                hook: hook,
                response: response
            })
        })
    }

    /** @description This method purpose to avoid typescript error (can't automatically detect correct overload method) */
    protected resend(method: string, data?: string | data) {
        // @ts-expect-error
        return this.send(method, data);
    }


    protected generateResponse(data: any, method: string, response: Response): requestReturn {
        const fullReturn: requestReturn = {
            data: data,
            status: response?.status || 0,
            headers: response.headers as data,
            request: this,
            resend: () => this.resend(method, data),
            response: response
        }
        return fullReturn;
    }

    get(data: data = {}): this {
        return this.send("GET", data);
    }

    post(data: data = {}): this {
        return this.send("POST", data);
    }

    put(data: data = {}): this {
        return this.send("PUT", data);
    }

    delete(data: data = {}): this {
        return this.send("DELETE", data);
    }

    patch(data: data = {}): this {
        return this.send("PATCH", data);
    }

    head(data: data = {}): this {
        return this.send("HEAD", data);
    }
}

export default FastjsRequest;