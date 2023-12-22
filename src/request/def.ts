import _dev from "../dev";
import FastjsRequest from "./xhr";

export interface data {
    [key: string]: any;
}

export interface requestConfig {
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
    hooks: {
        before: (request: FastjsRequest, config: moduleConfig) => boolean;
        success: (request: FastjsRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    query: {
        [key: string]: any;
    } | string | null;
    body: {
        [key: string]: any;
    } | string | null;
}

export interface moduleConfig {
    timeout: number;
    hooks: {
        before: (request: FastjsRequest, config: moduleConfig) => boolean;
        success: (request: FastjsRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    handler: {
        parseData: (data: any, request: FastjsRequest) => any;
        responseCode: (code: number, request: FastjsRequest) => boolean;
    }
    ignoreFormatWarning: boolean;
    returnFullResponse: boolean;
}