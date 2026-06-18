import _dev from "../dev";

/**
 * Copy text to the system clipboard.
 *
 * Prefers the asynchronous Clipboard API (`navigator.clipboard.writeText`)
 * when available (requires a secure context). Falls back to a hidden
 * `<textarea>` and the deprecated `document.execCommand("copy")` for
 * older browsers.
 *
 * @returns `true` if the copy succeeded, `false` otherwise.
 */
export async function copy(text: string): Promise<boolean> {
  if (typeof document === "undefined") {
    if (__DEV__) {
      _dev.warn(
        "fastjs/utils/copy",
        "document is not defined; copy() requires a browser environment",
        [`*text: ${text}`]
      );
    }
    return false;
  }

  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === "function"
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error: any) {
      if (__DEV__) {
        _dev.warn(
          "fastjs/utils/copy",
          "navigator.clipboard.writeText failed, falling back to execCommand",
          [`error: ${error?.message || error}`]
        );
      }
    }
  }

  return fallbackCopy(text);
}

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.padding = "0";
  textarea.style.border = "none";
  textarea.style.outline = "none";
  textarea.style.boxShadow = "none";
  textarea.style.background = "transparent";
  textarea.style.opacity = "0";

  const activeElement = document.activeElement as HTMLElement | null;
  document.body.appendChild(textarea);

  let success = false;
  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    success = document.execCommand("copy");
  } catch (error: any) {
    if (__DEV__) {
      _dev.warn(
        "fastjs/utils/copy",
        "document.execCommand('copy') failed",
        [`error: ${error?.message || error}`]
      );
    }
  } finally {
    textarea.remove();
    if (activeElement && typeof activeElement.focus === "function") {
      try {
        activeElement.focus();
      } catch {
        /* ignore */
      }
    }
  }

  return success;
}
