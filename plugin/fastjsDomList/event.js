export default {
    each(callback) {
        this._list.forEach((e) => {
            callback(e);
        })
        return this;
    },
    then(callback, time = 0) {
        if (time)
            setTimeout(() => {
                callback(this);
            }, time);
        else
            callback(this);
        return this;
    },
    bind(bind, key, object = {}, isAttr = false) {
        this._list.forEach((e) => {
            object = e.bind(bind, key, object, isAttr);
        })
        return object;
    },
    on(event = "click", callback) {
        this._list.forEach((e) => {
            e.on(event, callback);
        })
        return this;
    },
}