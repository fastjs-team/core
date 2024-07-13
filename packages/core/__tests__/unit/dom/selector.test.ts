/**
 * @vitest-environment jsdom
 */

import { assert, test } from "vitest";

import { dom } from "@/main";
import { setupDomEnvironment } from "../../utils";

setupDomEnvironment();

test("Select body with default export selctor", () => {
  const el = dom();
  assert(el?.el() === document.body, "body should be selected");
});

test("Select body with selector 'body'", () => {
  const el = dom.select("body");
  assert(el?.el() === document.body, "body should be selected");
});

test("Select body with selector default value null", () => {
  const el = dom.select();
  assert(el?.el() === document.body, "body should be selected");
});

test("Select div with selector 'div'", () => {
  const el = dom.select("div");
  assert(
    el?.el() === document.body.querySelector("div"),
    "first div should be selected"
  );
});

test("Select div with selector 'div#root'", () => {
  const el = dom.select("div#root");
  assert(
    el?.el() === document.body.querySelector("div#root"),
    "root div should be selected"
  );
});

test("Select div with selector 'div.div-child'", () => {
  const el = dom.select("div.div-child");
  assert(
    el?.el() === document.body.querySelector("div.div-child"),
    "first div with class div-child should be selected"
  );
});

test("Select div with selector 'div.div-child' and index 1", () => {
  const el = dom.select("div.div-child");
  assert(
    el?.getDom(1).el() === document.body.querySelectorAll("div.div-child")[1],
    "second div with class div-child should be selected"
  );
});

test("Select 2 input with selector 'input[name=textinput]'", () => {
  const el = dom.select("input[name=textinput]");
  assert(
    el?.toArray().length === 2,
    "3 div with name div-child should be selected"
  );
});

test("Select child of FastjsDom", () => {
  const el = dom.select("div#root");
  assert(
    el?.children().length === 5,
    "5 children of root div should be selected"
  );
});
