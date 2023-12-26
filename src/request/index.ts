import type {data, fetchRequestConfig, fetchReturn, xhrRequestConfig, xhrReturn} from './def';
import moduleConfig from './config';
import FastjsXhrRequest from './xhr';
import FastjsFetchRequest from "./fetch";


const create = (url: string, data?: data, config?: Partial<xhrRequestConfig>): FastjsXhrRequest => {
    return new FastjsXhrRequest(url, data, config);
}
const get = (url: string, data?: data, config?: Partial<xhrRequestConfig>): Promise<xhrReturn> => {
    return new FastjsXhrRequest(url, data, config).get();
}
const post = (url: string, data?: data, config?: Partial<xhrRequestConfig>): Promise<xhrReturn> => {
    return new FastjsXhrRequest(url, data, config).post();
}
const put = (url: string, data?: data, config?: Partial<xhrRequestConfig>): Promise<xhrReturn> => {
    return new FastjsXhrRequest(url, data, config).put();
}
const del = (url: string, data?: data, config?: Partial<xhrRequestConfig>): Promise<xhrReturn> => {
    return new FastjsXhrRequest(url, data, config).delete();
}
const patch = (url: string, data?: data, config?: Partial<xhrRequestConfig>): Promise<xhrReturn> => {
    return new FastjsXhrRequest(url, data, config).patch();
}

const head = (url: string, data?: data, config?: Partial<xhrRequestConfig>): Promise<xhrReturn> => {
    return new FastjsXhrRequest(url, data, config).head();
}

const createFetch = (url: string, data?: data, config?: Partial<fetchRequestConfig>): FastjsFetchRequest => {
    return new FastjsFetchRequest(url, data, config);
}

const fetchGet = (url: string, data?: data, config?: Partial<fetchRequestConfig>): Promise<fetchReturn> => {
    return new FastjsFetchRequest(url, data, config).get();
}

const fetchPost = (url: string, data?: data, config?: Partial<fetchRequestConfig>): Promise<fetchReturn> => {
    return new FastjsFetchRequest(url, data, config).post();
}

const fetchPut = (url: string, data?: data, config?: Partial<fetchRequestConfig>): Promise<fetchReturn> => {
    return new FastjsFetchRequest(url, data, config).put();
}

const fetchDel = (url: string, data?: data, config?: Partial<fetchRequestConfig>): Promise<fetchReturn> => {
    return new FastjsFetchRequest(url, data, config).delete();
}

const fetchPatch = (url: string, data?: data, config?: Partial<fetchRequestConfig>): Promise<fetchReturn> => {
    return new FastjsFetchRequest(url, data, config).patch();
}

const fetchHead = (url: string, data?: data, config?: Partial<fetchRequestConfig>): Promise<fetchReturn> => {
    return new FastjsFetchRequest(url, data, config).head();
}

export default {
    request: FastjsXhrRequest,
    create,
    createFetch,
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

export {FastjsXhrRequest, FastjsFetchRequest}