import _dev from "../dev";

export default _e => {
    return {
        toArray() {
            return _e._list;
        },
        set(val, key) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                if (val === undefined)
                    _dev.newError('fastjsDomList', 'argument val require a value', [
                        'set(val, key)',
                        'dataEdit.js',
                        'fastjsDomList'
                    ]);
            }
            // dev end
            if (key === undefined)
                _e.each((e) => {
                    e.set(val);
                })
            else
                _e.get(key).set(val);
            return _e;
        },
        get(target, key) {
            return _e._list[key || 0].get(target);
        },
        getEl(key) {
            // dev start
            if (process.env.NODE_ENV !== 'production') {
                // overflow
                if (key >= _e.length)
                    return _dev.newWarn('fastjsDomList', 'key is overflow', [
                        'getEl(key)',
                        'dataEdit.js',
                        'fastjsDomList'
                    ]);
            }
            // dev end
            return _e[key || 0];
        }
    }
}