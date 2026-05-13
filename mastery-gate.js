/* Mastery gate for Rise of the State.
 * Prevents students from progressing past scored activities until they answer correctly.
 * Works as a thin layer on top of the existing engine: incorrect attempts become
 * a Try Again button that reloads the saved current step rather than advancing.
 */

(function () {
  "use strict";

  const gatedScreens = [
    { screen: "screen-mcq", feedback: "mc-fb", next: "mc-next", retryText: "Try again →" },
    { screen: "screen-decision", feedback: "dc-fb", next: "dc-next", retryText: "Try again →" },
    { screen: "screen-classify", feedback: "cl-fb", next: "cl-next", retryText: "Fix and try again →" },
    { screen: "screen-order", feedback: "or-fb", next: "or-next", retryText: "Fix and try again →" }
  ];

  function byId(id) {
    return document.getElementById(id);
  }

  function isWrong(feedback) {
    return feedback && !feedback.hidden && feedback.classList.contains("wrong");
  }

  function markRetry(next, text) {
    if (!next || next.hidden) return;
    if (next.dataset.masteryRetry === "1") return;
    next.dataset.masteryRetry = "1";
    next.dataset.originalText = next.textContent;
    next.textContent = text;
    next.classList.add("mastery-retry");
    next.title = "You need a correct answer before moving on.";
  }

  function clearRetry(next) {
    if (!next || next.dataset.masteryRetry !== "1") return;
    next.textContent = next.dataset.originalText || "Continue →";
    delete next.dataset.masteryRetry;
    delete next.dataset.originalText;
    next.classList.remove("mastery-retry");
    next.removeAttribute("title");
  }

  function scan() {
    gatedScreens.forEach((cfg) => {
      const screen = byId(cfg.screen);
      const feedback = byId(cfg.feedback);
      const next = byId(cfg.next);
      if (!screen || !screen.classList.contains("active") || !next) return;
      if (isWrong(feedback)) markRetry(next, cfg.retryText);
      else clearRetry(next);
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target && event.target.closest ? event.target.closest("button") : null;
    if (!target || target.dataset.masteryRetry !== "1") return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    target.disabled = true;
    target.textContent = "Reloading this question…";
    window.location.reload();
  }, true);

  const observer = new MutationObserver(scan);
  document.addEventListener("DOMContentLoaded", () => {
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "hidden", "style", "data-mastery-retry"]
    });
    scan();
  });

  document.addEventListener("click", () => setTimeout(scan, 0));
  document.addEventListener("keyup", () => setTimeout(scan, 0));
})();
