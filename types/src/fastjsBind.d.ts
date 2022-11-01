import fastjsDom from "./fastjsDom/fastjsDom";
interface config {
    _event?: {
        [key: string]: Array<{
            attr: boolean;
            _el: fastjsDom;
            bind: string;
        }>;
    };
    [key: string]: any;
}
declare class fastjsBind {
    constructor(el: fastjsDom, bind: string, key: string | number, object?: config, isAttr?: boolean);
}
export default fastjsBind;
