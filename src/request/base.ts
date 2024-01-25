import _dev from "../dev";
import moduleConfig from "./config";
import FastjsBaseModule from "../base";

import type {data, requestConfig} from "./def";
import {xhrReturn} from "./xhr-def";
import {fetchReturn} from "./fetch-def";
import FastjsFetchRequest from "./fetch";
import FastjsXhrRequest, {getHeaders} from "./xhr";

class FastjsRequest extends FastjsBaseModule<FastjsRequest> {
    protected wait: number | void = 0;
    readonly construct: string = "FastjsRequest";

    config: requestConfig;
    response: any = null;
    xhr: XMLHttpRequest | null = null;

    constructor(public url: string, public data: data = {}, config: Partial<requestConfig> = {}) {
        super();

        if (__DEV__ && !url) {
            _dev.warn("fastjs/request", "A correct url is **required**.", [
                `***url: ${url}`,
                "data: ", data,
                "config: ", config,
                "super: ", this
            ], ["fastjs.wrong"])
            throw _dev.error("fastjs/request", "A correct url is required.", [
                "constructor(public url: string, public data: data = {}, config: Partial<requestConfig> = {})",
                "FastjsRequest.constructor"
            ]);
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
            body: config.body || null
        };
    }


    get(data: data = {}): this {
        return this.send("GET", data, "FastjsRequest.get()");
    }

    post(data: data = {}): this {
        return this.send("POST", data, "FastjsRequest.post()");
    }

    put(data: data = {}): this {
        return this.send("PUT", data, "FastjsRequest.put()");
    }

    delete(data: data = {}): this {
        return this.send("DELETE", data, "FastjsRequest.delete()");
    }

    patch(data: data = {}): this {
        return this.send("PATCH", data, "FastjsRequest.patch()");
    }

    head(data: data = {}): this {
        return this.send("HEAD", data, "FastjsRequest.head()");
    }

    protected handleBadResponse(response: xhrReturn | fetchReturn) {
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

    protected hookFailed(hook: string) {
        if (__DEV__) {
            _dev.warn("fastjs/request", `Request **interrupted** by ${hook}`, [
                "url: " + this.url,
                "config: ", this.config,
                "global config: ", moduleConfig,
                "super: ", this,
            ], ["fastjs.warn"]);
        }

        if (this.config.failed) this.config.failed(new Error(`Request interrupted by ${hook}`), this);
        this.callbacks.failed.forEach((callback: ((error: Error | any, response: FastjsRequest) => void)) => callback(new Error(`Request interrupted by ${hook}`), this));
    }

    /** @description This method purpose to avoid typescript error (can't automatically detect correct overload method) */
    protected resend(method: string, data?: string | data) {
        return this.send(method, data, "FastjsRequest.resend()");
    }

    protected generateResponse(data: any, method: string): xhrReturn
    protected generateResponse(data: any, method: string, response: Response): fetchReturn
    protected generateResponse(data: any, method: string, response?: Response): xhrReturn | fetchReturn {
        const fullReturn = {
            data: data,
            body: this.xhr ? this.xhr.response : null,
            status: response?.status || this.xhr?.status || 0,
            headers: response ? response.headers as data : getHeaders(this.xhr as XMLHttpRequest),
            request: this as unknown as FastjsFetchRequest | FastjsXhrRequest,
            resend: () => this.resend(method, data),
            xhr: this.xhr,
            response: response
        }
        if (this.xhr) return fullReturn as xhrReturn;
        else return fullReturn as fetchReturn;
    }
}

export default FastjsRequest;