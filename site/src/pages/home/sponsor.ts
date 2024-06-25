import "./main.scss";

import { FastjsDom, dom } from "jsfast";

export default function setup(container: FastjsDom) {
  const el = dom
    .newEl("div", {
      id: "sponsor"
    })
    .push(container, "lastElementChild").el;

  el.html(`
    <img src="https://raw.githubusercontent.com/xiaodong2008/sponsors/main/sponsors.wide.svg" />
  `);
}
