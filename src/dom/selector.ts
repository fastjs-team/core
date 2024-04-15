import FastjsDom from "./dom";
import {createFastjsDomList} from "./dom-list";
import _selector from "./selector-atom";
import _dev from "../dev";

import type {FastjsDomList} from "./dom-list";

function selector(
  target: string = "body",
  parent: Document | HTMLElement | HTMLElement[] = document
): FastjsDom | FastjsDomList | null {
  const result = _selector(target, parent);
  if (result instanceof HTMLElement) return new FastjsDom(result);
  if (Array.isArray(result)) return createFastjsDomList(result);
  return null;
}

export default selector;
