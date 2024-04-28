import type { FastjsDom } from "jsfast";

export function setupCounter(element: FastjsDom) {
  let count = 0;
  element.text("Count: 0").addEvent("click", (el) => {
    el.text(`Count: ${++count}`);
  });
}
