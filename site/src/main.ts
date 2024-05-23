import "./style.scss";

import { FastjsDom, dom } from "jsfast";

import Home from "./pages/home/";
import NotFound from "./pages/404";
import Sponsor from "./pages/sponsor/";
import { mountBackground } from "./components/background/background";
import { renderFadeIn } from "./fadeIn";
import { setupRouter } from "./router";
import { setupTopbar } from "./components/topbar";

const root = dom.select<FastjsDom>("#app");

setupTopbar(root);
setupRouter(root, {
  pages: [Home, Sponsor],
  notFound: NotFound
}).render(root);

window.addEventListener("scroll", renderFadeIn);
renderFadeIn();

mountBackground(root);
