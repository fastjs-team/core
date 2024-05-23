import type { FastjsDom, FastjsDomAtom } from "./dom-types";

import type { FastjsDomProps } from "./def";
import _dev from "../dev";
import _selector from "./selector-atom";
import { createMethods } from "./dom-methods";
import { createModule } from "../base";

export function createFastjsDom(
  el: FastjsDom | Element | HTMLElement | string = document.body,
  props?: FastjsDomProps
): FastjsDom {
  if (typeof el === "string") el = document.createElement(el);
  else if ("construct" in el && el.construct === "FastjsDom") el = el._el;

  const moduleAtom = createModule<FastjsDomAtom>(() => ({
    construct: "FastjsDom",
    _events: [],
    _el: el as HTMLElement
  }));

  const module: FastjsDom = Object.assign(
    moduleAtom,
    createMethods(moduleAtom as FastjsDom)
  );

  if (props) mergeProps(module, props);

  return module;
}

function mergeProps(el: FastjsDom, props: FastjsDomProps) {
  let key: keyof FastjsDomProps;
  for (key in props) {
    if (key === "html") el.html(props.html!);
    else if (key === "text") el.text(props.text!);
    else if (key === "css") el.setStyle(props.css!);
    else if (key === "class") el.addClass(props.class! as string);
    else if (key === "attr") el.setAttr(props.attr!);
    else if (key === "val") el.val(props.val!);
    else if (key in el._el) el.set(key, props[key]);
  }
}
