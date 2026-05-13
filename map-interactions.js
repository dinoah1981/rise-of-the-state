/* Real interactive map tasks for Rise of the State.
 * This script activates .geo-map-activity blocks injected by map-activities.js.
 */

(function () {
  "use strict";

  const tasks = {
    ancient: [
      {
        answer: "mesopotamia",
        prompt: "Click the river-valley region where Sumer and Babylon developed.",
        clue: "Look for the two major rivers. Irrigation, surplus, and water conflict mattered here.",
        good: "Correct — Mesopotamia sits between the Tigris and Euphrates. This geography helps explain Sumerian kings and Babylonian written law.",
        bad: "Not that region. Look for the two rivers that run through the same fertile zone."
      },
      {
        answer: "greece",
        prompt: "Click the fragmented mountain-and-island region that helped produce many poleis.",
        clue: "This is the region connected to Athens and direct democracy.",
        good: "Correct — Greece's mountains, islands, and narrow valleys made small city-states more likely than one giant kingdom.",
        bad: "Not there. Athens was in the broken-up Greek landscape, not a big river valley."
      },
      {
        answer: "rome",
        prompt: "Click the city whose republican government grew out of class conflict between patricians and plebeians.",
        clue: "Find the marker on the Italian peninsula near the Tiber River.",
        good: "Correct — Rome's location helped it grow, but its republic came from internal class struggle and shared institutions.",
        bad: "Not that city. Rome is west of Greece, on the Italian peninsula."
      }
    ],
    modern: [
      {
        answer: "americas",
        prompt: "Click the first broad region where modern independence movements created many nation-states.",
        clue: "Think U.S., Haiti, Mexico, and much of South America from the late 1700s to early 1800s.",
        good: "Correct — the Americas saw an early wave of anti-colonial nation-state formation.",
        bad: "Not that region. The earliest broad wave in this lesson is across the Atlantic from Europe."
      },
      {
        answer: "africa-asia",
        prompt: "Click the region linked to the huge 20th-century wave of decolonization.",
        clue: "Think India and Pakistan in 1947, Ghana in 1957, and many later independence movements.",
        good: "Correct — Africa and Asia saw many new nation-states emerge after European empires weakened.",
        bad: "Not quite. Look for the area associated with India, Ghana, and post-WWII decolonization."
      },
      {
        answer: "europe",
        prompt: "Click the region where nationalism helped break apart old empires after revolutions and world wars.",
        clue: "Think French Revolution, Italian/German unification, and the collapse of empires after World War I.",
        good: "Correct — Europe helped spread nationalism and saw empires fracture into nation-states.",
        bad: "Not that region. Look for the old European imperial core."
      }
    ]
  };

  function initActivity(activity) {
    if (activity.dataset.ready === "1") return;
    activity.dataset.ready = "1";

    const kind = activity.dataset.mapKind || "ancient";
    const sequence = tasks[kind] || tasks.ancient;
    let idx = 0;
    let misses = 0;

    const count = activity.querySelector(".geo-step-count");
    const prompt = activity.querySelector(".geo-prompt");
    const clue = activity.querySelector(".geo-clue");
    const feedback = activity.querySelector(".geo-feedback");
    const complete = activity.querySelector(".geo-complete");
    const continueBtn = activity.closest(".card")?.querySelector("#rd-next");

    if (continueBtn) continueBtn.disabled = true;

    function paint() {
      const task = sequence[idx];
      if (!task) {
        activity.classList.add("is-complete");
        if (feedback) {
          feedback.className = "geo-feedback good";
          feedback.innerHTML = `<strong>Map complete.</strong>You finished the map task with ${misses} ${misses === 1 ? "miss" : "misses"}.`;
        }
        if (complete) complete.textContent = "Map complete — you can continue.";
        if (continueBtn) continueBtn.disabled = false;
        return;
      }
      if (count) count.textContent = `Map task ${idx + 1} of ${sequence.length}`;
      if (prompt) prompt.textContent = task.prompt;
      if (clue) clue.textContent = task.clue;
      if (feedback) {
        feedback.className = "geo-feedback";
        feedback.innerHTML = "Click a labeled region or city marker on the map.";
      }
      activity.querySelectorAll(".geo-hotspot").forEach((h) => h.classList.remove("is-correct", "is-wrong"));
    }

    activity.querySelectorAll(".geo-hotspot").forEach((hotspot) => {
      hotspot.setAttribute("tabindex", "0");
      hotspot.setAttribute("role", "button");

      function choose() {
        const task = sequence[idx];
        if (!task) return;
        const picked = hotspot.dataset.target;
        const ok = picked === task.answer;
        hotspot.classList.remove("is-wrong", "is-correct");
        void hotspot.getBoundingClientRect();
        hotspot.classList.add(ok ? "is-correct" : "is-wrong");
        if (feedback) {
          feedback.className = "geo-feedback " + (ok ? "good" : "bad");
          feedback.innerHTML = `<strong>${ok ? "Correct." : "Try again."}</strong>${ok ? task.good : task.bad}`;
        }
        if (ok) {
          idx += 1;
          setTimeout(paint, 1100);
        } else {
          misses += 1;
        }
      }

      hotspot.addEventListener("click", choose);
      hotspot.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          choose();
        }
      });
    });

    paint();
  }

  function initAll() {
    document.querySelectorAll(".geo-map-activity").forEach(initActivity);
  }

  document.addEventListener("DOMContentLoaded", initAll);
  document.addEventListener("click", () => setTimeout(initAll, 0));
  window.addEventListener("hashchange", initAll);

  const observer = new MutationObserver(initAll);
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
