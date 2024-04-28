import _dev from "../dev";
import type { FastjsModuleBase } from "./def";

export function createModule<T extends { [key: string]: any }>(
  module: () => T
): T & FastjsModuleBase {
  return {
    ...module(),
    setCustomProp(name: string, value: any) {
      this[String(name)] = value;
      return this;
    },
    setCustomProps(props: { [key: string]: any }) {
      for (const key in props) {
        this[key] = props[key];
      }
      return this;
    },
    getCustomProp(name: string) {
      return this[String(name)];
    },
    setCustomEvent(
      name: string,
      func: (module: any, ...args: any[]) => void,
      setup: boolean = false
    ) {
      this[name] = func;
      if (setup) func(this, this);
      return this;
    },
    callCustomEvent(name: string, ...args: any[]) {
      this[name](this, ...args);
      return this;
    },
    then(func: (e: any) => void, time: number = 0) {
      if (_dev) {
        if (typeof func !== "function") {
          if (_dev) {
            throw _dev.error(
              "fastjs/base/FastjsBaseModule",
              "Invalid function, **a function is required**.",
              [
                `***func: ${func}`,
                `time: ${time}`,
                "then(**func: (e: T) => void**, time: number = 0): T",
                "FastjsBaseModule.then"
              ],
              ["fastjs.wrong"]
            );
          }
          throw "t33q";
        }
        if (typeof time !== "number") {
          _dev.warn(
            "fastjs/base/FastjsBaseModule",
            "Invalid time, **a number is required**.",
            [
              `func: ${func}`,
              `***time: ${time}`,
              "then(func: (e: T) => void, **time: number = 0**): T",
              "FastjsBaseModule.then"
            ],
            ["fastjs.warn"]
          );
        }
      }
      const callback = () => func(this);
      time === 0 ? callback() : setTimeout(callback, time);
      return this;
    }
  };
}
