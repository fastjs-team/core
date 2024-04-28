/**
 * @param {import('jsfast').FastjsDom} element
 */
export function setupCounter(element) {
  let count = 0;
  element.text("Count: 0").addEvent("click", (el) => {
    el.text(`Count: ${++count}`);
  });
}
