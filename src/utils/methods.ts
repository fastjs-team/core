/** @todo Rewrite, and remove some duplicate code */

import _dev from "../dev";
import FastjsDom from "../dom/fastjsDom";
import FastjsDomList from "../dom/fastjsDomList";
import FastjsArray from "../array/fastjsArray";
import config from "../config";

let fastjs = {
    selector(
        el: string,
        place: HTMLElement | Document | FastjsDomList | null = document
    ): FastjsDom | FastjsDomList | void {
        // selector()
        // select elements

        if (!place) return void _dev.error("selector", "place is null");

        // dom: Element[] :: save elements result
        let dom: HTMLElement[] = [];
        // if place = FastjsDomList
        if (place instanceof FastjsDomList) {
            place._list.forEach((e: FastjsDom) => {
                e._el.querySelectorAll(el).forEach((v: Element) => {
                    // check if v is in dom
                    if (!dom.some((v2) => v2 === v)) dom.push(v as HTMLElement);
                });
            });
        } else {
            place
                .querySelectorAll(el)
                .forEach((v: Element) => void dom.push(v as HTMLElement));
        }
        // if last selecter is id
        let special = el.split(" ")[el.split(" ").length - 1].startsWith("#");
        // prevent extra forEach
        if (!special)
            config.dom.specialDom.forEach((v: string) => {
                if (el.startsWith(v)) special = true;
            });
        if (special)
            // -> FastjsDom -> element
            return new FastjsDom(dom[0]);
        // -> FastjsDomList -> FastjsDom -> element
        return new FastjsDomList(dom);
    },
    copy(text: string): void {
        // copy text to clipboard
        let input = new FastjsDom("span");
        input.html(text.replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;")).push();
        // create range to select text
        const range: Range = document.createRange();
        range.setStart(input._el, 0);
        range.setEnd(input._el, input._el.childNodes.length);
        const selection: Selection | null = window.getSelection();
        if (!selection) return;
        selection.removeAllRanges();
        selection.addRange(range);
        // copy text
        document.execCommand("copy");
        input.remove();
    },
    rand(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    /*  Beta Feature  */
    install<T extends "FastjsDom" | "FastjsArray">(
        name: T
    ): T extends "FastjsDom" ? typeof FastjsDom : typeof FastjsArray {
        interface module {
            0: string;
            1: Function;
        }
        type method = Function;

        // module
        const install = eval(`new ${name}()`);
        // get all methods
        let methods: Array<module> = Object.entries(install);
        const moduleList: Array<module> = [];
        const methodList: Array<method> = [];
        methods.forEach((v: module) => {
            // if function and not private
            if (typeof v[1] === "function" && !v[0].startsWith("#"))
                // add to moduleList
                moduleList.push(v);
        });
        moduleList.forEach((v: module) => {
            methodList.push((obj: any) => {
                // fade class
                const fade = eval(`new ${module}(${obj})`);
                // do method
                return fade[v[0]](...Array.from(arguments).slice(1));
            });
        });
        // @ts-ignore
        return methodList;
    },
};

export const {selector, copy, rand} = fastjs;
export default fastjs;