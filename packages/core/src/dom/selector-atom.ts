import { ElementList } from "./def";
import type { FastjsDom } from "./dom-types";
import type { FastjsDomList } from "./dom-list-types";
import _dev from "../dev";

function _selector(
  selector: string,
  parent?: Document | ElementList | ElementList[] | FastjsDom | FastjsDomList
): HTMLElement | HTMLElement[] | null {
  // Always assert browser availability - production builds previously
  // skipped this check and surfaced an opaque ReferenceError.
  if (typeof document === "undefined") {
    if (__DEV__) _dev.browserCheck("fastjs/dom/selector");
    throw new Error(
      "[fastjs/dom/selector] document is not defined; selectors require a browser environment."
    );
  }

  const resolvedParent = parent ?? document;
  const specialStatements = ["body", "head"];

  const result: HTMLElement[] = [];

  let scope: Document | ElementList | ElementList[] | FastjsDomList;
  if ((resolvedParent as any)?.construct === "FastjsDom")
    scope = (resolvedParent as FastjsDom)._el;
  else if ((resolvedParent as any)?.construct === "FastjsDomList")
    scope = (resolvedParent as FastjsDomList)._list as unknown as ElementList[];
  else scope = resolvedParent as Document | ElementList | ElementList[];

  function select(el: ElementList | FastjsDom, selector: string) {
    if ((el as FastjsDom).set)
      return (el as FastjsDom).get("querySelectorAll")(selector);
    return (el as ElementList).querySelectorAll(selector);
  }

  if (Array.isArray(scope)) {
    (scope as ElementList[] | FastjsDomList).forEach(
      (e: FastjsDom | ElementList) => {
        result.push(...queryResultToArray(select(e as FastjsDom, selector)));
      }
    );
  } else {
    result.push(
      ...queryResultToArray(select(scope as FastjsDom | ElementList, selector))
    );
  }

  if (result.length === 0) return null;
  // Only short-circuit to the first node when the selector unambiguously
  // targets a single id (matches `#id` as its last/only segment) or a
  // well-known singleton (`body`/`head`).
  if (
    specialStatements.includes(selector) ||
    isSingleIdSelector(selector, result[0].id)
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

function isSingleIdSelector(selector: string, id: string | undefined): boolean {
  if (!id) return false;
  const trimmed = selector.trim();
  if (!trimmed.includes(`#${id}`)) return false;
  // A pure id reference, possibly combined with a tag prefix like `div#root`
  return (
    /^[a-zA-Z][\w-]*$/.test(trimmed.replace(`#${id}`, "")) ||
    trimmed === `#${id}`
  );
}

export default _selector;
