import _dev from "./dev";

interface dynamicParam {
  name: string;
  type?: string | string[];
  required?: boolean;
  multiple?: boolean;
  default?: any;
  match?: RegExp;
  verify?: (value: any) => boolean;
  include?: any[];
  equal?: any;
}

export function createDynamicFunction<T>(params: dynamicParam[], call: Function): (...args: any[]) => T {
  if (__DEV__) {
    params.reduce((s, v) => {
      if (!s && v.required) {
        throw _dev.error("fastjs/dynamic", `Strict param should be before non-strict param. This is a bug of fastjs or the plugin you are using, if you sure this is a bug of fastjs, please submit an issue with this error output to https://github.com/fastjs-team/core/issues.`, [
          `***params: `, params,
          `call: `, call
        ], ["fastjs.wrong"])
      }
      return !!v.required;
    }, true)
  }

  params = params.map((v) => {
    return {
      required: v.required || false,
      multiple: v.multiple || false,
      ...v
    }
  })
  const staticParams = params.filter((v) => v.required);

  function callDynamicFunction(...args: any[]) {
    const usedParams = new Set<string>();
    const callParams: { [key: string]: any } = {}

    staticParams.forEach((v, k) => {
      if (args[k] === undefined) {
        if (v.default !== undefined) args[k] = v.default;
        else if (__DEV__) {
          throw _dev.error("fastjs/dynamic-function", `Missing strict param ${v.name}.`, [
            `***params: `, callParams,
            `call: `, call
          ], ["fastjs.wrong"])
        }
      }
      usedParams.add(v.name);
      callParams[v.name] = args[k];
    })

    for (let i = staticParams.length; i < args.length; i++) {
      const param = findParam(args[i], i);
      callParams[param.name] = args[i];
    }

    // add default value if not set
    params.forEach((v) => {
      if (v.default !== undefined && !usedParams.has(v.name)) {
        usedParams.add(v.name);
        callParams[v.name] = v.default;
      }
    })

    return call(callParams);

    function findParam(value: any, key: number) {
      for (const param of params) {
        if (usedParams.has(param.name) && !param.multiple) continue;
        if (
          param.type === "any" ||
          typeof value === param.type ||
          (Array.isArray(param.type) && param.type.includes(typeof value)) ||
          (param.equal && value === param.equal) ||
          (param.include && param.include.includes(value)) ||
          (param.verify && param.verify(value)) ||
          (param.match && (typeof value !== "string" || !param.match.test(value)))
        ) {
          usedParams.add(param.name);
          return param;
        }
      }

      if (__DEV__) {
        throw _dev.error("fastjs/dynamic-function", `Cannot find match param type for value **${value}**.`, [
          `Matched params: `, callParams,
          `*Unknown param:&`, value,
          `*Unknown param key: index `, key, "&of", args,
          `Expected params: `, params,
        ], ["fastjs.wrong"])
      }
      throw "2dxz"
    }
  }

  return callDynamicFunction;
}