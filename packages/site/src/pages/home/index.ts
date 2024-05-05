import { Page } from "../../router";

const page: Page = {
  path: "/",
  load: (root) => {
    console.log(root);
  },
  template: `
    <h1>Home</h1>
    <p>Welcome to the home page!</p> 
  `
};

export default page;
