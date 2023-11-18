// modules
import request from "./request";
import array from "./array";
import date from "./date";
import dom from "./dom";
import utils from "./utils";

if (__DEV__) {
    console.info("You are running fastjs in development mode.\n" +
        "Make sure to use the production build (*.prod.js) when deploying for production.");
}

// export
export {
    array,
    date,
    dom,
    request,
    utils,
};
