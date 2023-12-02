// all modules
import request from "./request";
import array from "./array";
import {FastjsArray} from "./array";
import date from "./date";
import {FastjsDate} from "./date";
import dom from "./dom";
import {FastjsDom, FastjsDomList} from "./dom";
import utils from "./utils";
import {rand, copy} from "./utils";

import {PushTarget, InsertTarget} from "./dom/elop";

if (__DEV__) {
    console.info("You are running fastjs in development mode.\n" +
        "Make sure to use the production build (*.prod.js) when deploying for production.");
}

// export
export {
    /** @module array */
    array,
    FastjsArray,
    /** @module date */
    date,
    FastjsDate,
    /** @module dom */
    dom,
    FastjsDom,
    FastjsDomList,
    /** @module request */
    request,
    /** @module utils */
    utils,
    rand,
    copy,
    /** @description enums */
    PushTarget,
    InsertTarget
};
