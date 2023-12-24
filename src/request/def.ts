import FastjsRequest from "./xhr";
import FastjsFetchRequest from "./fetch";
import FastjsXhrRequest from "./xhr";

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
    query: {
        [key: string]: any;
    } | string | null;
    body: {
        [key: string]: any;
    } | string | null;
}

export interface xhrRequestConfig extends requestConfig {
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
}

export interface fetchRequestConfig extends requestConfig {
    hooks: {
        before: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        success: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsFetchRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
}

export interface moduleConfig {
    timeout: number;
    hooks: {
        before: (request: FastjsFetchRequest | FastjsXhrRequest, config: moduleConfig) => boolean;
        success: (request: FastjsFetchRequest | FastjsXhrRequest, config: moduleConfig) => boolean;
        failed: (request: FastjsFetchRequest | FastjsXhrRequest, config: moduleConfig) => boolean;
        callback: (
            request: FastjsFetchRequest | FastjsXhrRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    xhrHooks: {
        before?: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        success?: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        failed?: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        callback?: (
            request: FastjsXhrRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    fetchHooks: {
        before?: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        success?: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        failed?: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        callback?: (
            request: FastjsFetchRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    }
    handler: {
        parseData: (data: any, request: FastjsXhrRequest) => any;
        fetchReturn: (response: Response, request: FastjsFetchRequest) => Promise<any>;
        responseCode: (code: number, request: FastjsXhrRequest | FastjsFetchRequest) => boolean;
    }
    check: {
        ignoreFormatWarning: boolean;
        stringBodyWarning: boolean;
        unrecommendedMethodWarning: boolean;
    }
}

export interface xhrReturn extends XMLHttpRequest {
    headers: {
        [key: string]: string;
    }
    data: any;
    body: any;
    request: FastjsXhrRequest;
    xhr: XMLHttpRequest;
    resend: () => Promise<xhrReturn>;
}

export interface fetchReturn extends Response {
    data: any;
    request: FastjsFetchRequest;
    resend: () => Promise<fetchReturn>;
}