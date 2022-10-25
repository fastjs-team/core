import fastjsDom from '../fastjsDom/fastjsDom';
import _dev from "../dev";
import dataEdit from "./dataEdit";
import domEdit from "./domEdit";
import event from "./event";

class fastjsDomList {
    constructor(list: Array<Element> = []) {
        let domList: Array<fastjsDom> = [];
        list?.forEach((el: Element) => {
            domList.push(new fastjsDom(el));
        })

        // this
        let _this: object = {
            constructor: "fastjsDomList",
            _list: domList,
        };

        // init methods
        _this = _dev.initMethod(_this, dataEdit, domEdit, event)

        // mount domList: Array<Element> -> this
        domList.forEach((e:fastjsDom, key:number) => {
            this[key] = e;
        })

        // mount _this -> this
        Object.entries(_this).forEach((e:Array<any>) => {
            this[e[0]] = e[1];
        })

        return this;
    }

    [key: string]: any;
}

export default fastjsDomList