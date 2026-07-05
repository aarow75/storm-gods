# Mothership vs. RuneQuest Classic — Mechanics Comparison

*Comparing Mothership 1st edition (Player's Survival Guide, Tuesday Knight Games) against RuneQuest Classic 2nd edition (Chaosium 2016 reprint). Abbreviations: MS = Mothership, RQ = RuneQuest.*

---

## 1. Combat

### The Fundamental Difference

Mothership and RuneQuest are both percentile roll-under systems, but they aim combat at opposite goals:

- **MS:** A sci-fi horror system where combat is a failure state. The attacker's Combat check is opposed by the defender's Armor Save — there is no parry, no dodge, and no armor-as-damage-reduction. Weapons deal multiple d10s against a single Health pool, and taking a big hit forces a Panic roll. The system is built to make players avoid fights.
- **RQ:** A simulationist system where combat is a granular exchange. The attacker rolls weapon skill%; the defender rolls parry% or Defense; hits land on specific hit locations where armor points absorb damage. Weapons and shields have their own HP and can break. The system is built to make fights detailed and survivable-by-skill.

The structural contrast: MS resolves an attack as one opposed roll followed by raw damage; RQ resolves it as attack roll → parry/dodge roll → location roll → armor absorption → location damage effects. An MS Marine with a Pulse Rifle rolls Combat vs. the target's Armor Save and, on a win, deals 5d10 against a ~66-point Health pool. An RQ warrior rolls Broadsword%, the defender rolls Shield parry%, and 1d8+1 damage lands on a d20-rolled location holding perhaps 4–6 HP behind 4 armor points.

### Combat Comparison Table

| Topic | Mothership | RuneQuest |
|---|---|---|
| Core mechanic | d% ≤ Stat (+ skill bonus), opposed by defender's Save; higher successful roll wins | d100 ≤ skill%; both sides roll (attack vs. parry/dodge) |
| Armor abstraction | Armor Save bonus (+0% to +15%) — armor helps you avoid damage entirely | Absorbs damage per location (AP 1–6+ by material) |
| Hit locations | Optional d10 table (Head 10, Torso 5–9, limbs 1–4) | Core rule: d20 table, 7 locations, each with own HP |
| Defense | None — oppose with Armor Save (or Combat/Body in close quarters) | Parry with weapon/shield; Defense% subtracts from attacker |
| Shield | No shields | Parrying weapon with own HP; absorbs damage when it parries |
| Initiative | Speed check: pass = act before enemies; fail = act after | Strike Rank (lower acts first): SIZ + DEX + weapon SR |
| Round length | ~10 seconds | 12 seconds |
| Actions per round | 2 significant actions (attack, move, reload, etc.) | 1 attack + 1 parry reaction; move per SR |
| Critical hits | Doubles on d% (11, 22, …) — weapon-specific effects, forces Panic roll on defender | Roll ≤ 5% of skill → full damage, ignores armor |
| Fumbles | Doubles on a failed roll = critical failure | Roll 96–00 → d100 fumble table |
| Damage scale | 1d10 (scalpel) to 5d10 (Pulse Rifle) vs. Health ≈ STR × 2 (~66 avg) | 1d6–2d8 + damage bonus vs. total HP ≈ 8–14 |
| Cover | Half-body concealment = Advantage on Armor Save | Not a core mechanic (shields fill this role) |
| Aiming | Spend both actions → Advantage on next shot | Aimed attacks at higher SR (delay for precision) |
| Automatic fire | Full-auto weapons: reload every shot without Firearms/Military Training | No equivalent |
| Dying | 0 Health = Body Save or die; survival rolled secretly by the Warden | Location ≤ 0 = impaired/severed; total HP ≤ 0 = death |
| Panic in combat | Critical hit taken or losing > half Max Health in one hit → Panic roll | No morale/panic mechanic for PCs |

### Key Tactical Differences

**Opposed rolls vs. simultaneous rolls.** MS combat is a single opposed check: attacker rolls under Combat, defender rolls under Armor Save, and whoever rolls *higher while still succeeding* wins. One roll, one outcome. RQ separates the attack and the parry into independent rolls with four possible combinations (hit/parried, hit/unparried, miss/parried, miss/miss), then adds a location roll. MS resolves a shot in seconds; RQ resolves a sword blow in three or four dice.

**Where armor lives.** RQ armor is subtraction: plate stops 6 points on the location hit, every time, no roll. MS armor is probability: Advanced Battle Dress adds +15% to a save that starts around 25–50%, and a failed save means full damage regardless of what you're wearing. RQ armor makes weak attacks bounce; MS armor just shifts the odds — nothing bounces off a Vaccsuit.

**Lethality points in opposite directions.** In RQ, a single good hit can kill outright (head location zeroed, or an impale doubling damage), but armor and parries mean most exchanges do nothing. In MS, armor stops nothing once the save fails, but Health pools are large (~66 average) relative to small-arms damage — a Revolver (3d10, avg 16.5) needs ~4 clean hits. The real killers in MS are the big weapons (Pulse Rifle 5d10, avg 27.5) and the death spiral: damage → Panic roll → Stress → worse Panic rolls.

**Action economy.** MS characters get two significant actions — move and shoot, aim and hold, shoot twice. RQ characters get one attack plus a parry reaction, with movement costing Strike Ranks. MS combat is about spending two actions well; RQ combat is about timing within the Strike Rank countdown.

**No PC morale in RQ; no PC parry in MS.** RQ trusts armor, parries, and hit locations to model survival, and leaves fear to roleplay. MS deletes the defensive toolkit and replaces it with Stress and Panic — the defining subsystem of the game (see §3).

---

## 2. Character Advancement

### Advancement Comparison Table

| Topic | Mothership | RuneQuest |
|---|---|---|
| Structure | Class + level (0–10); class sets Saves, starting skills, and Panic behavior | Classless; individual skill advancement; no level cap |
| XP trigger | 10 XP per session survived, plus small awards (save a life = 3 XP, map a sector = 5 XP) | Mark a skill after stressful successful use; improve at session end |
| Advancement roll | None — hit XP threshold, level up while resting | Roll d100 *higher* than current skill% + INT modifier → +5% |
| Per-level gains | Major: +5/+3 to two Stats or +4/+4 to two Saves. Minor: +1 Resolve, cure phobia/addiction, or clear Stress. Plus 2 skill points | +5% per successful experience roll, per skill |
| Skill structure | Tree with prerequisites: Trained (+10%) → Expert (+15%) → Master (+20%) | Flat list; every skill improves independently by % |
| Training | Skill points spent at level-up (Trained = 1, Expert = 2, Master = 3) | Optional: 50 × current rating in Lunars per +5%; max 75% by training |
| HP scaling | Health = Strength × 2; grows only when STR is raised at level-up | HP fixed by CON/SIZ/POW; does not scale with experience |
| Stat improvement | Routine at level-up (max 85 per stat) | POW gain roll after overcoming resistance; others via rare training |
| Power curve | Shallow: a level 10 survivor has better saves, more skills, more Resolve — not more attacks or HP tiers | Gradual: 85% Broadsword beats 55%, but both can kill each other |
| Advancement flavor | Surviving is the achievement; XP rewards exploration and rescue | Doing is the achievement; you improve exactly what you used |

### Probability Worked Example

**MS: Combat 30 Marine, level 0 vs. level 5**
- Level 0: Combat 30 → 30% to hit before the opposed save
- Five level-ups, all spent on Combat (+5 each): Combat 55 → 55%
- Add Firearms (Expert, +15%): 70%
- Saves rise in parallel — but Health barely moves, and one Pulse Rifle burst still ends anyone

**RQ: Broadsword 55% vs. 85%**
- At 55%: hit chance 55% before the parry
- At 85%: hit chance 85%, and each point over 100% (later) reduces enemy parry
- HP never changes — a veteran is more reliable, not tougher

Both games reject the D&D-style HP mountain: veterans in either system die to the same weapons that threatened them at start. The difference is that MS advancement is scheduled (level-ups grant guaranteed improvements) while RQ advancement is stochastic and use-driven (you roll to improve only what you actually used under stress).

---

## 3. Magic vs. Stress & Panic

RuneQuest's supernatural layer is magic — three full systems of it. Mothership has no magic at all (Mysticism and Xenoesotericism are knowledge skills, not spellcasting). Its equivalent "invisible force that rules your character" is the Stress & Panic engine. They occupy the same mechanical slot: a second resource, tracked beside HP, that shapes every scene.

### Subsystem Comparison Table

| Topic | RQ Battle Magic | RQ Rune Magic | MS Stress & Panic |
|---|---|---|---|
| Resource | POW points (spend down, recover) | Rune Points (cult-granted) | Stress (accumulates upward; starts at 2) |
| Direction | Player spends it deliberately | Player spends it deliberately | World inflicts it; player tries to shed it |
| Gained/recovered by | ¼ POW per 6 hours rest | 1/day (priests); holy days (initiates) | Gain on failed saves, ship hits, no rest, horror. Shed via Fear save after 6h rest |
| Trigger roll | None — spend and it works | None — spend and it works | Panic Check: 2d10 vs. current Stress when the Warden calls for it |
| Outcome table | Spell effects (chosen) | Spell effects (chosen) | Panic Effect: 2d10 + Stress → Laser Focus (2–3) up to Heart Attack (30) |
| Mitigation | Countermagic, Dispel | Reflection, Absorption | Resolve: −1 per point to Panic Effect rolls (max 5) |
| Permanent costs | INT limits spells in memory | Permanent POW sacrifice to learn | Permanent phobias, madness, character loss (Effect 29) |
| Resistance mechanic | POW vs. POW resistance table | POW vs. POW resistance table | Saves: Sanity, Fear, Body vs. d% |

### Key Practical Differences

**A resource you own vs. a meter that owns you.** RQ magic is agency: you choose when to spend POW, which spell to cast, when to sacrifice for Rune Magic. MS Stress is anti-agency: the world adds it, you can't refuse it, and the only decisions are about shedding it (rest, safe port, Resolve) before the next Panic Check. RQ's second meter empowers; MS's second meter menaces.

**Escalation is built into MS.** Failing saves adds Stress; higher Stress makes Panic more likely; several Panic results *add more Stress* (Anxious, Overwhelmed) or hurt the group (Nervous Twitch, Marine class rule: nearby crew make Fear saves when a Marine panics). RQ has no equivalent doom spiral — spent magic points simply come back with rest.

**Group contagion.** MS Stress is social: Scientists leak Stress to the party on failed Sanity saves, Androids impose Disadvantage on nearby Fear saves, and seeing a crewmate die or panic triggers rolls. RQ magic is individual — the closest analogue, Spirit Combat, is a private POW-vs-POW duel.

**Converting between them:** there is no direct port. If you want RQ-style dread in Glorantha, the Panic engine transplants cleanly: treat POW as the Save target for Sanity-type checks, give characters a Stress track starting at 2, and call Panic Checks on Chaos encounters, first kills, and friend deaths. Going the other way, giving MS characters Battle Magic breaks the horror premise — better to model strange powers as one-use items or Mysticism-gated rituals with Stress costs.

---

## 4. Coinage, Encumbrance, and Movement

### Coinage

| System | Denominations | Base unit | Starting wealth |
|---|---|---|---|
| Mothership | Credits (cr) only | Credit | 5d10 × 10 cr (or 5d10 cr + free loadout) |
| RuneQuest | Wheels (20 L), Lunars, Clacks (0.1 L) | Lunar | By background (typically 25–500 L) |

**Price comparison (anchored on a basic melee weapon):**

| Item | MS price | RQ price |
|---|---|---|
| Knife/Scalpel | 50 cr | 5–10 L (dagger) |
| Sword-class melee (Vibechete / Broadsword) | 75 cr | 100 L |
| Sidearm (Revolver) / Self bow | 750 cr | ~75 L |
| Best personal armor (Adv. Battle Dress / Plate) | — (military issue) | 1,200 L |
| First Aid Kit / Healing potion | 75 cr | ~100 L |

At the personal-gear level, **1 cr ≈ 1 Lunar** is a workable baseline. But the MS economy runs on a second tier RQ lacks entirely: firearms cost 750–12,000 cr, mercenary salaries run 100–8,000 cr/month, and ships cost ~10 million cr per hull point with institutional debt (10% of all earnings). RQ's economy tops out at plate armor and war horses; MS's economy is the campaign (working jobs, paying crew, servicing ship debt).

**Neither game links treasure to advancement.** RQ improves skills through use; MS awards XP for surviving and exploring. Money in both games buys capability (training in RQ, gear/mercenaries/ships in MS), not levels.

### Encumbrance

| Topic | Mothership | RuneQuest |
|---|---|---|
| Unit | Abstract weight units per item | ENC (weighted units) |
| Maximum | Strength (Adv. Battle Dress exoskeleton: ×2) | Average of STR + CON, capped at STR |
| Penalty type | Simple: over limit = encumbered | Graduated: per ENC over max → movement, Defense, SR, skill penalties |
| Armor mobility cost | Heavy armor: Speed checks at Disadvantage; Strength check to move full allotment | Armor ENC counts against limit; no separate check |

### Movement

| Topic | Mothership | RuneQuest |
|---|---|---|
| Combat movement | ½ Speed stat in meters per action (full Speed with both actions) | 8 melee units/round; movement costs Strike Ranks |
| Sprinting | Both actions = Speed in meters (~30–40 m) | 24 m/round (3× walk) |
| Exploration scale | Not defined — scene-based horror pacing | Turn = 1 min scenario scale; 120 m/Turn walking |
| Long distance | Ship travel: days/weeks/years by drive rating; jumps in cryosleep | Walking 20 km/day; cavalry 40 km/day |

MS ties movement to the Speed stat itself (a Speed 40 character moves 40 m/round flat out), while RQ uses fixed racial move rates modified by encumbrance. At the campaign scale they are incommensurable: RQ measures overland travel in km/day, MS measures it in jump-drive ratings and months of cryosleep.

---

## 5. Conversion Guidelines

Use these when porting creatures, characters, or encounters between systems.

### Skill Conversion

Both systems are d100 roll-under, so success chances transfer directly — the work is in re-basing skills onto stats:

- **RQ → MS:** An RQ weapon skill% becomes the MS Combat stat + skill bonus. Broadsword 55% ≈ Combat 45 + Trained (+10). Knowledge skills map to Intellect + the nearest MS skill; agility skills to Speed.
- **MS → RQ:** Add the MS stat and skill bonus, use the total as the RQ skill%. Combat 40 + Firearms (+15) → 55% weapon skill.

| Concept | Mothership | RuneQuest |
|---|---|---|
| Untrained attempt | Bare stat (Disadvantage if complex) | Base chance (05–25% typical) |
| Competent professional | Stat + Trained ≈ 45–55% | Skill 50–60% |
| Veteran specialist | Stat + Expert ≈ 60–70% | Skill 75–90% |
| Master | Stat + Master ≈ 75–85% | Skill 100%+ |

### Armor Conversion

The models are incompatible (save bonus vs. damage absorption); convert by protective tier:

| MS Armor | Save bonus | ≈ RQ Equivalent | AP |
|---|---|---|---|
| Standard Crew Attire | +0% | Clothing | 0 |
| Hazard Suit | +5% | Leather | 1–2 |
| Vaccsuit | +7% | Cuirboilli | 3 |
| Standard Battle Dress | +10% | Chainmail | 4–5 |
| Advanced Battle Dress | +15% | Plate | 6 |

*MS → RQ: give the creature AP on all locations per the table. RQ → MS: convert AP to an Armor Save around 25 + (AP × 5)%.*

### HP and Damage Conversion

MS Health pools are ~5× RQ totals, and MS damage dice are correspondingly larger:

| Measure | Mothership | RuneQuest |
|---|---|---|
| Average human total | Health ≈ 60–70 (STR × 2) | Total HP ≈ 8–14 |
| Light weapon | 1d10 (avg 5.5) | 1d6 (avg 3.5) |
| Standard weapon | 2d10–3d10 (avg 11–16.5) | 1d8+1 (avg 5.5) |
| Heavy weapon | 4d10–5d10 (avg 22–27.5) | 2d8 (avg 9) |

- **MS → RQ:** Divide Health by 5 for RQ total HP; distribute across locations normally. Convert Xd10 damage to roughly Xd6 ÷ 2 (round up): a Revolver (3d10) becomes ~2d6, a Pulse Rifle (5d10) becomes ~2d6+3 — heavy crossbow territory.
- **RQ → MS:** Multiply total HP by 5 for Health. Convert damage by fraction of a human pool: an RQ greatsword (2d8, ~75% of an average human's HP) should deal ~4d10 in MS terms.

Note the design asymmetry this reveals: an average RQ sword blow removes ~50% of a human's HP; an average MS revolver shot removes ~25% of Health. RQ melee is proportionally deadlier — but MS compensates with Panic, no parries, and 5d10 military hardware.

### Monster Conversion

MS creatures and mercenaries use Combat, Instinct (a catch-all for everything else), Hits or Health, and Loyalty:

- **MS → RQ:** Combat → attack skill%. Instinct → POW and the average of other characteristics (Instinct 40 ≈ POW 13). Health ÷ 5 → total HP. Mercenary "Hits" (die in 1–2 hits) ≈ RQ HP 4–8.
- **RQ → MS:** Attack skill% → Combat. POW × 3 → Instinct. Total HP × 5 → Health. A creature's terror rating has no RQ source — assign Panic triggers by fiction (Chaos monsters = Fear save on sight, Sanity save on their stranger abilities).

### Saves and the Resistance Table

| MS Save | RQ Equivalent |
|---|---|
| Sanity | INT × 5 roll, or POW vs. POW on the resistance table |
| Fear | POW × 5 roll |
| Body | CON × 5 roll |
| Armor | No equivalent — use armor AP absorption |

The RQ resistance table (active POW vs. passive POW, 50% at parity, ±5% per point) can stand in for any opposed MS check; conversely, MS's opposed d% roll (both roll under, higher success wins) is a fast replacement for the resistance table.

### Coinage Conversion

| Mothership | ≈ RuneQuest |
|---|---|
| 1 Credit | 1 Lunar (personal gear tier) |
| 10 Credits | 1 Wheel ÷ 2 |
| Firearm prices (750–12,000 cr) | No equivalent — treat as iron/enchanted weapon tier (500–5,000 L) |
| Ship prices (millions) | No equivalent — temple or city-scale wealth |

---

*Sources: Mothership Player's Survival Guide (1e) mechanics reference; RuneQuest Classic 2nd edition (Chaosium 2016 reprint) mechanics reference.*
