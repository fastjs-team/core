import fastjsDom from "./fastjsDom";
import fastjsDomList from "./fastjsDomList";
import _dev from "../dev";
import FastjsDom from "./fastjsDom";
import FastjsDomList from "./fastjsDomList";

function selector(selector: string, parent: Document | HTMLElement | HTMLElement[] = document): FastjsDom | FastjsDomList | null {
    if (__DEV__)
        _dev.browserCheck("fastjs/dom/selector")

    const specialStatements = ["body", "head"];

    const result = []
    Array.isArray(parent) ? parent.forEach((e: HTMLElement) => {
        result.push(...queryResultToArray(e.querySelectorAll(selector)));
    }) : result.push(...queryResultToArray(parent.querySelectorAll(selector)));
    if (result.length === 0) return null;
    if (selector.includes(`#${result[0].id}`) || specialStatements.includes(selector)) return new fastjsDom(result[0] as HTMLElement);
    const list: HTMLElement[] = [];
    result.forEach((e: Element) => {
        list.push(e as HTMLElement);
    })
    return new fastjsDomList(list);

    function queryResultToArray(queryResult: NodeListOf<Element>): HTMLElement[] {
        const result: HTMLElement[] = [];
        queryResult.forEach((e: Element) => {
            result.push(e as HTMLElement);
        })
        return result;
    }
}

export default selector;