import fastjsDom from "./main";
import _dev from "../dev";

export default {
    html(val) {
        this._el.innerHTML = val ? val : this._el.innerHTML;
        return val ? this : this._el.innerHTML;
    },
    text(val) {
        this._el.innerText = val ? val : this._el.innerText;
        return val ? this : this._el.innerText;
    },
    next(selecter) {
        return new fastjsDom(selecter, this._el);
    },
    father() {
        return this._el.parentNode;
    },
    attr(key, value) {
        if (value != null)
            value = value.toString()
        if (value)
            this._el.setAttribute(key, value);
        if (value === null)
            this._el.removeAttribute(key);
        return value === undefined ? this : this._el.getAttribute(key);
    },
    css(key, value) {
        if (value) {
            this._el.style[key] = value;
            return this;
        } else {
            if (typeof key == "object") {
                Object.entries(key).forEach((v) => {
                    this._el.style[v[0]] = v[1];
                })
                return this;
            }
        }
    },
    appendTo(el = _dev._dom.body) {
        el.appendChild(this._el);
        return this;
    },
    push(el = _dev._dom.body) {
        this._el.appendChild(el);
        return this;
    },
    append(el) {
        this._el.appendChild(el);
        return this;
    },
    remove() {
        this._el.remove();
        return null;
    },
    addAfter(el) {
        // add this._el after el
        el.parentNode.insertBefore(this._el, el.nextSibling);
    },
    addBefore(el) {
        // add this._el before el
        el.parentNode.insertBefore(this._el, el);
    },
    val(val) {
        const btn = this._el.tagName === "BUTTON";
        if (val != null) {
            val = String(val);
            console.log(val);
            console.log(this);
            if (btn)
                this._el.innerText = val;
            else
                this._el.value = val;
        } else {
            // if button
            if (btn)
                return this._el.innerText;
            return this._el.value;
            // <-
        }
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
}