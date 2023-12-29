import _dev from "../dev";
import {getHeaders} from "./xhr";
import FastjsRequest from "./xhr";
import FastjsFetchRequest from "./fetch";
import type { moduleConfig } from "./def";

const config: moduleConfig = {
    timeout: 5000,
    // hooks: {
    //     before: (): boolean => true,
    //     init: (): boolean => true,
    //     success: (): boolean => true,
    //     failed: (): boolean => true,
    //     callback: (): boolean => true,
    // },
    xhrHooks: {
        // before: (): boolean => true,
        // init: (): boolean => true,
        // success: (): boolean => true,
        // failed: (): boolean => true,
        // callback: (): boolean => true,
    },
    fetchHooks: {
        // before: (): boolean => true,
        // init: (): boolean => true,
        // success: (): boolean => true,
        // failed: (): boolean => true,
        // callback: (): boolean => true,
    },
    handler: {
        parseData: (data: any, request: FastjsRequest) => {
            try {
                if (typeof data === "string") return data;
                return JSON.parse(data);
            } catch (e) {
                if (__DEV__ && !config.check.ignoreFormatWarning) {
                    _dev.warn("fastjs/request", "Failed to parse JSON, do you sure you send a request correctly? Set request.config.check.ignoreFormatWarning to true to ignore this warning.", [
                        `*Received data: `, {
                            data: data,
                            length: data.length,
                            // headers to object
                            headers: getHeaders(request.xhr as XMLHttpRequest),
                        },
                        `url: ${request.url}`,
                        `config: `, request.config,
                        "super: ", request
                    ], ["fastjs.warn"])
                }
                return data;
            }
        },
        fetchReturn: async (response: Response, request: FastjsFetchRequest): Promise<object | string> => {
            try {
                return (await response.json());
            } catch (e) {
                return (await response.text());
            }
        },
        responseCode: (code: number): boolean => {
            return code >= 200 && code < 300;
        }
    },
    check: {
        ignoreFormatWarning: false,
        stringBodyWarning: true,
        unrecommendedMethodWarning: true
    }
}

export default config;