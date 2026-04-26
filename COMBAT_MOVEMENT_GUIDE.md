# Combat Movement, Distance & Surprise Rules

## Overview

Combat now supports three new mechanics from Runequest rules:

1. **Distance** — Track meters between combatants at the start of combat
2. **Movement** — Participants can move before attacking; every 3 meters costs 1 Strike Rank
3. **Surprise** — Surprised combatants take a +12 Strike Rank penalty (only applies round 1)

## How to Use

### Starting a Combat with Distance & Surprise

1. Click **"Add Combat Participant"** button
2. Select a character or monster and weapon
3. Enter **"Starting Distance (meters)"** — how far apart the combatants begin
4. Check **"Surprised"** if the participant is caught off-guard (they'll act last in round 1)
5. Click **"Add to Combat"**

### Movement Each Round

For each participant's turn:

1. In the **Move** field, enter the number of meters they will move this round
2. The **SR cost badge** automatically shows how many Strike Rank points the movement costs
   - 0-3m = 1 SR
   - 4-6m = 2 SR
   - 7-9m = 3 SR
   - etc. (formula: `ceil(meters / 3)`)
3. Effective Strike Rank updates immediately and the participant order re-sorts

### Understanding the Strike Rank Display

The **Strike Rank** now shows a full breakdown:

```
Strike Rank: 8
Base: 5 + Wpn 2 + Move 1 + Surprise 12
```

Each component is additive:
- **Base** — Character's strike rank from DEX+SIZ modifiers
- **Wpn** — Weapon modifier (e.g., shortsword adds 2)
- **Move** — Cost of movement in meters (every 3m = 1 SR)
- **Surprise** — +12 if surprised (clears on New Round)

### Skipped Actions

When a participant is **surprised**, their **Roll button is disabled** and their round is automatically skipped. The focus automatically moves to the next participant who can act (not dead or surprised).

**Visual indicators:**
- **Roll button** becomes grayed out (gray background)
- **Participant card** has an orange left border and light orange background tint
- **Tooltip** on disabled button explains "Surprised — round is skipped"

### Round Reset

Click **"New Round"** to:
- Clear all movement (sets to 0m)
- Clear surprise status
- Reset missile rate-of-fire counters
- Recalculate strike ranks
- Focus returns to the first available combatant

This matches Runequest rules: surprise only affects round 1.

### Distance Tracking

The **Distance** field remains visible and editable throughout combat, so you can:
- Update distance as combatants close/retreat
- Track range for missile weapons
- Confirm melee engagement

## Mechanics Summary

### Movement Cost Formula

```
Movement SR Cost = ceil(distance_in_meters / 3)

Examples:
- 1-3m move = +1 SR
- 4-6m move = +2 SR
- 7-9m move = +3 SR
```

### Effective Strike Rank

```
Effective SR = Base Strike Rank + Weapon Modifier + Movement Cost + (Surprised ? 12 : 0)

A surprised warrior moving 6m with a shortsword:
= 5 (base) + 2 (sword) + 2 (6m movement) + 12 (surprise)
= 21 SR (very delayed!)
```

### Turn Order

Participants sort by **Effective SR** (lowest first). Someone with lower SR acts earlier in the round.

## Runequest Rules Reference

Per RuneQuest core rules:
- **Strike Rank Modifiers** are cumulative and all reduce strike rank (lower is better)
- **Movement penalty** applies if you move before attacking (RQ2: 3 meters per 1 point of SR increase)
- **Surprise** grants a +12 SR penalty (RQ2: prevents action in round 1; clears after round 1)
- **Distance** determines whether melee or missile combat is possible

---

### Example Scenario

**Warriors A and B encounter each other, 12 meters apart. A is surprised.**

Initial stats:
- Warrior A: Base SR 4, Broadsword (+2) → Final SR 6, **Surprised** → Effective SR 18
- Warrior B: Base SR 5, Spear (+3) → Final SR 8, Not surprised → Effective SR 8

**Round 1 (both move):**
- Warrior A moves 9m closer: 9m ÷ 3 = +3 SR → Effective SR 21 (still last!)
- Warrior B moves 6m closer: 6m ÷ 3 = +2 SR → Effective SR 10
- **Warrior B acts first** despite lower base SR

**Round 2 (after New Round clicked):**
- A's surprise clears, movement resets
- Both return to base effective SR
- A (6) acts before B (8)

