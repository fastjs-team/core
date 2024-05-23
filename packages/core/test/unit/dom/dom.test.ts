/**
 * @vitest-environment jsdom
 */

import { assert, test } from "vitest";

import { dom } from "@/main";
import { setupDomEnvironment } from "../../utils";

setupDomEnvironment();

test("dom.newEl", () => {
  const el = dom.newEl("div");
  assert(el.el().tagName === "DIV", "div should be created");
});

test("dom.newEl: with style object", () => {
  const el = dom.newEl("div", {
    css: {
      color: "red"
    }
  });
  assert(el.el().style.color === "red", "div should be created with red color");
});

test("dom.newEl: with style string", () => {
  const el = dom.newEl("div", {
    css: "color: red;"
  });
  assert(el.el().style.color === "red", "div should be created with red color");
})

test("dom.newEl: with class", () => {
  const el = dom.newEl("div", {
    class: "test1 test2"
  });
  assert(
    el.getClass().includes("test1"),
    "div should be created with test1 class"
  );
  assert(
    el.getClass().includes("test2"),
    "div should be created with test2 class"
  );
});

test("dom.newEl: with class array", () => {
  const el = dom.newEl("div", {
    class: ["test1", "test2"]
  });
  assert(
    el.getClass().includes("test1"),
    "div should be created with test1 class"
  );
  assert(
    el.getClass().includes("test2"),
    "div should be created with test2 class"
  );
});

test("dom.newEl: with text", () => {
  const el = dom.newEl("div", {
    text: "<span>test</span>"
  });
  assert(el.next("span") === null, "span should not be created");
  assert(el.text().indexOf("test"), "div should be created with text 'test'");
});

test("dom.newEl: with html", () => {
  const el = dom.newEl("div", {
    html: "<span>test</span>"
  });
  assert(
    el.html() === "<span>test</span>",
    "div should be created with html '<span>test</span>'"
  );
  assert(
    el.next("span")?.html() === "test",
    "span should be created with text 'test'"
  );
});

test("dom.newEl: input with value", () => {
  const el = dom.newEl("input", {
    val: "test"
  });
  assert(el.val() === "test", "input should be created with value 'test'");
});

test("dom.newEl: textarea with value", () => {
  const el = dom.newEl("textarea", {
    val: "test"
  });
  assert(el.val() === "test", "textarea should be created with value 'test'");
});

test("dom.newEl: with attributes", () => {
  const el = dom.newEl("div", {
    attr: {
      id: "test",
      class: "test"
    }
  });
  assert(el.getAttr("id") === "test", "div should be created with id 'test'");
  assert(
    el.getAttr("class") === "test",
    "div should be created with class 'test'"
  );
});
