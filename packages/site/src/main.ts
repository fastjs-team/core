import "./style.scss";
import { FastjsDom, dom } from "jsfast";
import { setupTopbar } from "./components/topbar";
import { setupRouter } from "./router";

import Home from "./pages/home/";
import NotFound from "./pages/404";

const root = dom.select<FastjsDom>("#app");

setupTopbar(root);
setupRouter(root, [Home], NotFound);
