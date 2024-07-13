import type { ElementList, FastjsDomProps } from "./def";
import type { FastjsDom, FastjsDomAtom } from "./dom-types";

import _dev from "../dev";
import _selector from "./selector-atom";
import { createMethods } from "./dom-methods";
import { createModule } from "../base";

export function createFastjsDom<T extends ElementList = ElementList>(
  el: FastjsDom | Element | ElementList | string = document.body,
  props?: FastjsDomProps<T>
): FastjsDom<T> {
  if (typeof el === "string") el = document.createElement(el);
  else if ("construct" in el && el.construct === "FastjsDom") el = el._el;

  const moduleAtom = createModule<FastjsDomAtom<T>>(() => ({
    construct: "FastjsDom",
    _events: [],
    _el: el as T
  }));

  const module: FastjsDom<T> = Object.assign(
    moduleAtom,
    createMethods(moduleAtom as FastjsDom<T>)
  );

  if (props) mergeProps<T>(module, props);

  return module;
}

function mergeProps<T extends ElementList>(
  el: FastjsDom<T>,
  props: FastjsDomProps<T>
) {
  let key: keyof FastjsDomProps<T>;
  for (key in props) {
    if (key === "html") el.html(props.html!);
    else if (key === "text") el.text(props.text!);
    else if (key === "css") el.setStyle(props.css!);
    else if (key === "class") el.addClass(props.class! as string);
    else if (key === "attr") el.setAttr(props.attr!);
    else if (key === "val") el.val(props.val!);
    else if (key in el._el) el.set(key as keyof T, props[key] as T[keyof T]);
  }
}
