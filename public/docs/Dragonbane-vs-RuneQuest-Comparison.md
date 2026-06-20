# Dragonbane vs. RuneQuest Classic — Mechanics Comparison

*Comparing Dragonbane Core Rulebook against RuneQuest Classic 2nd edition (Chaosium 2016 reprint). Abbreviations: DB = Dragonbane, RQ = RuneQuest.*

---

## 1. Combat

### The Fundamental Difference

Both games resolve attacks as roll-under tests, but the *structure* of a combat exchange is opposite:

- **DB:** The attacker rolls to hit. If they hit, the *defender* rolls a reaction (EVADE or weapon parry). Only one side rolls at a time per exchange.
- **RQ:** Both attacker and defender roll simultaneously. The attacker rolls their attack skill; the defender rolls their parry or dodge. Critical/fumble results on either side modify the outcome.

This has a downstream effect on monster combat:

- In **DB**, monsters don't roll to attack at all. Instead, players roll EVADE or a weapon skill to defend against a fixed difficulty (base 15). Players always have a chance to avoid damage.
- In **RQ**, monsters roll their full attack percentages just as player characters do, and players roll parry/dodge in response. Both sides can fumble.

### Combat Comparison Table

| Topic | Dragonbane | RuneQuest |
|---|---|---|
| Attack roll | D20 ≤ skill (success) | D100 ≤ skill% (success) |
| Defense | Defender reacts: EVADE roll or weapon parry roll | Defender rolls parry simultaneously; both rolls resolved together |
| Monster attacks | No attack roll — players roll defense vs. difficulty 15 | Monsters roll normally; players roll parry/dodge in response |
| Hit locations | None — single HP pool | 7 locations (humanoid D20 table), each with own HP |
| Armor | Flat AR subtracted from all damage to HP pool | AP absorbed per location; remaining damage to that location's HP |
| Initiative | Draw card 1–10; lower card acts first | Strike Rank (lower SR acts first); calculated from SIZ + DEX modifiers + weapon SR |
| Round length | 10 seconds | 12 seconds |
| Actions per round | 1 action + 1 fast action (or 2 fast actions) | 1 attack + 1 parry reaction; additional attacks by Split Attack |
| Critical hits | Dragon (1) → roll D6 on crit table | Roll ≤ 5% of skill → full damage, ignores armor on normal parry |
| Fumbles | Demon (20) → roll D6 on fumble table | Roll 96–00 → D100 fumble table (40 entries) |
| Impales | Not in DB | Roll ≤ 20% of skill (impaling weapons only) → max damage, weapon lodged |
| Conditions/wounds | 6 conditions (Exhausted, Sickly, Dazed, Angry, Scared, Grievous Wound); each gives bane to linked attribute | No condition track; damage degrades by location (limb useless at 0, unconscious/dying for torso/head) |
| Dying | 0 HP → Broken; D20 death roll each round; ally can rally with HEALING | Location at 0 HP → unconscious, die in 1D6 rounds without magic; total HP ≤ 0 → instant death |
| Instant death | Single hit ≥ max HP | Location reaches −(location max HP) |

### Key Tactical Differences

**DB boon/bane vs. RQ percentage modifiers.** DB adjusts difficulty by adding D20s to the pool (take lowest = boon; take highest = bane). RQ adjusts by flat % modifiers to the roll (point blank +25%, dim light −10%, etc.). Converting: 1 boon/bane ≈ ±20% in RQ terms.

**Parry mechanics.** In DB, a successful parry negates all damage. In RQ, a successful parry reduces damage by the weapon's HP rating — a knife (HP 4) parrying a two-handed sword (2D8 damage) will absorb very little. Shields are the reliable parry tools in RQ; in DB any weapon parries cleanly.

**The 100%+ rule (RQ only).** Rune Lords can exceed 100% skill. Every point above 100% subtracts from the opponent's parry or dodge skill before the roll. There is no equivalent in DB.

---

## 2. Skill Improvement

### Improvement Comparison Table

| Topic | Dragonbane | RuneQuest |
|---|---|---|
| Trigger to earn a check | Roll a Dragon (1) on a *trained* skill during play | Successfully use a skill in a stressful situation |
| Improvement roll | End of session: roll D20 *higher* than current skill level | End of session: roll D100 *higher* than current skill% (adjusted by INT modifier) |
| Gain on success | +1 to skill (scale is roughly 3–20) | +5% to skill (scale is 0%–100%+) |
| Training available? | GM discretion; no cost or rules given | Yes: costs 50 × current rating in Lunars per +5%; requires a teacher; max 75% via training |
| Practical ceiling | ~18 (rolling higher than 18 on D20 is nearly impossible) | 75% via training; higher only via experience; Rune Lords can exceed 100% |
| Rate of improvement | Very slow; luck-dependent | Moderate; faster at low skills, slows at high percentages |

### Probability Worked Example

Assume a character with a skill at the midpoint of each system's range:

**DB at skill 10:**
- Chance to roll Dragon (1) = 5%
- Chance to then beat 10 on D20 at session end = 50%
- Combined chance of improving per session ≈ **2.5%**
- Expected sessions to improve: ~40

**RQ at skill 50%:**
- Roughly 50% chance of a stressful success in a session (generous estimate)
- Chance to beat 50% + INT modifier on D100 ≈ 50%
- Combined chance of improving per session ≈ **25%**
- Expected sessions to improve: ~4

RQ advancement is roughly 10× faster at equivalent skill levels. DB advancement is a slow drip that rewards consistent play over many sessions.

### Training

DB has no priced training system for weapon/combat skills. RQ's training costs scale steeply: raising a weapon skill from 70% to 75% costs 70×50 = 3,500 Lunars — a significant investment that makes higher-tier characters expensive to maintain through training alone.

---

## 3. Magic in Combat

### Three Magic Systems Side by Side

| Topic | DB (all schools) | RQ Battle Magic | RQ Rune Magic |
|---|---|---|---|
| Resource | Willpower Points (WP = WIL score) | POW points (POW characteristic) | Rune Points (stored separately) |
| Resource recovery | D6 WP on round rest; all WP on shift rest (~6 hrs) | 1/4 of total POW per 6 hours | 1 point/day for Rune Priests (worship); holy days only for initiates |
| Casting roll required? | Yes — roll magic school skill; fail = no effect but WP still spent | No roll — spend POW, spell takes effect automatically | No roll — spend Rune Points, spell takes effect automatically |
| Catastrophic failure | Demon (20) → roll D20 on Magical Mishap table | N/A (no roll) | N/A (no roll) |
| Critical success | Dragon (1) → spell works at maximum effect | N/A (no roll) | N/A (no roll) |
| Casting timing | Action (immediate, resolves this round) | Declared at round start; resolves after movement and missiles; SR = 1 per POW point spent |  Same SR structure as Battle Magic |
| Spell preparation | Must be prepared before casting (prep during rest); INT base chance limits number prepared | Held in mind; INT limits simultaneous POW in memory | Learned permanently via permanent POW sacrifice |
| Power scaling | Power Levels 1–3; cost 2/4/6 WP | Most spells 1–4 levels; 1 POW per level | Stack levels at +1 Rune Point +1 SR each |
| Armor penalty | Metal armor = bane on all magic school rolls | None | None |
| Counter-magic | Dispel (General Magic) ends one magical effect | Countermagic 1–3: absorbs incoming spells ≤ that POW level | Reflection 1–4: reflects spells back; Absorption 1–4: converts absorbed spell to POW |
| Spirit Combat | Not a subsystem in DB | Spirits fight via POW vs. POW (both roll D100 ≤ Spirit Combat skill); damage reduces POW | Shamans have extended spirit world access; Spirit Block spell reduces spirit damage |

### Key Practical Differences

**Reliability vs. Risk.** RQ Battle Magic never fails — if you have the POW, the spell works. DB casting can roll a Demon and trigger a D20 mishap (anything from taking D6 damage to aging D6 years to having your grimoire destroyed). DB mages are gambles; RQ Battle Magicians are predictable.

**Resource availability.** DB WP is generous: full recovery after 6 hours of sleep, partial recovery after 15 minutes of rest. RQ POW recovers at 1/4 per 6 hours — a character with POW 12 recovers 3 POW per 6 hours. A typical combat might spend 6–8 POW, taking 12–16 hours to fully recover. DB magic is roughly 24× more available per unit of time.

**Rune Magic is a permanent investment.** Learning a Rune Spell requires sacrificing POW permanently — POW that is gone from your characteristic forever. The spell's "slots" are then available and recharge through worship. DB has no equivalent permanent cost; all WP is always recoverable.

**Timing matters in RQ.** Because Battle Magic resolves on a specific SR (1 SR per POW spent), a 3-POW spell cast on SR 1 resolves on SR 4. A fighter with SR 3 acts *before* that spell lands. DB has no equivalent timing tension — spells resolve when you take your action.

---

## 4. Coinage, Encumbrance, and Movement

### Coinage

| System | Denominations | Base unit |
|---|---|---|
| Dragonbane | Copper Piece (CP), Silver Piece (SP), Gold Piece (GP) | Silver Piece; 10 CP = 1 SP, 10 SP = 1 GP |
| RuneQuest | Lunars (L) | Lunars only (in this source) |

**Price comparison (anchored on a standard sword):**

| Item | DB price | RQ price |
|---|---|---|
| Basic sword | 50 SP | 100 L (Broadsword) |
| Dagger/Knife | 5–10 SP | 5–10 L |
| Leather armor | 20 SP | 30 L |
| Chainmail | 80 SP | 300 L |
| War horse | 500 SP | ~500 L (war horse) |

The sword comparison suggests **2 SP ≈ 1 Lunar** at similar quality levels. Chainmail diverges sharply (80 SP vs. 300 L), reflecting RQ's more granular armor economy. Use the sword anchor (2:1) as the default conversion rate.

**Conversion:** 2 DB Silver Pieces = 1 RQ Lunar | 1 DB Gold Piece ≈ 5 RQ Lunars | 1 DB Copper Piece ≈ 0.5 RQ Lunars (round to nearest Lunar for practical play)

### Encumbrance

| Topic | Dragonbane | RuneQuest |
|---|---|---|
| Unit | Item count (each item = 1 slot regardless of size) | ENC (weighted units; knife = 0.25, chainmail = 5) |
| Maximum | STR ÷ 2, rounded up | Average of STR+CON, capped at STR |
| Penalty type | Binary: over limit = bane on all physical rolls | Graduated: per ENC over max → −1 movement unit, −5% Defense, +1 SR, −5% all skills |
| Granularity | Coarse — a knife and a two-handed sword are both "1 item" | Fine — a knife (0.25 ENC) vs. a two-handed sword (2 ENC) vs. chainmail (5 ENC) |

**Example:** A character with STR 12, CON 12:
- **DB:** Can carry 6 items (STR ÷ 2). Sword + shield + chainmail + 3 items = exactly at limit.
- **RQ:** Max ENC = (12+12)÷2 = 12. Broadsword (1.5) + Shield (2) + Chainmail (5) = 8.5 ENC — still has 3.5 ENC of room.

RQ rewards careful load management with a sliding penalty scale; DB punishes any overload equally regardless of how far over you are.

### Movement

| Topic | Dragonbane | RuneQuest |
|---|---|---|
| Scale | Meters (literal distance) | Melee units (abstract); scenario scale in meters; long distance in km/day |
| Human base speed | 10m per fast action | 8 melee units per round (melee scale); 120m per Turn (1 min) at scenario scale |
| Running | Dash (full action): +10m = 20m total in a round | Running: 240m per Turn = 40m/round at scenario scale |
| Mounted (combat) | RIDING check required in combat; no listed combat movement rate | War Horse Move 16 melee units/round; 1,000m per Turn at scenario scale |
| Long distance | Not defined (implied by GM) | Walking 20 km/day; marching 30 km/day; cavalry 40 km/day |
| AGL/DEX modifier | AGL affects movement: −4 (AGL 1–6) to +4 (AGL 16–18) | DEX modifies Strike Rank, not movement directly |

**Scale note:** RQ's melee units are deliberately abstract and don't convert cleanly to meters. At scenario scale, a human walks 120m/minute, which implies ~24m per 12-second round — faster than DB's 10m per fast action. The discrepancy reflects different design priorities: DB is tactical (every meter matters on a literal map); RQ melee scale is relative positioning (who can reach whom in a round), not absolute distance.

---

## 5. Conversion Guidelines

Use these when porting creatures, characters, or encounters between systems.

### Skill Conversion

| Direction | Formula | Example |
|---|---|---|
| DB → RQ | RQ% = DB skill × 5 | DB Swords 12 → RQ Broadsword 60% |
| RQ → DB | DB skill = RQ% ÷ 5 (round to nearest whole, min 3 max 20) | RQ Swords 75% → DB Swords 15 |

*Round-trip check: DB 12 → RQ 60% → DB 12 ✓*

Trained DB skills typically run 8–14, equating to RQ 40–70% — the working range of a competent but not elite RQ fighter. An elite DB skill of 16–18 maps to RQ 80–90%, appropriate for a Rune Lord.

### HP Conversion

Both systems produce similar total HP for humanoids (DB CON score ≈ RQ total HP), so total HP transfers roughly 1:1.

**Running RQ creatures in DB:** Drop hit locations; use total HP as the DB HP pool.

**Running DB creatures in RQ:** Distribute total HP across locations using these fractions:

| Location | Fraction of total HP |
|---|---|
| Head | × 0.30 |
| Chest | × 0.45 |
| Abdomen | × 0.35 |
| Each arm | × 0.25 |
| Each leg | × 0.35 |

*(Fractions are approximate; round to nearest whole number.)*

### Armor Conversion

DB AR and RQ AP use the same scale (both go 1–6 for body armor). Convert directly 1:1.

| DB Armor | AR | RQ Equivalent | AP |
|---|---|---|---|
| Leather | 1 | Leather | 1 |
| Studded Leather | 2 | Ringmail | 2 |
| Chain Mail | 3 | Scalemail | 3 |
| Plate Armor | 4 | Chainmail | 4 |
| Full Plate | 6 | Platemail + Shield | 5+1 |

### Magic Resource Conversion

| DB | ≈ RQ equivalent |
|---|---|
| WP (Willpower Points) | POW points |
| DB Power Level 1 (2 WP) | RQ 1–2 POW spell |
| DB Power Level 2 (4 WP) | RQ 3–4 POW spell |
| DB Power Level 3 (6 WP) | RQ 5–6 POW spell |

**Recovery caveat:** DB WP recovers fully in 6 hours; RQ POW recovers 1/4 per 6 hours. When importing RQ POW-based limits into DB, treat them as WP costs but allow full recovery on a shift rest rather than the RQ rate. When importing DB magic into RQ, note that DB mages can cast far more often — consider limiting DB-sourced casters to 2–3 spells per combat before requiring rest.

### Initiative Conversion

Both systems use lower = acts first.

- **DB card → RQ SR:** Subtract card value from 11. (Card 1 → SR 10; Card 5 → SR 6; Card 10 → SR 1)
- **RQ SR → DB card:** Subtract SR from 11. (SR 3 → Card 8)

This is an approximation — RQ Strike Ranks extend beyond 10 for slow weapons, while DB cards cap at 10. For RQ SR values above 10, treat as DB card 1 (acts last among those who have a card).

### Encumbrance Conversion

For quick compatibility:
- Treat each DB item slot as 1 ENC in RQ.
- DB max items (STR÷2) ≈ RQ max ENC (STR+CON÷2).
- For heavier items, use the RQ ENC value if known; for anything without an RQ stat, assign 1 ENC per DB item.

### Coinage Conversion

| DB | RQ |
|---|---|
| 1 Copper Piece | ½ Lunar (round down; 2 CP = 1 L) |
| 1 Silver Piece | ½ Lunar (2 SP = 1 L) |
| 1 Gold Piece | 5 Lunars |

### Conditions → RQ Wound Penalties

When running DB's condition system in RQ (e.g., for narrative convenience over tracking hit locations):

| DB Condition | Linked Attribute | RQ Equivalent Penalty |
|---|---|---|
| Exhausted | AGL | −10% to all DEX-based skills |
| Sickly | CON | −10% to CON rolls; −1 to CON-derived HP for the scene |
| Dazed | INT | −10% to Perception and Knowledge skills |
| Angry | CHA | −10% to social skills; must attack most threatening target |
| Scared | WIL | −10% to POW rolls; cannot willingly approach the source of fear |
| Grievous Wound | STR | Treat as a limb at 0 HP (useless); or −10% to attack and STR rolls if location not tracked |

---

*Sources: Dragonbane Core Rulebook mechanics reference; RuneQuest Classic 2nd edition (Chaosium 2016 reprint) mechanics reference.*
