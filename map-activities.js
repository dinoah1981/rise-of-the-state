/* Rise of the State — real map activity extension.
 * Loaded after data.js and before app.js. Adds map-focused steps while leaving
 * the original state machine alone.
 */

(function () {
  "use strict";

  if (!window.GAME_DATA || !Array.isArray(window.GAME_DATA.ACTS)) return;

  const ACTS = window.GAME_DATA.ACTS;

  function ancientMapSvg() {
    return `<div class="geo-map-activity" data-map-kind="ancient">
      <div class="geo-map-frame">
        <svg class="geo-svg" viewBox="0 0 720 470" aria-label="Clickable map of the ancient Mediterranean and Mesopotamia">
          <rect class="geo-water" x="0" y="0" width="720" height="470"></rect>
          <path fill="#d7b16b" d="M0,82 C80,55 150,60 215,95 C285,132 350,125 418,100 C520,62 630,82 720,130 L720,470 L0,470 Z"></path>
          <path fill="#e7c985" d="M460,88 C530,70 605,78 720,125 L720,470 L515,470 C480,380 470,300 490,230 C510,162 470,130 460,88 Z"></path>
          <path fill="#c79b5e" d="M88,105 C135,105 182,130 210,168 C235,202 230,254 188,270 C145,286 112,240 88,198 C66,160 47,122 88,105 Z"></path>
          <path fill="#d5ac68" d="M236,86 C286,86 320,116 332,156 C342,194 316,222 276,222 C236,222 214,188 204,148 C194,110 208,90 236,86 Z"></path>
          <path fill="#d3a866" d="M340,176 C386,168 410,198 398,232 C386,266 344,274 315,252 C290,232 302,184 340,176 Z"></path>
          <path fill="#efd999" d="M560,156 C618,172 668,215 675,274 C680,326 637,356 590,330 C546,306 522,256 530,210 C535,180 542,161 560,156 Z"></path>
          <path class="geo-river" d="M565,112 C548,170 540,226 548,288 C552,320 542,352 523,386"></path>
          <path class="geo-river" d="M615,122 C596,186 592,234 610,296 C622,338 612,365 592,402"></path>
          <text class="geo-sea-label" x="225" y="310">Mediterranean Sea</text>
          <text class="geo-sea-label" x="560" y="86">Mesopotamia</text>
          <text class="geo-river-label" x="520" y="258" transform="rotate(-79 520 258)">Tigris</text>
          <text class="geo-river-label" x="645" y="260" transform="rotate(-72 645 260)">Euphrates</text>
          <polygon class="geo-mountain" points="230,118 244,86 258,118"></polygon>
          <polygon class="geo-mountain" points="258,130 274,96 292,130"></polygon>
          <polygon class="geo-mountain" points="286,138 302,104 318,138"></polygon>
          <polygon class="geo-mountain" points="322,132 338,98 354,132"></polygon>

          <g class="geo-hotspot" data-target="rome" aria-label="Rome" transform="translate(122 140)">
            <circle class="pin-ring" r="27"></circle><circle class="pin-core" r="12"></circle><text class="pin-label" y="49">Rome</text>
          </g>
          <g class="geo-hotspot" data-target="greece" aria-label="Greece and Athens" transform="translate(282 178)">
            <circle class="pin-ring" r="30"></circle><circle class="pin-core" r="13"></circle><text class="pin-label" y="53">Athens</text>
          </g>
          <g class="geo-hotspot" data-target="mesopotamia" aria-label="Mesopotamia, Sumer, and Babylon" transform="translate(585 260)">
            <circle class="pin-ring" r="42"></circle><circle class="pin-core" r="15"></circle><text class="pin-label" y="63">Sumer + Babylon</text>
          </g>
        </svg>
      </div>
      <aside class="geo-panel">
        <div class="geo-step-count">Map task</div>
        <p class="geo-prompt"></p>
        <p class="geo-clue"></p>
        <div class="geo-feedback" aria-live="polite"></div>
        <div class="geo-legend">
          <span class="geo-chip">🌊 Rivers</span>
          <span class="geo-chip">⛰️ Mountains</span>
          <span class="geo-chip">📍 Clickable places</span>
        </div>
        <div class="geo-complete"></div>
      </aside>
    </div>`;
  }

  function modernMapSvg() {
    return `<div class="geo-map-activity" data-map-kind="modern">
      <div class="geo-map-frame">
        <svg class="geo-svg" viewBox="0 0 720 470" aria-label="Clickable world map of nation-state development regions">
          <rect class="geo-water" x="0" y="0" width="720" height="470"></rect>
          <path fill="#d8b56d" d="M82,92 C142,70 204,92 226,145 C245,193 218,238 178,252 C135,267 81,245 55,198 C26,145 37,108 82,92 Z"></path>
          <path fill="#d0a262" d="M152,256 C196,266 225,314 212,366 C198,420 152,438 118,406 C88,378 99,327 120,289 C130,271 140,261 152,256 Z"></path>
          <path fill="#d9b66d" d="M330,96 C390,62 454,88 462,138 C470,184 424,212 372,198 C330,186 296,160 304,124 C307,111 316,102 330,96 Z"></path>
          <path fill="#dbb66d" d="M386,198 C430,200 455,244 442,300 C430,352 390,382 354,354 C322,328 324,272 344,232 C354,212 366,200 386,198 Z"></path>
          <path fill="#e0bd75" d="M470,118 C548,92 652,128 679,195 C706,262 666,310 590,298 C524,288 474,244 462,184 C456,154 458,128 470,118 Z"></path>
          <path fill="#d6ac68" d="M560,318 C616,306 666,330 675,374 C684,420 638,445 590,430 C548,416 522,384 532,348 C536,332 546,322 560,318 Z"></path>
          <text class="geo-sea-label" x="290" y="258">Atlantic</text>
          <text class="geo-sea-label" x="536" y="246">Indian Ocean</text>
          <text class="geo-land-label" x="103" y="177">Americas</text>
          <text class="geo-land-label" x="354" y="145">Europe</text>
          <text class="geo-land-label" x="394" y="292">Africa</text>
          <text class="geo-land-label" x="568" y="194">Asia</text>

          <g class="geo-hotspot" data-target="americas" aria-label="The Americas" transform="translate(142 178)">
            <circle class="pin-ring" r="45"></circle><circle class="pin-core" r="15"></circle><text class="pin-label" y="66">Americas</text>
          </g>
          <g class="geo-hotspot" data-target="europe" aria-label="Europe" transform="translate(376 132)">
            <circle class="pin-ring" r="38"></circle><circle class="pin-core" r="14"></circle><text class="pin-label" y="60">Europe</text>
          </g>
          <g class="geo-hotspot" data-target="africa-asia" aria-label="Africa and Asia" transform="translate(500 264)">
            <circle class="pin-ring" r="54"></circle><circle class="pin-core" r="16"></circle><text class="pin-label" y="77">Africa + Asia</text>
          </g>
        </svg>
      </div>
      <aside class="geo-panel">
        <div class="geo-step-count">Map task</div>
        <p class="geo-prompt"></p>
        <p class="geo-clue"></p>
        <div class="geo-feedback" aria-live="polite"></div>
        <div class="geo-legend">
          <span class="geo-chip">1776–1830s Americas</span>
          <span class="geo-chip">1789–1922 Europe</span>
          <span class="geo-chip">1947–1997 Africa/Asia</span>
        </div>
        <div class="geo-complete"></div>
      </aside>
    </div>`;
  }

  const ancientMapStep = {
    type: "reading",
    accent: "world",
    title: "Map lab: locate the geography behind government",
    body: `<p>This is an actual map task. You must complete the clickable map before continuing.</p>${ancientMapSvg()}`
  };

  const modernMapStep = {
    type: "reading",
    accent: "modern",
    title: "Map lab: independence movements redraw the world",
    body: `<p>Modern nation-states did not appear everywhere at the same time. Use the map to identify the major regional waves.</p>${modernMapSvg()}`
  };

  const mapBossQuestion = {
    question: "A map shows a region broken into mountains, narrow valleys, and islands, with many small independent poleis instead of one centralized river-valley kingdom. Which political development would this geography most help explain?",
    options: [
      "Sumerian kings gaining power through military control of canals",
      "Babylonian rulers gaining legitimacy through written law",
      "Athenian direct democracy based on citizen participation",
      "Modern decolonization creating new nation-states"
    ],
    correctIdx: 2,
    explanation: "Fragmented Greek geography made small city-states more likely. In Athens, that small scale helped make direct citizen participation possible."
  };

  function removeOldMapSteps(act) {
    if (!act || !Array.isArray(act.steps)) return;
    const oldTitles = new Set([
      "Map room: geography is not decoration — it explains power",
      "Map challenge: four city-states, four political inventions"
    ]);
    const oldPrompts = new Set([
      "Map activity: match each place to the geographic or social pressure that shaped its government.",
      "Map activity: sort these examples by what they show on the political map."
    ]);
    act.steps = act.steps.filter((s) => !oldTitles.has(s.title) && !oldPrompts.has(s.prompt));
  }

  ACTS.forEach(removeOldMapSteps);

  const act2 = ACTS.find((a) => a.id === "act2");
  if (act2 && Array.isArray(act2.steps) && !act2.steps.some((s) => s.title === ancientMapStep.title)) {
    act2.steps.splice(1, 0, ancientMapStep);
  }

  const act3 = ACTS.find((a) => a.id === "act3");
  if (act3 && Array.isArray(act3.steps) && !act3.steps.some((s) => s.title === modernMapStep.title)) {
    act3.steps.splice(1, 0, modernMapStep);
  }

  const bossAct = ACTS.find((a) => a.boss && a.boss.questions);
  if (bossAct && !bossAct.boss.questions.some((q) => q.question === mapBossQuestion.question)) {
    bossAct.boss.questions.splice(Math.min(3, bossAct.boss.questions.length), 0, mapBossQuestion);
    bossAct.boss.questions = bossAct.boss.questions.slice(0, 12);
  }
})();
