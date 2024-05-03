import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";
import _selector from "./selector-atom";
import _dev from "../dev";

import type { FastjsDom } from "./dom-types";
import type { FastjsDomList } from "./dom-list-types";

function selector<
  T extends FastjsDom | FastjsDomList | null = FastjsDom | FastjsDomList | null
>(
  target: string = "body",
  parent: Document | HTMLElement | HTMLElement[] = document
): T {
  const result = _selector(target, parent);
  if (result instanceof HTMLElement)
    return createFastjsDom(result) as FastjsDom as T;
  if (result === null) return null as T;
  return createFastjsDomList(result) as FastjsDomList as T;
}

export default selector;
