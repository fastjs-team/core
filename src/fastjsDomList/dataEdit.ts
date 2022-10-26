import _dev from "../dev";
import fastjsDomList from "./fastjsDomList";
import fastjsDom from "../fastjsDom/fastjsDom";

export default (_e: fastjsDomList) => {
    return {
        toArray() {
            return _e._list;
        },
        set(key: string, val: any, el?: number) {
            // set()
            // set a value of element

            if (el === undefined)
                // set for all elements
                _e.each((e: fastjsDom) => {
                    e.set(key, val);
                })
            else
                // getEl(key) -> fastjsDom -> set val
                _e.getEl(el).set(key, val);
            return _e;
        },
        get(target: string, key?: number) {
            // get()
            // get a value of element

            return _e._list[key || 0].get(target);
        },
        getEl(key: number = 0) {
            // getEl()
            // get a fastjsDom element

            // dev start
            if (process.env.NODE_ENV !== 'production') {
                // overflow
                if (key >= _e._list.length)
                    _dev.newWarn('fastjsDomList', 'key is overflow', [
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