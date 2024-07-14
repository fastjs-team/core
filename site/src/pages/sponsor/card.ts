import "./card.scss";

import { FastjsDom, dom } from "jsfast";

interface Button {
  text: string;
  link: string;
  icon?: string;
  color?: string;
}

export interface Member {
  name: string;
  username: string;
  avatar: string;
  description: string;
  button?: Button[];
  social?: {
    icon: string;
    link: string;
  }[];
}

export function newCard(params: Member): FastjsDom {
  const card = dom.newEl("div", {
    class: "card"
  });
  card.html(`
    <img src="${params.avatar}" alt="${params.name}" />
    <div class="info">
      <h3>${params.name}</h3>
      <p>${params.description}</p>
      <div class="btn-list"></div>
      <div class="social"></div>
    </div>
  `);

  params.button?.forEach((button) => {
    const color = button.color || "white";
    const icon = dom
      .newEl<HTMLAnchorElement>("a", {
        class: "button",
        href: button.link,
        target: "_blank",
        css: {
          border: `1px solid ${color}`,
          color: `${color}`
        }
      })
      .text(button.text);
    if (button.icon) {
      icon.insert(
        dom.newEl<HTMLImageElement>("img", {
          src: button.icon,
          alt: button.text
        }),
        "first"
      );
    }
    icon.push(card.next(".btn-list")!, "lastElementChild");
  });
  params.social?.forEach((social) => {
    card.next(".social")!.insert(
      dom
        .newEl<HTMLAnchorElement>("a", {
          class: "social",
          href: social.link,
          target: "_blank"
        })
        .html(`<img src="${social.icon}" alt="${social.link}" />`),
      "last"
    );
  });

  return card;
}
