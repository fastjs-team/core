import _dev from "../dev";
import moduleConfig from "./config";
import FastjsBaseModule from "../base";

import type {data, requestConfig, xhrReturn} from "./def";
import FastjsXhrRequest from "./xhr";
import FastjsFetchRequest from "./fetch";

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
            query: config.query || null,
            body: config.body || null
        };
    }


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

    protected handleBadResponse(send: () => void, response?: Response) {
        let res;
        let status = this.xhr ? this.xhr.status : response?.status;
        if (response) response.json().then((j => res = j)).catch(() => res = response.text());
        else this.xhr?.responseText.startsWith("{") ? res = JSON.parse(this.xhr?.responseText) : res = this.xhr?.responseText;
        if (__DEV__) {
            _dev.warn("fastjs/request", `Request failed with status code ${status}`, [
                "url: " + this.url,
                "config:", this.config,
                "*code: " + status,
                "*response:", res,
                "global config:", moduleConfig,
                "super:", this,
            ], ["fastjs.wrong"]);
        }
        // run failed
        this.config.failed(this);
        // if keepalive
        if (this.config.keepalive) setTimeout(send, this.config.keepaliveWait);
        return res;
    }
}

export default FastjsRequest;