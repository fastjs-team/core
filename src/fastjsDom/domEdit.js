import {selecter as _selecter} from "../../main";
import _dev from "../dev";
import fastjsDom from "./fastjsDom";

export default _e => {
    return {
        html(val) {
            _e._el.innerHTML = val ? val : _e._el.innerHTML;
            return val ? _e : _e._el.innerHTML;
        },
        text(val) {
            _e._el.innerText = val ? val : _e._el.innerText;
            return val ? _e : _e._el.innerText;
        },
        next(selecter) {
            return _selecter(selecter, _e._el);
        },
        father() {
            return _e._el.parentNode;
        },
        attr(key, value) {
            if (value != null)
                value = value.toString()
            if (value)
                _e._el.setAttribute(key, value);
            if (value === null)
                _e._el.removeAttribute(key);
            return value === undefined ? _e : _e._el.getAttribute(key);
        },
        css(key, value) {
            if (value) {
                _e._el.style[key] = value;
                return _e;
            } else {
                if (typeof key == "object") {
                    Object.entries(key).forEach((v) => {
                        _e._el.style[v[0]] = v[1];
                    })
                    return _e;
                }
            }
        },
        appendTo(el = _dev._dom.body) {
            el.appendChild(_e._el);
            return _e;
        },
        push(el = _dev._dom.body) {
            el.appendChild(_e._el);
            return _e;
        },
        append(el) {
            _e._el.appendChild(el);
            return _e;
        },
        remove() {
            _e._el.remove();
            return null;
        },
        addAfter(el) {
            // add _e._el after el
            el.parentNode.insertBefore(_e._el, el.nextSibling);
        },
        addBefore(el) {
            // add _e._el before el
            el.parentNode.insertBefore(_e._el, el);
        },
        addFirst(el) {
            // add _e._el first in el
            el.insertBefore(_e._el, el.firstChild);
        },
        val(val) {
            const btn = _e._el.tagName === "BUTTON";
            if (val != null) {
                val = String(val);
                console.log(val);
                console.log(_e);
                if (btn)
                    _e._el.innerText = val;
                else
                    _e._el.value = val;
            } else {
                // if button
                if (btn)
                    return _e._el.innerText;
                return _e._el.value;
                // <-
            }
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
        focus() {
            _e._el.focus();
            return _e;
        },
        first() {
            return new fastjsDom(_e._el.firstElementChild);
        },
        last() {
            return new fastjsDom(_e._el.lastElementChild);
        }
    }
}