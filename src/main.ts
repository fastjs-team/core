// all modules
import date from "./date";
import dom from "./dom";
import request from "./request";
import utils from "./utils/index";
import {rand, copy} from "./utils/index";
import {FastjsExpression} from "./base";

import {PushTarget, InsertTarget} from "./dom/def";

if (__DEV__) {
    console.info("You are running fastjs in development mode.\n" +
        "Make sure to use the production build (*.prod.js) when deploying for production.");
}

// export
export {
    date,
    dom,
    request,
    /** @module utils */
    utils,
    rand,
    copy,
    /** @description enums */
    PushTarget,
    InsertTarget,
    FastjsExpression
};
