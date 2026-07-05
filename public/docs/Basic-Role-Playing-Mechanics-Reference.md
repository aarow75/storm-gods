# Basic Role-Playing — Mechanics Reference

*Based on Basic Role-Playing: An Introductory Guide (Chaosium, 1980) by Greg Stafford and Lynn Willis.*

## Core Concept

Basic Role-Playing (BRP) is the percentile-based system that underpins Chaosium's family of games (RuneQuest, Call of Cthulhu, Stormbringer). Nearly everything is resolved by rolling **D100 equal to or under a percentage chance** — a skill rating, a characteristic multiplied by 5, or a value read off the Resistance Table. Characters are defined by seven characteristics, a single hit point pool, and a list of percentile skills that improve through successful use.

Three resolution methods cover all play:

1. **Automatic actions** — normal activity (walking, talking, seeing) always succeeds; no roll.
2. **Simple percentile rolls** — stressed or skilled actions: roll D100 ≤ skill % to succeed.
3. **Resistance Table rolls** — pit one characteristic against another (e.g. STR vs. SIZ to lift).

---

## Characteristics

Seven characteristics, each rolled on **3D6** (range 3–18) for humans:

| Stat | Name | Primary uses |
|------|------|--------------|
| STR | Strength | Muscle power; lifting (vs. SIZ on Resistance Table); arm wrestling |
| CON | Constitution | Health; **hit points equal CON**; resists poison and disease |
| SIZ | Size | Height and weight combined; being lifted; squeezing into spaces; who gets attacked first |
| INT | Intelligence | The **Idea Roll**: INT×5 (referee may lower the multiplier, never higher than ×5) |
| POW | Power | Soul/piety; the **Luck Roll**: POW×5; resists and fuels magic in expanded games |
| DEX | Dexterity | Strike order in combat (highest DEX acts first); the **Dodge Roll**: DEX×5 |
| CHA | Charisma | The **Persuasion Roll**: CHA×5 (or ×3 if the listener is suspicious) |

### Characteristic Rolls

Roll D100 ≤ (stat × multiplier). The standard multiplier is 5:

- **Idea** = INT×5 — realize something the character would know
- **Luck** = POW×5 — avoid mischance (land safely, etc.)
- **Dodge** = DEX×5 — dive out of the way of a seen threat (rolling rock, thrown weapon, charge)
- **Persuasion** = CHA×5 — talk someone into or out of something

Characteristic rolls do **not** improve with experience; they change only if the characteristic changes.

### The Resistance Table

Active characteristic vs. passive characteristic. Chance of success = **50% + (active − passive) × 5%**. Examples: STR 9 vs. STR 4 door = 75%; equal values = 50%. In simultaneous contests (arm wrestling), both parties roll: if both succeed or both fail, no result; if one succeeds, that side wins.

---

## Derived Values

| Value | Formula |
|-------|---------|
| Hit Points | **HP = CON** |
| Healing Rate | 1 HP per game week |
| Movement | 24 meters per melee round (2-legged); 36 m for 4-legged; doubled/tripled when fleeing |
| Strike order | By DEX, highest first (not a numeric strike rank) |

There is no damage bonus, encumbrance system, or magic points in the introductory rules.

---

## Time Scales

- **Game day** — travel: walking 20 km/day, marching 30 km/day, riding 20 km/day, cavalry 40 km/day (10 hours of movement per day).
- **Full turn** — 5 minutes; cautious advance 120 m, strolling 240 m, running 2000 m; riding doubles these.
- **Melee round** — ~12 seconds; one complete action (attack and parry, ready a weapon, mount a horse, light a torch, search an area, etc.).

### Melee Round Sequence

1. **Statement of Intent** — everyone declares actions (an action may be aborted but not substituted).
2. **Movement of non-engaged characters** — as a rule, characters that moved into contact this round cannot fight until next round.
3. **Resolution of melee, magic, etc.** — missiles first, then hand combat in descending DEX order. A character killed or knocked out before acting loses the action.
4. **Bookkeeping** — record damage, healing, skill-use checks.

---

## Skills

Roll D100 ≤ skill % to succeed. Default starting values:

| Skill | Starting % |
|-------|-----------|
| Climbing | 55% |
| Hide | 55% |
| Jumping | 45% |
| Throw | 45% |
| Listening | 45% |
| First Aid | 45% |
| Fist | 45%* |
| Spot Hidden Item | 25% |
| Move Quietly | 25% |

*\*The Fist weapon-attack value on the weapons table is 50%; 45% appears in the general skill list — use the weapons table value for combat.*

Improvised weapons use the closest listed weapon's chance (a coal shovel attacks as a mace).

---

## Combat

### Attacks and Parries

- Attack: roll D100 ≤ attack % with that weapon.
- Parry: roll D100 ≤ parry % with weapon or shield. Each weapon tracks attack and parry skill independently.
- A weapon may attack **or** parry in a round, not both (exception: the two-handed spear). A shield only parries. With weapon + shield, a character may parry twice in one round instead of attacking.
- Parries happen when needed, regardless of the parrier's DEX. One shield parry per round.

One-on-one resolution matrix:

| Attacker | Defender | Result |
|----------|----------|--------|
| hits | misses parry | defender takes damage (armor subtracts) |
| hits | parries | no damage to defender, but a parrying **weapon** takes the rolled damage toward breakage |
| misses | parries | no damage |
| misses | misses | no damage |

- **Rear attack**: +20% to attack; the target cannot parry attacks from a foe they've turned away from.
- Changing weapons takes a full melee round (may still shield-parry or dodge while doing so).

### Weapons Table

| Weapon | Type | Beginning Attack & Parry % | Damage | Breakage Points | Notes |
|--------|------|---------------------------|--------|-----------------|-------|
| Fist | Natural | 50% | 1D3 | — | |
| 2-Handed Spear | Thrusting | 25% | 1D8+1 | 15 | Impales; usable from second rank; can parry twice or attack+parry; never damages or is damaged by parrying weapons |
| Sword | Hand | 15% | 1D8+1 | 20 | |
| Axe | Hand | 25% | 1D8+2 | 15 | |
| Mace | Hand | 30% | 1D6+2 | 20 | |
| Rock | Thrown | 45% | 1D4 | — | |
| Javelin | Thrown | 20% | 1D10 | — | Impales |
| Bow | Missile | 10% | 1D6+1 | — | Impales; best range |
| Shield | Parry only | 25% | — | 12 | Blocks 12 points on a successful parry; does not break |

Thrown and missile weapons cannot be parried, only dodged (DEX×5). Missiles resolve before hand combat.

### The Impale

Spear, javelin, and arrow impale on an attack roll **≤ 20% of the required attack chance** (i.e. lower than 21% of the attack %). An impale:

1. Does rolled damage **plus the weapon's maximum damage** (an impaling spear does 1D8+1 + 9 = 10–18 points).
2. Sticks in the target. Pulling it free the next round requires D100 ≤ (impale chance × 2); it takes at least a full round.

Impaling weapons cannot damage other weapons — they don't chew through parries the way swords do, and take breakage damage when parried.

### Armor

Armor subtracts its point value from every hit that lands:

| Armor | Points | Notes |
|-------|--------|-------|
| None | 0 | |
| Leather | 2 | Jerkin, leggings, hood — "a heavy motorcycle jacket" |
| Ring Mail | 4 | Can be worn over leather for 6 points total |
| Plate | 6 | The best available |

A successful **shield parry blocks 12 points** before armor applies (shield block and armor stack).

### Weapon Breakage

Parrying **weapons** accumulate damage from blows they parry; when accumulated damage exceeds the weapon's breakage points, it breaks. Shields take blow after blow without breaking (effects are not cumulative). Two-handed spears neither damage nor take damage in parry exchanges.

---

## Damage, Death, and Healing

- **Hit points = CON.** No penalty for cumulative damage until the threshold below.
- At **1 HP or less**: unconscious; won't wake naturally — must be tended or given First Aid.
- **Damage exceeding total HP**: dead.
- **Falling**: roughly 1D6 per 2 meters (a 4-meter fall = 2D6); a successful Jumping or Luck roll may avoid it.
- **Natural healing**: 1 HP per game week.
- **First Aid** (45%): treat wounds, wake the unconscious.
- Healing potions exist as treasure (e.g. restores up to 5 points of damage; cannot raise HP above maximum).

---

## Experience

After each adventure, for **each skill used successfully** during play (mark it when it happens):

1. Learning threshold = 100 − current skill %.
2. Roll D100 ≤ threshold → **add 5%** to the skill. Otherwise no change.

One experience check per skill per adventure, no matter how many successes. Attack and parry advance separately. Characteristic rolls (Dodge, Luck, Idea, Persuasion) never improve this way.

---

## Magic

The introductory rules contain **no player magic system**. POW resists spells and powers spellcasting in expanded BRP games (RuneQuest, etc.), and magic items (healing potions) appear as treasure. Use POW×5 as the resistance/luck roll where magic threatens a character.

---

## Conditions

| Condition | Effect |
|-----------|--------|
| Unconscious | At 1 HP or less; helpless until tended or given First Aid |
| Surprised | Attacker gets a free attack before normal sequence |
| Attacked from behind | Cannot parry; attacker gains +20% |
| Impaled | Weapon stuck; removal takes a full round and a roll |
| Disarmed / weapon broken | Parrying weapon exceeded its breakage points |
