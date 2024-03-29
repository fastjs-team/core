import FastjsXhrRequest from "./xhr";
import type {moduleConfig, requestConfig, data} from "./def";

export interface xhrRequestConfig extends requestConfig {
    hooks: {
        before: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        init: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        success: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsXhrRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    callback: (data: any, response: xhrReturn) => void;
    failed: (error: Error | number, response: xhrReturn | FastjsXhrRequest) => void;
}

export interface xhrReturn {
    headers: data;
    data: any;
    body: any;
    status: number;
    request: FastjsXhrRequest;
    xhr: XMLHttpRequest;
    resend: () => FastjsXhrRequest;
}