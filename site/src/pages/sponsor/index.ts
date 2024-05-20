import "./style.scss";

import { Page } from "@/router";
import members from "./members";
import { newCard } from "./card";

const page: Page = {
  path: "/sponsor",
  load: (root) => {
    for (let member of members) {
      root.next(".members")!.insert(newCard(member), "last");
    }
  },
  template: `
    <div class="page">
      <h1>Sponsor Us</h1>
      <div class="flex">
        <p>
          Fastjs is a free and open-source project.<br><br>
          We don't have any income source, so we need your help to keep the project running.<br><br>
          If you like Fastjs, please consider supporting us.<br>
        </p>
        <div class="members"></div>
      </div>
    </div>
  `
};

export default page;
