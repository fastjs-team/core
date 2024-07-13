import dom, { FastjsDom } from "@/dom";

global.__DEV__ = true;

export function setupDomEnvironment() {
  document.body.innerHTML = `
    <div id="root">
      <div id="child1" class="div-child"></div>
      <div id="child2" class="div-child"></div>
      <div id="child3" class="div-child"></div>
      <input id="input1" name="textinput" class="input-child" />
      <input id="input2" name="textinput" class="input-child" />
    </div>
  `;
}

export function getRoot(): FastjsDom {
  return setupDomEnvironment(), dom.select("#root") as FastjsDom;
}
