interface config {
    dom: {
        defaultTag: string;
        specialDom: Array<string>;
    };
    modules: {
        ajax: {
            successCode: Array<number>;
            timeout: number;
            hooks: {
                before: Function;
                success: Function;
                failed: Function;
                callback: Function;
            };
        };
    };
}
declare const _config: config;
export default _config;
