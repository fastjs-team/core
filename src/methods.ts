import _dev from "./dev";
import fastjsDom from "./fastjsDom";
import fastjsDomList from "./fastjsDomList";
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
    install(module: string) {
        interface module {
            0: string,
            1: Function,
        }
        type method = Function;

        // check if require is defined
        if (typeof require === "undefined") {
            _dev.newError("install", "require is not defined, if you use fastjs-cli to build, please update to v2.3.0 to create a new project", [
                "Help: https://docs.fastjs.cc/"
            ]);
            return;
        }
        // require module
        const install = require(`${module}.ts`);
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
        return methodList
    }
}

let selecter = fastjs.selecter
let copy = fastjs.copy
let rand = fastjs.rand
let install = fastjs.install

export {selecter, copy, rand, install}
export default fastjs