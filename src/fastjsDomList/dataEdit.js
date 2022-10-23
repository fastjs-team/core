import _dev from "../dev";

export default _e => {
    return {
        toArray() {
            return _e._list;
        },
        set(key, val, el) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                if (key === undefined)
                    _dev.newError('fastjsDomList', 'argument val require a value', [
                        'set(key, val, el)',
                        'dataEdit.js',
                        'fastjsDomList'
                    ]);
            }
            // dev end
            if (el === undefined)
                _e.each((e) => {
                    e.set(key, val);
                })
            else
                _e.get(el).set(key, val);
            return _e;
        },
        get(target, key) {
            return _e._list[key || 0].get(target);
        },
        getEl(key = 0) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                // overflow
                if (key >= _e._list.length)
                    return _dev.newWarn('fastjsDomList', 'key is overflow', [
                        'getEl(key)',
                        'dataEdit.js',
                        'fastjsDomList'
                    ]);
            }
            // dev end
            return _e._list[key || 0];
        }
    }
}