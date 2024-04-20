import type {FastjsRequest} from "./fetch-types"

export interface RequestData {
    [key: string]: any;
}

export interface RequestReturn {
    headers: RequestData;
    response: any;
    data: any;
    status: number;
    request: FastjsRequest;
    resend: () => FastjsRequest;
}

export type RequestHooks = "before" | "init" | "success" | "failed" | "callback";

export interface FailedParams<T extends Error | number | null> {
    error: T;
    request: FastjsRequest;
    intercept: boolean;
    hook: RequestHooks | null;
    response: RequestReturn | null;
}

export interface RequestCallback {
    success: ((data: any, response: RequestReturn) => void)[],
    failed: ((err: FailedParams<Error | number | null>) => void)[]
    finally: ((request: FastjsRequest) => void)[]
}

export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";