export default _e => {
    return {
        get(key) {
            return _e._el[key];
        },
        set(key, val) {
            _e._el[key] = val;
            return _e;
        }
    }
}