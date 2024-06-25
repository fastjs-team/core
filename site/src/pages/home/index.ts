import { Page } from "@/router";
import setupMain from "./main";
import setupSponsor from "./sponsor";
import setupWrite from "./write";

const page: Page = {
  path: "/",
  load: (root) => {
    setupMain(root);
    setupWrite(root);
    setupSponsor(root);
  }
};

export default page;
