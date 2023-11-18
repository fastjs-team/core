/** @todo Rewrite, and remove some duplicate code */

// import _dev from "../dev";

let fastjs = {
    async copy(text: string): Promise<void> {
        const {FastjsDom} = await import("../dom");
        // copy text to clipboard
        let input = new FastjsDom("span");
        // input.html(text.replaceAll("\n", "<br>").replaceAll(" ", "&nbsp;")).push();
        input.html(text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;")).push();
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
    rand(min: number, max: number, decimal: number = 0): number {
        // return Math.floor(Math.random() * (max - min + 1)) + min;
        return Number(
            (Math.random() * (max - min) + min).toFixed(decimal)
        );
    },
    // install<T extends "FastjsDom" | "FastjsArray">(
    //     name: T
    // ): T extends "FastjsDom" ? typeof FastjsDom : typeof FastjsArray {
    //     interface module {
    //         0: string;
    //         1: Function;
    //     }
    //     type method = Function;
    //
    //     // module
    //     const install = eval(`new ${name}()`);
    //     // get all methods
    //     let methods: Array<module> = Object.entries(install);
    //     const moduleList: Array<module> = [];
    //     const methodList: Array<method> = [];
    //     methods.forEach((v: module) => {
    //         // if function and not private
    //         if (typeof v[1] === "function" && !v[0].startsWith("#"))
    //             // add to moduleList
    //             moduleList.push(v);
    //     });
    //     moduleList.forEach((v: module) => {
    //         methodList.push((obj: any) => {
    //             // fade class
    //             const fade = eval(`new ${module}(${obj})`);
    //             // do method
    //             return fade[v[0]](...Array.from(arguments).slice(1));
    //         });
    //     });
    //     // @ts-ignore
    //     return methodList;
    // },
};

export const {copy, rand} = fastjs;
export default {
    copy,
    rand
}