# Kal-Arath vs. RuneQuest Classic — Mechanics Comparison

*Comparing the Kal-Arath rules (Castle Grief, 2023) against RuneQuest Classic 2nd edition (Chaosium 2016 reprint). Abbreviations: KA = Kal-Arath, RQ = RuneQuest.*

---

## 1. Combat

### The Fundamental Difference

Both games use player-facing combat — players always roll dice — but the resolution systems beneath that shared trait are structurally opposite:

- **KA:** A flat stat modifier system. Roll 2d6 + stat; meet or beat a fixed target (8 for standard tasks). The bell curve of 2d6 means the modifier is decisive: a +2 character succeeds 72% of the time; a +0 character succeeds only 41%.
- **RQ:** A percentile roll-under system. Roll d100 ≤ skill%. Modifiers shift the percentage directly. A character with Broadsword 65% succeeds 65% of the time, and the linear distribution makes each 5% increment feel equally meaningful.

Both games are player-facing for defense:
- In **KA**, when it is the enemy's "turn," the player rolls 2d6 + AGI vs. 8 to dodge. Success negates all damage. Failure means taking full weapon damage minus armor reduction.
- In **RQ**, both attacker and defender roll simultaneously — the attacker rolls their attack%, the defender rolls their parry% or dodge. Whether the defender rolls under their skill determines how much (if any) damage they absorb.

The critical difference is what happens at the extremes. In KA, a double-6 always succeeds and a double-1 always fails (with catastrophic results for magic). In RQ, rolling ≤ 5% of your skill is a critical hit; rolling 96–00 is a fumble. Both create dramatic high/low moments, but RQ ties those moments to your skill level — only master combatants crit frequently.

### Combat Comparison Table

| Topic | Kal-Arath | RuneQuest |
|---|---|---|
| Core mechanic | 2d6 + stat ≥ 8 | d100 ≤ skill% |
| Roll distribution | Bell curve (2d6 peaks at 7) | Linear (d100 is flat) |
| Attack roll | 2d6 + STR ≥ 8 (melee); 2d6 + AGI ≥ 8 (missile); 2d6 + INT ≥ 8 (magic) | d100 ≤ attack skill% |
| Defense | Player rolls 2d6 + AGI ≥ 8 to dodge on enemy's turn | Player rolls d100 ≤ parry% or dodge% simultaneously with attacker |
| Monster attacks | No attack roll — players roll dodge vs. difficulty 8 | Monsters roll their attack% normally; players roll parry/dodge in response |
| Hit locations | None — single HP pool | 7 locations (humanoid D20 table), each with own HP |
| Armor | Flat reduction: Light −1, Medium −2, Heavy −3, Shield −1 | AP absorbed per location; varies 1–6 by armor type |
| Damage dice | Explode: 6s are rerolled once and added to total (max 12 per die) | No explosion; damage is final on the roll |
| Critical hit | Double-6 → double all damage dice (then explode as normal) | Roll ≤ 5% of skill → full damage, ignores armor on a normal parry |
| Fumble | Double-1 → some setback (broken weapon, fall prone, etc.) | Roll 96–00 → d100 fumble table (40 entries) |
| Initiative | d6 + AGI; on 4+ the player's side goes first (binary) | Strike Rank (lower SR acts first): SIZ modifier + DEX modifier + weapon SR |
| Round length | Abstract "a few seconds" | 12 seconds |
| Actions per round | Move + attack; or move + dodge; or throw/drink/etc. | 1 attack + 1 parry reaction; additional attacks via Split Attack |
| Dual wielding | Roll both weapons, take best damage roll | Not directly equivalent; two weapons add complexity to parry |
| Dying | Roll on Death & Wounding table at 0 HP; cumulative −2 per subsequent hit | Location HP ≤ 0 → impaired/unconscious; total HP ≤ 0 → instant death |
| Instant death | D&W roll result of 2 (or roll adjusted below 7–8 for severe cases) | Location reaches negative of its max HP |

### Key Tactical Differences

**The bell curve matters.** KA's 2d6 creates a probability curve that makes average results likely and extremes rare. In RQ, every percentage point on d100 is equally likely. A KA fighter with STR +2 always has a 72% chance to hit — no equivalent of "raising weapon skill from 20% to 80%" exists. Advancement in KA instead means raising the stat by +1 (e.g., +2 to +3), which bumps success from 72% to 83%.

**Armor covers everything vs. per-location protection.** KA armor reduces all damage from any source by a flat amount. A Medium armor wearer hit for 4 points takes 2. In RQ, armor protects the specific location struck. A chest hit absorbs AP; a head hit only absorbs head armor. This creates RQ's tactical reality: unarmored legs are targets, and a shield matters enormously because it parries the whole blow.

**Exploding damage is a significant KA advantage.** A KA heavy weapon rolls d6 (best of 2d6 = d6/a). On a 6, reroll once and add — potential maximum 12. On a critical (double-6), you double the dice first, then explode. A critical with a heavy weapon could produce 2d6/a with explosion — capable of dropping even a hardened character in one hit. RQ has no equivalent escalation; maximum damage on a weapon is fixed.

**The 100%+ rule (RQ only).** Rune Lords can exceed 100% skill. Every point above 100% subtracts from the opponent's parry or dodge. There is no equivalent in KA.

---

## 2. Character Advancement

### Advancement Comparison Table

| Topic | Kal-Arath | RuneQuest |
|---|---|---|
| XP trigger | 1 XP per meaningful session; bonus XP for major events (max 2 per session) | Mark a skill after a successful stressful use; review at end of session |
| Improvement roll | At XP threshold: choose between HP roll or stat increase | Roll d100 *higher* than current skill% (+ INT modifier); success = +5% |
| HP advancement | Roll 6d6 vs. current HP; rolling higher grants d6 HP, else +1 HP | HP is fixed from CON + SIZ; does not improve on its own |
| Stat advancement | +1 to any stat (max +5) | No equivalent; stats are fixed; skills improve instead |
| Skills | 4 broad categories (Warrior/Rogue/Mystic/Explorer); pick from category list at levels 1, 3, 5, 9 | ~40 individual skills track separately; improve independently |
| Training | Not defined (GM discretion) | Costs 50 × current rating in Lunars per +5%; requires a teacher; caps at 75% |
| Practical ceiling | Stat max +5 (97% success chance on all rolls) | Skills can exceed 100%; 75% via training; higher via experience only |

### Probability Worked Example

**KA: improving from STR +2 to STR +3**
- Current chance to hit: 72%
- New chance to hit: 83%
- This costs one level's advancement choice (forfeiting an HP increase)
- At 1 XP/session and level 3 requiring 3 XP, early improvements are fast; later ones slow

**RQ: improving Broadsword from 65% to 70%**
- Roughly 65% chance of a stressful success per session
- Chance to then beat 65% on d100 ≈ 35%
- Combined chance ≈ 23% per session
- Expected sessions to improve: ~4–5

**KA advancement is structurally different from RQ.** RQ advances narrow skills that become progressively harder to improve (raising 85% requires beating 85% on d100 — a 15% chance). KA advances broad stats where the choice to improve an attack stat also benefits social rolls and vice versa. A KA +3 STR fighter is also harder to grapple, better at feats of strength, and better at dodging (if they'd raised AGI instead). RQ's system rewards specialization and breadth of coverage.

---

## 3. Magic

### Magic System Comparison Table

| Topic | Kal-Arath (Demonic Pacts) | RQ Battle Magic | RQ Rune Magic |
|---|---|---|---|
| Access | Choose one pact (6 available); INT score determines max tier accessible | Learned from teachers or other magicians; POW score limits simultaneous spells in memory | Learned by permanently sacrificing POW; available to cult initiates and priests |
| Resource | None — no WP or POW pool spent on casting | POW points (spent on casting; recovered at ¼ per 6 hours) | Rune Points (separate pool; recharged via worship) |
| Casting roll | Yes: 2d6 + INT ≥ difficulty (8 for Tier 1, +1 per tier) | No roll — spend POW, effect is automatic | No roll — spend Rune Points, effect is automatic |
| Failure | Casting failure: take 1 HP damage; cannot cast again until rest | N/A (no roll) | N/A (no roll) |
| Catastrophic failure | Double-1 → Arcane Disaster table (2d6: demon possession, permanent stat loss, etc.) | N/A (no roll) | N/A (no roll) |
| Critical success | Double-6 → effect doubled or maximized | N/A (no roll) | N/A (no roll) |
| Spell tiers | 5 tiers per pact (difficulty 8–12); access requires INT ≥ tier number | 1–4 POW levels; higher-level spells cost more POW | Stack levels at +1 Rune Point +1 SR each |
| Maximum spells | 5 (one per tier per pact); additional pacts available via Mystic skill | INT limits simultaneous POW in memory | Unlimited Rune Spell access; limited by Rune Points per day |
| Recovery | Full recover on rest (no resource spent anyway) | 1/4 of total POW per 6 hours | 1 point/day (priests); holy days only (initiates) |
| Timing | Cast as an action (this round) | SR 1 per POW point spent (3-POW spell cast SR 1 resolves SR 4) | Same SR structure as Battle Magic |
| Pact obligations | Dooms: taboos the caster must observe or lose their powers | None | Cult obligations; regular worship attendance |
| Armor penalty | None specified in KA rules | None | None |

### Key Practical Differences

**Risk vs. reliability.** KA magic can fail (rolling below the difficulty), with a failure causing immediate HP loss and locking out further spellcasting until a rest. RQ Battle Magic never fails — if you have the POW, the spell works. KA mages are gamblers; RQ Battle Magicians are reliable resources. RQ Rune Mages are also reliable but their resource is far harder to recover.

**Permanent costs vs. permanent risks.** RQ Rune Magic requires sacrificing POW permanently to learn spells — that characteristic point is gone forever. KA magic requires taking on Dooms (behavioral restrictions); violating them breaks the pact. One is a resource cost; the other is a lifestyle constraint.

**No resource pool in KA.** KA casters do not spend a WP or POW equivalent — they simply roll and succeed or fail. This means a Tier 1 spell can be attempted repeatedly (taking 1 HP and ending casting on failure), and a successful caster can cast multiple spells per battle without depleting a resource pool. RQ Battle Mages are strictly limited by their POW supply.

**Spell scope differences.** KA Tier 5 spells are catastrophically powerful (planetary plagues, vast area control, instant kill on one target with a chance to gain a level). RQ Rune Magic operates on a different scale — enhancing combatants, summoning, healing — dramatic but rarely world-altering at the spell level.

---

## 4. Coinage, Encumbrance, and Movement

### Coinage

| System | Denominations | Economy |
|---|---|---|
| Kal-Arath | Silver pieces only | All prices in silver; d6 to d6×100 |
| RuneQuest | Lunars (primarily) | Lunars; some Wheels and Clacks mentioned |

**Price comparison (anchored on a sword):**

| Item | KA price | RQ price |
|---|---|---|
| Simple weapon (dagger) | d6s (~3s average) | 5–10 L |
| Iron sword | 15s | 100 L (Broadsword) |
| Leather armor | 30s | 30 L |
| Chainmail | 200s (Masterwork Chainmail) | 300 L |
| Good horse | d6×100s (~350s) | ~250–500 L (war horse) |

The sword suggests **≈ 1 KA silver ≈ 6–7 RQ Lunars** for standard weapons. This diverges for armor and horses — KA prices are less granular (range categories, not fixed prices). For practical conversion, use **1 KA silver ≈ 6 Lunars** as a baseline.

### Encumbrance

| Topic | Kal-Arath | RuneQuest |
|---|---|---|
| Unit | Item count (STR + 8 maximum) | ENC (weighted units; knife = 0.25, chainmail = 5) |
| Maximum | STR + 8 items | Average of STR + CON, capped at STR |
| Penalty (over limit) | Disadvantage (roll 3d6, take worst 2) on all physical rolls | Per ENC over max: −1 movement, −5% Defense, +1 SR, −5% all skills |
| Double the limit | Cannot move at all | No equivalent (skills penalties continue to stack) |

### Movement

| Topic | Kal-Arath | RuneQuest |
|---|---|---|
| Scale | Abstract; no explicit distance unit in combat | Melee units (abstract); scenario scale in meters |
| Base speed | Implied 30–60 feet movement per round (not defined) | 8 melee units/round combat; 120m/Turn scenario scale |
| Long distance | 20 miles/day on foot (each hex = 1 day's travel) | Walking 20 km/day; marching 30 km/day |
| Mounted | Horse doubles travel speed (40 miles/day) | War Horse Move 16 melee units/round; 1,000m/Turn |
| Initiative-based? | AGI affects initiative, not movement rate | DEX modifies Strike Rank (initiative), not movement |

Both systems agree on foot travel pace (~20 miles / 32 km per day), reflecting broadly similar assumptions about the game world's geography.

---

## 5. Conversion Guidelines

Use these when porting creatures, characters, or encounters between systems.

### Stat-to-Skill Conversion

KA stats (−1 to +5) produce known success probabilities on 2d6. Match these to RQ skill% by success rate:

| KA Stat | KA Success % | ≈ RQ Skill% Equivalent |
|---------|-------------|------------------------|
| −1 | 28% | 30% |
| 0 | 41% | 40% |
| +1 | 58% | 55–60% |
| +2 | 72% | 70% |
| +3 | 83% | 80–85% |
| +4 | 92% | 90% |
| +5 | 97% | 95–97% |

*Direction: KA → RQ: look up the success % for the KA stat and assign the matching RQ skill%. RQ → KA: find the nearest probability match and assign the corresponding stat.*

### HP Conversion

Both systems produce similar HP totals for starting humanoids (KA d6+TOU start ≈ RQ CON+SIZ÷2 total of 8–12). Convert roughly 1:1 for starting characters.

**Running RQ creatures in KA:** Drop hit locations; use total HP as the KA HP pool. Use the highest location AP as the flat armor value (or average location AP).

**Running KA creatures in RQ:** Distribute total HP across locations using the standard RQ fractions. Assign the KA armor tier as uniform AP per location (KA Light 1 → RQ 1 AP, KA Medium 2 → RQ 3 AP, KA Heavy 3 → RQ 5 AP).

### Armor Conversion

| KA Armor | Reduction | RQ Equivalent | AP |
|----------|-----------|---------------|-----|
| Light | −1 | Leather | 1 |
| Medium | −2 | Scalemail | 3 |
| Heavy | −3 | Chainmail | 4–5 |
| Shield | −1 | Medium Shield | 12 HP (parry value) |

Note: KA armor is blanket reduction; RQ AP applies per location. When converting KA creatures to RQ, apply the AP value uniformly to all locations.

### Damage Conversion

KA weapons deal d6 (normal), d6/d (roll 2, take worst), or d6/a (roll 2, take best) with explosion on 6s. Map to RQ:

| KA Damage | Average (with explosion) | ≈ RQ Weapon Equivalent |
|-----------|------------------------|------------------------|
| d6/d (Light) | ~2.5 | Dagger (1d4+1) or Shortsword (1d6+1) |
| d6 (Medium) | ~4.2 | Scimitar (1d8) or Spear (1d8+1) |
| d6/a (Heavy) | ~6.0 | Greatsword (2d8) or Greataxe (2d8+2) |

KA damage explodes but RQ does not. When running KA weapons in RQ, drop explosion and add +1 to the average damage to compensate, or simply use the nearest RQ equivalent.

### Magic Conversion

| KA | ≈ RQ Equivalent |
|---|---|
| Tier 1 spell (difficulty 8) | Low-level Battle Magic (1–2 POW cost) |
| Tier 2 spell (difficulty 9) | Mid-level Battle Magic (3–4 POW cost) |
| Tier 3 spell (difficulty 10) | High-level Battle Magic or minor Rune Magic |
| Tier 4–5 spells | Rune Magic (treat as Rune Lord abilities) |
| Demonic pact (6 schools) | Approximately: cult membership (Rune Magic access) |

**Resource note:** KA casters have no resource pool — they can attempt spells repeatedly at HP cost. When running KA mages in RQ, limit them to 3 spell attempts per combat before requiring rest, or assign them a small POW pool (INT value) to spend.

### Coinage Conversion

| KA | ≈ RQ |
|---|---|
| 1 silver piece | 6 Lunars |
| 6 silver pieces | ~1 Wheel (if using RQ denominations) |

---

*Sources: Kal-Arath rules reference (Castle Grief, 2023); RuneQuest Classic 2nd edition (Chaosium 2016 reprint) mechanics reference.*
