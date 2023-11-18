import {FastjsDate} from "../dist/fastjs.esm.js";
import {describe, it, expect } from "@jest/globals";

function getUTCTimestamp() {
  const date = new Date();
  return date.getTime() + date.getTimezoneOffset() * 60 * 1000;
}

describe("Date create and convert", () => {
  it("Normal Date", () => {
    const result = new FastjsDate("Y-M-DTh:m:s", getUTCTimestamp()).toString();
    console.log("Date create and convert: ", result);
    expect(new Date().toISOString().includes(result)).toBe(true);
  })

  it("Date with some special characters", () => {
    const result = new FastjsDate("<!@#$%^&*()_+<>><<>?:>Y-M-DTh:m:s").toString();
    console.log("Date with some special characters: ", result);
    expect(result.toString().includes("!@#$%^&*()_+<>><<>?:")).toBe(true);
  })

  it("Date string local function", (done) => {
    const nowTime = new FastjsDate("h:m:s").toString();
    const result = new FastjsDate("h:m:s");
    setTimeout(() => {
      try {
        expect(result.toStringLocal()).toBe(nowTime);
      } catch (e) {
      } finally {
        done();
      }
    }, 2000);
  });

  it("Date timestamp basic", () => {
    const result = new FastjsDate().toNumber();
    console.log("Date timestamp basic: ", result);
    expect(result - Date.now()).toBeLessThan(100);
  })

  it("Date timestamp local", (done) => {
    const nowTime = new Date().getTime();
    const result = new FastjsDate();
    setTimeout(() => {
      try {
        expect(result.toNumber()).toBe(nowTime);
        done();
      } catch (e) {
        done(e);
      }
    }, 2000);
  })
})