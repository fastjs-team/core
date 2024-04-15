// all modules
import date from "./date";
import {FastjsDate} from "./date";
import dom from "./dom";
import {FastjsDom, createFastjsDomList} from "./dom";
import request from "./request";
import {FastjsRequest} from "./request"
import utils from "./utils/";
import {rand, copy} from "./utils/";
import {FastjsExpression} from "./base";

import {PushTarget, InsertTarget} from "./dom/def";

if (__DEV__) {
    console.info("You are running fastjs in development mode.\n" +
        "Make sure to use the production build (*.prod.js) when deploying for production.");
}

// export
export {
    /** @module date */
    date,
    FastjsDate,
    /** @module dom */
    dom,
    FastjsDom,
    createFastjsDomList,
    /** @module request */
    request,
    FastjsRequest,
    /** @module utils */
    utils,
    rand,
    copy,
    /** @description enums */
    PushTarget,
    InsertTarget,
    FastjsExpression
};
