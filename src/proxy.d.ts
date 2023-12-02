type ArrayProxyHandler<T> = {
    get?: (target: T[], prop: PropertyKey, receiver: any) => any;
    set: (target: T[], prop: PropertyKey, value: any, receiver: any) => boolean;
};

export type {ArrayProxyHandler}