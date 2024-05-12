import { dom } from "jsfast";
import successIcon from "@/assets/success.svg";

import "./message.scss";

const container = dom
  .newEl("div")
  .setAttr("id", "message-container")
  .push(dom.select("#app")!, "lastElementChild").el;

export function success(message: string, duration: number = 2000) {
  const box = dom
    .newEl("div")
    .addClass("box")
    .push(container, "lastElementChild").el;
  dom
    .newEl("div")
    .addClass("message success")
    .html(
      `
      <img src="${successIcon}" alt="success">
      <span>${message}</span>
    `
    )
    .push(box, "lastElementChild");

  setTimeout(() => {
    box.addClass("hide");
    setTimeout(() => {
      box.remove();
    }, 300);
  }, duration);
}
