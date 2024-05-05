import { Page } from "../router";

const page: Page = {
  path: "/404",
  load: (root, router) => {
    root
      .next("#error-msg")!
      .html(`The page at <b>${router.location.realPath}</b> does not exist.`);
  },
  template: `
    <div>
      <h1>404</h1>
      <p id="error-msg"></p>
      <a href="/">Go back home</a>
    </div>
  `
};

export default page;
