import fastjsDom from '../fastjsDom/fastjsDom';
import _dev from "../dev";
import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

class fastjsDomList {
    constructor(list: Array<Element> = []) {
        let domList: Array<Element> = [];
        list?.forEach(el => {
            domList.push(new fastjsDom(el));
        })

        // this
        let _this: object = {
            constructor: "fastjsDomList",
            _list: domList,
        };

        // init methods
        _this = _dev.initMethod(_this, dataEdit, domEdit, event)

        domList.forEach((e:Element, key:number) => {
            this[key] = e;
        })
        Object.entries(_this).forEach((e:Array<any>) => {
            this[e[0]] = e[1];
        })

        return this;
    }
}

export default fastjsDomList