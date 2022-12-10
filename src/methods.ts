import _dev from "./dev";
import fastjsDom from "./fastjsDom";
import fastjsDomList from "./fastjsDomList";
import fastjsArray from "./fastjsArray";
import config from "./config";

let fastjs = {
    selecter(el: string, place: Element | Document | fastjsDomList = _dev._dom): fastjsDom | fastjsDomList {
        // selecter()
        // select elements

        // dom: Element[] :: save elements result
        let dom: Element[] = []
        // if place = fastjsDomList
        if (place instanceof fastjsDomList) {
            place._list.forEach((e: fastjsDom) => {
                e._el.querySelectorAll(el).forEach((v: Element) => {
                    // check if v is in dom
                    if (!dom.some((v2) => v2 === v))
                        dom.push(v);
                })
            })
        } else {
            // @ts-ignore
            dom = place.querySelectorAll(el);
        }
        // if last selecter is id
        let special = el.split(" ")[el.split(" ").length - 1].startsWith("#");
        // prevent extra forEach
        if (!special)
            config.dom.specialDom.forEach((v: string) => {
                if (el.startsWith(v))
                    special = true;
            })
        if (special)
            // -> fastjsDom -> element
            return new fastjsDom(dom[0] as HTMLElement);
        // -> fastjsDomList -> fastjsDom -> element
        return new fastjsDomList(dom);
    },
    copy(text: string) {
        // copy text to clipboard
        let input = new fastjsDom("span");
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
    install<T extends "fastjsDom" | "fastjsArray">(name: T): T extends "fastjsDom" ? typeof fastjsDom : typeof fastjsArray {
        interface module {
            0: string,
            1: Function,
        }
        type method = Function;

        // module
        const install = eval(name);
        // get all methods
        let methods: Array<module> = Object.entries(install);
        const moduleList: Array<module> = [];
        const methodList: Array<method> = [];
        methods.forEach((v: module) => {
            // if function and not private
            if (typeof v[1] === "function" && !v[0].startsWith("#"))
                // add to moduleList
                moduleList.push(v);
        })
        moduleList.forEach((v: module) => {
            methodList.push(
                (obj: any) => {
                    // fade class
                    const fade = eval(`new ${module}(${obj})`);
                    // do method
                    return fade[v[0]](...Array.from(arguments).slice(1));
                }
            );
        })
        // @ts-ignore
        return methodList
    }
}

let selecter = fastjs.selecter
let copy = fastjs.copy
let rand = fastjs.rand
let install = fastjs.install

export {selecter, copy, rand, install}
export default fastjs