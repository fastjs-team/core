export default _e => {
    return {
        toArray() {
            return _e._list;
        },
        set(key, val) {
            _e._list.forEach((e) => {
                e.set(key, val);
            })
            return _e;
        },
        get(key, target) {
            if (key)
                return _e._list[key || 0]
            return _e._list[key || 0].get(target);
        }
    }
}