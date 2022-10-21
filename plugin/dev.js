const _dev = {
    _dom: document,
    newWarn(send, index, info) {
        // if in dev
        if (process.env.NODE_ENV === "development")
            console.warn(`[FastjsWarn] ${send}: ${index}${info ? `\n(${info})` : ""}`);
    },
    newError(send, name = "Error") {

    },
    initMethod() {
        // arguments[0] -> object
        // arguments >= 1 -> object need to add
        // Object.assign(arguments[0], arguments[i]);
        let obj = arguments[0];
        for (let i = 1; i < arguments.length; i++) {
            obj = Object.assign(obj, arguments[i]);
        }
        return obj;
    }
}

export default _dev