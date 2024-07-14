import type { ElementList } from "./def";
import type { FastjsDom } from "./dom-types";
import type { FastjsDomList } from "./dom-list-types";
import _dev from "../dev";
import _selector from "./selector-atom";
import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";

function selector<
  T extends FastjsDom | FastjsDomList | null = FastjsDom | FastjsDomList | null
>(
  target: string = "body",
  parent: Document | ElementList | ElementList[] = document
): T {
  const result = _selector(target, parent);
  if (Array.isArray(result))
    return createFastjsDomList(result) as FastjsDomList as T;
  if (result === null) return null as T;
  return createFastjsDom(result) as FastjsDom as T;
}

export default selector;
