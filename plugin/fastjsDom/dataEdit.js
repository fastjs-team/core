export default {
    get(key) {
        return this._el[key];
    },
    set(key, val) {
        this._el[key] = val;
        return this;
    }
}