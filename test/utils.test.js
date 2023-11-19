import {rand} from "../dist/fastjs.esm.js";

describe("Random test", () => {
  // try 5 time 1~10, need to be 1~10 and at lease one time not equal
  it("Random 1~10", () => {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(rand(1, 10));
    }
    console.log("Random number: ", result);
    if (result.every((v) => v === result[0])) {
      throw new Error("All number are equal");
    }
    if (result.some((v) => v < 1 || v > 10)) {
      throw new Error("Number out of range");
    }
  })

  it('Random 1.0~10.0', function () {
    let result = [];
    for (let i = 0; i < 5; i++) {
      result.push(rand(1, 10, 1));
    }
    console.log("Random number: ", result);
    if (result.every((v) => v === result[0])) {
      throw new Error("All number are equal");
    }
    if (result.some((v) => v < 1 || v > 10)) {
      throw new Error("Number out of range");
    }
    // if all .0
    if (result.every((v) => v % 1 === 0)) {
      throw new Error("All number are integer");
    }
  });
})