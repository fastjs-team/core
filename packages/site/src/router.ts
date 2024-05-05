import { dom, FastjsDom } from "jsfast";

export interface Page {
  path: string;
  template: string;
  load: (root: FastjsDom, router: Router) => void;
  unload?: () => void;
}

export interface Router {
  navigate: (isInit?: boolean) => void;
  location: {
    path: string;
    realPath: string;
  };
}

let isNavigating = false;

export function setupRouter(root: FastjsDom, pages: Page[], notFound: Page) {
  root = dom.newEl("div").set("id", "router").push(root, "lastElementChild").el;

  const setup = (page: Page, withTransition = true) => {
    router.location = {
      path: page.path,
      realPath: window.location.pathname
    };

    if (withTransition) {
      root.addClass("fade").then(() => {
        page.load(root.html(page.template), router);
        root.removeClass("fade");
      }, 300);
    } else page.load(root.html(page.template), router);

    root.next("a")?.forEach((a: FastjsDom) => {
      a.addEvent("click", (dom, e) => {
        console.log("click");
        e.preventDefault();
        window.history.pushState({}, "", a.getAttr("href")!);
        navigate();
      });
    });
  };

  const navigate = (isInit: boolean = false) => {
    const path = window.location.pathname;
    const page = pages.find((p) => p.path === path);
    if (page) setup(page, !isInit);
    else setup(notFound, false);
  };

  const router: Router = {
    navigate: () => { },
    location: {
      path: "",
      realPath: ""
    }
  };

  if (isNavigating) return;
  isNavigating = true;

  window.addEventListener("popstate", () => navigate());
  navigate(true);

  return router;
}
