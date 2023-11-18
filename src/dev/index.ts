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

function error(module: string, message: string): Error {
  // const outputArgs = [`[Fastjs error] ${module}: ${message}`, ...args];
  // console.error(...outputArgs);
  return new Error(`[Fastjs error] ${module}: ${message}`);
}

function type(arg: any): string {
  let type: string = typeof arg;
  if (type === "object") {
    if (arg instanceof Element) type = "Element";
    // if null
    else if (arg === null) type = "Null";
    else type = arg.constructor.name;
  }
  return type;
}


export default {
  browserCheck,
  warn,
  error,
  type,
};
