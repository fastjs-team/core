import { FastjsDom, FastjsDomList, dom } from "jsfast";

let calc = 0,
  first = true;
export function renderFadeIn() {
  const fadeInElements = dom
    .select<FastjsDomList>("*[fade-in]")
    .filter((el) => {
      return el.getAttr("fade-in") !== "true";
    });

  for (const el of fadeInElements) {
    let params = el
      .getAttr("fade-in")!
      .split(",")
      .map((v) => parseInt(v));

    const offset = getElementDistanceFromTop();
    let delay = params[0] || 0;

    if (delay === 0 && first) {
      delay = calc * 500;
      calc++;
    }

    if (el.getAttr("fade-in-done")) continue;
    if (
      window.scrollY <= offset &&
      window.scrollY + window.innerHeight >
        offset + (el as FastjsDom<any>).get("offsetHeight")
    ) {
      setTimeout(() => {
        el.setAttr("fade-in", "true");
      }, delay);
    }

    function getElementDistanceFromTop() {
      var rect = el.el().getBoundingClientRect();
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return rect.top + scrollTop;
    }
  }
  first = false;
}
