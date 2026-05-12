Rise of the State
A self-contained, gamified interactive lesson for PGG Unit 5, Lessons 11.1 & 11.2 — the development of the state (Sumer, Babylon, Athens, Rome) and the modern nation-state. Built for 9th-grade self-pacing in roughly 30–40 minutes.

Run it
No build step. No dependencies.

Online: drop the four files into any static host (GitHub Pages, Netlify, Vercel, a /public folder, etc.) and open index.html.
Offline: unzip and double-click index.html. Works fully from disk.
Structure
A 5-act journey rather than a quiz. Each act earns Legitimacy Points (LP) and badges. The final act is a 12-question boss exam that awards a title.

Act	Theme	Mechanics
I — What Is a State?	Defines a "state" in the global-history sense	Drag-to-bucket classification (China vs. UN vs. Ohio vs. Kurdistan) + definition MCQ → 🔍 Classifier
II — The Four Founders	One mini-quest per ancient city-state, each with its own visual theme	Story-style reading → decision moment (you choose a path, see what historically happened) → MCQ → badge. Capped with a city-state ↔ innovation matching game. Earns: ⚔️ Lugal, 📜 Lawgiver, 🗳️ Citizen of Athens, 🏛️ Senator
III — City-State → Nation-State	The 12,000-year gap and modern nation-state formation	Drag-to-order causal chain (state → competition → empires → colonization → independence) + region-to-era matching → 🗺️ Cartographer of Nations
IV — Tricky Cases & Spiral Review	Apply concepts to hard cases + revisit earlier unit content	4-bucket classification (nation-state / empire / stateless nation / city-state) + spiraled-review MCQs on Neolithic (5.21), Industrial Revolution / Britain (5.31), and Americas timing (5.12) → 🎓 Master Classifier
V — The Magistrate Exam (boss)	Final test	12 mixed questions: all 8 real L11 exit-ticket questions + 4 spiraled-review zingers. Title earned by score: 👑 Imperator (12), 🎖️ Consul (10–11), ⚖️ Magistrate (8–9), 🛡️ Plebeian Tribune (6–7), 📚 Apprentice (<6). End screen shows title + LP + badges + boss answer key + copy-to-clipboard for sharing with the teacher.
Files
index.html    Layout and screen containers
styles.css    Per-city color themes, badge animation, boss styling
data.js       All content: chapters, readings, questions, decisions, badges, titles
app.js        Game state machine, scoring, mini-game logic
Single dependency: none. No external fonts, no CDN scripts, no fetch calls.

Competencies covered
Maps to PGG Unit 5 standards:

5.51 / 5.52 — primary focus (development of the state; spread of modern nation-states)
5.0 — meta-framing across the unit
5.12, 5.21, 5.22, 5.31, 5.32, 5.41, 5.42 — spiraled in via Act IV review questions and the boss exam
Pedagogical notes
Decision moments are the core teaching device. In each city-state quest, students must predict what historically worked. Wrong answers come with detailed "here's why that didn't happen" outcomes, so a wrong choice still teaches.
All 8 real L11 exit-ticket questions are inside the boss exam. Students who play through this should be ready for the exit ticket on the first try.
Spiral review is folded in narratively, not bolted on. Earlier-unit content (Neolithic Revolution, Industrial Revolution, Americas parallel) shows up in context — as part of explaining how states became nation-states — rather than as isolated review questions.
Progress saves automatically to localStorage as students play, but the game starts fresh on each new session by design (so shared computers don't show one student another student's progress).
Sharing results
At the end, students click Copy result to clipboard to grab a plaintext summary including their title, boss answers, total LP, and earned badges. They can paste it into Google Classroom, an email, or a Form response.

Testing
End-to-end verified via jsdom: full flow reaches the final screen, all 7 badges unlock, perfect play yields the 👑 Imperator title.

Credit
Built for Mr. Noah's PGG class at Comp Sci High, school year 2025–26.
