import FastjsRequest from './xhr';
import type {data, fetchRequestConfig, xhrRequestConfig} from './def';
import moduleConfig from './config';
import FastjsFetchRequest from "./fetch";


const create = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config);
}
const get = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config).get();
}
const post = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config).post();
}
const put = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config).put();
}
const del = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config).delete();
}
const patch = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config).patch();
}

const head = (url: string, data?: data, config?: Partial<xhrRequestConfig>) => {
    return new FastjsRequest(url, data, config).head();
}

const fetchGet = (url: string, data?: data, config?: Partial<fetchRequestConfig>) => {
    return new FastjsFetchRequest(url, data, config).get();
}

const fetchPost = (url: string, data?: data, config?: Partial<fetchRequestConfig>) => {
    return new FastjsFetchRequest(url, data, config).post();
}

const fetchPut = (url: string, data?: data, config?: Partial<fetchRequestConfig>) => {
    return new FastjsFetchRequest(url, data, config).put();
}

const fetchDel = (url: string, data?: data, config?: Partial<fetchRequestConfig>) => {
    return new FastjsFetchRequest(url, data, config).delete();
}

const fetchPatch = (url: string, data?: data, config?: Partial<fetchRequestConfig>) => {
    return new FastjsFetchRequest(url, data, config).patch();
}

const fetchHead = (url: string, data?: data, config?: Partial<fetchRequestConfig>) => {
    return new FastjsFetchRequest(url, data, config).head();
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
    head,
    fetch: FastjsFetchRequest,
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete: fetchDel,
    fetchPatch,
    fetchHead
};

export {FastjsRequest}