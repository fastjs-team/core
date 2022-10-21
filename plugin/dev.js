const _dev = {
    _dom: document,
    newWarn(send, index, info) {
        // if in dev
        if (process.env.NODE_ENV === "development")
            console.warn(`[FastjsWarn] ${send}: ${index}${info ? `\n(${info})` : ""}`);
    },
    newError(send, name = "Error") {

    }
}

export default _dev