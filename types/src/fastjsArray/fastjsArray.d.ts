interface config {
    type: string | Array<string>;
    length: number | null;
}
declare class fastjsArray {
    constructor(array: Array<any>, config?: config);
    _config: config;
    _array: Array<any>;
    [key: string]: any;
    first(): any;
    last(): any;
    length(): number;
    add(val: any, key?: number): fastjsArray;
    push(): fastjsArray;
    remove(key: number): fastjsArray;
    get(key: number): any;
    set(key: number, val: any): fastjsArray;
    each(callback: Function): fastjsArray;
    filter(callback: Function): any;
    map(callback: Function): any;
    toArray(): Array<any>;
    then(callback: Function, time?: number): fastjsArray;
    construct: string;
}
export default fastjsArray;
