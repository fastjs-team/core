import FastjsDom from "./fastjsDom";
import {styleObj} from "./css";

export enum PushTarget {
    firstElementChild = "firstElementChild",
    lastElementChild = "lastElementChild",
    beforeElement = "beforeElement",
    afterElement = "afterElement",
    replaceElement = "replaceElement"
}

export type PushReturn<T> = {
    isReplace: T extends PushTarget.replaceElement ? true : false;
    newElement: T extends PushTarget.replaceElement ? FastjsDom : never;
    oldElement: T extends PushTarget.replaceElement ? FastjsDom : never;
    /** @description index to parent -> children, start with 0 */
    index: number;
    /** @description FastjsDom point to the new element */
    el: FastjsDom;
    /** @description FastjsDom point to the origin element when you call(this) */
    origin: FastjsDom;
    father: FastjsDom;
}

export enum InsertTarget {
    first = "first",
    last = "last",
    random = "random"
}

export type InsertReturn = {
    /** @description index to parent -> children, start with 0 */
    index: number;
    /** @description FastjsDom point to the new element */
    added: FastjsDom;
    /** @description FastjsDom point to the origin element when you call(this) */
    origin: FastjsDom;
}

export type EventCallback = (el: FastjsDom, event: Event) => void;
export type EachCallback = (el: FastjsDom, dom: HTMLElement, index: number) => void;
export type EventList = Array<{
    type: keyof HTMLElementEventMap
    callback: EventCallback
    trigger: EventListener
    remove: () => void
}>;

export type CustomProps = {
    html?: string;
    text?: string;
    css?: styleObj | string;
    class?: string[] | string;
    attr?: { [key: string]: string | null };
    value?: string;
}

export type FastjsDomProps = CustomProps & {
    [K in keyof HTMLElement]?: HTMLElement[K] | HTMLInputElement[K] | HTMLTextAreaElement[K] | HTMLButtonElement[K];
}