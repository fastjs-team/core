import FastjsDom from "./fastjsDom";

export enum PushTarget {
    firstElementChild = "firstElementChild",
    lastElementChild = "lastElementChild",
    beforeElement = "beforeElement",
    afterElement = "afterElement",
    replaceElement = "replaceElement",
}

export type PushReturn<T> = {
    isReplace: T extends PushTarget.replaceElement ? true : false;
    newElement: T extends PushTarget.replaceElement ? FastjsDom : never;
    oldElement: T extends PushTarget.replaceElement ? FastjsDom : never;
    /** @description index to parent -> children, start with 0 */
    index: number;
    /** @description FastjsDom point to the new element */
    el: FastjsDom;
    origin: HTMLElement;
    father: FastjsDom;
    _this: FastjsDom;
}