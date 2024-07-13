/**
 * @vitest-environment jsdom
 */

import { assert, test } from "vitest";

import type { FastjsDom } from "@/dom";
import { dom } from "@/main";
import { setupDomEnvironment } from "../../utils";

setupDomEnvironment();

test("Select all div and edit their text", () => {
  const divs = dom.select(".div-child");
  divs?.text("test").each((el: FastjsDom) => {
    assert(el.text() === "test", "div should have text 'test'");
  });
});

test("Select all input and edit their value", () => {
  const inputs = dom.select(".input-child");
  inputs?.val("test").each((el: FastjsDom) => {
    assert(el.val() === "test", "input should have value 'test'");
  });
});

test("Select all div and edit their text using each", () => {
  const divs = dom.select(".div-child");
  divs?.each((el: FastjsDom) => {
    el.text("test");
    assert(el.text() === "test", "div should have text 'test'");
  });
});

test("Create a list and edit their text", () => {
  const divs = dom.newElList([dom.newEl("div"), dom.newEl("div")]);
  divs.text("test").each((el: FastjsDom) => {
    assert(el.text() === "test", "div should have text 'test'");
  });
});

test("Create a list with real dom and edit their text", () => {
  const divs = dom.newElList([dom.select("#child1"), dom.select("#child2")]);
  divs.text("newText").each((el: FastjsDom) => {
    assert(el.text() === "newText", "div should have text 'test'");
  });
});

test("Create a list with real dom and edit their text using each", () => {
  const divs = dom.newElList([dom.select("#child1"), dom.select("#child2")]);
  let count = 0;
  divs.each((el, dom, index) => {
    el.text(`newText${index}`);
    assert(el.text() === `newText${count++}`, "div should have text 'test'");
  });
});
