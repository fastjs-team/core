import "./style.css";
import typescriptLogo from "./typescript.svg";
import logo from "./logo.svg";
import { FastjsDom, dom } from "jsfast";
import { setupCounter } from "./counter";
import { setupRequest } from "./request";
import { setupDate } from "./date";

dom.select("#app")?.html(`
  <div>
    <a href="https://docs.fastjs.dev" target="_blank">
      <img src="${logo}" class="logo" alt="Fastjs logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Glossary/TypeScript" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello, Fastjs.</h1>
    <div class="card">
    <p id="date"></p>
      <button id="counter" type="button"></button>
    </div>
    <div class="card">
      <button id="send" type="button">Send Request</button>
      <p id="request-result"></p>
    </div>
    <p class="read-the-docs">
      Click on the logos to learn more
    </p>
  </div>
`);

setupDate(dom.select("#date") as FastjsDom);
setupCounter(dom.select("#counter") as FastjsDom);
setupRequest();
