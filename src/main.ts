// modules
import FastjsAjax from "../modules/ajax/index";
import FastjsDate from "../modules/date/index";

// src
import FastjsArray from "./fastjsArray";
import FastjsDom from "../src/fastjsDom";
import FastjsDomList from "./fastjsDomList";

// main
import fastjs from "./methods";
import { selector, copy, rand } from "./methods";
const selecter = selector

// export
export {
  FastjsAjax,
  FastjsDate,
  FastjsArray,
  FastjsDom,
  FastjsDomList,
  selector,
  selecter,
  copy,
  rand,
};
export default fastjs;
