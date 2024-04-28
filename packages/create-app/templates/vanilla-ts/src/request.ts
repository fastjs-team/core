import { dom, request, FastjsDom } from "jsfast";

export function setupRequest() {
  const textEl = dom.select("#request-result") as FastjsDom;
  dom.select("#send")?.addEvent("click", () => {
    textEl.text("Thinking...");
    request.get("https://catfact.ninja/fact").then((data) => {
      textEl?.text(data.fact);
    });
  });
}
