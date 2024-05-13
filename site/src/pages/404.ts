import { Page } from "../router";

const page: Page = {
  path: "/404",
  load: (root, router) => {
    root
      .next("#error-msg")!
      .html(`The page at <b>${router.location.realPath}</b> does not exist.`);
  },
  template: `
    <div class="center-box">
      <h1>404</h1>
      <p id="error-msg"></p>
      <b><a href="/">Go back home &gt;</a></b>
    </div>
  `
};

export default page;
