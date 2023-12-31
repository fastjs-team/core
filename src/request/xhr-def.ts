import FastjsXhrRequest from "./xhr";
import {moduleConfig, requestConfig} from "./def";

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
    failed: (error: any, response: xhrReturn) => void;
}

export interface xhrReturn {
    headers: {
        [key: string]: string;
    }
    data: any;
    body: any;
    request: FastjsXhrRequest;
    xhr: XMLHttpRequest;
    resend: () => Promise<xhrReturn>;
}