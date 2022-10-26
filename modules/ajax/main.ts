import _config from "../../src/config";
import send from "./send";

interface data {
    [key: string]: string | number | boolean | Array<any> | null | data;
}

interface config {
    timeout: number;
    datatype: string;
    headers: {
        [key: string]: string;
    };
}

let defaultConfig: config = {
    timeout: _config.modules.ajax.timeout,
    datatype: "auto",
    headers: {}
}

class fastjsAjax {
    constructor(url: string, data?: data, callback?: Function, failed?: Function, config: config = defaultConfig) {
        const func = () => 0

        this.url = url;
        this.data = data || {};
        this.callback = callback || func;
        this.failed = failed || func;
        this.config = config;
        this.response = null;
        this.xhr = null;

        // init methods
        this.send = send;
    }

    [key: string]: any;

    url: string;
    data: {
        [key: string]: string | number | boolean | Array<any> | null | data;
    };
    callback: Function;
    failed: Function;
    config: config;
    response: any;
    xhr: XMLHttpRequest | null;
}

export default fastjsAjax