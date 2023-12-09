function browserCheck(module: string): void {
    const isBrowser: boolean = typeof window !== "undefined";
    if (!isBrowser) {
        throw error(`${module}/browserCheck`, "This module is only available in browser environments.");
    }
}

type style =
    "fastjs.bold"
    | "fastjs.reverse"
    | "fastjs.red"
    | "fastjs.green"
    | "fastjs.yellow"
    | "fastjs.blue"
    | "fastjs.magenta"
    | "fastjs.cyan"
    | "fastjs.white"
    | "fastjs.gray"
    | "fastjs.bgRed"
    | "fastjs.bgGreen"
    | "fastjs.bgYellow"
    | "fastjs.bgBlue"
    | "fastjs.bgMagenta"
    | "fastjs.bgCyan"
    | "fastjs.bgWhite"
    | "fastjs.bgGray"
    | "fastjs.wrong"
    | "fastjs.right"
    | "fastjs.warn";

function warn(module: string, message: string, args: Array<any> = [], styleArgs: Array<style | style[]> = []): void {
    // Define a style list
    const styleList = {
        "fastjs.bold": "\u001b[1m",
        "fastjs.reverse": "\u001b[7m",
        "fastjs.red": "\u001b[31m",
        "fastjs.green": "\u001b[32m",
        "fastjs.yellow": "\u001b[33m",
        "fastjs.blue": "\u001b[34m",
        "fastjs.magenta": "\u001b[35m",
        "fastjs.cyan": "\u001b[36m",
        "fastjs.white": "\u001b[37m",
        "fastjs.gray": "\u001b[90m",
        "fastjs.bgRed": "\u001b[41m",
        "fastjs.bgGreen": "\u001b[42m",
        "fastjs.bgYellow": "\u001b[43m",
        "fastjs.bgBlue": "\u001b[44m",
        "fastjs.bgMagenta": "\u001b[45m",
        "fastjs.bgCyan": "\u001b[46m",
        "fastjs.bgWhite": "\u001b[47m",
        "fastjs.bgGray": "\u001b[100m",
        "fastjs.wrong": "\u001b[41m\u001b[37m\u001b[1m",
        "fastjs.right": "\u001b[42m\u001b[37m\u001b[1m",
        "fastjs.warn": "\u001b[43m\u001b[90m\u001b[1m",
    };

    args = args.map((arg) => typeof arg === "string" ? "\n    > " + arg : arg)

    let styleKey = 0
    let outputMessage = ""
    let outputObjects: any[] = []
    let lastStyle = styleArgs.length ? getStyle(styleArgs[styleArgs.length - 1]) : ""

    args.unshift(`[Fastjs warn] ${module}: ${message}`)
    args.forEach((arg) => {
        if (typeof arg !== "string") {
            outputMessage += "%o"
            outputObjects.push(arg)
            return;
        }
        if (arg.includes("*") && !arg.includes("**")) {
            let style = styleArgs[styleKey]
            arg = arg.replace("*", "")
            arg = arg.replace("  >", getStyle(style) + "-->\u001b[0m")
            styleKey++
        }
        if (arg.includes("***")) {
            let style = styleArgs[styleKey]
            arg = arg.replace("***", "")
            arg = arg.split("> ")[0] + "> " + getStyle(style) + arg.split("> ")[1] + "\u001b[0m"
            styleKey++
        }
        while (arg.includes(`**`)) {
            let style = styleArgs[styleKey]
            arg = arg.replace(`**`, getStyle(style))
            arg = arg.replace(`**`, "\u001b[0m")
            styleKey++
        }
        outputMessage += arg
    })
    console.warn(outputMessage, ...outputObjects)

    function getStyle(key: style | style[]): string {
        // if no, return last style
        if (!key) return lastStyle
        if (Array.isArray(key)) {
            return key.map((style) => styleList[style] || "").join("");
        }
        return styleList[key] || "";
    }
}

function error(module: string, message: string, args: Array<string> = []): Error {
    let msg = `[Fastjs error] ${module}: ${message}`;
    if (args.length > 0) {
        msg += args.map((arg) => "\n    > " + arg).join("");
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
