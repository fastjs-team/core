import _dev from "../dev";

async function copy(text: string): Promise<void> {
  const input = await createDomElement(text);
  const selection = selectText(input);
  copyToClipboard(selection);
  input.remove();

  async function createDomElement(text: string): Promise<HTMLElement> {
    const { FastjsDom } = await import("../dom");
    let input = new FastjsDom("span");
    input.html(replaceNewLinesAndSpaces(text)).push();
    return input.el();

    function replaceNewLinesAndSpaces(text: string): string {
      return text.replace(/\n/g, "<br>").replace(/ /g, "&nbsp;");
    }
  }

  function selectText(element: HTMLElement): Selection | null {
    const range: Range = document.createRange();
    range.setStart(element, 0);
    range.setEnd(element, element.childNodes.length);
    const selection: Selection | null = window.getSelection();
    if (!selection) return null;
    selection.removeAllRanges();
    selection.addRange(range);
    return selection;
  }

  function copyToClipboard(selection: Selection | null): void {
    if (!selection) {
      if (__DEV__) {
        _dev.warn("fastjs/utils/copy", "selection is null");
      }
      return;
    }
    document.execCommand("copy");
  }
}

function rand(min: number, max: number, decimal: number = 0): number {
  if (__DEV__) {
    if (min > max) {
      _dev.warn(
        "fastjs/utils/rand",
        "min is greater than max, this may cause unexpected results",
        [`*min: ${min}`, `*max: ${max}`, `decimal: ${decimal}`]
      );
    }
    if (decimal < 0) {
      _dev.warn(
        "fastjs/utils/rand",
        "decimal is less than 0, this may cause unexpected results",
        [`min: ${min}`, `max: ${max}`, `*decimal: ${decimal}`]
      );
    }
  }

  const prefix = (decimal * 10) || 1;
  [min, max] = [min * prefix, max * prefix];
  let num =
    (Math.floor(Math.pow(10, 14) * Math.random() * Math.random()) %
      (max - min + 1)) +
    min;
  return num / prefix;
}

export { copy, rand };
export default {
  copy,
  rand
};
