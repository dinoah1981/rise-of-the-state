/* "Rise of the State" — PGG Unit 5 Lessons 11.1 & 11.2 interactive lesson.
 * Five-act gamified journey: classification, four city-state quests with decision
 * moments, the modern nation-state, tricky cases + spiraled unit review, and a
 * Magistrate Exam boss quiz that unlocks a title.
 */

// ---- Acts ----
// Step types:
//   reading   - {title, body, accent}
//   classify  - {prompt, categories, items, explanation}
//   mcq       - {question, options, correctIdx, explanation, competency}
//   decision  - {accent, scenario, prompt, options:[{label,correct,outcome}]}
//   order     - {prompt, items:[{label,order}], explanation}
//   match     - {prompt, pairs:[{left,right,blurb}]}
//   badge     - {id, name, emoji, description}
//   actEnd    - {title, body}
//   boss      - handled specially (full Act 5)

const ACTS = [

  // ===================================================================== ACT 1
  {
    id: "act1",
    title: "Act I — What Is a State?",
    accent: "world",
    intro: "Before we can talk about Sumerian kings or modern nations, you need to know exactly what a <b>state</b> is — and what it isn't.",
    steps: [
      {
        type: "reading",
        accent: "world",
        title: "The word \"state\" doesn't mean what you think it means",
        body: `<p>In everyday English, "state" usually means <b>Texas</b> or <b>New Jersey</b>. In <b>global history</b>, the word means something very different — and much bigger.</p>
        <p>A <b>state</b> is a political organization that has all four of these:</p>
        <ul>
          <li><b>A defined territory</b> — clear borders.</li>
          <li><b>A permanent population</b> — people who live there.</li>
          <li><b>A sovereign government</b> — final authority over what happens inside those borders.</li>
          <li><b>The ability to make agreements with other states</b> — like trade deals or treaties.</li>
        </ul>
        <p>That last word — <b>sovereign</b> — is the heart of it. A sovereign government answers to no higher authority. <b>China</b> is a state. <b>Texas</b> is not, because the U.S. federal government can overrule it. <b>New York City</b> is not, for the same reason. The <b>United Nations</b> is not, because it has no territory and no population of its own — it's a club <em>of</em> states.</p>`
      },
      {
        type: "classify",
        prompt: "Sort each one. <b>States</b> are sovereign political units with all four required ingredients. The others are missing something — they might be cities, regions, organizations, or stateless peoples.",
        categories: [
          { id: "state", label: "🌍 State" },
          { id: "not", label: "🚫 Not a State" }
        ],
        items: [
          { label: "China",           correctCategory: "state", explanation: "Sovereign, defined borders, permanent population — a textbook state." },
          { label: "France",          correctCategory: "state", explanation: "Sovereign government, clear borders, permanent population, makes treaties. State." },
          { label: "Mexico",          correctCategory: "state", explanation: "Sovereign and bordered — a state." },
          { label: "Japan",           correctCategory: "state", explanation: "Sovereign island nation — a state." },
          { label: "Ohio",            correctCategory: "not",   explanation: "Ohio has borders and people, but it's NOT sovereign — federal law overrules it. It's a province, not a state in the global-history sense." },
          { label: "New York City",   correctCategory: "not",   explanation: "A huge, important city — but it can't sign treaties or overrule federal law. Not a state." },
          { label: "The United Nations", correctCategory: "not", explanation: "The UN has no territory or population of its own. It's an organization OF states, not a state itself." },
          { label: "Kurdistan",       correctCategory: "not",   explanation: "The Kurdish people are a 'nation' (shared culture/identity), but they have no sovereign country. They're a stateless nation." }
        ]
      },
      {
        type: "mcq",
        competency: "5.51",
        question: "Which of the following is NOT required to be considered a state?",
        options: ["A defined territory", "A permanent population", "A sense of national identity", "A sovereign government"],
        correctIdx: 2,
        explanation: "A shared 'national identity' is what makes something a <b>nation</b> — that's a different concept. Plenty of states (like the old USSR or modern Belgium) contain multiple national identities. A state just needs territory, population, and sovereign government."
      },
      {
        type: "badge",
        id: "classifier",
        name: "Classifier",
        emoji: "🔍",
        description: "You can now spot a state at fifty paces."
      }
    ]
  },

  // ===================================================================== ACT 2
  {
    id: "act2",
    title: "Act II — The Four Founders",
    accent: "world",
    intro: "Once you understand <em>what</em> a state is, the next question is <em>how</em> humans actually built them. Four ancient city-states each invented a different answer.",
    steps: [
      {
        type: "reading",
        accent: "world",
        title: "Welcome to the world before states",
        body: `<p>Roughly <b>12,000 years ago</b>, the last Ice Age ended. Over the next several thousand years, humans in a handful of river valleys figured out how to farm. Farming produced <b>food surplus</b>. Surplus made <b>cities</b> possible. Cities needed organized ways to share water, settle fights, defend territory, and store grain — and that's where the very first <b>states</b> came from.</p>
        <p>You're about to visit four of those early experiments: <b>Sumer</b>, <b>Babylon</b>, <b>Athens</b>, and <b>Rome</b>. Each city-state invented a different way to answer the same hard question: <i>where does political authority actually come from?</i> Each gives you a badge if you pay attention.</p>`
      },

      // ----- Sumer quest -----
      {
        type: "reading",
        accent: "sumer",
        title: "Sumer · ~3500 BCE · Between the Tigris and Euphrates",
        body: `<p>In southern Mesopotamia, fertile soil and irrigation produced enormous food surpluses. Cities like <b>Ur</b> and <b>Uruk</b> grew into the world's first true urban centers — tens of thousands of people, packed into mud-brick neighborhoods.</p>
        <p>But the rivers didn't belong to one city. <b>Uruk</b> and <b>Ur</b> and <b>Lagash</b> all needed the same water, and farmers upstream could easily starve those downstream. <b>Competition over agricultural resources</b> turned violent. The people who solved that — the people the city would follow into battle — became the first kings. Sumerians called them <b>lugals</b> ("big men").</p>
        <p>Lugals claimed the gods backed them, but their real authority came from being able to <b>win battles</b> over water and land. They also organized canals, collected taxes, enforced laws, and (crucially) invented <b>cuneiform</b> — the world's earliest writing system — partly just to keep records of grain, taxes, and trade.</p>`
      },
      {
        type: "decision",
        accent: "sumer",
        scenario: "It's 3200 BCE. You're a council elder in Uruk. The neighboring city of Ur has been diverting more water from the canals upstream, and your fields are drying out. Your people are starting to go hungry.",
        prompt: "What do you do?",
        options: [
          {
            label: "Pray harder and offer more sacrifices to the gods.",
            correct: false,
            outcome: "Your priests work overtime, but the canals stay dry. Your crops fail. In the real history of Sumer, divine appeals alone never solved resource competition between cities — they reinforced authority that already existed, but they couldn't make water flow uphill."
          },
          {
            label: "Pick the strongest, most successful warrior in Uruk and make him our military leader. Have him take back the canals by force.",
            correct: true,
            outcome: "This is exactly what real Sumerians did. The need to fight over rivers and land turned successful military leaders into permanent kings — <b>lugals</b>. Sumer gave the world its first monarchies precisely because cities competed for scarce resources."
          },
          {
            label: "Call together every adult citizen in Uruk and vote on what to do.",
            correct: false,
            outcome: "Beautiful idea — but anachronistic by about 2,700 years. Direct citizen voting didn't appear in Sumer. It emerged much later in <b>Athens</b>, where rocky geography prevented the kind of resource competition that produced kings in Mesopotamia."
          }
        ]
      },
      {
        type: "mcq",
        competency: "5.51",
        question: "What best explains the political development of the first recorded human city-states in ancient Sumer?",
        options: [
          "Lack of fertile river valleys led to democratic systems that prioritized civic responsibility",
          "Competition over agricultural resources led to strong military leaders becoming kings",
          "Leaders like Hammurabi gained legitimacy by enforcing laws, dispensing justice, and ensuring fairness",
          "Tensions between social classes led to the city-state's king being replaced by a republic"
        ],
        correctIdx: 1,
        explanation: "Sumer's defining political move was making successful generals into permanent kings (<b>lugals</b>). The other three answers describe Athens, Babylon, and Rome respectively — you'll meet them in this Act."
      },
      {
        type: "badge",
        id: "lugal",
        name: "Lugal",
        emoji: "⚔️",
        description: "You learned the original recipe for monarchy: resource competition + military success."
      },

      // ----- Babylon quest -----
      {
        type: "reading",
        accent: "babylon",
        title: "Babylon · ~1800 BCE · Upstream on the Euphrates",
        body: `<p>By 1800 BCE, the city of <b>Babylon</b> had grown rich on Mesopotamian trade. King <b>Hammurabi</b> conquered the surrounding cities and stitched them together into the Babylonian Empire — but he ran into a new problem.</p>
        <p>You can win battles with a sword. You can collect taxes with soldiers. But how do you make the people in a city you conquered five years ago <i>actually believe</i> your rule is legitimate? How do you make sure the next king after you doesn't have to fight the same battles all over again?</p>
        <p>Hammurabi's answer was radical: <b>write the law down</b>. The famous <b>Code of Hammurabi</b> was carved onto huge stone pillars and set up in public squares. Anyone could see the rules. Same crime, same punishment — at least in theory. The introduction even claimed the code existed to "<b>prevent the strong from oppressing the weak</b>."</p>
        <p>This was a new source of legitimacy. The king wasn't just a warrior or a god's favorite — he was the <b>guarantor of public justice</b>. Citizens obeyed because the rules were visible, predictable, and seemed fair (even if punishments still differed by social class).</p>`
      },
      {
        type: "decision",
        accent: "babylon",
        scenario: "It's 1790 BCE. You are Hammurabi. You've just conquered five rival cities. The people there don't trust your soldiers, and your tax collectors are getting attacked.",
        prompt: "How do you make your rule stick — not just in your lifetime, but long after you're gone?",
        options: [
          {
            label: "Tell each conquered city to settle disputes the way they always have — with family elders and local priests.",
            correct: false,
            outcome: "That preserves their old systems and keeps them loyal to local leaders, not you. Within a generation, your empire fragments — local elders quietly ignore your taxes and your soldiers."
          },
          {
            label: "Carve the laws onto stone pillars and put them in every public square. Same rules everywhere. Anyone literate can read them.",
            correct: true,
            outcome: "This is what Hammurabi actually did. Visible written law meant authority didn't depend on you personally — it traveled with the words. Citizens could check the rules themselves. The legitimacy of the state stopped being about <i>who you are</i> and started being about <i>what the law says</i>. Massive upgrade."
          },
          {
            label: "Replace every local priest with a Babylonian priest who reports directly to you in private.",
            correct: false,
            outcome: "Secret authority that depends on you appointing the right people is fragile — the next king has to start over. Hammurabi's actual move was the opposite: make the rules <b>public and written</b> so they outlast individual rulers."
          }
        ]
      },
      {
        type: "mcq",
        competency: "5.51",
        question: "What best explains the political development of the city-state of Babylon?",
        options: [
          "Competition over agricultural resources led to strong military leaders becoming kings",
          "Tensions between social classes led to the city-state's king being replaced by a republic",
          "Lack of fertile river valleys led to democratic systems that prioritized civic responsibility",
          "Leaders like Hammurabi gained legitimacy by enforcing laws, dispensing justice, and ensuring fairness"
        ],
        correctIdx: 3,
        explanation: "Hammurabi's Code put justice on display. Babylon's defining contribution wasn't conquest — it was the idea that the state's authority comes from being the <b>visible, predictable enforcer of written law</b>."
      },
      {
        type: "badge",
        id: "lawgiver",
        name: "Lawgiver",
        emoji: "📜",
        description: "You discovered the trick that lets a state outlive any single ruler: write the law down."
      },

      // ----- Athens quest -----
      {
        type: "reading",
        accent: "athens",
        title: "Athens · ~800 BCE · Rocky Greek coast",
        body: `<p>Sumer and Babylon both grew along huge river valleys. <b>Greece</b> had no such river. Its coast and interior are broken up by <b>mountains, narrow valleys, and tiny islands</b> — a geography that physically prevents one ruler from controlling everything.</p>
        <p>So instead of one big kingdom, Greeks built dozens of small independent city-states called <b>poleis</b> (singular: polis). Each polis was small enough that most citizens could literally walk to a central meeting space. That had a wild consequence: in <b>Athens</b>, by around 500 BCE, free adult male citizens started showing up in person to <b>debate laws, vote on policies, and serve as jurors</b>.</p>
        <p>That's <b>direct democracy</b> — the very first time political authority came from the consent of ordinary citizens rather than from generals or gods. Athens limited it harshly: women, foreigners, and enslaved people were all excluded. But the principle was new: <b>the state belonged to the citizens, and citizens had a duty to participate</b>.</p>`
      },
      {
        type: "decision",
        accent: "athens",
        scenario: "It's 508 BCE. Athens just kicked out a tyrant. The people are gathered in the agora (public square) trying to decide how to govern themselves going forward.",
        prompt: "Which proposal best fits Athens' geography and history?",
        options: [
          {
            label: "Crown the most successful general as king. Athens needs a strong leader.",
            correct: false,
            outcome: "This is the Sumerian solution — and it can work where one ruler can control a whole river valley. But Greek geography is too fragmented; mountains protect each polis from being conquered easily. A king in Athens has no easy way to dominate his neighbors and no enemy big enough to require permanent military rule."
          },
          {
            label: "Give voting power only to the wealthiest landowners — they have the most at stake.",
            correct: false,
            outcome: "This is <b>oligarchy</b>, and several Greek city-states did exactly this. Athens flirted with it. But in Athens, ordinary citizens kept pushing back — and they had political leverage because they were also the soldiers and rowers the city depended on."
          },
          {
            label: "Let every free male citizen show up in the assembly, debate, and vote on laws directly.",
            correct: true,
            outcome: "This is what Athens chose, and it's what makes Athens famous. The polis was small enough that direct participation was actually possible. Legitimacy came not from a king or a god but from the citizens themselves. Athens invented the idea that the state belongs to those who help govern it."
          }
        ]
      },
      {
        type: "mcq",
        competency: "5.51",
        question: "What best explains the political development of the city-state of Athens?",
        options: [
          "Lack of fertile river valleys led to democratic systems that prioritized civic responsibility",
          "Tensions between social classes led to the city-state's king being replaced by a republic",
          "Leaders like Hammurabi gained legitimacy by enforcing laws, dispensing justice, and ensuring fairness",
          "Competition over agricultural resources led to strong military leaders becoming kings"
        ],
        correctIdx: 0,
        explanation: "Greek geography — mountains, islands, no single dominant river — meant no one ruler could control the whole region. Small, walkable poleis made citizen participation realistic in a way it never was in Sumer or Babylon."
      },
      {
        type: "badge",
        id: "athenian",
        name: "Citizen of Athens",
        emoji: "🗳️",
        description: "You saw how geography itself can invent democracy."
      },

      // ----- Rome quest -----
      {
        type: "reading",
        accent: "rome",
        title: "Rome · 509 BCE · Banks of the Tiber",
        body: `<p>Rome started small — a hill-town near a useful river crossing on the Tiber. For its first two centuries it was ruled by kings, just like Sumer. But Rome had a class problem.</p>
        <p>Roman society was sharply divided between <b>patricians</b> (wealthy, landowning families) and <b>plebeians</b> (everyone else — farmers, craftsmen, soldiers). The kings increasingly served only patrician interests. After a particularly cruel king named Tarquin, in <b>509 BCE</b> the Roman people <b>overthrew the monarchy</b> and built something new.</p>
        <p>They called it a <b>res publica</b> — a "public thing" — a <b>republic</b>. Instead of a king, two consuls were elected each year. A <b>Senate</b> of elder statesmen advised them. Plebeians, after generations of struggle, won their own assembly and their own protective officials (tribunes). To make the rules visible to all, Rome carved its core laws onto twelve bronze tablets, the <b>Twelve Tables</b>, and displayed them in the Forum.</p>
        <p>This is the third path to state authority: legitimacy from <b>balancing competing social classes</b> through shared institutions, written law, and the duty of every citizen to serve.</p>`
      },
      {
        type: "decision",
        accent: "rome",
        scenario: "It's 509 BCE. You've just kicked out Tarquin, Rome's last king. The patricians want to install one of their own as the new king. The plebeians are furious — they've been abused by kings and patricians both, and they're armed.",
        prompt: "How do you build a new government that won't immediately collapse into civil war?",
        options: [
          {
            label: "Crown a patrician as the new king. Stability matters more than fairness.",
            correct: false,
            outcome: "The plebeians will revolt within a year. The whole point of overthrowing Tarquin was that ordinary Romans were sick of one-man rule. You've just recreated the problem."
          },
          {
            label: "Crown the most popular plebeian general. Power to the people.",
            correct: false,
            outcome: "Now the patricians revolt, the plebeian general becomes a tyrant himself, and you're back to monarchy. Single-ruler systems don't solve class tension; they just shift which class is mad."
          },
          {
            label: "Don't have a king. Elect two consuls every year, share power with an aristocratic Senate, and over time let plebeians win their own assembly and written legal protections.",
            correct: true,
            outcome: "This is what Rome actually did. The Roman Republic balanced patricians and plebeians through overlapping institutions — consuls, Senate, plebeian assemblies, tribunes. The Twelve Tables put core laws in writing so they couldn't be twisted. The result lasted, in some form, for nearly 500 years."
          }
        ]
      },
      {
        type: "mcq",
        competency: "5.51",
        question: "What best explains the political development of the city-state of Rome?",
        options: [
          "Competition over agricultural resources led to strong military leaders becoming kings",
          "Settlements along the Tiber River allowed merchants to establish a plutocratic commercial state",
          "Lack of fertile river valleys led to democratic systems that prioritized civic responsibility",
          "Tensions between social classes led to the city-state's king being replaced by a republic"
        ],
        correctIdx: 3,
        explanation: "Rome's story is class struggle producing institutions. Patricians and plebeians built a balance — consuls, Senate, tribunes, written law — instead of either side simply winning. That's the republican model."
      },
      {
        type: "badge",
        id: "senator",
        name: "Senator",
        emoji: "🏛️",
        description: "You traded a king for a republic — and lived to tell about it."
      },

      // ----- Capstone matching -----
      {
        type: "match",
        prompt: "Capstone: match each ancient city-state to the <b>main source of its political legitimacy</b>.",
        pairs: [
          { left: "Sumer",   right: "Military victory in competition over rivers and farmland", blurb: "Lugals earned authority by winning fights over scarce resources." },
          { left: "Babylon", right: "Publicly displayed written laws enforcing justice",          blurb: "Hammurabi's Code on stone pillars made authority predictable and portable." },
          { left: "Athens",  right: "Direct participation of male citizens in the assembly",      blurb: "Greek geography made small, walkable poleis where citizens could vote in person." },
          { left: "Rome",    right: "Balance of social classes through elected officials & shared institutions", blurb: "Two consuls, a Senate, plebeian assemblies, and the Twelve Tables divided power." }
        ]
      },
      {
        type: "actEnd",
        title: "End of Act II",
        body: `<p>Four city-states, four answers to the question "where does authority come from?" Notice that <b>all four</b> are downstream of the same root cause: <b>farming produced surplus, surplus produced cities, cities needed states</b>. Geography and class structure then shaped <i>what kind of state</i> each one became.</p>`
      }
    ]
  },

  // ===================================================================== ACT 3
  {
    id: "act3",
    title: "Act III — From City-State to Nation-State",
    accent: "modern",
    intro: "Sumer's lugals were kings. So were Hammurabi, Caesar Augustus, Charlemagne, Henry VIII. So why is the country you live in called a <b>nation-state</b>, not a city-state or a kingdom?",
    steps: [
      {
        type: "reading",
        accent: "modern",
        title: "Twelve thousand years of build-up",
        body: `<p>From those four city-states to the world you live in, roughly <b>12,000 years pass</b>. Civilizations grow. Religions like Christianity, Islam, Buddhism, and Hinduism spread across continents. Big empires rise and fall — Persia, Rome, the Mongols, the Ottomans, the Spanish, the British.</p>
        <p>Then, starting around <b>1648</b> (after a long, brutal European war ended with the Treaty of Westphalia), a new idea takes hold: maybe a country should be ruled <b>on behalf of a people who share an identity</b> — a common language, a common history, sometimes a common religion. Maybe sovereignty should rest with that "nation," not with a king's family.</p>
        <p>That's the <b>nation-state</b>: a sovereign state PLUS a nation (a community that identifies itself as a people). The United States (1776), Venezuela (1811), Turkey (1923), Israel (1948), Ghana (1957) — these are textbook nation-states. The Holy Roman Empire and the Ottoman Empire were not — they were empires that ruled over many different nations.</p>`
      },
      {
        type: "mcq",
        competency: "5.52",
        question: "Which of the following best describes the development of modern Nation-States?",
        options: [
          "The first Nation-States were formed to improve international cooperation",
          "The first Nation-States formed in fertile river-valleys to better organize agriculture",
          "Nation-States developed gradually following the Scientific Revolution",
          "Nation-States emerged immediately after the Neolithic Revolution"
        ],
        correctIdx: 2,
        explanation: "Nation-states are a relatively <b>recent</b> invention — they spread gradually after the Scientific Revolution (1500s–1700s) and especially after the late 1700s. The Neolithic Revolution gave us city-states and empires, not nation-states."
      },
      {
        type: "order",
        prompt: "Drag this causal chain into the right order — the path from early states all the way to modern independent nation-states.",
        items: [
          { label: "States form (to manage resources and keep order)", order: 1 },
          { label: "Competition between states (over resources, religion, prestige)", order: 2 },
          { label: "Empires expand (large states ruling many nations)", order: 3 },
          { label: "Colonization (empires control stateless peoples around the world)", order: 4 },
          { label: "Independence movements! (new Nation-States are born)", order: 5 }
        ],
        explanation: "States → competition → empires → colonization → independence. This same chain explains why most modern nation-states in Africa, Asia, and the Americas were born from <b>throwing off</b> a European empire — not from being invented from scratch."
      },
      {
        type: "match",
        prompt: "Match each region to the era when its modern nation-states formed. (Hint: <b>not all at once, and not long ago</b>.)",
        pairs: [
          { left: "Americas",          right: "1783–1833",  blurb: "U.S. independence in 1776 → Haiti, Mexico, most of South America by the 1820s." },
          { left: "Europe",            right: "1789–1922",  blurb: "From the French Revolution through the collapse of the Austro-Hungarian and Ottoman empires after WWI." },
          { left: "East Asia",         right: "1868–1924",  blurb: "Japan's Meiji Restoration in 1868 marks the start; modern Turkey and the Republic of China bookend the era." },
          { left: "Africa, Asia, Oceania", right: "1947–1997", blurb: "Decolonization. India and Pakistan in 1947, Ghana 1957, decades of African independence, Hong Kong handed back in 1997." }
        ]
      },
      {
        type: "badge",
        id: "cartographer",
        name: "Cartographer of Nations",
        emoji: "🗺️",
        description: "You now know that the world map of countries is, on the scale of human history, brand new."
      }
    ]
  },

  // ===================================================================== ACT 4
  {
    id: "act4",
    title: "Act IV — Tricky Cases & Spiral Review",
    accent: "world",
    intro: "Real life is messier than definitions. Time to apply what you know to harder cases — and revisit a few key ideas from earlier in the unit.",
    steps: [
      {
        type: "reading",
        accent: "world",
        title: "When the pieces don't fit cleanly",
        body: `<p>A <b>nation-state</b> needs <b>both</b> a state (sovereignty, borders, government) <b>and</b> a nation (a community that identifies as a people). The interesting cases are when you have one without the other.</p>
        <ul>
          <li><b>Stateless nation</b> — a "nation" with no sovereign state of its own. Kurds in the Middle East, Palestinians, the Roma — all identify as peoples, but none currently have a fully sovereign country to call theirs.</li>
          <li><b>Empire</b> — a single state ruling over many different nations. The Holy Roman Empire, the Ottoman Empire, the British Empire at its peak. Empires are not nation-states because the people inside don't share one national identity.</li>
          <li><b>State without an agreed nation</b> — countries where citizens don't agree they belong to one people. Bosnia has a state but ongoing disagreement about the national identity that binds it.</li>
        </ul>
        <p>The neat definitions matter — but the gray cases are where actual politics happens.</p>`
      },
      {
        type: "classify",
        prompt: "Classify each entity. Drag it into the right bucket.",
        categories: [
          { id: "nationState", label: "🌐 Nation-State" },
          { id: "empire",      label: "👑 Empire" },
          { id: "stateless",   label: "🏳️ Stateless Nation" },
          { id: "cityState",   label: "🏛️ Ancient City-State" }
        ],
        items: [
          { label: "The United States",     correctCategory: "nationState", explanation: "Sovereign state + Americans identify as a single nation. Textbook nation-state since 1776." },
          { label: "Modern Ghana",          correctCategory: "nationState", explanation: "Independent since 1957 with a shared national identity. Nation-state." },
          { label: "Turkey",                correctCategory: "nationState", explanation: "Founded 1923 as a nation-state when the Ottoman Empire collapsed." },
          { label: "The Holy Roman Empire", correctCategory: "empire",      explanation: "962–1806. A patchwork of hundreds of German-speaking territories, plus others. Not one nation — an empire." },
          { label: "The Ottoman Empire",    correctCategory: "empire",      explanation: "1299–1922. Ruled Turks, Arabs, Greeks, Armenians, Slavs, and many others. An empire, not a nation-state." },
          { label: "Kurdistan",             correctCategory: "stateless",   explanation: "The Kurds are a nation (~30 million people, shared language and culture) but they have no sovereign country. Stateless nation." },
          { label: "Palestine",             correctCategory: "stateless",   explanation: "Recognized as a nation by many but lacking full sovereign control. Currently considered a stateless nation by most international classifications." },
          { label: "Ancient Sumer",         correctCategory: "cityState",   explanation: "Each Sumerian city (Ur, Uruk, Lagash) was its own sovereign political unit. City-states, not nation-states." },
          { label: "Ancient Athens",        correctCategory: "cityState",   explanation: "One city + its surrounding territory + its own sovereign government. A textbook ancient city-state." }
        ]
      },
      {
        type: "mcq",
        competency: "5.52",
        question: "Which of the following best explains the spread of modern Nation-States around the world?",
        options: [
          "Competition between European states led to colonization and eventual independence",
          "Nation-States developed directly from ancient city-states beginning after 1,000 BCE",
          "All countries throughout human history can be classified as Nation-States",
          "Early conquest by empires from East Asia led to the formation of Nation-States in Europe"
        ],
        correctIdx: 0,
        explanation: "European states competed → built empires → colonized much of the world → those colonies eventually fought for independence and became nation-states. That's why so many modern countries' borders match old European colonial boundaries."
      },
      // Spiraled review
      {
        type: "mcq",
        competency: "5.21",
        question: "<b>Spiral Review:</b> Why did the <b>Neolithic Revolution</b> make city-states possible thousands of years before they actually appeared?",
        options: [
          "Because it gave humans permission from the gods to build cities.",
          "Because farming produced a food surplus, which freed people from full-time food-gathering and let them specialize and cluster into cities.",
          "Because it directly invented kings and writing.",
          "Because it ended the dinosaurs."
        ],
        correctIdx: 1,
        explanation: "Surplus is the unlock. Without farmers growing more than they personally eat, there's no scribe, no priest, no king, no soldier — no city. The Neolithic Revolution is the root of every state in this unit."
      },
      {
        type: "mcq",
        competency: "5.31",
        question: "<b>Spiral Review:</b> Why did the <b>Industrial Revolution</b> start in <b>Britain</b> specifically?",
        options: [
          "Because Britain had the only English-speakers in Europe.",
          "Because of abundant coal, rivers for transport, scientific institutions, capital from global trade, and political stability — all stacked in one place.",
          "Because the British invented mathematics.",
          "Because Britain was farthest from the equator."
        ],
        correctIdx: 1,
        explanation: "The Industrial Revolution wasn't an accident — Britain had several rare advantages compounding at once. The steam engine then let Britain project industrial power into colonial empires, which feeds back into the nation-state story you just learned."
      },
      {
        type: "mcq",
        competency: "5.12",
        question: "<b>Spiral Review:</b> Why did civilization in the Americas develop a few thousand years <em>after</em> civilization in the Old World?",
        options: [
          "Because Americans were less intelligent.",
          "Because humans arrived in the Americas much later, and the available plants and animals (especially teosinte → corn, and the llama) were much harder to domesticate.",
          "Because there were no rivers in the Americas.",
          "Because of the Inca calendar."
        ],
        correctIdx: 1,
        explanation: "Geography, not ability. Late arrival via the Bering Land Bridge + crops that took 4,000–6,000 years to fully domesticate + no horses or cattle = the same revolution, just on a different timeline."
      },
      {
        type: "badge",
        id: "masterClassifier",
        name: "Master Classifier",
        emoji: "🎓",
        description: "You can tell a nation-state from an empire — and you remember why surplus made all of it possible."
      }
    ]
  },

  // ===================================================================== ACT 5 (boss)
  {
    id: "act5",
    title: "Act V — The Magistrate Exam",
    accent: "boss",
    intro: "The final test. Twelve questions covering everything you've seen — plus a few spiraled-review zingers. Earn at least 9 to claim a Magistrate's title.",
    boss: {
      questions: [
        // The official exit ticket Q1
        {
          question: "Which of the following is the best example of a \"state\" in a global historical context?",
          options: ["The United Nations", "China", "Ohio", "New York City"],
          correctIdx: 1,
          explanation: "Only China is a sovereign state. The UN is an organization OF states; Ohio and NYC are sub-national governments."
        },
        // Exit ticket Q2 — Sumer
        {
          question: "What best explains the political development of the first recorded human city-states in ancient Sumer?",
          options: [
            "Lack of fertile river valleys led to democratic systems",
            "Competition over agricultural resources led to strong military leaders becoming kings",
            "Leaders like Hammurabi gained legitimacy by enforcing laws",
            "Tensions between social classes led to the king being replaced by a republic"
          ],
          correctIdx: 1,
          explanation: "Sumer = competition over water/farmland → lugals → monarchy."
        },
        // Exit ticket Q3 — Athens
        {
          question: "What best explains the political development of the city-state of Athens?",
          options: [
            "Lack of fertile river valleys led to democratic systems that prioritized civic responsibility",
            "Tensions between social classes led to the king being replaced by a republic",
            "Leaders like Hammurabi gained legitimacy by enforcing laws",
            "Competition over agricultural resources led to military leaders becoming kings"
          ],
          correctIdx: 0,
          explanation: "Athens = mountainous geography → small walkable poleis → direct citizen democracy."
        },
        // Exit ticket Q4 — Babylon
        {
          question: "What best explains the political development of the city-state of Babylon?",
          options: [
            "Competition over agricultural resources led to military leaders becoming kings",
            "Tensions between social classes led to the king being replaced by a republic",
            "Lack of fertile river valleys led to democratic systems",
            "Leaders like Hammurabi gained legitimacy by enforcing laws, dispensing justice, and ensuring fairness"
          ],
          correctIdx: 3,
          explanation: "Babylon = public written law → predictable state-administered justice."
        },
        // Exit ticket Q5 — Rome
        {
          question: "What best explains the political development of the city-state of Rome?",
          options: [
            "Competition over agricultural resources led to military leaders becoming kings",
            "Settlements along the Tiber allowed merchants to establish a plutocratic commercial state",
            "Lack of fertile river valleys led to democratic systems",
            "Tensions between social classes led to the king being replaced by a republic"
          ],
          correctIdx: 3,
          explanation: "Rome = patrician/plebeian class tension → overthrow of monarchy → Republic (509 BCE)."
        },
        // Exit ticket Q6 — required characteristics
        {
          question: "Which of the following characteristics is NOT required to be considered a \"state\"?",
          options: [
            "A defined territory",
            "A permanent population",
            "A sense of national identity",
            "A sovereign government"
          ],
          correctIdx: 2,
          explanation: "National identity is what makes something a NATION. Plenty of states have multiple national identities inside them."
        },
        // Exit ticket Q7
        {
          question: "Which of the following best describes the development of modern Nation-States?",
          options: [
            "The first Nation-States were formed to improve international cooperation",
            "The first Nation-States formed in fertile river-valleys to better organize agriculture",
            "Nation-States developed gradually following the Scientific Revolution",
            "Nation-States emerged immediately after the Neolithic Revolution"
          ],
          correctIdx: 2,
          explanation: "Nation-states are a relatively recent invention, mostly post-1500 and especially after 1776."
        },
        // Exit ticket Q8
        {
          question: "Which of the following best explains the spread of modern Nation-States around the world?",
          options: [
            "Competition between European states led to colonization and eventual independence",
            "Nation-States developed directly from ancient city-states beginning after 1,000 BCE",
            "All countries throughout human history can be classified as Nation-States",
            "Early conquest by empires from East Asia led to the formation of Nation-States in Europe"
          ],
          correctIdx: 0,
          explanation: "States → empires → colonization → independence movements → new nation-states. Most of today's countries trace through this chain."
        },
        // Spiral review — Neolithic
        {
          question: "<b>Spiral review:</b> Roughly how long ago did the Neolithic Revolution begin in the Fertile Crescent?",
          options: ["About 500 years ago", "About 2,500 years ago", "About 12,000 years ago", "About 1 million years ago"],
          correctIdx: 2,
          explanation: "~12,000 years ago, after the last Ice Age ended. Wheat and barley domesticated ~9,500 BCE."
        },
        // Spiral review — Scientific Revolution
        {
          question: "<b>Spiral review:</b> What single idea most defines the Scientific Revolution?",
          options: [
            "Knowledge should come from religious tradition.",
            "Knowledge should come from observation and evidence (empiricism).",
            "Knowledge is impossible to obtain.",
            "Knowledge belongs only to kings."
          ],
          correctIdx: 1,
          explanation: "Empiricism. Test things in the real world rather than just trusting authority."
        },
        // Spiral review — rivers
        {
          question: "<b>Spiral review:</b> Which civilization is famous for grid-pattern city streets and early plumbing/sewage systems?",
          options: ["Egypt (Nile)", "Mesopotamia (Tigris & Euphrates)", "Indus Valley", "Yellow River (China)"],
          correctIdx: 2,
          explanation: "The Indus Valley cities (Mohenjo-Daro, Harappa) had remarkably advanced urban planning around 2600 BCE."
        },
        // Final synthesis
        {
          question: "<b>Big picture:</b> Looking across the whole unit, what single best summarizes WHY states and nation-states exist?",
          options: [
            "Because one culture invented government and the rest copied it.",
            "Because farming produced surpluses and cities, which needed organized authority — and that engine has been compounding ever since.",
            "Because politicians wanted jobs.",
            "Because it was inevitable from the moment Earth formed."
          ],
          correctIdx: 1,
          explanation: "Surplus → cities → states → empires → nation-states. The whole unit, in one line. Different geographies produced different versions of the same engine."
        }
      ],
      // Titles
      titles: [
        { min: 12, label: "Imperator",        emoji: "👑", blurb: "Perfect score. You could rule from Rome." },
        { min: 10, label: "Consul",           emoji: "🎖️", blurb: "Elected to the highest office. Statesmanlike." },
        { min: 8,  label: "Magistrate",       emoji: "⚖️", blurb: "You hold real authority. Well done." },
        { min: 6,  label: "Plebeian Tribune", emoji: "🛡️", blurb: "You speak for the people. Keep studying — you're close to magistrate." },
        { min: 0,  label: "Apprentice",       emoji: "📚", blurb: "Not yet — but every magistrate started here. Run it back." }
      ]
    }
  }
];

window.GAME_DATA = { ACTS };
