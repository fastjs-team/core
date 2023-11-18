import fastjsDom from "./fastjsDom";
import fastjsDomList from "./fastjsDomList";

function selector(selector: string, parent: HTMLElement | HTMLElement[] = document.body) {
    const result = []
    Array.isArray(parent) ? parent.forEach((e: HTMLElement) => {
        result.push(...queryResultToArray(e.querySelectorAll(selector)));
    }) : result.push(...queryResultToArray(parent.querySelectorAll(selector)));
    if (result.length === 0) return null;
    if (result.length === 1) return new fastjsDom(result[0] as HTMLElement);
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