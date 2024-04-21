import {createFastjsDom} from "./dom";
import {createFastjsDomList} from "./dom-list";
import _selector from "./selector-atom";
import _dev from "../dev";

import type {FastjsDom} from "./dom-types";
import type {FastjsDomList} from "./dom-list-types";

function selector(
  target: string = "body",
  parent: Document | HTMLElement | HTMLElement[] = document
): FastjsDom | FastjsDomList | null {
  const result = _selector(target, parent);
  if (result instanceof HTMLElement) return createFastjsDom(result);
  if (Array.isArray(result)) return createFastjsDomList(result);
  return null;
}

export default selector;
