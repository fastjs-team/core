import FastjsArray from "./fastjsArray";
import type {config} from "./fastjsArray";

function create<T = any>(array: Array<T> = [], config: config = {}): FastjsArray<T> {
    return new FastjsArray(array, config) as FastjsArray<T>;
}

export {FastjsArray};
export default {
    create
}