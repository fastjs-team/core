import { Page } from "@/router";
import setupMain from "./main";
import setupWrite from "./write";

const page: Page = {
  path: "/",
  load: (root) => {
    setupMain(root);
    setupWrite(root);
  }
};

export default page;
