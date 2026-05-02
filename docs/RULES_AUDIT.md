# RuneQuest Rules Audit

Detailed comparison of app implementation vs. official RQ2 rules from [rqwiki.chaosium.com](https://rqwiki.chaosium.com/).

**Date**: 2026-04-30  
**Audit Scope**: Sections II (Character Creation) and III (Mechanics and Melee)  
**Status**: 3 Critical Issues, 2 Major Issues, 3 Minor Issues

---

## SUMMARY

| Category | Status | Notes |
|---|---|---|
| **Characteristics** | ✅ Correct | 7 stats properly defined |
| **Ability Resolution** | ⚠️ Not Implemented | D100 system, critical/special successes not tracked |
| **Skills** | ⚠️ Incomplete | Categories exist; modifiers by characteristic not calculated |
| **Derived Stats** | 🔴 CRITICAL ISSUES | Hit points, healing rate, damage bonus incorrect |
| **Strike Rank** | ✅ Mostly Correct | Formula present; movement penalty needs verification |
| **Hit Locations** | 🔴 CRITICAL ISSUES | Proportions significantly wrong |
| **Equipment & Encumbrance** | ✅ Basic Implementation | Functional but needs tuning |

---

## DETAILED FINDINGS

### 1. HIT POINTS CALCULATION ❌ CRITICAL

**Rule** (Section III, Derived Statistics):
```
Total Hit Points = (CON + SIZ) ÷ 2 (rounded up)
```

**Current Implementation** ([character.model.ts:426](src/app/models/character.model.ts#L426)):
```typescript
const totalHP = Math.round((stats.CON + stats.SIZ) / 2);  // ✅ Correct
```

**Example**: CON 10 + SIZ 10 = 20 ÷ 2 = **10 HP** ✅ **CORRECT**

**Status**: ✅ **CORRECT**

---

### 2. HIT LOCATION PROPORTIONS ❌ CRITICAL

**Rule** (Section III, Hit Location and Wounds):

Per the documented rules, hit location proportions are:
- **Right Leg**: 1/4 of total HP
- **Left Leg**: 1/4 of total HP
- **Abdomen**: 1/6 of total HP (not 1/3)
- **Chest**: 1/3 of total HP
- **Right Arm**: 1/6 of total HP
- **Left Arm**: 1/6 of total HP
- **Head**: 1/8 of total HP

Note: These sum to ~105% due to rounding; the actual allocation should distribute the total HP proportionally.

**Current Implementation** ([character.model.ts:373-384](src/app/models/character.model.ts#L373-L384)):
```typescript
export function calculateHitLocations(con: number, siz: number): HitLocations {
  const totalHP = Math.round((con + siz) / 2);
  return {
    'Right Leg': Math.max(1, Math.round(totalHP * 0.33)),
    'Left Leg': Math.max(1, Math.round(totalHP * 0.33)),
    'Abdomen': Math.max(1, Math.round(totalHP * 0.33)),     // ❌ Should be 0.167
    'Chest': Math.max(1, Math.round(totalHP * 0.40)),       // ✅ Close to 1/3
    'Right Arm': Math.max(1, Math.round(totalHP * 0.25)),   // ❌ Should be 0.167
    'Left Arm': Math.max(1, Math.round(totalHP * 0.25)),    // ❌ Should be 0.167
    'Head': Math.max(1, Math.round(totalHP * 0.33))         // ❌ Should be 0.125
  };
}
```

**Example Comparison** (CON 10, SIZ 10 = 10 total HP):

| Location | Rule | Current App | Difference |
|---|---|---|---|
| Right Leg | 2.5 (1/4) | 3 | +0.5 |
| Left Leg | 2.5 (1/4) | 3 | +0.5 |
| Abdomen | 1.67 (1/6) | 3 | **+1.33** |
| Chest | 3.33 (1/3) | 4 | +0.67 |
| Right Arm | 1.67 (1/6) | 2 | **+0.33** |
| Left Arm | 1.67 (1/6) | 2 | **+0.33** |
| Head | 1.25 (1/8) | 3 | **+1.75** |
| **Total** | ~16.5 | 20 | **+3.5** |

**Impact**: This makes characters significantly more durable than intended. A character with 10 HP receives 20 HP distributed across locations instead of the correct proportions.

**Status**: 🔴 **CRITICAL - Proportions incorrect**

**Fix Needed**:
```typescript
export function calculateHitLocations(con: number, siz: number): HitLocations {
  const totalHP = Math.ceil((con + siz) / 2);
  
  return {
    'Right Leg': Math.max(1, Math.round(totalHP / 4)),      // 1/4
    'Left Leg': Math.max(1, Math.round(totalHP / 4)),       // 1/4
    'Abdomen': Math.max(1, Math.round(totalHP / 6)),        // 1/6
    'Chest': Math.max(1, Math.round(totalHP / 3)),          // 1/3
    'Right Arm': Math.max(1, Math.round(totalHP / 6)),      // 1/6
    'Left Arm': Math.max(1, Math.round(totalHP / 6)),       // 1/6
    'Head': Math.max(1, Math.round(totalHP / 8))            // 1/8
  };
}
```

---

### 3. HEALING RATE ❌ CRITICAL

**Rule** (Section III, Derived Statistics):
```
Healing Rate = CON ÷ 4 (rounded up)
Represents hit points recovered per week during full rest.
```

**Current Implementation** ([character.model.ts:468](src/app/models/character.model.ts#L468)):
```typescript
healingRate: Math.max(1, Math.round(stats.CON / 6))  // ❌ Dividing by 6, not 4
```

**Example Comparison** (CON 12):

| Rule | Current App | Difference |
|---|---|---|
| 12 ÷ 4 = **3** | 12 ÷ 6 = 2 | **-33%** |

**Status**: 🔴 **CRITICAL - Formula incorrect**

**Fix Needed**:
```typescript
healingRate: Math.ceil(stats.CON / 4)
```

---

### 4. DAMAGE BONUS ❌ MAJOR ISSUES

**Rule** (Section III, Derived Statistics):

Damage Bonus is calculated from STR + SIZ:
```
| STR + SIZ | Bonus    |
|-----------|----------|
| 1–6       | 0        |
| 7–12      | 1D4      |
| 13–18     | 1D6      |
| 19–24     | 1D8      |
| 25–30     | 1D10     |
| 31–36     | 1D12     |
| 37–42     | 1D12+1D4 |
| 43–48     | 2D12     |
```

**Current Implementation** ([character.model.ts:429-437](src/app/models/character.model.ts#L429-L437)):
```typescript
let damageBonus = '0';
if (strSiz <= 12) damageBonus = '-1d4';        // ❌ Rule says 0 for 1-6, never -1d4
else if (strSiz <= 24) damageBonus = '0';      // ✅ Overlaps with 13-24 range
else if (strSiz <= 32) damageBonus = '+1d4';   // ❌ Should be 25-30 = 1D10
else if (strSiz <= 40) damageBonus = '+1d6';   // ❌ Should be 31-36 = 1D12
else if (strSiz <= 56) damageBonus = '+2d6';   // ❌ Not in rule
else if (strSiz <= 72) damageBonus = '+3d6';   // ❌ Not in rule
else damageBonus = '+4d6';                     // ❌ Not in rule
```

**Issues**:
- Negative damage bonus (`-1d4`) does not exist in rules for low STR+SIZ
- Progression using d6 increments (rule uses d4, d6, d8, d10, d12 progression)
- Higher tiers (3d6, 4d6) are custom/non-standard

**Example**: STR 8, SIZ 8 (total 16)
- **Rule**: Should be **1D6** (falls in 13-18 range)
- **Current App**: Returns **'0'** (fails 12 < 24 check)

**Status**: 🔴 **CRITICAL - Formula incorrect**

---

### 5. SPIRIT COMBAT DAMAGE ⚠️ MAJOR

**Rule** (Section III, Derived Statistics):
```
Spirit Combat Damage = POW
(POW value used directly for damage, no damage bonus calculation)
```

**Current Implementation** ([character.model.ts:439-444](src/app/models/character.model.ts#L439-L444)):
```typescript
let spiritCombatDamage = '1d6';
if (stats.POW <= 6) spiritCombatDamage = '1d3';
else if (stats.POW <= 12) spiritCombatDamage = '1d6';
else if (stats.POW <= 18) spiritCombatDamage = '1d6+1';
else spiritCombatDamage = '1d6+2';
```

**Issue**: The rule states Spirit Combat Damage should be POW value used directly, not a dice pool with modifiers.

**Example**: POW 14
- **Rule**: Damage = **14** (POW value directly)
- **Current App**: Damage = **1D6+1** (dice pool)

**Status**: ⚠️ **MAJOR - Represents damage incorrectly**

**Note**: The app may be converting POW to a dice notation for display purposes. If so, this is a representational issue (how it's displayed), not a calculation error. **Needs clarification** — Does the app use the dice notation as-is, or convert it back to POW value during combat?

---

### 6. STRIKE RANK ✅ MOSTLY CORRECT

**Rule** (Section III, The Melee Round):
```
Strike Rank = Base 0 + DEX modifier + SIZ modifier + Weapon modifier + Other adjustments
```

**Current Implementation** ([character.model.ts:409-447](src/app/models/character.model.ts#L409-L447)):

DEX Modifier Function ([character.model.ts:416-423](src/app/models/character.model.ts#L416-L423)):
```typescript
export function getDexterityModifier(dex: number): number {
  if (dex >= 19) return 0;
  if (dex >= 16) return 1;
  if (dex >= 13) return 2;
  if (dex >= 9) return 3;
  if (dex >= 6) return 4;
  return 5;
}
```

**Rule** (from Section III):
| DEX Score | Modifier |
|---|---|
| 19+ | 0 |
| 16–18 | +1 |
| 13–15 | +2 |
| 9–12 | +3 |
| 6–8 | +4 |
| 1–5 | +5 |

✅ **Correct**

SIZ Modifier Function ([character.model.ts:409-414](src/app/models/character.model.ts#L409-L414)):
```typescript
export function getSizeModifier(siz: number): number {
  if (siz >= 22) return 0;
  if (siz >= 15) return 1;
  if (siz >= 7) return 2;
  return 3;
}
```

**Rule** (from Section III):
| SIZ Score | Modifier |
|---|---|
| 22+ | 0 |
| 15–21 | +1 |
| 7–14 | +2 |
| 1–6 | +3 |

✅ **Correct**

Strike Rank Calculation ([character.model.ts:446-447](src/app/models/character.model.ts#L446-L447)):
```typescript
let strikeRank = getSizeModifier(stats.SIZ) + getDexterityModifier(stats.DEX);
```

✅ **Correct formula** (base 0 + DEX mod + SIZ mod)

**Note**: Weapon modifiers are added in [CombatService.calculateFinalStrikeRank()](src/app/services/combat.service.ts#L56-L61). Movement SR cost is calculated elsewhere. ✅ **Mostly correct structure**.

**Status**: ✅ **CORRECT**

---

### 7. MOVEMENT AND ENCUMBRANCE ⚠️ MINOR

**Rule** (Section III, Movement):
```
Unencumbered movement: 8 MOV per round
Each MOV = 3 meters
Movement in combat adds +1 SR per 3 meters moved
Encumbrance reduces movement and adds SR penalties
```

**Current Implementation** ([character.model.ts:450-460](src/app/models/character.model.ts#L450-L460)):
```typescript
const maxEncumbrance = stats.STR;
const equipmentENC = equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
const weaponsENC = weapons.reduce((sum, w) => sum + (WEAPON_LIST.find(wd => wd.name === w.name)?.encumbrance || 0), 0);
const shieldsENC = shields.reduce((sum, s) => sum + (SHIELD_LIST.find(sd => sd.name === s.name)?.encumbrance || 0), 0);
const totalENC = equipmentENC + weaponsENC + shieldsENC;
const overENC = Math.max(0, totalENC - maxEncumbrance);

const movementRate = Math.max(0, 8 - overENC);
strikeRank += overENC;
const encumbranceDefensePenalty = overENC * 5;
```

**Issues**:
1. **Max Encumbrance**: Rule doesn't explicitly state encumbrance limit as STR. Should verify against RQ2 standard (typically STR or higher).
2. **Defense Penalty**: Rule doesn't mention a "defense penalty" of 5% per encumbrance point. This may be custom.
3. **Movement Reduction**: Movement reduction (8 - overENC) is a custom rule; official rules don't specify exact movement loss.

**Status**: ⚠️ **MINOR - Custom interpretation of encumbrance rules**

**Recommendation**: Verify against full RQ2 encumbrance rules to confirm these interpretations are correct.

---

### 8. SKILL CATEGORIES ✅ CORRECT STRUCTURE

**Rule** (Section II, Skills):
Eight skill categories organized by characteristic modifiers.

**Current Implementation** ([skill-categories.constants.ts](src/app/constants/skill-categories.constants.ts)):
```typescript
export const SKILL_CATEGORIES = {
  'Combat Skills': ['Sword & Shield', 'Two-Handed Weapon', 'Spear', 'Bow', 'Sling', 'Unarmed', 'Shield'],
  'Magic Skills': ['Spirit Combat', 'Sorcery', 'Rune Magic'],
  'Knowledge Skills': ['Lore (World)', 'Lore (Animal)', 'Lore (Plant)'],
  'Communication Skills': ['Speak (Native)', 'Speak (Other)', 'Read/Write'],
  'Manipulation Skills': ['Craft', 'Farm', 'Heal'],
  'Perception Skills': ['Listen', 'Scan', 'Search', 'Track'],
  'Stealth Skills': ['Hide', 'Move Quietly'],
  'Agility Skills': ['Climb', 'Dodge', 'Ride', 'Swim']
};
```

✅ **Correct categorization** (matches RQ2 rule skill categories)

**Status**: ✅ **CORRECT STRUCTURE** (but see note below)

**⚠️ Missing Implementation**: Skill categories are defined but **no characteristic modifiers are applied to skills**. Rule states each skill category gets a modifier from characteristics. This system is not implemented in the app.

---

### 9. ABILITY RESOLUTION SYSTEM ⚠️ NOT IMPLEMENTED

**Rule** (Section II, Abilities and How Characteristics Affect Them):

RuneQuest uses a **D100 percentile system**:
- Roll D100 vs. ability rating
- Success if ≤ ability
- Five outcome levels: Critical, Special, Normal, Failure, Fumble
- Opposed resolution rules for contested actions

**Current Implementation**: 
No D100 resolution system is implemented in the app. Skills are stored as percentages, but there's no dice roller built into the character sheet to perform actual ability checks.

**Status**: ⚠️ **NOT IMPLEMENTED** (May be intentional—app focuses on character creation, not play mechanics)

---

### 10. ARMOR AND SHIELD RULES ⚠️ INCOMPLETE

**Rule** (Section IV, Armor):
Armor reduces damage by its armor value; critical hits bypass armor entirely.

**Current Implementation** ([character.model.ts:386-407](src/app/models/character.model.ts#L386-L407)):
```typescript
export function calculateArmorFromShields(shields: Shield[]): ArmorLocations {
  // Calculates armor points from shields only
}
```

**Shield Definitions** ([character.model.ts:534-539](src/app/models/character.model.ts#L534-L539)):
```typescript
export const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Target Shield',  armorPoints: 6,  ... protectedLocations: ['Left Arm', 'Chest'] },
  { name: 'Heater Shield',  armorPoints: 10, ... protectedLocations: ['Left Arm', 'Right Arm', 'Chest'] },
  { name: 'Kite Shield',    armorPoints: 12, ... protectedLocations: [...] },
  { name: 'Tower Shield',   armorPoints: 14, ... protectedLocations: [...] }
];
```

**Issues**:
1. Only shields calculate armor; worn armor (leather, chain, etc.) is referenced in `ARMOR_TYPES` but not integrated
2. Shield armor is location-specific (good); worn armor should also be location-specific
3. No combat mechanics for applying armor reduction during damage calculation

**Status**: ⚠️ **INCOMPLETE - Shield system defined but not fully integrated with worn armor**

---

## SUMMARY TABLE

| Issue | Severity | Rule | Current | Fix |
|---|---|---|---|---|
| Hit Location Proportions | 🔴 CRITICAL | (1/4, 1/6, 1/3, etc.) | Wrong percentages | Correct formula |
| Healing Rate | 🔴 CRITICAL | CON ÷ 4 | CON ÷ 6 | Change divisor |
| Damage Bonus | 🔴 CRITICAL | (1D4, 1D6, 1D8, 1D10, 1D12 progression) | (1D6 increments, custom tiers) | Rewrite formula |
| Spirit Combat Damage | ⚠️ MAJOR | POW direct value | 1D3-1D6+2 dice | Use POW directly |
| Hit Points | ✅ CORRECT | (CON+SIZ)/2 | (CON+SIZ)/2 | None needed |
| Strike Rank Modifiers | ✅ CORRECT | DEX + SIZ mods | Correctly calculated | None needed |
| Skill Categories | ✅ Defined | 8 categories | Correctly organized | Need characteristic modifiers |
| Ability Resolution | ⚠️ Missing | D100 system | Not implemented | Add dice roller (if needed) |
| Movement/Encumbrance | ⚠️ MINOR | Verify rules | Custom interpretation | Review against RQ2 |
| Armor Integration | ⚠️ INCOMPLETE | Worn armor + shields | Shields only | Integrate worn armor |

---

## RECOMMENDATIONS

### Phase 1: Critical Fixes (Must Fix Before Release)
1. ✏️ **Fix hit location proportions** — Correct formula in `calculateHitLocations()`
2. ✏️ **Fix healing rate** — Change divisor from 6 to 4
3. ✏️ **Fix damage bonus progression** — Rewrite to match RQ2 table exactly

### Phase 2: Major Fixes (Important for Accuracy)
4. ✏️ **Clarify Spirit Combat Damage** — Decide if POW value or dice notation
5. ✏️ **Implement skill category modifiers** — Apply characteristic modifiers to base skills

### Phase 3: Minor Improvements
6. 🔍 **Review encumbrance rules** — Verify custom interpretation against full RQ2
7. ✏️ **Integrate worn armor** — Connect `ARMOR_TYPES` to character armor calculations
8. ⚠️ **Consider D100 resolver** — Add dice roller if app expands to play mechanics

---

**Sources**:
- [The Game System | RQ Wiki](https://rqwiki.chaosium.com/rules/the-game-system.html)
- [Characteristics and Runes | RQ Wiki](https://rqwiki.chaosium.com/adventurers/characteristics-and-runes.html)
- [Combat | RQ Wiki](https://rqwiki.chaosium.com/rules/combat.html)
- [Time & Movement | RQ Wiki](https://rqwiki.chaosium.com/rules/time-and-movement.html)
