import "./style.scss";
import { FastjsDom, dom } from "jsfast";
import fastjs from "../../public/fastjs.svg";
import github from "@/assets/github.svg";
import { getI18n } from "@/lang";

interface TopbarItem {
  name: string;
  type?: "text" | "icon";
  content: string;
  path?: string;
  position?: "left" | "right";
}

const lang = getI18n("topbar");
console.log(lang);

const topbar: TopbarItem[] = [
  {
    name: "Icon",
    type: "icon",
    content: fastjs
  },
  {
    name: "Home",
    content: lang.home,
    path: "/"
  },
  {
    name: "Sponsor",
    content: lang.sponsor,
    path: "/sponsor"
  },
  {
    name: "Playground",
    content: lang.playground,
    path: "https://stackblitz.com/edit/fastjs-playground?file=src%2Fmain.ts"
  },
  {
    name: "Docs",
    content: lang.docs,
    path: "https://docs.fastjs.dev",
    position: "right"
  },
  {
    name: "Github",
    type: "icon",
    content: github,
    path: "https://github.com/fastjs-team/core",
    position: "right"
  }
];

export function setupTopbar(root: FastjsDom) {
  const template = `
    <div class="container">
      <div class="left"></div>
      <div class="right"></div>
      <span class="line"></span>
    </div>
  `;

  dom
    .newEl("div")
    .set("id", "topbar")
    .html(template)
    .push(root, "firstElementChild");

  // render topbar items
  topbar.forEach((item) => {
    const el = dom
      .newEl("a")
      .setAttr({
        href: item.path || null,
        target: item.path?.startsWith("http") ? "_blank" : ""
      })
      .html(
        item.type === "icon" ? `<img src="${item.content}" />` : item.content
      );

    el.push(
      dom.select(item.position === "right" ? ".right" : ".left", root.el())!,
      "lastElementChild"
    );
  });
}
