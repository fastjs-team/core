import type {data, requestConfig} from './fastjsRequest';
import {request, moduleConfig} from './fastjsRequest';

const create = (url: string, data?: data, config?: Partial<requestConfig>) => {
    return new request(url, data, config);
}
const get = (url: string, data?: data, config?: Partial<requestConfig>) => {
    return new request(url, data, config).get();
}
const post = (url: string, data?: data, config?: Partial<requestConfig>) => {
    return new request(url, data, config).post();
}
const put = (url: string, data?: data, config?: Partial<requestConfig>) => {
    return new request(url, data, config).put();
}
const del = (url: string, data?: data, config?: Partial<requestConfig>) => {
    return new request(url, data, config).delete();
}
const patch = (url: string, data?: data, config?: Partial<requestConfig>) => {
    return new request(url, data, config).patch();
}

export default {
    request,
    create,
    config: moduleConfig,
    get,
    post,
    put,
    delete: del,
    patch
};
