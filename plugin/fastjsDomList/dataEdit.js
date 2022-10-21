export default {
    toArray() {
        return this._list;
    },
    set(key, val) {
        this._list.forEach((e) => {
            e.set(key, val);
        })
        return this;
    },
    get(key, target) {
        if (key)
            return this._list[key || 0]
        return this._list[key || 0].get(target);
    }
}