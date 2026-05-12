/* Rise of the State — map activity extension.
 * Loaded after data.js and before app.js. It adds map-rich readings and map-based
 * questions without changing the original game engine.
 */

(function () {
  "use strict";

  if (!window.GAME_DATA || !Array.isArray(window.GAME_DATA.ACTS)) return;

  const ACTS = window.GAME_DATA.ACTS;

  const worldMapReading = {
    type: "reading",
    accent: "world",
    title: "Map room: geography is not decoration — it explains power",
    body: `<div class="map-quest">
      <div class="ancient-map" role="img" aria-label="Stylized map showing Rome, Athens, Sumer, Babylon, and modern nation-states">
        <div class="map-label rome"><span>🏛️</span>Rome</div>
        <div class="map-label athens"><span>🗳️</span>Athens</div>
        <div class="map-label sumer"><span>⚔️</span>Sumer</div>
        <div class="map-label babylon"><span>📜</span>Babylon</div>
        <div class="map-label modern"><span>🗺️</span>Nation-states</div>
      </div>
      <div class="map-note">
        <h3>How to read this map</h3>
        <p>Every place on the map answers the same question: <b>why did this kind of state form here?</b></p>
        <ul>
          <li><b>River valleys</b> concentrate food, water, cities, and conflict.</li>
          <li><b>Mountains and islands</b> fragment power into smaller communities.</li>
          <li><b>Empires and colonies</b> later redraw the map into modern nation-states.</li>
        </ul>
      </div>
    </div>`
  };

  const ancientMapReading = {
    type: "reading",
    accent: "world",
    title: "Map challenge: four city-states, four political inventions",
    body: `<div class="map-quest">
      <div class="ancient-map" role="img" aria-label="Stylized ancient map with Rome, Athens, Sumer, and Babylon">
        <div class="map-label rome"><span>🏛️</span>Rome</div>
        <div class="map-label athens"><span>🗳️</span>Athens</div>
        <div class="map-label sumer"><span>⚔️</span>Sumer</div>
        <div class="map-label babylon"><span>📜</span>Babylon</div>
      </div>
      <div class="map-note">
        <h3>Look for the geographic clue</h3>
        <p><b>Sumer</b> and <b>Babylon</b> sit in Mesopotamia, between major rivers. Irrigation and surplus made cities possible, but also created conflict over canals and farmland.</p>
        <p><b>Athens</b> sits in a fragmented Greek landscape of mountains, coasts, and islands. That made small city-states more likely than one huge kingdom.</p>
        <p><b>Rome</b> sits on the Tiber, in a location good for trade and expansion — but its republican turn came from social conflict inside the city.</p>
      </div>
    </div>`
  };

  const ancientMapMatch = {
    type: "match",
    prompt: "Map activity: match each place to the geographic or social pressure that shaped its government.",
    pairs: [
      { left: "Sumer", right: "River-valley competition over canals and farmland", blurb: "Resource conflict helped turn successful military leaders into kings." },
      { left: "Babylon", right: "A conquered Mesopotamian empire needing one public legal system", blurb: "Hammurabi used written law to make authority visible and predictable across many cities." },
      { left: "Athens", right: "Fragmented Greek geography of mountains, islands, and small poleis", blurb: "Small political communities made direct citizen participation more realistic." },
      { left: "Rome", right: "A growing city divided between patricians and plebeians", blurb: "Class tension pushed Rome toward shared institutions instead of monarchy." }
    ]
  };

  const modernMapClassify = {
    type: "classify",
    prompt: "Map activity: sort these examples by what they show on the political map.",
    categories: [
      { id: "river", label: "🌊 River-valley state origins" },
      { id: "fragmented", label: "⛰️ Fragmented geography" },
      { id: "decolonization", label: "🗺️ Decolonization / new nation-state" }
    ],
    items: [
      { label: "Sumerian city-states", correctCategory: "river", explanation: "They grew in Mesopotamian river valleys where irrigation, surplus, and resource conflict shaped early monarchy." },
      { label: "Babylonian Empire", correctCategory: "river", explanation: "Babylon also emerged in Mesopotamia, where controlling many river-valley cities required public written law." },
      { label: "Greek poleis", correctCategory: "fragmented", explanation: "Greece's mountains and islands encouraged many smaller city-states instead of one centralized kingdom." },
      { label: "Athens", correctCategory: "fragmented", explanation: "Athens was a polis where small scale and citizen participation made direct democracy possible." },
      { label: "Ghana, 1957", correctCategory: "decolonization", explanation: "Modern Ghana became independent from British colonial rule, part of the 20th-century wave of decolonization." },
      { label: "India and Pakistan, 1947", correctCategory: "decolonization", explanation: "Their independence from British rule marks one of the most important moments in modern decolonization." }
    ]
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

  const act1 = ACTS.find((a) => a.id === "act1");
  if (act1 && Array.isArray(act1.steps) && !act1.steps.some((s) => s.title === worldMapReading.title)) {
    act1.steps.splice(1, 0, worldMapReading);
  }

  const act2 = ACTS.find((a) => a.id === "act2");
  if (act2 && Array.isArray(act2.steps)) {
    if (!act2.steps.some((s) => s.title === ancientMapReading.title)) {
      act2.steps.splice(1, 0, ancientMapReading);
    }
    if (!act2.steps.some((s) => s.prompt === ancientMapMatch.prompt)) {
      const capstoneIdx = act2.steps.findIndex((s) => s.type === "match" && /Capstone/.test(s.prompt || ""));
      act2.steps.splice(capstoneIdx >= 0 ? capstoneIdx : act2.steps.length - 1, 0, ancientMapMatch);
    }
  }

  const act3 = ACTS.find((a) => a.id === "act3");
  if (act3 && Array.isArray(act3.steps) && !act3.steps.some((s) => s.prompt === modernMapClassify.prompt)) {
    const badgeIdx = act3.steps.findIndex((s) => s.type === "badge");
    act3.steps.splice(badgeIdx >= 0 ? badgeIdx : act3.steps.length, 0, modernMapClassify);
  }

  const bossAct = ACTS.find((a) => a.boss && a.boss.questions);
  if (bossAct && !bossAct.boss.questions.some((q) => q.question === mapBossQuestion.question)) {
    bossAct.boss.questions.splice(Math.min(3, bossAct.boss.questions.length), 0, mapBossQuestion);
    bossAct.boss.questions = bossAct.boss.questions.slice(0, 12);
  }
})();
