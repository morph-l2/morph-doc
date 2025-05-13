import { useLayoutEffect } from "react";
function AskCookbook({
  apiKey,
  alwaysOpen,
  noFastMode
}) {
  useLayoutEffect(() => {
    if (!window?.document)
      return;
    let element = document.getElementById("__cookbook");
    if (!element) {
      element = document.createElement("div");
      element.id = "__cookbook";
      element.dataset.apiKey = apiKey;
      if (alwaysOpen) {
        element.dataset.alwaysOpen = "";
      }
      if (noFastMode) {
        element.dataset.noFast = "";
      }
      document.body.appendChild(element);
    }
    let script = document.getElementById("__cookbook-script");
    if (!script) {
      script = document.createElement("script");
      script.src = "/js/cookbookdev.index.cjs.js";
      script.id = "__cookbook-script";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);
  return null;
}
export {
  AskCookbook as default
};
