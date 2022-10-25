export default {
    _dom: document,
    newWarn(send: string, warn: string, file: Array<string>): void {
        // if in dev
        if (process.env.NODE_ENV === "development") {
            let output = `[Fastjs warn] ${send}: ${warn}`
            if (file) {
                output += "\n";
                file.forEach((v) => {
                    output += `  ${v}\n`;
                })
            }
            // new warn
            console.warn(output);
        }
    },
    newError(send: string, error: string, file: Array<string>): void {
        // if in dev
        if (process.env.NODE_ENV === "development") {
            let output = `[Fastjs error] ${send}: ${error}`
            if (file) {
                output += "\n";
                file.forEach((v) => {
                    output += `  ${v}\n`;
                })
            }
            // new error
            throw new Error(output);
        }
    },
    initMethod(_this: any, ...methods: any): object {
        // arguments[0] -> object
        // arguments >= 1 -> object need to add
        // Object.assign(arguments[0], arguments[i]);
        let obj: object = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
            obj = Object.assign(obj, arguments[i](obj));
        }
        return obj;
    },
    type(arg: any): string {
        let type: string = typeof arg;
        if (type === "object") {
            if (arg instanceof Element)
                type = "Element";
            // if null
            else if (arg === null)
                type = "Null";
            else
                type = arg.constructor.name;
        }
        return type;
    }
}