import { dom, FastjsDom } from "jsfast";
import { rand } from "jsfast";
import "./background.scss";

export function mountBackground(container: FastjsDom) {
  container = dom
    .newEl("div")
    .addClass("background")
    .push(container, "firstElementChild").el;

  const newStar = () => {
    container.insert(createStar(), "last");
    setTimeout(newStar, rand(100, 2000));
  };
  newStar();
}

function createStar(): FastjsDom {
  const star = dom.newEl("div", {
    class: "star",
    css: {
      left: rand(0, 100) + "vw",
      top: rand(0, 100) + "vh",
      transform: `scale(${rand(0, 150) / 100 + 0.5})`
    }
  });
  star.then(() => {
    star.addClass("show").then(
      () => {
        star.addClass("hide").then(() => {
          star.remove();
        }, 1000);
      },
      rand(3000, 15000)
    );
  }, 10);
  return star;
}
