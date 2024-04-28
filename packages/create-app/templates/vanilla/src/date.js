import { date } from "jsfast";

/**
 * @param {import('jsfast').FastjsDate} el
 */
export function setupDate(el) {
  setInterval(() => {
    // Default: Y-M-D h:m:s
    // Suggest: <Now Time:> Y-M-D h:m:s
    el.text(date.string());
  }, 1000);
}
