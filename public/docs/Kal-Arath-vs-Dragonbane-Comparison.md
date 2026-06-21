# Kal-Arath vs. Dragonbane — Mechanics Comparison

*Comparing the Kal-Arath rules (Castle Grief, 2023) against the Dragonbane Core Rulebook (Free League, 2023). Abbreviations: KA = Kal-Arath, DB = Dragonbane.*

---

## 1. Combat

### The Fundamental Difference

Both games use player-facing combat — players roll for both attacks and defense rather than having enemies roll to attack them. The architecture of that player-facing design, however, works on different mathematical foundations:

- **KA:** Roll 2d6 + stat, meet or beat 8. The bell curve of 2d6 means the modifier is decisive. A stat of +2 gives 72% success; +0 gives 41%. Crits and fumbles require double-6 or double-1 — rare and dramatic.
- **DB:** Roll d20 ≤ skill. The flat distribution means every skill point matters equally. A skill 12 gives 60% success; a skill 15 gives 75%. Crits and fumbles are always 1 (Dragon) and 20 (Demon), regardless of skill.

Both games have players roll to dodge on enemy turns:
- **KA:** 2d6 + AGI ≥ 8. Standard success negates all damage. Failure applies full weapon damage minus armor reduction.
- **DB:** d20 ≤ EVADE skill (or weapon skill for a parry). A successful defense negates all damage. Failure means taking full damage minus AR.

The feel diverges at the weapon level. KA groups weapons into three damage tiers (Light/Medium/Heavy) with exploding dice. DB assigns specific damage dice to each weapon (d4 to 2d6) with unique critical effects per weapon but no explosion.

### Combat Comparison Table

| Topic | Kal-Arath | Dragonbane |
|---|---|---|
| Core mechanic | 2d6 + stat ≥ 8 | d20 ≤ skill (roll-under) |
| Roll distribution | Bell curve (2d6; peaks at 7) | Flat (d20; all values equally likely) |
| Stat range | Modifiers: −1 to +5 | Raw scores: 3–18+ (used directly as skill ceiling) |
| Attack roll | 2d6 + STR (melee), AGI (missile), INT (magic) | d20 ≤ weapon skill (trained) |
| Defense | Player rolls 2d6 + AGI ≥ 8 on enemy turn | Player rolls d20 ≤ EVADE or weapon skill (parry) |
| Monster attacks | No roll — players always roll dodge | No roll — players always roll defense vs. difficulty 15 |
| Hit locations | None — single HP pool | None — single HP pool |
| HP range | d6 + TOU at creation (typically 6–9) | CON score (typically 10–14) |
| Armor | Flat reduction: Light −1, Medium −2, Heavy −3 | Flat AR subtracted from damage: 1–6 |
| Damage dice | d6/d, d6, or d6/a; dice explode on 6 (reroll once, add to total) | d4 to 2d6 by weapon; no explosion |
| Critical hit | Double-6 → double all damage dice (then explode normally) | Roll 1 (Dragon) → roll D6 on critical table |
| Fumble | Double-1 → some setback | Roll 20 (Demon) → roll D6 on fumble table |
| Boon / disadvantage | Disadvantage: roll 3d6, take 2 worst. Advantage: roll 3d6, take 2 best | Bane: roll 2d20, take worst. Boon: roll 2d20, take best |
| Initiative | d6 + AGI; on 4+ the player's side goes first (binary, per side) | Draw card 1–10; lower card acts first (granular, per character) |
| Round length | Not defined (abstract, a few seconds) | 10 seconds |
| Actions per round | Move + one action (attack, dodge, spell, etc.) | 1 action + 1 fast action (or 2 fast actions) |
| Dying | Roll on Death & Wounding table at 0 HP (cumulative −2 per hit) | 0 HP → Broken; D20 death roll each round |
| Instant death | D&W roll result of 2; or adjusted roll results in severe outcome | Single hit ≥ max HP |

### Key Tactical Differences

**Distribution shape matters.** KA's bell curve means extreme results (very high or very low) occur less often than median results. A KA fighter rolling 2d6+2 will cluster around 9–12 — usually a comfortable success. DB's flat d20 means any result is equally likely; a trained skill-12 character fails 40% of the time regardless of "how good" they roll. Variance in DB is higher for individual rolls, but the mean stays more predictable per skill level.

**Weapon differentiation.** In KA, all weapons in the same size category deal the same damage but have different special effects on crits (a sword counterattacks; a mace stuns; a flail ignores shields). DB has per-weapon damage dice (dagger d6, longsword d8, two-handed sword 2d8) plus unique crit effects. DB is more granular about the damage output; KA is more uniform but uses explosion to create high-variance outcomes.

**Initiative granularity.** KA's binary initiative (one side goes first, then the other) simplifies play. DB's card draw creates a meaningful action order within a round — card 3 acts before card 7, which can affect whether a spell or a sword swing resolves first. This makes DB initiative more tactically interesting but requires tracking the card order.

**Parry vs. dodge.** In DB, any weapon can parry, cleanly negating all damage on success. In KA, the only defense is a dodge roll. There is no weapon parry system in KA. A shield in KA adds −1 to all incoming damage (and can be sacrificed to reduce one attack's damage to 0); a shield in DB is treated as armor (+1 AR) or can be used for a shield parry.

---

## 2. Character Advancement

### Advancement Comparison Table

| Topic | Kal-Arath | Dragonbane |
|---|---|---|
| XP / check trigger | 1 XP per meaningful session; bonus XP for major events | Roll a Dragon (1) on a *trained* skill during play |
| Improvement roll | At XP threshold → choose HP roll or stat increase | End of session: roll d20 *higher* than current skill level |
| HP advancement | Roll 6d6 vs. current HP; higher → +d6 HP; equal/lower → +1 HP | No HP advancement per level (HP = CON score, fixed) |
| Stat advancement | +1 to any stat (max +5) | Ability scores can improve via specific profession advances |
| Skill system | 4 broad categories; pick one unlockable perk at levels 1, 3, 5, 9 | ~50 individual skills; each trained or untrained |
| Rate of improvement | Fast at low levels (1 XP/session → level 1 after 1 session); slows at high XP thresholds | Slow and luck-dependent; roughly 2.5% chance to improve any given skill per session |
| Practical ceiling | Stat +5 (97% success) | Skill ~18 (rolling above 18 on D20 is nearly impossible) |

### Probability Worked Example

Both systems produce slow advancement, but through different mechanisms:

**KA: raising STR from +1 to +2**
- Requires reaching the next level threshold (e.g., level 2 costs 2 XP total)
- At 1 XP/session and occasional bonus XP, typical rate is 1–2 sessions per early level
- Effect: attack success improves from 58% to 72%
- This is predictable and GM-driven; no luck required for the stat to improve

**DB: improving Swords from skill 10 to skill 11**
- ~5% chance to roll a Dragon on an untrained action per use (~10% if trained)
- ~50% chance to roll above skill 10 on the session improvement roll
- Combined: roughly 2.5–5% per session
- Expected sessions to improve: 20–40

KA advancement is faster and more predictable. DB advancement is extremely slow and luck-dependent, rewarding consistent play over many sessions with a rare +1 skill increment. KA characters feel growth in every few sessions; DB characters feel minor growth over many sessions.

---

## 3. Magic

### Magic System Comparison Table

| Topic | Kal-Arath (Demonic Pacts) | Dragonbane (Magic Schools) |
|---|---|---|
| Access | Choose one pact (6 available): Blood, Destruction, Corruption, Illumination, Shadow, Domination | Choose school skills; each school is a separate skill (Animism, Elementalism, Mentalism, etc.) |
| Resource | None — no WP or point pool is spent | Willpower Points (WP = WIL score) |
| Casting roll | 2d6 + INT ≥ difficulty (tier 1 = 8, tier 2 = 9, up to tier 5 = 12) | d20 ≤ magic school skill |
| Failure | Take 1 HP damage; cannot cast again until rest | No effect; WP still spent |
| Catastrophic failure | Double-1 → Arcane Disaster (2d6 table: demon possession, stat loss, permanent HP drain, etc.) | Roll 20 (Demon) → d6 on Magical Mishap table |
| Critical success | Double-6 → effect maximized or doubled | Roll 1 (Dragon) → spell works at maximum effect |
| Spell tiers | 5 tiers per pact; tier accessed requires INT ≥ tier; difficulty increases by tier | Power Levels 1–3; cost 2/4/6 WP per level |
| Resource recovery | N/A (no resource) | d6 WP on 15 min rest; full WP on 6-hour shift rest |
| Armor penalty | None specified | Metal armor gives bane on all magic school rolls |
| Pact / school obligations | Dooms: behavioral taboos; violating them breaks the pact | None (schools are neutral skills) |
| Spell count | 5 spells per pact; additional pacts via Mystic skill | Unlimited spells per school (skill advances normally) |

### Key Practical Differences

**Resource vs. risk.** DB magic spends WP on every cast — it's a consumable resource that limits how often magic is used per adventure and recovers overnight. KA magic has no WP equivalent — spells can be attempted freely, but failure costs HP and prevents further casting until rest. KA mages have unlimited "attempts" at the cost of staying healthy; DB mages have a fixed budget of WP per day.

**Catastrophic failure comparison.** Both systems have magic mishap/disaster tables triggered by the worst roll (double-1 in KA, Demon/20 in DB). KA's Arcane Disaster table is more severe: results include permanent stat loss, HP drain, demon possession, and permanent psychic damage. DB's Magical Mishap table is serious but mostly scene-disrupting rather than character-ending. KA magic is a higher-stakes gamble.

**Spell access vs. skill training.** KA spells are all available immediately once a pact is made — all five tiers exist, limited only by INT score and tier difficulty. DB spells require learning the school skill; the skill must be trained and improved like any other skill. DB mages advance slowly (same Dragon-roll advancement as all skills); KA mages can immediately attempt any spell in their pact at creation.

**Tier 5 KA spells are extreme.** The highest KA tier spells (requiring INT +5) include instant killing an individual with a d6 chance to gain a level (*Void of the Black Lotus*) and unleashing a planetary plague outbreak (*Forbidden Temple of the 7th Sigil*). DB's most powerful spells are potent but not civilization-altering by design.

---

## 4. Coinage, Encumbrance, and Movement

### Coinage

Both KA and DB use silver as their primary currency denomination, making conversion straightforward.

| System | Denominations | Base unit |
|---|---|---|
| Kal-Arath | Silver (s) only | Silver; all prices listed in silver |
| Dragonbane | Copper (CP), Silver (SP), Gold (GP) | Silver; 10 CP = 1 SP, 10 SP = 1 GP |

**Price comparison:**

| Item | KA price | DB price |
|---|---|---|
| Dagger | d6s (~3s) | 5–10 SP |
| Simple sword | 15s | 50 SP |
| Leather armor | 30s | 20 SP |
| Good horse | d6×100s | 500 SP |
| Healing item | d6s (herbs, various) | 50 SP (basic healing) |

KA prices are ranges (d6, d6×10, d6×100 categories), not fixed values. A KA iron sword at 15s maps to roughly DB 15 SP. The economies are roughly **1 KA silver ≈ 1–2 DB Silver Pieces** for most equipment. Where KA price ranges are wide, use the DB price as a fixed anchor and assign the appropriate KA category.

### Encumbrance

| Topic | Kal-Arath | Dragonbane |
|---|---|---|
| Unit | Item count | Item count (each item = 1 slot) |
| Maximum | STR + 8 items | STR ÷ 2 items (rounded up) |
| Penalty (over limit) | All physical rolls at disadvantage | All physical rolls at bane |
| Double the limit | Cannot move | No defined double-limit rule |
| Granularity | Coarse — all items equal 1 | Coarse — all items equal 1 |

Both systems use item count rather than weight, and both apply a binary penalty (disadvantage/bane) for overloading. KA is more generous with the base limit: a STR +0 character can carry 8 items; the equivalent DB character with STR 12 carries 6 items. The penalty in practice is identical — rolls at disadvantage in KA, rolls with bane in DB — since both mean "roll extra dice, take worst."

### Movement

| Topic | Kal-Arath | Dragonbane |
|---|---|---|
| Combat scale | Not defined (abstract) | 10 meters per fast action (base) |
| Running | Not defined | Dash (full action): +10m = 20m total |
| Long distance | 20 miles/day on foot; 40 miles/day mounted | Not defined (implied by GM) |
| Initiative modifier | AGI affects initiative roll (binary result) | AGL affects movement range (−4 at AGL 1–6 to +4 at AGL 16–18) |

KA's overland travel hex system (1 hex = 1 day's travel = ~20 miles) aligns closely with DB's implied pace. KA has extensive overland procedures (weather, foraging, POI, encounters); DB leaves overland travel to GM discretion.

---

## 5. Conversion Guidelines

Use these when porting creatures, characters, or encounters between systems.

### Stat-to-Skill Conversion

KA modifiers and DB raw scores both map to a success probability:

| KA Stat | KA Success % | DB Skill ≈ Equivalent |
|---------|-------------|----------------------|
| −1 | 28% | 5–6 |
| 0 | 41% | 8 |
| +1 | 58% | 11–12 |
| +2 | 72% | 14 |
| +3 | 83% | 16–17 |
| +4 | 92% | 18–19 |
| +5 | 97% | 19–20 (near-cap) |

*KA → DB: multiply success probability by 20 to get approximate DB skill. DB → KA: divide DB skill by 20 to get success probability; find closest KA modifier.*

### HP Conversion

KA HP (d6 + TOU at creation, typically 6–9) is lower than DB HP (CON score, typically 10–14). Adjust:
- **KA → DB:** Multiply KA HP by 1.5 (round to nearest whole) to get DB HP equivalent.
- **DB → KA:** Multiply DB HP by 0.7 to get KA HP equivalent.

KA characters heal 1+TOU HP after each battle (min 1) and d6+TOU on full rest. DB characters heal via the HEALING skill and natural recovery. For compatibility, treat KA battle recovery as equivalent to a DB HEALING roll of modest success.

### Armor Conversion

KA and DB armor reductions are on nearly identical scales:

| KA Armor | Reduction | DB Equivalent | AR |
|----------|-----------|---------------|-----|
| Light | −1 | Leather | 1 |
| Medium | −2 | Studded Leather / Ring | 2 |
| Heavy | −3 | Chain Mail | 3 |
| Shield | −1 | Shield (+1 AR) | +1 |

Convert directly 1:1. KA Heavy (3) maps cleanly to DB Chain Mail (AR 3).

### Damage Conversion

| KA Damage | Average (with explosion) | DB Equivalent |
|-----------|------------------------|---------------|
| d6/d (Light) | ~2.5 | d4 or d6 (dagger, knife) |
| d6 (Medium) | ~4.2 | d8 (short sword, spear) |
| d6/a (Heavy) | ~6.0 | d10 or 2d6 (two-handed sword) |

When running KA weapons in DB, drop the explosion rule and use the nearest DB damage die. When running DB weapons in KA, use the matching size category; add the explosion rule for all d6 dice in KA.

### Magic Resource Conversion

| KA | DB Equivalent |
|---|---|
| No resource pool | WP = INT score (assign for porting purposes) |
| Tier 1–2 spell | Power Level 1 (2 WP cost) |
| Tier 3 spell | Power Level 2 (4 WP cost) |
| Tier 4–5 spell | Power Level 3 (6 WP cost) |

**When running KA mages in DB:** Assign a WP pool equal to INT × 3. Each spell costs WP per the tier. Remove the HP-penalty-on-failure mechanic; use DB's standard "spend WP, roll fails, no effect" rule instead. Keep KA's Arcane Disaster on a Demon (20) result.

**When running DB mages in KA:** Drop WP. Use 2d6 + INT vs. difficulty matching the Power Level (PL 1 = difficulty 8, PL 2 = 9, PL 3 = 10). On failure, take 1 HP damage and lose that casting. On double-1, roll on KA's Arcane Disaster table.

### Coinage Conversion

| KA | DB |
|---|---|
| 1 silver | 1 Silver Piece |
| 10 silver | 1 Gold Piece |
| Copper equivalent | 1 Copper Piece (0.1 silver) |

---

*Sources: Kal-Arath rules reference (Castle Grief, 2023); Dragonbane Core Rulebook mechanics reference (Free League, 2023).*
