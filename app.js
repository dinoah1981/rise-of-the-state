/* Rise of the State — main game logic.
 * State machine that walks players through Acts I–V, awards LP and badges,
 * runs the boss exam, and produces a shareable summary at the end.
 */

(function () {
  "use strict";

  const ACTS = window.GAME_DATA.ACTS;
  const SAVE_KEY = "pgg-rise-of-the-state-v1";

  // --------------------------- Helpers
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  // --------------------------- State
  const state = {
    name: "",
    period: "",
    actIdx: 0,
    stepIdx: 0,
    lp: 0,
    badges: [],
    answers: [],     // {act, type, question, correct, given, right, lp}
    bossIdx: 0,
    bossCorrect: 0,
    bossAnswers: [],
    startTime: null,
  };

  // --------------------------- Screen routing
  function show(id) {
    $$(".screen").forEach((s) => s.classList.remove("active"));
    $("#" + id).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function setAccent(accent) {
    document.body.dataset.accent = accent || "world";
  }
  function bumpLP(amt) {
    state.lp += amt;
    const el = $("#lp-num");
    el.textContent = state.lp;
    const pill = el.closest(".lp-pill");
    pill.classList.remove("bump");
    void pill.offsetWidth;
    pill.classList.add("bump");
  }
  function drawBadges() {
    const tray = $("#badges-tray");
    tray.innerHTML = "";
    state.badges.forEach((b) => {
      const c = el("div", "badge-chip", b.emoji);
      c.title = b.name + " — " + b.description;
      tray.appendChild(c);
    });
  }
  function updateProgress() {
    // Roughly proportional to acts completed + steps in current act.
    const totalSteps = ACTS.reduce((sum, a) => sum + (a.steps ? a.steps.length : 12) + 1, 0);
    let cumulative = 0;
    for (let i = 0; i < state.actIdx; i++) {
      cumulative += (ACTS[i].steps ? ACTS[i].steps.length : 12) + 1;
    }
    cumulative += state.stepIdx;
    const pct = Math.min(100, Math.round((cumulative / totalSteps) * 100));
    $("#progress-fill").style.width = pct + "%";
  }
  function updateActLabel() {
    const act = ACTS[state.actIdx];
    if (act) $("#hud-act").textContent = act.title;
  }

  // --------------------------- Save / load
  function save() {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function loadIfAny() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) { return null; }
  }
  function clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

  // --------------------------- Welcome
  function bindWelcome() {
    $("#start-btn").addEventListener("click", () => {
      const n = $("#name").value.trim();
      const p = $("#period").value.trim();
      if (!n) { $("#name").focus(); $("#name").style.borderColor = "var(--bad)"; return; }
      state.name = n; state.period = p;
      state.actIdx = 0; state.stepIdx = 0; state.startTime = Date.now();
      save();
      enterAct();
    });
  }

  // --------------------------- Act flow
  function enterAct() {
    const act = ACTS[state.actIdx];
    if (!act) return finalReport();
    setAccent(act.accent || "world");
    updateActLabel();
    updateProgress();
    if (act.boss) {
      // Show boss intro
      show("screen-boss-intro");
      $("#boss-go").onclick = () => { state.bossIdx = 0; state.bossCorrect = 0; state.bossAnswers = []; renderBossQ(); };
      return;
    }
    // Standard act intro
    show("screen-act-intro");
    $("#ai-kicker").textContent = "Act " + (state.actIdx + 1) + " of " + ACTS.length;
    $("#ai-title").textContent  = act.title;
    $("#ai-sub").innerHTML      = act.intro || "";
    $("#ai-go").onclick = () => { state.stepIdx = 0; renderStep(); };
  }

  function renderStep() {
    const act = ACTS[state.actIdx];
    const step = act.steps[state.stepIdx];
    if (!step) {
      state.actIdx++;
      state.stepIdx = 0;
      save();
      return enterAct();
    }
    setAccent(step.accent || act.accent || "world");
    updateProgress();
    save();

    switch (step.type) {
      case "reading":  return renderReading(step);
      case "mcq":      return renderMCQ(step);
      case "classify": return renderClassify(step);
      case "decision": return renderDecision(step);
      case "order":    return renderOrder(step);
      case "match":    return renderMatch(step);
      case "badge":    return renderBadge(step);
      case "actEnd":   return renderActEnd(step);
      default:
        console.warn("Unknown step type", step.type);
        return advance();
    }
  }
  function advance() {
    state.stepIdx++;
    renderStep();
  }

  // --------------------------- Reading
  function renderReading(step) {
    show("screen-reading");
    $("#rd-kicker").textContent = ACTS[state.actIdx].title;
    $("#rd-title").textContent = step.title || "";
    $("#rd-body").innerHTML = step.body;
    $("#rd-next").onclick = advance;
  }

  // --------------------------- MCQ
  function renderMCQ(step) {
    show("screen-mcq");
    $("#mc-kicker").textContent = ACTS[state.actIdx].title;
    $("#mc-q").innerHTML = step.question;
    const host = $("#mc-options");
    host.innerHTML = "";
    const fb = $("#mc-fb"); fb.hidden = true; fb.className = "feedback";
    const next = $("#mc-next"); next.hidden = true;
    step.options.forEach((text, i) => {
      const b = el("button", "option");
      b.appendChild(el("span", "marker", String.fromCharCode(65 + i)));
      b.appendChild(el("span", "lbl", text));
      b.onclick = () => {
        if (b.dataset.locked) return;
        host.querySelectorAll(".option").forEach((o) => { o.dataset.locked = "1"; o.classList.add("disabled"); });
        const correct = i === step.correctIdx;
        b.classList.add(correct ? "correct" : "wrong");
        if (!correct) host.children[step.correctIdx].classList.add("correct");
        const lp = correct ? 10 : 0;
        if (correct) bumpLP(lp);
        state.answers.push({ act: state.actIdx, type: "mcq", q: stripHtml(step.question), given: text, right: step.options[step.correctIdx], correct, lp });
        fb.hidden = false;
        fb.classList.add(correct ? "correct" : "wrong");
        fb.innerHTML = "<h3>" + (correct ? "+10 LP — Right." : "Not quite.") + "</h3><p>" + step.explanation + "</p>";
        next.hidden = false;
      };
      host.appendChild(b);
    });
    next.onclick = advance;
  }

  // --------------------------- Classify
  function renderClassify(step) {
    show("screen-classify");
    $("#cl-kicker").textContent = ACTS[state.actIdx].title;
    $("#cl-q").innerHTML = step.prompt;
    const fb = $("#cl-fb"); fb.hidden = true; fb.className = "feedback";
    $("#cl-next").hidden = true;
    $("#cl-check").disabled = false;
    $("#cl-reset").disabled = false;

    const pool = $("#cl-pool");
    const buckets = $("#cl-buckets");
    pool.innerHTML = "";
    buckets.innerHTML = "";

    // build buckets
    step.categories.forEach((c) => {
      const b = el("div", "bucket");
      b.dataset.cat = c.id;
      b.appendChild(el("div", "bucket-title", c.label));
      const inner = el("div", "bucket-inner");
      b.appendChild(inner);
      buckets.appendChild(b);

      // drop targets
      b.addEventListener("dragover", (e) => { e.preventDefault(); b.classList.add("over"); });
      b.addEventListener("dragleave", () => b.classList.remove("over"));
      b.addEventListener("drop", (e) => {
        e.preventDefault();
        b.classList.remove("over");
        const cardId = e.dataTransfer.getData("text/plain");
        const card = document.getElementById(cardId);
        if (card) inner.appendChild(card);
      });
      // tap-to-place
      b.addEventListener("click", () => {
        const sel = pool.querySelector(".classify-card.selected") || document.querySelector(".classify-card.selected");
        if (sel) {
          sel.classList.remove("selected");
          inner.appendChild(sel);
        }
      });
    });

    // build cards (shuffled)
    const itemsShuf = shuffle([...step.items]);
    itemsShuf.forEach((it, idx) => {
      const c = el("div", "classify-card", it.label);
      c.id = "ci_" + idx;
      c.draggable = true;
      c.dataset.correct = it.correctCategory;
      c.dataset.label = it.label;
      c.dataset.explanation = it.explanation || "";
      c.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", c.id);
        e.dataTransfer.effectAllowed = "move";
      });
      c.addEventListener("click", (e) => {
        e.stopPropagation();
        // toggle selected
        if (c.classList.contains("selected")) { c.classList.remove("selected"); return; }
        $$(".classify-card.selected").forEach((s) => s.classList.remove("selected"));
        c.classList.add("selected");
      });
      pool.appendChild(c);
    });

    $("#cl-reset").onclick = () => {
      // move everything back to pool
      $$(".classify-card").forEach((c) => pool.appendChild(c));
      $$(".classify-card").forEach((c) => c.classList.remove("correct","wrong"));
      fb.hidden = true; fb.className = "feedback";
    };

    $("#cl-check").onclick = () => {
      let right = 0, total = 0;
      const explanations = [];
      buckets.querySelectorAll(".bucket").forEach((b) => {
        const cat = b.dataset.cat;
        b.querySelectorAll(".classify-card").forEach((card) => {
          total++;
          const ok = card.dataset.correct === cat;
          card.classList.add(ok ? "correct" : "wrong");
          if (ok) right++;
          else explanations.push("<b>" + card.dataset.label + "</b> — " + card.dataset.explanation);
        });
      });
      // ungrouped cards
      pool.querySelectorAll(".classify-card").forEach((card) => {
        total++;
        card.classList.add("wrong");
        explanations.push("<b>" + card.dataset.label + "</b> didn't get placed. " + card.dataset.explanation);
      });
      const allRight = right === step.items.length;
      const lp = allRight ? 25 : Math.max(0, right * 3 - (total - right) * 2);
      if (lp > 0) bumpLP(lp);
      state.answers.push({ act: state.actIdx, type: "classify", q: stripHtml(step.prompt), correct: allRight, given: right + "/" + step.items.length, right: "all in right buckets", lp });
      fb.hidden = false;
      fb.classList.add(allRight ? "correct" : "wrong");
      fb.innerHTML = "<h3>" + (allRight ? "+25 LP — Perfect sort." : "+" + lp + " LP — " + right + " of " + step.items.length + " correct.") + "</h3>" +
                     "<p>" + (explanations.length ? explanations.join("<br>") : "Every card placed correctly.") + "</p>";
      $("#cl-check").disabled = true;
      $("#cl-reset").disabled = true;
      $("#cl-next").hidden = false;
    };
    $("#cl-next").onclick = advance;
  }

  // --------------------------- Decision
  function renderDecision(step) {
    show("screen-decision");
    $("#dc-kicker").textContent = ACTS[state.actIdx].title;
    $("#dc-scenario").innerHTML = step.scenario;
    $("#dc-prompt").innerHTML = step.prompt;
    const host = $("#dc-options");
    host.innerHTML = "";
    const fb = $("#dc-fb"); fb.hidden = true; fb.className = "feedback";
    $("#dc-next").hidden = true;

    step.options.forEach((opt) => {
      const c = el("button", "decision-card");
      c.appendChild(el("span", "lbl", opt.label));
      c.onclick = () => {
        $$(".decision-card").forEach((d) => { d.classList.add("locked"); });
        c.classList.add(opt.correct ? "correct" : "wrong");
        // append outcome
        const out = el("div", "decision-outcome");
        out.innerHTML = opt.outcome;
        c.appendChild(out);
        const lp = opt.correct ? 15 : 0;
        if (opt.correct) bumpLP(lp);
        state.answers.push({ act: state.actIdx, type: "decision", q: stripHtml(step.prompt), given: opt.label, correct: opt.correct, right: "(see scenario)", lp });
        fb.hidden = false;
        fb.classList.add(opt.correct ? "correct" : "wrong");
        fb.innerHTML = "<h3>" + (opt.correct ? "+15 LP — Historically accurate." : "That's not how this one played out.") + "</h3><p>" + (opt.correct ? "Move on with confidence." : "Read the outcome above carefully — it explains what really happened.") + "</p>";
        $("#dc-next").hidden = false;
      };
      host.appendChild(c);
    });
    $("#dc-next").onclick = advance;
  }

  // --------------------------- Order
  function renderOrder(step) {
    show("screen-order");
    $("#or-kicker").textContent = ACTS[state.actIdx].title;
    $("#or-q").innerHTML = step.prompt;
    const list = $("#or-list");
    list.innerHTML = "";
    const fb = $("#or-fb"); fb.hidden = true; fb.className = "feedback";
    $("#or-next").hidden = true;
    $("#or-check").disabled = false;
    $("#or-shuffle").disabled = false;

    let order = shuffle(step.items.map((it, i) => ({ ...it, _i: i })));
    let dragging = null;
    let selected = null;

    function paint() {
      list.innerHTML = "";
      order.forEach((it, idx) => {
        const li = el("li", "order-item");
        li.draggable = true;
        li.appendChild(el("span", "num", (idx + 1) + "."));
        li.appendChild(el("span", "grip", "≡"));
        li.appendChild(el("span", "lbl", it.label));
        li.dataset.i = it._i;
        li.addEventListener("dragstart", (e) => {
          dragging = it._i;
          li.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });
        li.addEventListener("dragend", () => { li.classList.remove("dragging"); $$(".order-item").forEach((n) => n.classList.remove("over")); });
        li.addEventListener("dragover", (e) => { e.preventDefault(); li.classList.add("over"); });
        li.addEventListener("dragleave", () => li.classList.remove("over"));
        li.addEventListener("drop", (e) => {
          e.preventDefault();
          li.classList.remove("over");
          if (dragging == null) return;
          const fromIdx = order.findIndex((x) => x._i === dragging);
          const toIdx = order.findIndex((x) => x._i === Number(li.dataset.i));
          if (fromIdx < 0 || toIdx < 0 || fromIdx === toIdx) return;
          const [m] = order.splice(fromIdx, 1);
          order.splice(toIdx, 0, m);
          paint();
        });
        // tap to swap
        li.addEventListener("click", () => {
          if (li.dataset.locked) return;
          if (selected === li) { li.classList.remove("selected"); selected = null; return; }
          if (selected) {
            const a = order.findIndex((x) => x._i === Number(selected.dataset.i));
            const b = order.findIndex((x) => x._i === Number(li.dataset.i));
            const [m] = order.splice(a, 1);
            order.splice(b, 0, m);
            selected.classList.remove("selected");
            selected = null;
            paint();
          } else {
            li.classList.add("selected");
            selected = li;
          }
        });
        list.appendChild(li);
      });
    }
    paint();

    $("#or-shuffle").onclick = () => { order = shuffle(order); paint(); };
    $("#or-check").onclick = () => {
      const expectedByOrder = step.items.map((it, idx) => ({ ...it, _i: idx })).sort((a,b) => a.order - b.order);
      let right = 0;
      const orderItems = Array.from(list.children);
      orderItems.forEach((node, idx) => {
        node.dataset.locked = "1";
        const guessIdx = Number(node.dataset.i);
        const expectedIdx = expectedByOrder[idx]._i;
        if (guessIdx === expectedIdx) { node.classList.add("correct-pos"); right++; }
        else node.classList.add("wrong-pos");
      });
      const allRight = right === step.items.length;
      const lp = allRight ? 20 : Math.max(0, right * 3);
      if (lp > 0) bumpLP(lp);
      state.answers.push({ act: state.actIdx, type: "order", q: stripHtml(step.prompt), correct: allRight, given: order.map((o) => o.label).join(" → "), right: expectedByOrder.map((o) => o.label).join(" → "), lp });
      fb.hidden = false;
      fb.classList.add(allRight ? "correct" : "wrong");
      fb.innerHTML = "<h3>" + (allRight ? "+20 LP — Correct order." : "+" + lp + " LP — " + right + " of " + step.items.length + " in the right slot.") + "</h3><p>" + step.explanation + "</p>";
      $("#or-check").disabled = true;
      $("#or-shuffle").disabled = true;
      $("#or-next").hidden = false;
    };
    $("#or-next").onclick = advance;
  }

  // --------------------------- Match
  function renderMatch(step) {
    show("screen-match");
    $("#mt-kicker").textContent = ACTS[state.actIdx].title;
    $("#mt-q").innerHTML = step.prompt;
    const L = $("#mt-lefts"), R = $("#mt-rights");
    L.innerHTML = ""; R.innerHTML = "";
    const fb = $("#mt-fb"); fb.hidden = true; fb.className = "feedback";
    $("#mt-next").hidden = true;

    const lefts  = shuffle(step.pairs.map((p, i) => ({ ...p, _i: i })));
    const rights = shuffle(step.pairs.map((p, i) => ({ ...p, _i: i })));
    let selected = null;
    let wrongCount = 0;
    let matched = 0;

    function makeCard(host, side, item) {
      const c = el("button", "match-card");
      c.appendChild(el("span", "lbl", side === "L" ? item.left : item.right));
      c.dataset.i = item._i;
      c.dataset.side = side;
      c.onclick = () => {
        if (c.classList.contains("locked")) return;
        if (selected === c) { c.classList.remove("selected"); selected = null; return; }
        if (!selected) { c.classList.add("selected"); selected = c; return; }
        // attempt a match
        if (selected.dataset.side === c.dataset.side) {
          // both same side — swap selection
          selected.classList.remove("selected");
          c.classList.add("selected");
          selected = c;
          return;
        }
        const ok = selected.dataset.i === c.dataset.i;
        if (ok) {
          selected.classList.remove("selected");
          selected.classList.add("matched","locked");
          c.classList.add("matched","locked");
          // append blurb
          const pair = step.pairs[Number(c.dataset.i)];
          const tagL = el("span","pair-tag","✓");
          const tagR = el("span","pair-tag","✓");
          selected.appendChild(tagL);
          c.appendChild(tagR);
          if (pair.blurb) {
            const bl = el("span","blurb", pair.blurb);
            // attach to whichever is on the right column
            (c.dataset.side === "R" ? c : selected).appendChild(bl);
          }
          selected = null;
          matched++;
          if (matched === step.pairs.length) {
            const lp = Math.max(0, 25 - wrongCount * 3);
            if (lp > 0) bumpLP(lp);
            state.answers.push({ act: state.actIdx, type: "match", q: stripHtml(step.prompt), correct: wrongCount === 0, given: "All matched, " + wrongCount + " misses", right: "all pairs correct", lp });
            fb.hidden = false;
            fb.classList.add(wrongCount === 0 ? "correct" : "wrong");
            fb.innerHTML = "<h3>" + (wrongCount === 0 ? "+25 LP — Flawless." : "+" + lp + " LP — " + wrongCount + " miss" + (wrongCount > 1 ? "es" : "") + " before completing.") + "</h3><p>All pairs are now revealed — read the short notes for each.</p>";
            $("#mt-next").hidden = false;
          }
        } else {
          wrongCount++;
          selected.classList.add("wrong-flash");
          c.classList.add("wrong-flash");
          const t1 = selected, t2 = c;
          setTimeout(() => { t1.classList.remove("wrong-flash","selected"); t2.classList.remove("wrong-flash"); selected = null; }, 420);
        }
      };
      host.appendChild(c);
    }
    lefts.forEach((it) => makeCard(L, "L", it));
    rights.forEach((it) => makeCard(R, "R", it));

    $("#mt-next").onclick = advance;
  }

  // --------------------------- Badge unlock
  function renderBadge(step) {
    show("screen-badge");
    $("#bg-emoji").textContent = step.emoji;
    $("#bg-name").textContent = step.name;
    $("#bg-desc").textContent = step.description;
    if (!state.badges.find((b) => b.id === step.id)) {
      state.badges.push({ id: step.id, name: step.name, emoji: step.emoji, description: step.description });
      drawBadges();
      bumpLP(15);
    }
    $("#bg-next").onclick = advance;
  }

  // --------------------------- Act end
  function renderActEnd(step) {
    show("screen-act-end");
    $("#ae-title").textContent = step.title || "End of act";
    $("#ae-body").innerHTML = step.body || "";
    $("#ae-next").onclick = advance;
  }

  // --------------------------- Boss
  function renderBossQ() {
    const act = ACTS[state.actIdx];
    const questions = act.boss.questions;
    if (state.bossIdx >= questions.length) return renderBossEnd();
    show("screen-boss");
    setAccent("boss");
    const q = questions[state.bossIdx];
    $("#boss-counter").textContent = "Question " + (state.bossIdx + 1) + " of " + questions.length;
    $("#boss-score").textContent = state.bossCorrect + " correct";
    $("#boss-bar-fill").style.width = ((state.bossIdx / questions.length) * 100) + "%";
    $("#bq-q").innerHTML = q.question;
    const host = $("#bq-options");
    host.innerHTML = "";
    const fb = $("#bq-fb"); fb.hidden = true; fb.className = "feedback";
    $("#bq-next").hidden = true;
    q.options.forEach((text, i) => {
      const b = el("button", "option");
      b.appendChild(el("span", "marker", String.fromCharCode(65 + i)));
      b.appendChild(el("span", "lbl", text));
      b.onclick = () => {
        if (b.dataset.locked) return;
        host.querySelectorAll(".option").forEach((o) => { o.dataset.locked = "1"; o.classList.add("disabled"); });
        const correct = i === q.correctIdx;
        b.classList.add(correct ? "correct" : "wrong");
        if (!correct) host.children[q.correctIdx].classList.add("correct");
        if (correct) { state.bossCorrect++; bumpLP(20); }
        state.bossAnswers.push({ q: stripHtml(q.question), given: text, right: q.options[q.correctIdx], correct });
        fb.hidden = false;
        fb.classList.add(correct ? "correct" : "wrong");
        fb.innerHTML = "<h3>" + (correct ? "+20 LP — Right." : "Wrong — but you'll see the answer.") + "</h3><p>" + q.explanation + "</p>";
        $("#bq-next").hidden = false;
      };
      host.appendChild(b);
    });
    $("#bq-next").onclick = () => { state.bossIdx++; renderBossQ(); };
  }
  function renderBossEnd() {
    finalReport();
  }

  // --------------------------- Final
  function finalReport() {
    show("screen-final");
    setAccent("boss");
    const act = ACTS[ACTS.length - 1];
    const titles = act.boss.titles;
    const found = titles.find((t) => state.bossCorrect >= t.min) || titles[titles.length - 1];
    const minutes = Math.max(1, Math.round((Date.now() - (state.startTime || Date.now())) / 60000));
    $("#fn-emoji").textContent = found.emoji;
    $("#fn-title-name").textContent = "You earned the title of " + found.label;
    $("#fn-blurb").innerHTML = found.blurb + " <br><span class='muted'>Boss score: " + state.bossCorrect + " of " + act.boss.questions.length + ".</span>";
    $("#fn-score").textContent = state.bossCorrect + " / " + act.boss.questions.length;
    $("#fn-lp").textContent = state.lp;
    $("#fn-badges").textContent = state.badges.length;
    $("#fn-time").textContent = minutes;
    const badgeRow = $("#fn-badge-row");
    badgeRow.innerHTML = "";
    state.badges.forEach((b) => {
      const c = el("div","badge-chip", b.emoji);
      c.title = b.name + " — " + b.description;
      badgeRow.appendChild(c);
    });
    // Boss report
    const rep = $("#fn-report");
    rep.innerHTML = "";
    state.bossAnswers.forEach((a, i) => {
      const row = el("div", "report-row " + (a.correct ? "right" : "wrong"));
      row.appendChild(el("div","badge", a.correct ? "✓" : "✗"));
      const main = el("div");
      main.appendChild(el("div","", "Q" + (i + 1) + ": " + a.q));
      if (!a.correct) main.appendChild(el("div","muted micro", "Your answer: " + a.given + " — Correct: " + a.right));
      row.appendChild(main);
      rep.appendChild(row);
    });
    $("#fn-copy").onclick = () => copyResult(found, minutes);
    $("#fn-restart").onclick = () => {
      clearSave();
      location.reload();
    };
    clearSave(); // session done
  }

  function copyResult(title, minutes) {
    const lines = [];
    const act = ACTS[ACTS.length - 1];
    lines.push("Rise of the State — PGG Unit 5 Lessons 11.1 & 11.2");
    lines.push("");
    lines.push("Player: " + state.name + (state.period ? " (Period " + state.period + ")" : ""));
    lines.push("Date: " + new Date().toISOString().slice(0,10));
    lines.push("Title earned: " + title.emoji + " " + title.label);
    lines.push("Boss score: " + state.bossCorrect + " / " + act.boss.questions.length);
    lines.push("Total LP: " + state.lp);
    lines.push("Badges: " + state.badges.map((b) => b.emoji + " " + b.name).join(", "));
    lines.push("Minutes played: " + minutes);
    lines.push("");
    lines.push("Boss exam answers:");
    state.bossAnswers.forEach((a, i) => {
      lines.push("  Q" + (i + 1) + " " + (a.correct ? "✓" : "✗") + " — " + a.q);
      if (!a.correct) lines.push("    Your answer: " + a.given + " | Correct: " + a.right);
    });
    const text = lines.join("\n");
    navigator.clipboard.writeText(text).then(() => {
      $("#fn-copy").textContent = "Copied ✓";
      setTimeout(() => { $("#fn-copy").textContent = "Copy result to clipboard"; }, 1800);
    }).catch(() => {
      // Fallback: textarea select
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); $("#fn-copy").textContent = "Copied ✓"; } catch(e) {}
      ta.remove();
    });
  }

  // --------------------------- Utilities
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function stripHtml(s) { return String(s || "").replace(/<[^>]+>/g, ""); }

  // --------------------------- Boot
  document.addEventListener("DOMContentLoaded", () => {
    bindWelcome();
    show("screen-welcome");
    // we deliberately don't auto-resume; teachers want a clean start
  });
})();
