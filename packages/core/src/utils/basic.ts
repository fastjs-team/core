import _dev from "../dev";

export async function callUntilEnd(
  func: (end: () => boolean) => Promise<void | boolean> | void | boolean,
  timeout: number,
  immediate: boolean = false,
  continueEvenError: boolean = false
): Promise<void> {
  return new Promise((resolve, reject) => {
    let end = false;
    const endFunc = () => end;

    setTimeout(callFunc, immediate ? 0 : timeout);

    async function callFunc() {
      try {
        let res = func(endFunc);
        if (res instanceof Promise) {
          res = await res;
        }
        end = !!res;
        if (!end) {
          setTimeout(callFunc, timeout);
        } else resolve();
      } catch (error: any) {
        if (__DEV__) {
          _dev.warn(
            "fastjs/utils/doUntilEnd",
            "An error occurred while executing the function",
            [error.toString()]
          );
        }
        if (continueEvenError) {
          setTimeout(callFunc, timeout);
          console.error(error);
        } else {
          reject(error);
          end = true;
        }
      }
    }
  });
}
