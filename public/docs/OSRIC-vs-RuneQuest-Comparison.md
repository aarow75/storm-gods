# OSRIC vs. RuneQuest Classic — Mechanics Comparison

*Comparing OSRIC (Old School Reference and Index Compilation, v2.2) against RuneQuest Classic 2nd edition (Chaosium 2016 reprint). Abbreviations: OS = OSRIC, RQ = RuneQuest.*

---

## 1. Combat

### The Fundamental Difference

OSRIC and RuneQuest share old-school DNA but resolve combat through fundamentally different philosophies:

- **OS:** A class-and-level system using a d20 against a descending Armor Class target. Both sides roll — the attacker rolls d20 to hit the defender's AC; the defender rolls saving throws when relevant. Combat is fast and lethal at low levels; high-level characters become increasingly durable.
- **RQ:** A percentile, classless system where both sides roll simultaneously. The attacker rolls their weapon skill%; the defender rolls their parry% or dodge%. No class determines your combat ability — your practiced weapon skills do. Hit locations and armor-by-location create granular, realistic damage.

The structural contrast is stark: OSRIC abstracts combat into a single to-hit roll with a fixed damage die; RuneQuest resolves every attack as a simultaneous exchange with location-specific outcomes. An OSRIC fighter attacking a plate-armored knight simply needs to roll ≥ AC 3 on d20 (THAC0 20 at level 1 = need 17+). An RQ fighter attacking the same enemy rolls their Broadsword%, the knight rolls their Shield parry%, and the AP absorption of both armor and shield affects only the specific location struck.

### Combat Comparison Table

| Topic | OSRIC | RuneQuest |
|---|---|---|
| Core mechanic | d20 + to-hit bonus ≥ AC target (roll high) | d100 ≤ skill% (roll low); both sides roll simultaneously |
| Armor abstraction | Sets AC (descending; 10 = unarmored, 3 = plate) | Absorbs damage per location (AP 1–6 by material) |
| Monster attacks | Monsters roll d20 to hit players normally | Monsters roll their skill% normally; players roll parry/dodge in response |
| Hit locations | None — single HP pool | 7 locations (humanoid D20 table), each with own HP |
| Shield | +1 to AC | Parry weapon; weapon's HP absorbs damage; shields absorb more |
| Initiative | Both sides roll d6; higher roll wins (acts first) | Strike Rank (lower SR acts first): SIZ + DEX modifier + weapon SR |
| Round length | 1 minute (10 segments) | 12 seconds |
| Actions per round | 1 attack (fighters get 3/2 or 2 at higher levels); casters spend segments casting | 1 attack + 1 parry reaction; additional attacks via Split Attack |
| Critical hits | None (optional rules exist but not in core) | Roll ≤ 5% of skill → full damage, ignores armor on normal parry |
| Fumbles | None (optional) | Roll 96–00 → d100 fumble table (40 entries) |
| Charging | +2 to hit, double movement; defender's longer weapon strikes first | Not a separate rule (covered by Strike Rank weapon modifiers) |
| Parrying | Forfeit your attack to subtract "to-hit" bonus from opponent's roll | Roll parry%; weapon's HP absorbs damage from successful attack |
| Dying | 0 HP = unconscious (−1 HP/round); −10 HP = dead | Location ≤ 0 HP = impaired; total HP ≤ 0 = instant death |
| Subdual damage | Half "real," half non-lethal (by agreement) | No equivalent |
| Two-weapon fighting | −2 primary / −4 off-hand (off-hand limited to dagger/hatchet) | Allowed; off-hand parries; specific rules by weapon combination |

### Key Tactical Differences

**Level vs. skill.** OSRIC fighters gain better to-hit as they gain levels (level 7–12: 3 attacks per 2 rounds; 13+: 2 per round). Their attack bonus and AC both improve with equipment and level. RQ characters have no levels — their Broadsword skill might go from 55% to 85% over a campaign, but they never gain "extra attacks" from leveling. High-skill RQ fighters use Split Attack (divide skill among multiple attacks) rather than gaining bonus attacks.

**The THAC0/AC system.** OSRIC's "To Hit Armor Class 0" means each class has a table number (e.g., level 1 fighter THAC0 = 20). To find the roll needed: THAC0 − target AC. Fighter vs. AC 5 chainmail: 20 − 5 = 15 (needs 15+ on d20 = 30% hit chance). As fighters level, THAC0 improves (level 10 = THAC0 11: hits AC 5 on 6+ = 75%). RQ has no equivalent progression — only the character's weapon skill% changes.

**Round length dramatically affects magic.** OSRIC's 1-minute round means casters declare and commit to spells before initiative rolls. A 1-segment spell fires in segment 1; a 9-segment spell fires in segment 9. Interrupting a caster (dealing damage before their segment) cancels the spell. RQ's 12-second round with Strike Rank means a low-SR caster fires a 1-POW spell on SR 2; a 3-POW spell resolves on SR 4. OSRIC gives magic more planning tension; RQ makes casting timing feel more tactical within a round.

**The 100%+ rule (RQ only).** RQ characters can exceed 100% skill; each point above 100% reduces the opponent's parry or dodge before they roll. There is no equivalent progression in OSRIC — bonuses improve to-hit, not the opponent's defense.

---

## 2. Character Advancement

### Advancement Comparison Table

| Topic | OSRIC | RuneQuest |
|---|---|---|
| Structure | Class/level; 11 classes; racial level caps | Classless; individual skill advancement; no level cap |
| XP trigger | 1 GP recovered = 1 XP; monster XP by HD tier | Mark a skill after stressful successful use; improve at session end |
| Advancement roll | None — accumulate XP to threshold, then train | Roll d100 *higher* than current skill% + INT modifier → +5% |
| Training required | Yes: ~1,500 gp and 1d4 weeks per level | Yes (optional): 50 × current rating in Lunars per +5%; max 75% |
| HP gain per level | Roll class HD + CON modifier (caps after 9–11 levels) | HP is fixed (CON + SIZ ÷ 2); does not scale with time |
| Combat power curve | Steep: level 10 fighter vastly outperforms level 1 in HP, attacks, and saves | Gradual: a master skill at 85% vs. 55% is meaningful but not overwhelming |
| Class restrictions | Alignment, ability scores, race requirements (Paladin: Str 12, Wis 13, Cha 17, Lawful Good) | No class; any character can learn any skill |
| Henchmen/followers | Charisma governs max henchmen; available at appropriate levels | No formal henchmen system |
| Spellcaster progression | Spell slots per day scale with level; new spell tiers unlock at set levels | POW is fixed; Battle Magic learned individually; Rune Magic requires POW sacrifice |

### Probability Worked Example

**OS: level 1 Fighter vs. level 5 Fighter attacking AC 5 (chain)**
- Level 1 (THAC0 20): needs 15+ on d20 → 30% hit chance
- Level 5 (THAC0 16): needs 11+ on d20 → 50% hit chance
- Level 9 (THAC0 12): needs 7+ on d20 → 70% hit chance
- OSRIC fighters double in combat effectiveness across 9 levels

**RQ: Broadsword at 55% vs. Broadsword at 85%**
- At 55%: hit chance 55% (assuming no parry)
- At 85%: hit chance 85%
- Improvement is meaningful, not multiplicative — the character is better, not categorically different
- Both characters are potentially lethal to each other; RQ lacks the level-tiered power gulf

OSRIC advancement creates a strong power curve: a level 10 party should face categorically harder challenges than a level 3 party. RQ advancement is cumulative skill improvement; a highly experienced RQ character is more reliable, not exponentially more powerful.

---

## 3. Magic

### Magic System Comparison Table

| Topic | OSRIC (Arcane & Divine) | RQ Battle Magic | RQ Rune Magic |
|---|---|---|---|
| Access | Class-gated: Magic User, Illusionist, Cleric, Druid, Paladin (level 9+), Ranger (level 8+) | Learned from any teacher; all characters eligible | Requires cult initiation; limited to cult spell list |
| Resource | Spell slots per day (class + level dependent) | POW points (characteristic score) | Rune Points (cult-granted; separate pool) |
| Casting roll | None — spells always work if cast; only interruption stops them | None — spend POW, automatic effect | None — spend Rune Points, automatic effect |
| Failure | Only if interrupted during casting (damage = spell lost) | N/A | N/A |
| Memorization | Arcane: must study spell book each morning; Clerics: granted automatically | Held in mind; INT limits simultaneous POW in memory | Learned permanently; always available to cast |
| New spells | Arcane: find scrolls/books; chance to comprehend (Int-based, 35–90%); max spells/level by Int | Learned from practitioners or research | Learned permanently via permanent POW sacrifice |
| Resource recovery | Full recovery after 8 hours sleep | ¼ of total POW per 6 hours | 1 point/day (priests); holy days only (initiates) |
| Spell levels | Arcane: 9 spell levels; Cleric: 7 spell levels | Roughly equivalent to 1–4 POW cost | Stack levels at +1 Rune Point +1 SR |
| Area of effect | Ranges from touch to 20-ft radius (level-dependent) | Typically targeted; some area effects | Varies; generally targeted |
| Counter-magic | *Dispel Magic* (specific spell) | *Countermagic* 1–3: absorbs incoming spells | *Reflection*, *Absorption* |
| Spirit magic | No equivalent subsystem | Spirits fight via POW vs. POW; Shaman extended rules | Shamans have extended spirit world access |

### Key Practical Differences

**Memorize-and-forget vs. resource pool.** OSRIC mages prepare specific spells each morning and forget them on casting (Vancian magic). A Magic User with two 3rd-level spell slots must choose *Fireball* or *Lightning Bolt* in the morning — casting one means the slot is gone until sleep. RQ Battle Magic doesn't require pre-selection: spend POW and the spell fires. This makes OSRIC magic more strategic (morning preparation) and RQ magic more reactive (spend at will until out).

**Reliability.** Both systems make magic reliable once initiated: OSRIC spells always work if cast without interruption; RQ Battle Magic always works if you have the POW. The key difference is that OSRIC spells can be interrupted (damage during casting), while RQ Battle Magic is declared and the POW is committed at the start of a round — interruption doesn't exist in the same way.

**Permanent costs (RQ only).** Learning a Rune Spell requires permanently sacrificing POW. That POW is gone from the characteristic forever. OSRIC mages pay nothing permanent — they just need to find or buy new spell scrolls and comprehend them (an Int-based chance). RQ Rune Magic represents a character permanently changing to invest in divine power.

**Alignment and divine magic.** OSRIC clerics must follow alignment requirements; evil clerics control undead rather than turning them. RQ has no alignment — cult membership and passions define divine access. An RQ Chalana Arroy cultist can't cast offensive spells; an OSRIC cleric of any alignment has access to the same cleric spell list (mostly).

---

## 4. Coinage, Encumbrance, and Movement

### Coinage

| System | Denominations | Base unit | GP to XP? |
|---|---|---|---|
| OSRIC | CP, SP, EP, GP, PP | Gold Piece (GP) | Yes: 1 GP = 1 XP |
| RuneQuest | Lunars (L) primarily | Lunar | No XP-gold link |

**Price comparison (anchored on a sword):**

| Item | OSRIC price | RQ price |
|---|---|---|
| Dagger | 2 gp | 5–10 L |
| Longsword | 15 gp | 100 L (Broadsword) |
| Chainmail | 75 gp | 300 L |
| War horse (heavy) | 500+ gp | ~500 L |
| Plate armor | 400 gp | 1,200 L (Full Plate) |

The longsword comparison gives **≈ 1 OSRIC GP ≈ 6–7 RQ Lunars**. Plate armor diverges significantly — RQ plate is proportionally far more expensive relative to swords. Use 1 GP ≈ 6 L as a baseline; adjust for high-value items.

**The GP = XP economy matters for OSRIC.** Recovering 600 gp from a dungeon gives all party members 600 XP each (or divided by party, depending on house rules). RQ characters earn no XP from treasure — their advancement is entirely skill-practice driven. This makes OSRIC campaigns treasure-focused by design in a way RQ is not.

### Encumbrance

| Topic | OSRIC | RuneQuest |
|---|---|---|
| Unit | Pounds | ENC (weighted units) |
| Maximum | 150 lbs + Str bonus | Average of STR + CON, capped at STR |
| Penalty type | Stepped: weight determines max movement rate | Graduated: per ENC over max → penalties to movement, Defense, SR, skills |
| Armor movement limit | Armor independently limits movement regardless of weight | No separate armor movement limit |
| Granularity | Fine (items measured in lbs and fractions) | Fine (items measured in ENC; knife = 0.25, chainmail = 5) |

**OSRIC's armor-as-movement-cap is unique.** A character in chainmail can carry only 30 lbs before hitting the 90 ft/round movement tier, but even carrying nothing, chainmail limits max move to 90 ft/round. RQ simply penalizes skills and movement per ENC over limit — no hard category cap from armor alone.

### Movement

| Topic | OSRIC | RuneQuest |
|---|---|---|
| Base movement (human) | 120 ft/round (in combat) | 8 melee units/round (abstract melee scale) |
| Running/scenario scale | 240 ft/round if unencumbered | 120m/Turn (1 min) at scenario scale; 240m running |
| Long distance | Not defined explicitly | Walking 20 km/day; marching 30 km/day; cavalry 40 km/day |
| Time scale (exploration) | Turn = 10 minutes (dungeon exploration) | Turn = 1 minute (scenario scale); melee scale abstract |
| Small races | −30 ft from all movement (dwarves, gnomes, halflings = 90 ft base) | No race-based movement modifiers in the same way |

OSRIC's 10-minute Turn is a dungeon exploration unit — wandering monster checks, torch duration, and spell durations track in Turns. RQ uses a 1-minute Turn at scenario scale with melee as abstract positioning, not precise distance. The two games have incompatible timekeeping for exploration; use whichever system's encounter procedures fit the tone of the session.

---

## 5. Conversion Guidelines

Use these when porting creatures, characters, or encounters between systems.

### Attack Bonus to Skill%

OSRIC to-hit numbers can be converted to approximate RQ skill% by matching success probability:

| OSRIC Roll Needed (d20) | Success % | ≈ RQ Skill% |
|------------------------|-----------|-------------|
| 20 (needs exactly 20) | 5% | 5–10% |
| 17+ | 20% | 20% |
| 15+ | 30% | 30% |
| 12+ | 45% | 45% |
| 9+ | 60% | 60% |
| 6+ | 75% | 75% |
| 3+ | 90% | 90% |

*OSRIC → RQ: calculate the THAC0 roll needed vs. the enemy's AC; convert to a percentage; assign that as the RQ skill%. RQ → OSRIC: convert skill% to a d20 roll needed by dividing by 5 and subtracting from 21.*

### Armor Conversion

OSRIC armor sets AC (lower = better); RQ armor absorbs damage (higher = better). Convert:

| OSRIC Armor | AC | ≈ RQ Equivalent | AP |
|-------------|-----|-----------------|-----|
| No armor | 10 | No armor | 0 |
| Leather | 8 | Leather | 1 |
| Ring mail | 7 | Ringmail | 2 |
| Chain mail | 5 | Chainmail | 4 |
| Plate mail | 3 | Platemail | 6 |

*Formula: RQ AP ≈ (10 − OSRIC AC) × 0.75 (rounded). The relationship is not perfectly linear — use the table above as the primary reference.*

When running OSRIC creatures in RQ, assign AP per location equal to the armor conversion above, applied uniformly.

### HP Conversion

| Level/Tier | OSRIC HP range | RQ HP range |
|------------|---------------|-------------|
| Starting | 4–10 (d4–d10 by class) | 8–14 (CON+SIZ÷2) |
| Mid (level 5) | 15–35 | 8–14 (unchanged) |
| High (level 10) | 40–70+ | 8–14 (unchanged) |

RQ HP does not scale with experience. OSRIC HP diverges massively at higher levels. When converting:
- **OSRIC → RQ:** Use OSRIC starting HP as the RQ HP total. High-level OSRIC characters are inherently more durable than RQ equivalents — accept this as a genre difference or cap at 18–20 HP.
- **RQ → OSRIC:** Treat RQ HP as level 1–2 OSRIC HP. Assign an appropriate level (level 1 for new characters, level 5–7 for veteran RQ characters).

### Monster Conversion

OSRIC monsters use Hit Dice; RQ monsters use fixed stats. Convert HD to RQ HP roughly as:
- **OSRIC HD × 4.5** = average HP (use this as RQ total HP)
- Distribute across RQ hit locations using standard fractions if needed
- Assign OSRIC monster THAC0 → RQ attack% using the attack bonus table above
- Assign OSRIC monster AC → RQ armor using the armor table above

### Magic Conversion

| OSRIC | ≈ RQ Equivalent |
|---|---|
| 1st-level spell slot (Magic User) | RQ Battle Magic 1–2 POW spell |
| 3rd-level spell slot | RQ Battle Magic 3–5 POW spell or Rune Magic |
| 5th-level+ spell slot | RQ Rune Magic (major effect) |
| Cleric turning undead | RQ spirit combat vs. POW |
| Spell memorization limit (Int-based) | INT × 2 limits total POW in memory (RQ) |

### Alignment Conversion

OSRIC's 9-alignment grid has no direct RQ equivalent. Map as follows for NPC tone:

| OSRIC Alignment | RQ Tone |
|-----------------|---------|
| Lawful Good | Order/Light cult member (Yelm, Lankhor Mhy) |
| Neutral Good | Chalana Arroy cultist (healing, pacifist) |
| Chaotic Good | Orlanth initiate (rebellious, honorable) |
| Lawful Neutral | Lunar Empire affiliate |
| True Neutral | Unaffiliated farmer/merchant |
| Chaotic Neutral | Trickster cultist |
| Lawful/Neutral Evil | Lunar military (ruthless order) |
| Chaotic Evil | Chaos cult (Vivamort, Thanatar) |

### Coinage Conversion

| OSRIC | ≈ RQ |
|---|---|
| 1 Copper Piece | 1 Clack (0.1 Lunar) |
| 1 Silver Piece | ½ Lunar |
| 1 Gold Piece | 6 Lunars |
| 1 Platinum Piece | 30 Lunars |

---

*Sources: OSRIC v2.2 mechanics reference; RuneQuest Classic 2nd edition (Chaosium 2016 reprint) mechanics reference.*
