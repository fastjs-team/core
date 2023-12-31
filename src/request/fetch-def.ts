import FastjsFetchRequest from "./fetch";
import {moduleConfig, requestConfig} from "./def";

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
    failed: (error: Error | any, response: fetchReturn | null) => void;
}

export interface fetchReturn {
    response: Response;
    data: any;
    request: FastjsFetchRequest;
    resend: () => Promise<fetchReturn>;
}