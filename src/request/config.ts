import _dev from "../dev";
import FastjsFetchRequest from "./fetch";
import type { moduleConfig } from "./def";

const config: moduleConfig = {
    timeout: 5000,
    hooks: {
        // before: (): boolean => true,
        // init: (): boolean => true,
        // success: (): boolean => true,
        // failed: (): boolean => true,
        // callback: (): boolean => true,
    },
    handler: {
        fetchReturn: async (response: Response, request: FastjsFetchRequest): Promise<object | string> => {
            if (response.headers.get("Content-Type")?.includes("application/json"))
                return (await response.json());
            return (await response.text());
        },
        responseCode: (code: number): boolean => {
            return code >= 200 && code < 300;
        }
    },
    check: {
        ignoreFormatWarning: false,
        stringBodyWarning: true,
        unrecommendedMethodWarning: true
    }
}

export default config;