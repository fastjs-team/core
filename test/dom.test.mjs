/**
 * @jest-environment jsdom
 */

import {dom} from "../dist/fastjs.esm.js";
import {describe, it, expect} from "@jest/globals";

const templates = [
  "",
  "<div id='main' class='block'></div>",
  "<div id='main' class='block'><div id='child' class='child block'></div><a id='child1' class='child link block'></a></div>",
]
function cleanupEnv(templateId = 0) {
  document.body.innerHTML = templates[templateId];
}

describe("Dom selector test", () => {
  it("Dom selector by id", () => {
    cleanupEnv(2)
    const result = dom.select("#main");
    console.log("Dom selector by id: ", result);
    expect(result._el).toEqual(document.getElementById("main"));
  })

  it("Multiple dom selector", () => {
    cleanupEnv(2)
    const result = dom.select("a.block");
    console.log("Multiple dom selector: ", result);
    expect(result.length).toBe(1);
    expect(result.el()).toEqual(document.getElementById("child1"));
  })
})

describe("Dom create test", () => {
  it("Insert dom", () => {
    cleanupEnv(1)
    dom.newEl("div", {
      id: "test",
      class: "block"
    }).push(dom.select("#main").el());
    expect(dom.select("#main #test")).not.toBe(null);
  })
})

describe("Dom remove test", () => {
  it("Remove dom", () => {
    cleanupEnv(1)
    dom.select("#main").remove();
    expect(dom.select("#main")).toBe(null);
    expect(document.body.innerHTML).toBe("");
  })

  it("Remove multiple dom", () => {
    cleanupEnv(2)
    dom.select(".child").remove();
    expect(dom.select(".child")).toBe(null);
    expect(document.body.innerHTML).toBe('<div id="main" class="block"></div>');
  })
})

describe("DomList test", () => {
  it("Return Dom", () => {
    cleanupEnv(2)
    const result = dom.select(".child");
    expect(result.getDom(1).get("tagName")).toBe("A");
  })

  it("Return Dom Array", () => {
    cleanupEnv(2)
    const result = dom.select(".child").toArray();
    expect(result[1].get("tagName")).toBe("A");
  })

  it("Return Element Array", () => {
    cleanupEnv(2)
    const result = dom.select(".child").toElArray()
    expect(result[1].tagName).toBe("A");
  })
})