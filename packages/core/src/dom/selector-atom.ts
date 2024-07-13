import { ElementList } from "./def";
import type { FastjsDom } from "./dom-types";
import type { FastjsDomList } from "./dom-list-types";
import _dev from "../dev";

function _selector(
  selector: string,
  parent:
    | Document
    | ElementList
    | ElementList[]
    | FastjsDom
    | FastjsDomList = document
): HTMLElement | HTMLElement[] | null {
  if (__DEV__) _dev.browserCheck("fastjs/dom/selector");

  const specialStatements = ["body", "head"];

  const result = [];

  // @ts-ignore
  if (parent?.construct === "FastjsDom") parent = parent._el;
  // @ts-ignore
  if (parent?.construct === "FastjsDomList") parent = parent._list;

  function select(el: ElementList | FastjsDom, selector: string) {
    if ((el as FastjsDom).set)
      return (el as FastjsDom).get("querySelectorAll")(selector);
    return el.querySelectorAll(selector);
  }

  Array.isArray(parent)
    ? (parent as ElementList[] | FastjsDomList).forEach(
        (e: FastjsDom | ElementList) => {
          result.push(...queryResultToArray(select(e as FastjsDom, selector)));
        }
      )
    : result.push(
        ...queryResultToArray(
          select(parent as FastjsDom | ElementList, selector)
        )
      );

  if (result.length === 0) return null;
  if (
    (result[0].id && selector.includes(`#${result[0].id}`)) ||
    specialStatements.includes(selector)
  )
    return result[0];
  const list: HTMLElement[] = [];
  result.forEach((e: Element) => {
    list.push(e as HTMLElement);
  });
  return list;

  function queryResultToArray(queryResult: NodeListOf<Element>): HTMLElement[] {
    const result: HTMLElement[] = [];
    queryResult.forEach((e: Element) => {
      result.push(e as HTMLElement);
    });
    return result;
  }
}

export default _selector;
