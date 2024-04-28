/**
 * @vitest-environment jsdom
 */

import { expect, test } from "vitest";
import { getRoot } from "../../utils";
import { dom } from "@/main";

test("Test FastjsDom.get", () => {
  expect(getRoot().get("id")).toBe("root");
});

test("Test FastjsDom.set", () => {
  expect(getRoot().set("id", "new-root").get("id")).toBe("new-root");
});

test("Test FastjsDom.text.get", () => {
  const root = getRoot().set("textContent", "test");
  expect(root.text()).toBe("test");
});

test("Test FastjsDom.text.set", () => {
  const root = getRoot().text("test");
  expect(root.text()).toBe("test");
});

test("Test FastjsDom.html.get", () => {
  expect(getRoot().html()).toBe(`
      <div id="child1" class="div-child"></div>
      <div id="child2" class="div-child"></div>
      <div id="child3" class="div-child"></div>
      <input id="input1" name="textinput" class="input-child">
      <input id="input2" name="textinput" class="input-child">
    `);
});

test("Test FastjsDom.html.set", () => {
  getRoot().html("<h1>test</h1>");
  expect(document.querySelector("h1")).not.toBeNull();
});

test("Test FastjsDom.val.get", () => {
  const input = document.createElement("input");
  input.value = "test";
  expect(dom.newEl(input).val()).toBe("test");
});

test("Test FastjsDom.val.set", () => {
  const input = document.createElement("input");
  dom.newEl(input).val("test");
  expect(input.value).toBe("test");
});

test("Test FastjsDom.el", () => {
  expect(getRoot().el()).toBe(document.querySelector("#root"));
});

test("Test FastjsDom.remove", () => {
  getRoot().remove();
  expect(document.querySelector("#root")).toBeNull();
});

test("Test FastjsDom.first", () => {
  expect(getRoot().first()?.get("id")).toBe("child1");
});

test("Test FastjsDom.last", () => {
  expect(getRoot().last()?.get("id")).toBe("input2");
});

test("Test FastjsDom.father", () => {
  expect(getRoot().first()?.father()?.get("id")).toBe("root");
});

test("Test FastjsDom.children", () => {
  expect(getRoot().children().length).toBe(5);
});

test("Test FastjsDom.next", () => {
  expect(getRoot().next("#child2")?.get("id")).toBe("child2");
});

test("Test FastjsDom.each", () => {
  let count = 0;
  getRoot().each(() => count++);
  expect(count).toBe(getRoot().children().length);
});

test("Test FastjsDom.getStyle", () => {
  const root = getRoot();
  root.get("style").color = "red";
  expect(root.getStyle("color")).toBe("red");
});

test("Test FastjsDom.getStyle.proxy", () => {
  const root = getRoot();
  root.getStyle().color = "red";
  expect(root.get("style").color).toBe("red");
});

test("Test FastjsDom.setStyle.obj", () => {
  const root = getRoot();
  root.setStyle({ color: "red" });
  expect(root.getStyle("color")).toBe("red");
});

test("Test FastjsDom.setStyle.string", () => {
  const root = getRoot();
  root.setStyle("color: red");
  expect(root.getStyle("color")).toBe("red");
});

test("Test FastjsDom.setStyle.key", () => {
  const root = getRoot();
  root.setStyle("color", "red");
  expect(root.getStyle("color")).toBe("red");
});

test("Test FastjsDom.getClass", () => {
  const root = getRoot();
  root.get("classList").add("test");
  expect(root.getClass()).toContain("test");
});

test("Test FastjsDom.setClass.callback", () => {
  const root = getRoot();
  root.setClass("test", true);
  root.getClass((classNames) => {
    expect(classNames).toContain("test");
  });
});

test("Test FastjsDom.setClass.obj", () => {
  const root = getRoot();
  root.setClass({ test: true });
  expect(root.getClass()).toContain("test");
});

test("Test FastjsDom.addClass.array", () => {
  const root = getRoot();
  root.addClass(["test1", "test2"]);
  expect(root.getClass()).toContain("test1");
  expect(root.getClass()).toContain("test2");
});

test("Test FastjsDom.addClass.iterable", () => {
  const root = getRoot();
  root.addClass("test1", "test2");
  expect(root.getClass()).toContain("test1");
  expect(root.getClass()).toContain("test2");
});

test("Test FastjsDom.removeClass.array", () => {
  const root = getRoot();
  root.addClass("test1", "test2");
  root.removeClass(["test1", "test2"]);
  expect(root.getClass()).not.toContain("test1");
  expect(root.getClass()).not.toContain("test2");
});

test("Test FastjsDom.removeClass.iterable", () => {
  const root = getRoot();
  root.addClass("test1", "test2");
  root.removeClass("test1", "test2");
  expect(root.getClass()).not.toContain("test1");
  expect(root.getClass()).not.toContain("test2");
});

test("Test FastjsDom.clearClass", () => {
  const root = getRoot();
  root.addClass("test1", "test2");
  root.clearClass();
  expect(root.getClass()).toEqual([]);
});

test("Test FastjsDom.getAttr", () => {
  const root = getRoot();
  root.get("dataset").test = "test";
  expect(root.getAttr("data-test")).toBe("test");
});

test("Test FastjsDom.getAttr.key", () => {
  const root = getRoot();
  root.get("dataset").test = "test";
  expect(root.getAttr("data-test")).toBe("test");
});

test("Test FastjsDom.getAttr.obj", () => {
  const root = getRoot();
  root.get("dataset").test = "test";
  expect(root.getAttr()).toEqual({ id: "root", "data-test": "test" });
});

test("Test FastjsDom.getAttr.key.callback", () => {
  const root = getRoot();
  root.get("dataset").test = "test";
  root.getAttr("data-test", (val) => {
    expect(val).toBe("test");
  });
});

test("Test FastjsDom.getAttr.obj.callback", () => {
  const root = getRoot();
  root.get("dataset").test = "test";
  root.getAttr((attr) => {
    expect(attr).toEqual({ id: "root", "data-test": "test" });
  });
});

test("Test FastjsDom.setAttr.obj", () => {
  const root = getRoot();
  root.setAttr({ "data-test": "test" });
  expect(root.getAttr("data-test")).toBe("test");
});

test("Test FastjsDom.setAttr.key", () => {
  const root = getRoot();
  root.setAttr("data-test", "test");
  expect(root.getAttr("data-test")).toBe("test");
});
