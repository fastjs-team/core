import type { Member } from "./card";
import github from "@/assets/github.svg";
import heart from "@/assets/heart.svg";
import twitter from "@/assets/twitter.svg";

export default [
  {
    name: "DY_XiaoDong",
    username: "xiaodong2008",
    avatar: "https://avatars.githubusercontent.com/u/84657208?v=4",
    description:
      "Creator, maintainer of <a href='https://github.com/fastjs-team/core' target='_blank'>@Fastjs</a>.",
    button: [
      {
        text: "Sponsor",
        link: "https://github.com/sponsors/xiaodong2008",
        icon: heart,
        color: "#f736cd"
      }
    ],
    social: [
      {
        icon: github,
        link: "https://github.com/xiaodong2008"
      },
      {
        icon: twitter,
        link: "https://twitter.com/dy_xiaodong"
      }
    ]
  }
] as Member[];
