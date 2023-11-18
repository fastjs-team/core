function browserCheck(module: string): void {
  const isBrowser: boolean = typeof window !== "undefined";
  if (!isBrowser) {
    throw error(`${module}/browserCheck`, "This module is only available in browser environments.");
  }
}

function warn(module: string, message: string, args: Array<string> = []): void {
  const outputArgs = [`[Fastjs warn] ${module}: ${message}`, ...args];
  console.warn(...outputArgs);
}

function error(module: string, message: string, args: Array<string> = []): Error {
  let msg = `[Fastjs error] ${module}: ${message}`;
  if (args.length > 0) {
    msg += `\n${args.join("\n")}`;
  }
  return new Error(msg);
}

function type(arg: any): string {
  let type: string = typeof arg;
  if (type === "object") {
    if (typeof Element !== "undefined" && arg instanceof Element) {
      type = "Element";
    }
    // if null
    else if (arg === null) {
      type = "Null";
    } else {
      type = arg.constructor.name;
    }
  }
  return type;
}


export default {
  browserCheck,
  warn,
  error,
  type,
};
