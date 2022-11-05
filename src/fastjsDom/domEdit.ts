import {selecter as _selecter} from "../main";
import _dev from "../dev";
import fastjsDom from "./fastjsDom";
import fastjsDomList from "../fastjsDomList/fastjsDomList";

export default (_e: fastjsDom) => {
    return {
        html(val: string): string | fastjsDom {
            _e._el.innerHTML = val ? val : _e._el.innerHTML;
            return val ? _e : _e._el.innerHTML;
        },
        text(val: string): string | fastjsDom {
            _e._el.innerText = val ? val : _e._el.innerText;
            return val ? _e : _e._el.innerText;
        },
        next(selecter: string): fastjsDom | fastjsDomList {
            return _selecter(selecter, _e._el);
        },
        father(): Element {
            return _e._el.parentNode;
        },
        attr(key: string, value?: string): any {
            if (value != null)
                value = value.toString()
            if (value)
                _e._el.setAttribute(key, value);
            if (value === null)
                _e._el.removeAttribute(key);
            return value !== undefined ? _e : _e._el.getAttribute(key);
        },
        css(key: string | object, value?: string): fastjsDom {
            if (typeof key === "string") {
                _e._el.style[key] = value;
                return _e;
            } else {
                Object.entries(key).forEach((v) => {
                    _e._el.style[v[0]] = v[1];
                })
                return _e;
            }
        },
        appendTo(el: Element = _dev._dom.body): fastjsDom {
            el.appendChild(_e._el);
            return _e;
        },
        push(el: Element = _dev._dom.body): fastjsDom {
            el.appendChild(_e._el);
            return _e;
        },
        append(el: Element): fastjsDom {
            _e._el.appendChild(el);
            return _e;
        },
        remove(): null {
            _e._el.remove();
            return null;
        },
        addAfter(el: Element): fastjsDom {
            if (!el.parentNode) {
                // dev start
                if (process.env.NODE_ENV !== 'production') {
                    _dev.newWarn("fastjsDom.addAfter", "el.parentNode is null", [
                        "addAfter(el: Element)",
                        "domEdit.ts",
                        "fastjsDom"
                    ]);
                }
                // dev end
            } else
                // add _e._el after el
                el.parentNode.insertBefore(_e._el, el.nextSibling);

            return _e;
        },
        addBefore(el: Element): fastjsDom {
            if (!el.parentNode) {
                // dev start
                if (process.env.NODE_ENV !== 'production') {
                    _dev.newWarn("fastjsDom.addAfter", "el.parentNode is null", [
                        "addAfter(el: Element)",
                        "domEdit.ts",
                        "fastjsDom"
                    ]);
                }
                // dev end
            } else
                // add _e._el before el
                el.parentNode.insertBefore(_e._el, el);

            return _e;
        },
        addFirst(el: Element): fastjsDom {
            // add _e._el first in el
            el.insertBefore(_e._el, el.firstChild);
            return _e;
        },
        val(val: string | boolean | number): any {
            const btn = _e._el.tagName === "BUTTON";
            if (val != null) {
                val = String(val);
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
        then(callback: Function, time = 0): fastjsDom {
            if (time)
                setTimeout(() => {
                    callback(_e);
                }, time);
            else
                callback(_e);
            return _e;
        },
        focus(): fastjsDom {
            _e._el.focus();
            return _e;
        },
        first(): fastjsDom {
            return new fastjsDom(_e._el.firstElementChild);
        },
        last(): fastjsDom {
            return new fastjsDom(_e._el.lastElementChild);
        },
        el(): Element {
            return _e._el;
        }
    }
}