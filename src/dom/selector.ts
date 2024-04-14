import FastjsDom from "./dom";
import FastjsDomList from "./dom-list";
import _selector from "./selector-atom";
import _dev from "../dev";

function selector(
  selector: string = "body",
  parent: Document | HTMLElement | HTMLElement[] = document
): FastjsDom | FastjsDomList | null {
  const result = _selector(selector, parent);
  if (result instanceof HTMLElement) return new FastjsDom(result);
  if (Array.isArray(result)) return new FastjsDomList(result);
  return null;
}

export default selector;
