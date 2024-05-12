import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import { FastjsDom, FastjsDomList } from "jsfast";

hljs.registerLanguage("javascript", javascript);

export function render(code: string): string;
export function render(code: string, el: FastjsDom | FastjsDomList): string;
export function render(code: string, el?: FastjsDom | FastjsDomList): string {
  const val = hljs.highlight(code, { language: "javascript" }).value;
  if (el) el.html(val);
  return val;
}
