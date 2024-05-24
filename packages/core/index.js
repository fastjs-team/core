"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/fastjs.esm.prod.js");
} else {
  module.exports = require("./dist/fastjs.esm.js");
}
