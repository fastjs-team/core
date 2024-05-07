import { Page } from "@/router";

const page: Page = {
  path: "/sponsor",
  load: (root) => {
    console.log(root);
  },
  template: `
    <h1>Sponsor</h1>
    <p>Welcome to the sponsor page!</p> 
  `
};

export default page;
