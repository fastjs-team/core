import FastjsRequest from "./fetch"

export interface data {
    [key: string]: any;
}

export interface requestConfig {
    timeout: number;
    headers: {
        [key: string]: string;
    };
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
    hooks: {
        before: (request: FastjsRequest, config: moduleConfig) => boolean;
        init: (request: FastjsRequest, config: moduleConfig) => boolean;
        success: (response: Response, request: FastjsRequest, config: moduleConfig) => boolean;
        failed: (error: any, request: FastjsRequest, config: moduleConfig) => boolean;
        callback: (
            response: Response,
            request: FastjsRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    }
}

export interface moduleConfig {
    timeout: number;
    hooks: {
        before?: (request: FastjsRequest, config: moduleConfig) => boolean;
        init?: (request: FastjsRequest, config: moduleConfig) => boolean;
        success?: (response: Response, request: FastjsRequest, config: moduleConfig) => boolean;
        failed?: (error: any, request: FastjsRequest, config: moduleConfig) => boolean;
        callback?: (
            response: Response,
            request: FastjsRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    }
    handler: {
        fetchReturn: (response: Response, request: FastjsRequest) => Promise<any>;
        responseCode: (code: number, request: FastjsRequest) => boolean;
    }
    check: {
        ignoreFormatWarning: boolean;
        stringBodyWarning: boolean;
        unrecommendedMethodWarning: boolean;
    }
}

export interface requestReturn {
    headers: data;
    response: any;
    data: any;
    status: number;
    request: FastjsRequest;
    resend: () => FastjsRequest;
}

export interface failedParams<T extends Error | number | null> {
    error: T;
    request: FastjsRequest;
    intercept: boolean;
    hook: "before" | "init" | "success" | "failed" | "callback" | null;
    response: T extends number ? requestReturn : (Response | null);
}