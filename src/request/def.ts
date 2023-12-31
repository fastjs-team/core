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

export interface moduleConfig {
    timeout: number;
    xhrHooks: {
        before?: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
        init?: (request: FastjsXhrRequest, config: moduleConfig) => boolean;
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
        init?: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        success?: (response: Response, request: FastjsFetchRequest, config: moduleConfig) => boolean;
        failed?: (error: any, request: FastjsFetchRequest, config: moduleConfig) => boolean;
        callback?: (
            response: Response,
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