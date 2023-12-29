import {FastjsArray} from "../dist/fastjs.esm.js";
import {describe, it, expect, jest} from "@jest/globals";

describe("Array create and convert", () => {
  it("Empty Array", () => {
    const result = new FastjsArray().toArray();
    console.log("Empty Array: ", result);
    expect(result).toEqual([]);
  });
  it("Array with one element", () => {
    const result = new FastjsArray([1]).toArray();
    console.log("Array with one element: ", result);
    expect(result).toEqual([1]);
  })
  it("Array with two elements", () => {
    const result = new FastjsArray([null, undefined]).toArray();
    console.log("Array with two elements: ", result);
    expect(result).toEqual([null, undefined]);
  })
})

describe("Array check", () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });


  it("Overflow array when create", () => {
    new FastjsArray([1, 2], {
      length: 1
    });
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("Overflow array after create", () => {
    const arr = new FastjsArray([1, 2, 3, 4, 5], {
      length: 5
    });
    try {
      arr.push(6);
    } catch (e) {
    }
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("TypeError when create", () => {
    new FastjsArray([1, 2, 3, 4, 5], {
      type: "string"
    })
    expect(consoleSpy).toHaveBeenCalled();
  });

  it("TypeError after create", () => {
    const arr = new FastjsArray([1, 2, 3, 4, 5], {
      type: "string"
    });
    try {
      arr.push(6);
    } catch (e) {
    }
    expect(consoleSpy).toHaveBeenCalled();
  });
});