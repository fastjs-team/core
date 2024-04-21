/**
 * @vitest-environment jsdom
 */

import { assert, test } from "vitest";
import { setupDomEnvironment } from "../../utils";
import { dom } from "@/main";

setupDomEnvironment();

test("Create a FastjsDom element normally", () => {
  const el = dom.newEl("div");
  assert(el.el().tagName === "DIV", "div should be created");
});

test("Create a FastjsDom element with style", () => {
  const el = dom.newEl("div", {
    css: {
      color: "red"
    }
  });
  assert(el.el().style.color === "red", "div should be created with red color");
});

test("Create a FastjsDom element with class", () => {
  const el = dom.newEl("div", {
    class: "test"
  });
  assert(
    el.getClass().includes("test"),
    "div should be created with test class"
  );
});

test("Create a FastjsDom element with class list", () => {
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

test("Create a FastjsDom element with text", () => {
  const el = dom.newEl("div", {
    text: "test"
  });
  assert(el.text() === "test", "div should be created with text 'test'");
});

test("Create a FastjsDom element with html", () => {
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

test("Create a FastjsDom element with input value", () => {
  const el = dom.newEl("input", {
    value: "test"
  });
  assert(el.val() === "test", "input should be created with value 'test'");
});

test("Create a FastjsDom element with textarea value", () => {
  const el = dom.newEl("textarea", {
    value: "test"
  });
  assert(el.val() === "test", "textarea should be created with value 'test'");
});

test("Create a FastjsDom element with attribute", () => {
  const el = dom.newEl("div", {
    attr: {
      id: "test"
    }
  });
  assert(el.getAttr("id") === "test", "div should be created with id 'test'");
});

test("Create a FastjsDom element with multiple attributes", () => {
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
