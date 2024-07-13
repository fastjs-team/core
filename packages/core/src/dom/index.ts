import selector from "./selector";
import { createFastjsDom } from "./dom";
import { createFastjsDomList } from "./dom-list";
import type { FastjsDom } from "./dom-types";
import type { FastjsDomList } from "./dom-list-types";

interface DomModule {
  <
    T extends FastjsDom | FastjsDomList | null =
      | FastjsDom
      | FastjsDomList
      | null
  >(
    target?: string,
    parent?: Document | HTMLElement | HTMLElement[]
  ): T;
  select: typeof selector;
  newEl: typeof createFastjsDom;
  newElList: typeof createFastjsDomList;
}

const dom: DomModule = function <
  T extends FastjsDom | FastjsDomList | null = FastjsDom | FastjsDomList | null
>(
  target: string = "body",
  parent: Document | HTMLElement | HTMLElement[] = document
): T {
  return selector(target, parent);
};
dom.select = selector;
dom.newEl = createFastjsDom;
dom.newElList = createFastjsDomList;

export default dom;

export type * from "./def";
export type * from "./dom-types";
export type * from "./dom-list-types";
