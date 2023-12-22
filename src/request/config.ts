import _dev from "../dev";
import {getHeaders} from "./xhr";
import FastjsRequest from "./xhr";
import type { moduleConfig } from "./def";

const config: moduleConfig = {
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
                if (__DEV__ && !config.ignoreFormatWarning) {
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

export default config;