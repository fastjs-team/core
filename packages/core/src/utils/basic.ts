import _dev from "../dev";

export async function callUntilEnd<T extends boolean>(
  func: T extends true
    ? (end: () => boolean) => Promise<void | boolean>
    : (end: () => boolean) => void | boolean,
  timeout: number,
  immediate: boolean = false,
  promise: T = false as T
): Promise<void> {
  return new Promise((resolve, reject) => {
    let end = false;
    const endFunc = () => end;

    setTimeout(callFunc, immediate ? 0 : timeout);

    async function callFunc() {
      try {
        end = promise ? !!(await func(endFunc)) : !!func(endFunc);
        // Don't use else, using else can't detect is endFunc called, it can only detect is func returns true
        if (!end) {
          setTimeout(callFunc, timeout);
        } else resolve();
      } catch (error: any) {
        if (__DEV__) {
          _dev.warn(
            "fastjs/utils/doUntilEnd",
            "An error occurred while executing the function",
            error
          );
        }
        reject(error);
        end = true;
      }
    }
  });
}

export function callPromiseUntilEnd(
  func: (end: () => boolean) => Promise<void | boolean>,
  timeout: number = 1000,
  immediate: boolean = false
): Promise<void> {
  return new Promise((resolve) => {
    callUntilEnd(func, timeout, immediate, true).then(resolve);
  });
}
