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

// export
export {
  FastjsAjax,
  FastjsDate,
  FastjsArray,
  FastjsDom,
  FastjsDomList,
  selector,
  copy,
  rand,
};
export default fastjs;
