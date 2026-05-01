# III. MECHANICS AND MELEE

## Overview

This section covers the fundamental mechanics of time, movement, encumbrance, and how melee combat is structured in RuneQuest.

---

## 1. Time

RuneQuest uses several overlapping time scales for play:

| Time Unit | Duration | Context |
|---|---|---|
| **Real Time** | Actual time at table | Rarely used in rules; GM determines pacing |
| **Narrative Time** | Variable (GM discretion) | Passage of time advancing story (days, weeks, months) |
| **Full Turn** | 5 minutes (25 melee rounds) | Standard unit for exploration and detailed action |
| **Melee Round** | ~12 seconds | Basic combat unit; all actions per round simultaneous |
| **Strike Rank** | 1 second (1/12 of round) | Individual action timing within melee round (12 SR per round) |
| **Skill Time** | Seconds to days | Time required for specific abilities (varies widely) |

### Melee Round Structure

Each melee round consists of **12 Strike Rank slots** (SR 1 through SR 12).

**Round Phases** (taken in order, but action is simultaneous):
1. **Statement of Intent** — Players and GM declare what they'll attempt
2. **Movement of Unengaged Characters** — Those not in combat move
3. **Resolution of Melee/Missiles/Spells** — All attacks, spells, and actions resolved by strike rank order
4. **Bookkeeping** — Damage recorded, conditions updated, round ends

---

## 2. Movement

### Unencumbered Movement

An unencumbered adventurer not in combat can move up to **8 MOV per melee round**.

**Movement Distance**: Each point of MOV represents **3 meters** of distance when running or traveling outside combat.

**Example**: An adventurer with 8 MOV can travel 24 meters (3m × 8) per melee round when not engaged.

### Movement and Strike Rank

**In Combat**: Movement incurs a strike rank penalty. For each 3 meters of movement attempted, add **+1 to strike rank**. This penalty applies even if movement is ended.

**Example**: An adventurer moving 9 meters (3 MOV) in combat adds +3 to their strike rank.

### Engaged Combat

Adventurers actively engaged in melee combat **cannot move freely** until they disengage (break off combat by winning parries or leaving the melee).

### Travel and Overland Movement

For overland travel on foot at a steady pace: **approximately 5 km/hour**.

Groups travel at the speed of their slowest member unless deliberately leaving members behind.

---

## 3. Encumbrance

### Hit Point and Carrying Capacity Modifiers

Encumbrance is determined by the total weight of equipment, weapons, and supplies an adventurer is carrying.

**Carrying Limit**: Typically related to STR × 3 (in kilograms), though this varies.

When an adventurer exceeds their carrying capacity:
- **Defense penalties apply** (reduced dodge and parry percentages)
- **Movement is hindered** (reduced MOV or increased strike rank penalties)
- Specific mechanical modifiers vary by how much weight is exceeded

### Armor Encumbrance

Heavy armor reduces movement and increases strike rank. Armor encumbrance is already factored into carrying capacity calculations.

---

## 4. The Melee Round

### Combat Overview

Combat is resolved in **melee rounds** of ~12 seconds each. Each round, adventurers take actions based on their **Strike Rank**.

### Strike Rank Determination

**Strike Rank = Base DEX modifier + SIZ modifier + Weapon modifier + Other adjustments**

#### DEX Modifier
| DEX Score | Modifier |
|---|---|
| 19+ | 0 |
| 16–18 | +1 |
| 13–15 | +2 |
| 9–12 | +3 |
| 6–8 | +4 |
| 1–5 | +5 |

#### SIZ Modifier
| SIZ Score | Modifier |
|---|---|
| 22+ | 0 |
| 15–21 | +1 |
| 7–14 | +2 |
| 1–6 | +3 |

#### Weapon Modifier
- **1-Handed melee weapons** (sword, mace, hand axe): 0
- **2-Handed melee weapons** (spear, battle axe, staff): +1
- **Unarmed/hand-to-hand**: Varies by martial training
- **Missile weapons** (bow, thrown): Varies

#### Other Adjustments
- **Movement penalty**: +1 for each 3 meters moved (including attempt to move)
- **Multiple actions**: Each additional action/attack adds +3 to SR
- **Magic points spent**: +1 for each point of magic spent
- **Surprise/magical slowness**: Additional penalties as appropriate

### Action Resolution by Strike Rank

Actions are resolved **in order from lowest SR to highest**. When multiple combatants act at the same SR, they act **simultaneously**.

**No action or combination of actions may require more than 12 total strike ranks.** If combined cost exceeds 12, the action cannot be performed in that round.

### What Counts as an Action

| Action | Strike Ranks |
|---|---|
| Attack (weapon) | Varies (typically 4–8 depending on weapon) |
| Parry | 3 |
| Dodge | 3 |
| Cast spell (battle magic) | 3–4+ (varies by spell) |
| Quick movement (3m) | N/A (free, but +1 SR penalty if taking action) |
| Reload bow/crossbow | Varies |

---

## 5. Hit Location and Wounds

### Human Hit Locations

Humans have **seven hit locations**, each with its own hit point total and armor value.

| Location | Hit Points | Notes |
|---|---|---|
| **Right Leg** | 1/4 of total HP | Loss of use: stumbling, reduced movement |
| **Left Leg** | 1/4 of total HP | Loss of use: stumbling, reduced movement |
| **Abdomen** | 1/6 of total HP | Vulnerable; internal organs |
| **Chest** | 1/3 of total HP | Most vital; lungs, heart |
| **Right Arm** | 1/6 of total HP | Loss of use: can't hold items, reduced effectiveness |
| **Left Arm** | 1/6 of total HP | Loss of use: can't hold items, reduced effectiveness |
| **Head** | 1/8 of total HP | Most dangerous; instant death at threshold |

**Note**: These proportions add up to over 100% due to rounding; the actual calculation distributes based on (CON + SIZ) ÷ 2.

### Calculating Hit Points per Location

**Total Hit Points** = (CON + SIZ) ÷ 2 (rounded up)

Damage to specific locations is tracked separately. An adventurer can lose a limb or die before total HP reaches zero.

### Damage Application

Damage from an attack is applied to the target hit location.

**Damage Modifiers**:
- **Normal success**: Roll damage as normal
- **Special success** (roll ≤ 1/5 of weapon skill): **Double damage**
- **Critical success** (roll ≤ 1/20 of weapon skill): **Double maximum damage and ignore armor**

### Wound Severity and Results

| Damage vs Location | Result |
|---|---|
| **At location HP threshold** | Limb becomes useless; cannot be used effectively |
| **At double location HP** | Location is incapacitated (e.g., arm paralyzed); torso causes bleeding |
| **At triple location HP** | Instant death (head); permanent maiming or incapacitation (limbs/torso) |

**Head**: If damage equals or exceeds location HP, character dies instantly (or is unconscious if magical healing is available).

**Limbs (arms/legs)**: If damage equals or exceeds location HP, that limb is useless. Further damage causes permanent loss.

**Torso (chest/abdomen)**: If damage equals or exceeds location HP, character begins bleeding (loses 1 HP per round). Death occurs if bleeding is not stopped and damage accumulates beyond double location HP.

### Armor Protection

Armor reduces incoming damage **before applying to location hit points**.

**Armor Example**: 
- Armor value: 4 points
- Incoming damage: 7 points
- Damage applied to location: 3 points (7 − 4 = 3)
- If armor is penetrated or bypassed, full damage applies

**Special rule for critical hits**: A critical success **ignores armor entirely**.

---

## 6. Derived Statistics

### Hit Points

**Total Hit Points** = (CON + SIZ) ÷ 2

Each hit location has proportional HP based on location type (as listed above).

### Healing Rate

**Healing Rate** = CON ÷ 4 (rounded up)

Represents hit points recovered per week during full rest. Natural healing requires no magical intervention.

### Damage Bonus

Represents extra damage from physical power.

**Calculation**:
- STR + SIZ = Base
- Divide by 8, round down
- Map to damage die progression

| Total (STR + SIZ) | Damage Bonus |
|---|---|
| 1–6 | 0 (none) |
| 7–12 | 1D4 |
| 13–18 | 1D6 |
| 19–24 | 1D8 |
| 25–30 | 1D10 |
| 31–36 | 1D12 |
| 37–42 | 1D12+1D4 |
| 43–48 | 2D12 |

**Application**: Add damage bonus to all melee weapon damage rolls. Does not apply to missile weapons or magic spells (except where explicitly stated).

### Strike Rank (Derived)

See **Section 4: The Melee Round** for full Strike Rank calculation.

### Magic Points

**Magic Points** = POW

Magic points are spent to cast spirit magic spells. They recover at a rate of 1 per day of rest (or via magic).

### Spirit Combat Damage

**Spirit Combat Damage** = POW

When spirits engage in non-physical combat (astral plane), POW is used directly for damage instead of the usual damage bonus.

### Movement Rate

**Movement Rate** = Base 8 MOV (can be modified by characteristics, magic, or encumbrance)

Used for determining distance covered and strike rank penalties.

---

## 7. Opposed Resolution

When two abilities directly oppose each other (attack vs. parry, one spell vs. another), both parties roll:

**Success Hierarchy**:
- **Critical success** beats special success
- **Special success** beats normal success
- **Normal success** beats failure/fumble
- **Fumble** is worst outcome

If both achieve the same success level, the higher roll wins (or results are simultaneous).

---

## 8. Optional and Advanced Rules

### Reattempting Rolls

A failed ability roll can be retried **at a –20% penalty**. Further failures prevent additional attempts without significant time passage or changed circumstances.

### Characteristic Augmentation

One characteristic can support or "augment" another through roleplay or special circumstances:
- **Critical success in augmentation**: +50% to target ability
- **Special success**: +30%
- **Normal success**: +20%
- **Failure**: –20%
- **Fumble**: –50%

---

## Summary

**Key Takeaways**:
- Melee rounds are 12 seconds with 12 strike rank slots
- Strike rank determines action order; lower SR acts first
- Movement in combat incurs +1 SR per 3 meters
- Damage is applied to individual hit locations
- Hit location HP is based on total HP split proportionally
- Armor reduces damage before applying to location HP
- Derived stats (HP, damage bonus, healing rate) are calculated from characteristics

---

**Sources**:
- [Combat | RQ Wiki](https://rqwiki.chaosium.com/rules/combat.html)
- [Time & Movement | RQ Wiki](https://rqwiki.chaosium.com/rules/time-and-movement.html)
- [Spot Rules | RQ Wiki](https://rqwiki.chaosium.com/rules/spot-rules.html)
- [The Game System | RQ Wiki](https://rqwiki.chaosium.com/rules/the-game-system.html)
