import fastjsDom from "./fastjsDom/fastjsDom";
import fastjsDomList from "./fastjsDomList/fastjsDomList";
declare let fastjs: {
    selecter(el: string, place?: Element | Document | fastjsDomList): fastjsDom | fastjsDomList;
    copy(text: string): void;
};
declare let selecter: (el: string, place?: Element | Document | fastjsDomList) => fastjsDom | fastjsDomList;
declare let copy: (text: string) => void;
export { selecter, copy };
export default fastjs;
