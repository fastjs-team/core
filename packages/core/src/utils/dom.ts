import _dev from "../dev";

async function createDomElement(text: string): Promise<HTMLElement> {
  const { createFastjsDom } = await import("../dom/dom");
  let input = createFastjsDom("span");
  input
    .html(replaceNewLinesAndSpaces(text))
    .push(document.body, "lastElementChild");
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

export async function copy(text: string): Promise<void> {
  try {
    const input = await createDomElement(text);
    const selection = selectText(input);
    copyToClipboard(selection);
    input.remove();
  } catch (error: any) {
    if (__DEV__) {
      _dev.warn(
        "fastjs/utils/copy",
        "An error occurred while copying text to clipboard",
        error
      );
    }
  }
}
