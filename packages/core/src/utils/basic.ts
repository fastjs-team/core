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
        if (end || !res) {
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

export function catchError(
  func: () => Promise<any> | any,
  onError?: (error: Error) => void
): Promise<any> | any {
  const err = (error: Error) => {
    if (__DEV__) {
      _dev.warn(
        "fastjs/utils/catchError",
        "An error occurred while executing the function",
        [error.toString()]
      );
    }
    if (onError) onError(error);
    else console.error(error);
    return error;
  };

  try {
    const res = func();
    if (res instanceof Promise) {
      return res.then((res) => res).catch(err);
    }
    return res;
  } catch (error: any) {
    return err(error);
  }
}

export function secureCall(
  func: () => Promise<any> | any
): [any, Error | null] | Promise<[any, Error | null]> {
  try {
    const res = func();
    if (res instanceof Promise) {
      return new Promise((resolve, reject) => {
        res
          .then((res) => resolve([res, null]))
          .catch((error) => resolve([undefined, error]));
      });
    }
    return [res, null];
  } catch (error: any) {
    return [undefined, error];
  }
}
