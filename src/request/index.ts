import moduleConfig from './config';
import FastjsRequest from "./fetch";

import type {data} from "./def";
import type {requestConfig} from "./def";


const create = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config);
}
const get = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config).get();
}
const post = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config).post();
}
const put = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config).put();
}
const del = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config).delete();
}
const patch = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config).patch();
}

const head = (url: string, data?: data, config?: Partial<requestConfig>): FastjsRequest => {
    return new FastjsRequest(url, data, config).head();
}

export default {
    request: FastjsRequest,
    create,
    config: moduleConfig,
    get,
    post,
    put,
    delete: del,
    patch,
    head
};

export {FastjsRequest}