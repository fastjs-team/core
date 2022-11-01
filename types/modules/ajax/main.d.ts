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
declare class fastjsAjax {
    constructor(url: string, data?: data, callback?: Function, failed?: Function, config?: config);
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
export default fastjsAjax;
