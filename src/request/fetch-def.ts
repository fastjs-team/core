import FastjsFetchRequest from "./fetch";
 import {moduleConfig, requestConfig, data} from "./def";

export interface fetchRequestConfig extends requestConfig {
    hooks: {
        before: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        init: (request: FastjsFetchRequest, config: moduleConfig) => boolean;
        success: (response: Response, request: FastjsFetchRequest, config: moduleConfig) => boolean;
        failed: (error: any, request: FastjsFetchRequest, config: moduleConfig) => boolean;
        callback: (
            response: Response,
            request: FastjsFetchRequest,
            data: {
                [key: string]: any;
            }, config: moduleConfig
        ) => boolean
    };
    callback: (data: any, response: fetchReturn) => void;
    failed: (error: Error | number, response: fetchReturn | FastjsFetchRequest) => void;
}

export interface fetchReturn {
    headers: data;
    response: Response;
    data: any;
    status: number;
    request: FastjsFetchRequest;
    resend: () => FastjsFetchRequest;
}