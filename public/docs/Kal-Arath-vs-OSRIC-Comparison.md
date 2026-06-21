# Kal-Arath vs. OSRIC — Mechanics Comparison

*Comparing the Kal-Arath rules (Castle Grief, 2023) against OSRIC (Old School Reference and Index Compilation, v2.2). Abbreviations: KA = Kal-Arath, OS = OSRIC.*

---

## 1. Combat

### The Fundamental Difference

Kal-Arath and OSRIC represent opposite poles of old-school RPG design philosophy — both draw from the OSR tradition but diverge dramatically in complexity, scope, and intended play style:

- **KA:** A minimalist system that fits on a handful of pages. All resolution uses 2d6 + stat ≥ 8. Combat is player-facing — players always roll, for both attacks and dodges. The entire system can be taught to a new player in five minutes.
- **OS:** A comprehensive simulation system with dozens of interacting subsystems. Attack resolution uses d20 against descending Armor Class targets, modified by class THAC0, weapon type, and situational modifiers. Monsters roll to attack players. The game expects detailed tracking of spell slots, equipment weight, torch duration, and hireling morale.

Both games are dangerous at low levels and reward tactical thinking, but KA's danger comes from the brutal death-and-wounding table at 0 HP; OSRIC's danger comes from resource depletion, attrition, and positioning. A KA session might end in a dramatic wounding table result after a single failed dodge; an OSRIC session builds toward resource exhaustion across a dungeon level.

### Combat Comparison Table

| Topic | Kal-Arath | OSRIC |
|---|---|---|
| Core mechanic | 2d6 + stat ≥ 8 (roll high, bell curve) | d20 + to-hit bonus ≥ AC target (roll high, flat) |
| Monster attacks | No roll — players dodge (2d6 + AGI ≥ 8) | Monsters roll d20 to hit player AC normally |
| Armor abstraction | Flat damage reduction: Light −1, Medium −2, Heavy −3 | Sets AC (10 = unarmored; plate = AC 3; lower = better) |
| Hit locations | None — single HP pool | None — single HP pool |
| Shields | −1 damage reduction; can be sacrificed to negate one attack entirely | +1 to AC |
| Damage | d6/d, d6, or d6/a by weapon size; dice explode on 6 | d4 to 3d6 by weapon; weapon vs. S/M and L targets tracked separately |
| Critical hit | Double-6 → double damage dice (then explode) | None in core rules |
| Fumble | Double-1 → setback (broken weapon, fall prone, etc.) | None in core rules |
| Initiative | d6 + AGI; on 4+ players go first (binary, per side) | Both sides roll d6; higher wins (binary, per side; ties = simultaneous) |
| Round length | Abstract (a few seconds) | 1 minute (10 segments of 6 seconds) |
| Actions per round | Move + attack; OR move + dodge; OR throw/drink/etc. | 1 attack; higher-level fighters gain 3/2 or 2 attacks |
| Two-weapon fighting | Roll both weapons; take best damage result | −2 primary / −4 off-hand; off-hand limited to dagger or hatchet |
| Dying | Roll on 12-entry Death & Wounding table at 0 HP | 0 HP = unconscious (−1 HP/round); −10 HP = dead |
| Instant death | D&W result of 2 | Any damage while unconscious |
| Healing after combat | 1 + TOU HP immediately after each battle | None; only magic or rest |
| Morale | 2d6 vs. morale rating when triggered (50% reduction, leader lost, etc.) | Percentage check; modifiers for kills/casualties |

### Key Tactical Differences

**Who rolls when.** In KA, players roll for everything — attack *and* defense. On the enemy's turn, the player rolls 2d6 + AGI ≥ 8 to dodge. In OSRIC, monsters roll their own attack dice against player AC. A KA player is active every round; an OSRIC player waits during enemy turns.

**Bell curve vs. flat distribution.** KA's 2d6 + stat system clusters around middle results. A stat of +2 gives 72% success; going from +2 to +3 improves that to 83%. The middle of the bell curve is very reliable. OSRIC's d20 is flat — a fighter needing 11+ on d20 hits 50% of the time, and there's the same probability of rolling a 1 as rolling a 20. OSRIC combat is more swingy per individual roll; KA combat is more predictable per stat level.

**The damage dice difference.** KA uses three uniform damage categories (Light d6/d, Medium d6, Heavy d6/a) with exploding 6s. OSRIC uses specific weapon damage dice (dagger 1d4, longsword 1d8, two-handed sword 1d10, with separate damage vs. large creatures). OSRIC weapon selection matters more for tactical reasons; in KA, picking a longsword over a scimitar is flavoring, not a statistical difference.

**OSRIC's 1-minute round abstracts extensively.** A 1-minute OSRIC combat round represents many blows, parries, and feints — the single d20 roll abstracts them all. KA's abstract "a few seconds" implies shorter rounds but never specifies duration. For combat pacing, KA rounds are faster (one roll each way); OSRIC rounds involve more bookkeeping (initiative, segment tracking for spells, charging rules, etc.).

---

## 2. Character Advancement

### Advancement Comparison Table

| Topic | Kal-Arath | OSRIC |
|---|---|---|
| Structure | No classes; 4 broad skill categories (Warrior/Rogue/Mystic/Explorer) | 11 distinct classes with strict ability/alignment requirements |
| XP trigger | 1 XP per meaningful session; bonus for major events | 1 GP recovered = 1 XP; monster XP by HD tier |
| Advancement mechanism | At XP threshold: choose HP increase or +1 stat | Accumulate XP to class threshold; train for ~1,500 gp and 1d4 weeks |
| HP progression | Roll 6d6 vs. current HP (rolling higher = +d6 HP; else +1 HP) | Roll class HD + CON modifier each level (caps at level 9–11) |
| Stat progression | +1 to any stat per advancement choice (max +5) | Stats fixed after creation; no improvement by default |
| Class skills / abilities | Choose 1 perk from category at levels 1, 3, 5, 9 | Class abilities unlock at specific levels (e.g., Ranger shapeshift at level 7) |
| Races | None (all player characters are human-scale) | 7 races (Dwarf, Elf, Gnome, Half-Elf, Half-Orc, Halfling, Human) with racial modifiers and level caps |
| Henchmen / followers | None | Charisma governs max henchmen; extensive recruitment and morale rules |
| Power ceiling | Stat +5 (97% success) with 4 perk selections | Level 15+ (class-dependent); some classes have hard racial level caps |

### Philosophy Comparison

**KA advancement is fast and flexible.** 1 XP per session means a character might reach "level 2" after a single session, with advancement choices coming regularly in early play. The binary choice (HP or stat) keeps every level-up meaningful and personalized. A KA fighter who never takes the Warrior stat-perk is still viable; one who focuses exclusively on STR upgrades becomes an elite striker.

**OSRIC advancement is XP-driven and class-locked.** A OSRIC fighter can never become a mage mid-campaign (dual-classing requires abandoning class abilities). A thief's ability set is defined at creation and expands along a fixed track. XP rewards treasure recovery — a party that finds 10,000 GP gets 10,000 XP each, advancing much faster than a party who fights monsters but finds little gold. This incentivizes exploration and resource recovery over combat.

**Scale diverges dramatically at high levels.** A level 10 OSRIC fighter has 60–80 HP, 2 attacks per round, and a substantially improved THAC0. A KA character at their equivalent experience level might have 20–30 HP and STR +4, attacking at 92% success. The power gap between a level 1 and level 10 OSRIC fighter is categorical; in KA, progression is additive and measured.

---

## 3. Magic

### Magic System Comparison Table

| Topic | Kal-Arath (Demonic Pacts) | OSRIC Arcane Magic | OSRIC Divine Magic |
|---|---|---|---|
| Access | Choose one pact (6 available); any character via Mystic skill | Magic User or Illusionist class required | Cleric, Druid, Paladin (level 9+), Ranger (level 8+) required |
| Resource | None — no point pool is spent | Spell slots per day (class + level) | Spell slots per day (auto-granted by deity) |
| Casting roll | Yes: 2d6 + INT ≥ difficulty (8 for Tier 1; +1 per tier up to 12 for Tier 5) | None — spells work automatically if cast | None — spells work automatically if cast |
| Failure | 1 HP damage; no more casting until rest | Only if interrupted by damage during casting | Only if interrupted during casting |
| Catastrophic failure | Double-1 → Arcane Disaster (2d6 table; results include demon possession, permanent stat loss) | N/A | N/A |
| Spell tiers / levels | 5 tiers per pact; tier requires INT ≥ tier value | 9 spell levels; unlock via class level advancement | 7 spell levels; unlock via class level |
| Maximum spells | 5 per pact; additional pacts via Mystic skill | Int-based limit per spell level per day | Wisdom-based bonus spells |
| Resource recovery | N/A (no resource) | Full recovery after 8 hours sleep | Full recovery after 8 hours sleep |
| New spells | All 5 pact spells available immediately (limited by INT tier access) | Find scrolls/books; Int-based comprehension roll; max spells/level by Int | Automatically granted by deity (no research required) |
| Armor restriction | None | No armor allowed (Magic Users/Illusionists) | Any armor (Clerics); leather only (Druids) |
| Pact obligations | Dooms: behavioral taboos (metal prohibition, monthly sacrifices, silence vows, etc.) | None | Alignment restrictions; can only cast spells from deity's domain |

### Key Practical Differences

**Risk vs. certainty.** KA magic always risks failure — the caster rolls every time, and failure costs HP and access. OSRIC magic that has been memorized and begins casting *cannot fail* (only physical interruption stops it). For combatants deciding whether to trust their caster, OSRIC magic is a reliable resource; KA magic is a calculated gamble.

**The Doom system is unique to KA.** KA mages must observe ongoing behavioral restrictions (their Doom) or lose their powers entirely. A caster bound by "cannot use metal weapons or armor" is meaningfully constrained in equipment choices. A caster who "must speak demon prayers aloud" cannot cast silently and draws attention. OSRIC mages have alignment restrictions and cannot wear armor, but suffer no ongoing behavioral obligations.

**Scope of spells.** OSRIC's 9-level spell system produces the genre's classic high-end effects (*Wish*, *Gate*, *Power Word Kill*, *Meteor Swarm*). KA's Tier 5 spells are extremely powerful in their own right (plague outbreaks, instant kill with level gain, mass mind control of 600+ people), but they operate on a different narrative register — KA's power feels dark and personal; OSRIC's escalates to godlike cosmological force.

**Arcane vs. divine split.** OSRIC divides magic between arcane (learned, intellectual, no inherent moral orientation) and divine (faith-based, alignment-constrained, granted by a deity). KA has no such split — all magic is demonic in origin. A KA healer uses the Pact of Illumination; a KA combat caster uses Destruction or Blood. There is no "safe" magic in KA, only magic with different pacts and costs.

---

## 4. Coinage, Encumbrance, and Movement

### Coinage

| System | Denominations | Base unit | XP link? |
|---|---|---|---|
| Kal-Arath | Silver (s) only | Silver | None |
| OSRIC | CP, SP, EP, GP, PP | Gold Piece | Yes: 1 GP = 1 XP |

KA uses only silver pieces; OSRIC uses a five-tier denomination system anchored on gold. The economies reflect different scales: OSRIC expects characters to accumulate thousands of GP per dungeon haul; KA prices are modest silver amounts (d6 for a meal, d6×100 for major items).

**Price comparison:**

| Item | KA price | OSRIC price |
|---|---|---|
| Dagger | d6s (~3s) | 2 gp |
| Iron sword | 15s | 15 gp (longsword) |
| Leather armor | 30s | 5 gp |
| Chainmail | (Medium armor: d6×100s) | 75 gp |
| War horse | d6×100s (~350s) | 200–500+ gp |
| Healing item | d6s (herbs) | 25 gp (holy water) or varies |

The sword comparison gives **≈ 1 KA silver ≈ 1 OSRIC GP**. This matches for weapons but diverges for armor (KA leather at 30s vs. OSRIC leather at 5 gp suggests KA has higher relative armor costs). Use **1 KA silver ≈ 1 OSRIC GP** as a default conversion.

### Encumbrance

| Topic | Kal-Arath | OSRIC |
|---|---|---|
| Unit | Item count | Pounds |
| Maximum | STR + 8 items | 150 lbs + Str weight bonus |
| Penalty type | Disadvantage on all physical rolls | Stepped: weight determines movement rate (120/90/60/30 ft) |
| Armor movement cap | None | Yes: chainmail limits max move to 90 ft regardless of weight |
| Granularity | Coarse (all items = 1 slot) | Fine (items measured in specific pounds) |

### Movement

| Topic | Kal-Arath | OSRIC |
|---|---|---|
| Overland travel | 20 miles/day on foot (hex = 1 day's walk); 40 miles/day mounted | Not specified in core; implied ~20 miles/day standard |
| Combat scale | Abstract | 120 ft/round (30 ft steps per segment) |
| Dungeon exploration | Not formalized | Turn = 10 minutes; encounter checks per Turn |
| Small races | N/A (no races) | Dwarves/gnomes/halflings: −30 ft from all movement rates |

KA's overland hex travel procedure (weather, foraging, POI rolls, encounter checks) is more detailed than anything in OSRIC's core rules. OSRIC assumes the GM handles overland travel; KA provides explicit solo-play procedures for wilderness days.

---

## 5. Conversion Guidelines

Use these when porting creatures, characters, or encounters between systems.

### Stat-to-THAC0 Conversion

KA stats produce a known success probability that can map to an OSRIC to-hit roll needed:

| KA Stat | KA Success % | d20 Roll Needed (OSRIC equiv.) |
|---------|-------------|-------------------------------|
| −1 | 28% | 15+ (6 in 20 = 30%) |
| 0 | 41% | 12+ (9 in 20 = 45%) |
| +1 | 58% | 9+ (12 in 20 = 60%) |
| +2 | 72% | 6+ (15 in 20 = 75%) |
| +3 | 83% | 4+ (17 in 20 = 85%) |
| +4 | 92% | 2+ (19 in 20 = 95%) |
| +5 | 97% | 1+ (always hits) |

*KA → OSRIC: find the roll needed that matches the KA stat success probability. OSRIC → KA: convert the attack success% to the nearest KA stat modifier.*

### Armor Conversion

| KA Armor | Reduction | OSRIC Equivalent | AC |
|----------|-----------|------------------|----|
| No armor | 0 | No armor | 10 |
| Light | −1 | Leather | 8 |
| Medium | −2 | Ring mail / Scale | 7 |
| Heavy | −3 | Chain mail | 5 |
| Shield | −1 | Shield | +1 AC |

*Formula: OSRIC AC ≈ 10 − (KA reduction × 1.5). KA armor reduction × 1.5 = AC reduction from 10.*

### HP Conversion

| KA HP (starting) | OSRIC equivalent |
|-----------------|-----------------|
| 4–6 HP | Level 1 Wizard/Magic User (d4 HP) |
| 6–9 HP | Level 1 Cleric (d8) or Fighter (d10) |
| 10–15 HP (wounded veteran) | Level 2–3 Fighter |

When converting OSRIC monsters to KA:
- **1 HD monsters** → d6 HP in KA
- **Each additional HD** → +d6 HP (e.g., 4 HD → 4d6 HP)
- Apply the conversion from the KA dungeon monster rules: HD to d6 HP dice

When converting KA monsters to OSRIC:
- KA HP ÷ 4.5 = approximate OSRIC HD
- Round to nearest whole HD; assign standard damage for that HD tier

### Magic Conversion

| KA Tier | INT Required | ≈ OSRIC Equivalent |
|---------|-------------|-------------------|
| Tier 1 (difficulty 8) | +1 | 1st-level spell |
| Tier 2 (difficulty 9) | +2 | 2nd-level spell |
| Tier 3 (difficulty 10) | +3 | 3rd-level spell |
| Tier 4 (difficulty 11) | +4 | 5th–6th-level spell |
| Tier 5 (difficulty 12) | +5 | 8th–9th-level spell |

**When running KA mages in OSRIC:** Treat as a Magic User with spell slots equal to the tiers accessible (INT +2 mage = 2nd-level MU with 2 × 1st-level and 1 × 2nd-level slot). Assign a 65% chance for each spell attempt (average INT +2 KA caster maps to ~70% success). On a natural 1, trigger an Arcane Disaster.

**When running OSRIC mages in KA:** Assign INT modifier = approximate MU level ÷ 3 (level 6 MU = INT +2 in KA). Spell slots become "spells per rest" with the equivalent tier. Remove slot tracking; allow free casting but apply KA's HP-on-failure mechanic.

### Encounter Scale Comparison

OSRIC expects dungeon levels filled with rooms, wandering monster checks per Turn, and systematic treasure placement by dungeon level. KA provides a much lighter dungeon procedure (d6 dice pool for areas, area type table). When importing an OSRIC dungeon into KA:
- Convert each room encounter to KA monsters using the HD conversion above
- Strip detailed room furnishing; focus on traps, foes, and key treasure
- Use KA's death-and-wounding table as the consequence system; OSRIC's room-by-room tracking doesn't translate well

### Coinage Conversion

| KA | OSRIC |
|---|---|
| 1 silver | 1 Gold Piece |
| 10 silver | 1 Platinum Piece |
| Cheap items (d6s category) | 1–5 cp to 5 sp |
| Moderate items (d6×10s category) | 5 gp to 50 gp |
| Expensive items (d6×100s category) | 50 gp to 600+ gp |

Note: the KA economy produces far fewer absolute monetary units than a typical OSRIC haul. A KA treasure of 200 silver is significant; 200 OSRIC GP is a modest dungeon find. Adjust expectations accordingly when running crossover campaigns.

---

*Sources: Kal-Arath rules reference (Castle Grief, 2023); OSRIC v2.2 mechanics reference.*
