import _dev from "../dev";
import FastjsXhrRequest from "./xhr";

export interface data {
    [key: string]: any;
}

export interface xhrRequestConfig {
    timeout: number;
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
        before: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        success: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsXhrRequest,
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

export interface requestConfig {
    timeout: number;
    headers: {
        [key: string]: string;
    };
    shutdown: boolean;
    wait: number;
    failed: Function;
}

export interface moduleConfig {
    timeout: number;
    hooks: {
        before: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        success: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsXhrRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    handler: {
        parseData: (data: any, request: FastjsXhrRequest) => any;
        responseCode: (code: number, request: FastjsXhrRequest) => boolean;
    }
    ignoreFormatWarning: boolean;
    returnFullResponse: boolean;
}