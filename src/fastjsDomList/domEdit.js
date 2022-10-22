import {selecter} from "../../main";

export default _e => {
    return {
        next(el) {
            return selecter(el, _e);
        },
        attr(key, value) {
            _e._list.forEach((e) => {
                e.attr(key, value);
            })
            return _e;
        },
        css(key, value) {
            _e._list.forEach((e) => {
                e.css(key, value);
            })
            return _e;
        },
        html(val) {
            if (val === undefined)
                return _e._list[0].html();
            _e._list.forEach((e) => {
                e.html(val);
            })
            return _e;
        },
        text(val) {
            if (val === undefined)
                return _e._list[0].text(val);
            _e._list.forEach((e) => {
                e.text(val);
            })
            return _e;
        },
        father() {
            return _e._list[0].father();
        },
    }
}