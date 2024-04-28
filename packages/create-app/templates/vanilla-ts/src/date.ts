import { FastjsDom, date } from "jsfast";

export function setupDate(el: FastjsDom) {
  setInterval(() => {
    // Default: Y-M-D h:m:s
    // Suggest: <Now Time:> Y-M-D h:m:s
    el.text(date.string());
  }, 1000);
}
