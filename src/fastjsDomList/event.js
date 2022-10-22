export default _e => {
    return {
        each(callback) {
            _e._list.forEach((e) => {
                callback(e);
            })
            return _e;
        },
        then(callback, time = 0) {
            if (time)
                setTimeout(() => {
                    callback(_e);
                }, time);
            else
                callback(_e);
            return _e;
        },
        bind(bind, key, object = {}, isAttr = false) {
            _e._list.forEach((e) => {
                object = e.bind(bind, key, object, isAttr);
            })
            return object;
        },
        on(event = "click", callback) {
            _e._list.forEach((e) => {
                e.on(event, callback);
            })
            return _e;
        },
    }
}