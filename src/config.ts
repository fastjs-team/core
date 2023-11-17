/** @todo Remove file if not needed */

import FastjsAjax from "./ajax";

interface config {
  dom: {
    defaultTag: string;
    specialDom: Array<string>;
  };
  modules: {
    ajax: {
      successCode: Array<number>;
      timeout: number;
      hooks: {
        before: Function;
        success: Function;
        failed: Function;
        callback: Function;
      };
    };
  };
}

const _config: config = {
  dom: {
    defaultTag: "div",
    specialDom: ["body", "head", "html"],
  },
  modules: {
    ajax: {
      successCode: [200],
      // default timeout
      timeout: 5000,
      // return false to stop the request
      hooks: {
        // => ajax::Ajax
        before: (ajax: FastjsAjax) => ajax || true,
        // => ajax::Ajax
        success: (ajax: FastjsAjax) => ajax || true,
        // => ajax::Ajax
        failed: (ajax: FastjsAjax) => ajax || true,
        // => ajax::Ajax, data::Object
        callback: (
          ajax: FastjsAjax,
          data: {
            [key: string]: any;
          }
        ) => ajax || data || true,
      },
    },
  },
};

export default _config;
