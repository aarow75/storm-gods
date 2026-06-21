Add a new game system to the character creator.

Arguments: $ARGUMENTS
(Provide the system slug and display name, e.g.: `my-system "My System"`)

The slug must be URL-safe (lowercase, hyphens only). If no display name is given, derive one from the slug.

---

## Overview

A game system is a named URL prefix (`/:system/...`) with its own rules, character data, and UI labels. Four systems currently exist: `runequest`, `dragonbane`, `kal-arath`, and `osric`. The first and most critical step is establishing the mechanics reference — every other file (rules class, GM screen, publications, etc.) is derived from it. Do not proceed past Step 1 until the reference document exists.

---

## Step 1 — Establish the mechanics reference document

This document is the canonical source of truth for the system's rules. Everything else in this skill is derived from it.

**Check if it already exists:**
```bash
ls public/docs/
```
Look for a file like `<SystemName>-Mechanics-Reference.md`. If it exists, proceed to Step 2.

**If it does not exist:**

1. Check `public/docs/` for any raw rules text, scan output, or partial document for this system.
2. Check whether a source PDF is available anywhere in the project directory:
   ```bash
   find . -name "*.pdf" -not -path "*/node_modules/*"
   ```
3. If a PDF is found, use the `ocr-pdf` skill to extract it, then synthesize the extracted text into a structured mechanics reference.
4. If neither a PDF nor any source text is found, stop and ask the user: *"I need a rules document to build from — do you have a PDF, scan, or text file of the [System Name] rules I can work from?"*

**Writing the mechanics reference:**

Create `public/docs/<SystemName>-Mechanics-Reference.md`. Use `public/docs/OSRIC-Mechanics-Reference.md` and `public/docs/Kal-Arath-Mechanics-Reference.md` as structural templates. Cover:

- Introduction / Core Concept (what makes this system distinct)
- Character Stats and what each one does
- Derived values (HP, initiative, etc.) and their formulas
- Skill or ability check resolution (how to roll, difficulty)
- Combat sequence (initiative, attack, defense, damage)
- Weapons, armor, and shields (types, stats, special rules)
- Magic system (if any — cost, resolution, mishap rules)
- Healing and recovery
- Conditions and status effects
- Experience / advancement (if applicable)

Be precise about numbers and formulas — this doc is the source from which the rules class will be implemented.

---

## Step 2 — Extend the `GameSystem` type

File: `src/app/shared/models/game-system.model.ts`

Add the new slug to the union. TypeScript propagates this change as compile errors throughout the codebase — follow those errors to find every place that needs updating.

```typescript
export type GameSystem = 'runequest' | 'dragonbane' | 'kal-arath' | 'osric' | '<new-slug>';
```

---

## Step 3 — Create the rules class

Create `src/app/shared/rules/<new-slug>-rules.ts` implementing `GameSystemRules` from `./game-system-rules.interface`.

Use the mechanics reference from Step 1 as the authoritative source for all numbers and formulas. Use `osric-rules.ts` as a code template for systems with class/level mechanics, or `runequest-rules.ts` for d100 skill-based systems.

Required interface methods:

- `getStatDefinitions()` — which of STR/CON/SIZ/DEX/INT/POW/CHA are visible and what labels to show; derive labels from the system's actual stat names
- `calculateDerivedStats()` — implement the system's formulas exactly as documented in the reference; return `0` or `null` for concepts that don't apply
- `usesHitLocations()` — `true` for location-based HP (RQ-style), `false` for single HP pool
- `calculateHitLocations()` — return `null` if `usesHitLocations()` is `false`
- `getSkillDefinitions()` / `getDefaultSkills()` / `getSkillCategories()` — full skill list with default starting values from the reference
- `calculateSkillCategoryModifiers()` — stat-derived bonuses per category; return `{}` if not used
- `applyBackgroundBonuses()` — occupation/homeland/cult starting bonuses per the reference
- `getWeaponList()` / `getShieldList()` / `getArmorTypes()` — equipment stats from the reference
- `getConditions()` — all status conditions and their mechanical effects
- `getMagicSystemType()` — e.g. `'spirit'`, `'arcane'`, `'dragonbane'`, `'none'`
- `getCurrencyLabel()` — e.g. `'GP'`, `'Silver'`, `'SP'`

Optional methods — implement if the system uses them:
- `getRaceAbilities?(race)` — racial traits
- `getClassAbilities?(className)` — class features
- `getClassHitDie?(className)` — HD info for level-up HP rolling
- `getConHpModifier?(con)` — CON bonus per HD roll

---

## Step 4 — Register the rules in the factory

File: `src/app/shared/rules/game-system-rules.factory.ts`

Import the new rules class and add it to the `RULES` record. The `Record<GameSystem, GameSystemRules>` type will produce a TypeScript error until the new slug is present.

---

## Step 5 — Add the equipment list

File: `src/app/shared/constants/equipment.constants.ts`

Add a new exported constant (e.g. `MY_SYSTEM_EQUIPMENT_LIST`) as an `EquipmentDefinition[]`. Draw item names, weights, and costs from the mechanics reference. Use `OSRIC_EQUIPMENT_LIST` as a structural template.

---

## Step 6 — Wire up `GameSystemService`

File: `src/app/shared/services/game-system.service.ts`

**6a.** Update `SYSTEM_PATTERN` regex to include the new slug.

**6b.** Update the `switchSystem()` regex for the same list.

**6c.** Add a private `GameSystemData` field. Derive the values from the mechanics reference:
- `cults` — affiliations, alignments, pacts, or beliefs (whatever the system calls them)
- `occupations` — classes, professions, or backgrounds
- `homelands` — races, regions, or origins

**6d.** Add a branch to every getter — every `if`/`else` chain must handle the new slug:
- `loadLastUsed()` — add slug to the validity check
- `getCults()`, `getOccupations()`, `getHomelands()`
- `getSystemName()` — human-readable display name
- `getHomelandLabel()`, `getOccupationLabel()`, `getCultLabel()` — use the system's actual terminology
- `getSelectHomelandLabel()`, `getSelectOccupationLabel()`, `getSelectCultLabel()`
- `getEquipmentList()` — return the constant from Step 5
- `getCurrencyLabel()` — short currency string
- `getPrimaryCurrencyKey()` — one of `'lunars' | 'silver' | 'gold'`

---

## Step 7 — Add the route

File: `src/app/app.routes.ts`

Add the slug to the `valid` array in `redirectToLastSystem`, and add a top-level route entry reusing `gameSystemRoutes`:
```typescript
{ path: '<new-slug>', children: gameSystemRoutes },
```

---

## Step 8 — Update `CharacterService`

File: `src/app/features/characters/services/character.service.ts`

`migrateCharacter()` defaults `gameSystem` to `'runequest'` for legacy characters. Add a branch only if the new system needs special migration logic. Otherwise the factory fallback handles it.

---

## Step 9 — Search for per-system display branches

Run:
```bash
grep -rn "kal-arath\|osric\|dragonbane" src/app/features --include="*.ts" -l
```

Open each file and extend every `=== 'kal-arath'` / `!== 'dragonbane'` style branch to explicitly handle the new system.

Key files:
- `character-list.component.ts` — display labels and section visibility per system
- `character-form.component.ts` — which sub-forms are shown
- `character-magic.ts`, `character-derived-stats.ts`, `character-armor.ts`, `character-weapons.ts`, `character-resources.ts`, `character-abilities.ts`

---

## Step 10 — Add the logo

Place the logo in `public/` as `<SystemName>-logo.png` (e.g. `public/My-System-logo.png`). Recommended: 300×150px minimum, transparent or dark background. Ask the user to provide the logo file if it isn't already in the project. After adding it, find all logo references and add a guarded branch for the new system:
```bash
grep -rn "logo\|\.png" src/app --include="*.html" --include="*.ts"
```

---

## Step 11 — Add the publications list

Create `src/app/features/docs/constants/<new-slug>-publications.constants.ts`. Define an interface and export a typed array of publication objects. Use `osric-publications.constants.ts` as a template — it has `title`, `publishedYear`, `category`, `description`, `publisher`, and optional flags. Populate it from the mechanics reference or by asking the user for a list of official publications.

Update `publications.component.ts`:
1. Import the new constant.
2. Add a branch in the `publications` getter.
3. Add a `get is<SystemName>()` computed property.
4. Add categorized getters if the publications need split views (core rules, supplements, adventures, etc.).

Update `publications.component.html` with a new system block, guarded by `is<SystemName>`.

---

## Step 12 — Add the GM screen data

Using the mechanics reference as the source, add quick-reference data arrays to `game-masters-screen.component.ts`. Aim to cover what a GM needs during play:

- Core resolution mechanic
- Stat modifier table (if applicable)
- Combat procedure (attack, defense, critical, fumble)
- Armor and weapon quick reference
- Conditions and effects
- Magic mishap or surge table (if applicable)
- Healing and recovery summary
- Any system-specific reference tables (e.g. THAC0, morale, reaction)

In `game-masters-screen.component.html`, add a new `@if (gameSystemService.gameSystem() === '<new-slug>')` block. Use `<section class="gm-section">` with `<h3>` headings and `<table class="gm-table-small">` for tabular data — match the style of existing system blocks.

---

## Step 13 — Register the mechanics reference in the docs shell

File: `src/app/features/docs/components/docs/docs.component.ts`

Add an entry for the new system in `CUSTOM_DOCUMENTS`. The `Record<GameSystem, ...>` type will produce a TypeScript error until the new slug is present:

```typescript
'<new-slug>': [
  { filename: '<SystemName>-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' }
],
```

---

## Step 14 — Verify

1. Run `npm test` — all tests must pass.
2. Run `npm start` and navigate to `/<new-slug>/characters`.
3. Create a character — verify stats calculate, skills populate, character saves and reloads correctly.
4. Navigate to `/<new-slug>/docs/publications` — publications render correctly.
5. Navigate to `/<new-slug>/docs/gm-screen` — GM screen shows the new system's tables.
6. Open the mechanics reference from the docs sidebar — it loads and renders.
7. Switch to another system and back — `GameSystemService` reflects the correct data throughout.
