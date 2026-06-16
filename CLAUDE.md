# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Runequest Character Manager** — An Angular application for creating and managing Runequest/Dragonbane RPG characters with complete character sheet functionality, dice rolling, combat tracking, bestiary, wilderness/combat maps, campaign management, and localStorage persistence.

- **Framework**: Angular 21.2.7 with standalone components
- **Language**: TypeScript 5.9
- **Testing**: Vitest
- **Mobile**: Capacitor 8 for Android
- **Supported Systems**: Runequest and Dragonbane (URL-based via `GameSystemService`)

## Common Commands

```bash
# Development
npm start                  # Start dev server on http://localhost:4202
npm run watch             # Watch build (continuous compilation)

# Building & Deployment
npm run build             # Production build to dist/

# Testing
npm test                  # Run Vitest unit tests

# Mobile
npm run android           # Sync Capacitor files and open Android Studio
npm run icons             # Generate app icons from source

# Code Generation (Angular CLI)
ng generate component path/to/component-name  # Create new component
```

## Architecture

### Directory Structure

The app uses a **feature-based module architecture**. All code lives under `src/app/` organized into `features/` (domain-specific) and `shared/` (cross-cutting).

```
src/app/
├── app.ts / app.routes.ts / app.config.ts   # Root component, lazy routes, DI config
│
├── features/
│   ├── characters/          # Character creation and management
│   │   ├── components/      # character-form, character-list, + 18 character-* sub-components
│   │   ├── services/        # character.service.ts, character-update.service.ts
│   │   ├── models/          # character.model.ts  (authoritative character types + calculations)
│   │   └── constants/       # character-colors, cult-ranks, fantasy-names, skill-categories
│   ├── combat/              # Combat tracker and hex map
│   │   ├── components/      # combat-tracker, combat-map
│   │   ├── services/        # combat.service.ts, combat-log.service.ts
│   │   ├── models/          # combat.model.ts
│   │   └── utils/           # damage-parser.ts
│   ├── bestiary/            # Monster browser and creator
│   │   ├── components/      # bestiary, monster-creator
│   │   ├── services/        # custom-monster.service.ts
│   │   ├── models/          # monster.model.ts
│   │   └── constants/       # monsters, encounters, hit-location-templates
│   ├── campaigns/           # Campaign management
│   │   ├── components/      # campaign-planner, campaign-detail + 5 tab sub-components
│   │   ├── services/        # campaign.service.ts
│   │   └── models/          # campaign.model.ts
│   ├── docs/                # Rules reference, publications, GM screen
│   │   ├── components/      # docs, rules-reference, publications, game-masters-screen, markdown-page
│   │   ├── services/        # markdown.service.ts
│   │   └── constants/       # runequest-publications, dragonbane-publications
│   ├── dice-roller/
│   │   └── components/      # dice-roller
│   ├── maps/                # Wilderness hex map
│   │   ├── components/      # wilderness-map
│   │   ├── services/        # wilderness-map.service.ts
│   │   ├── models/          # wilderness-map.model.ts
│   │   ├── utils/           # hex-pathfinding.ts
│   │   └── constants/       # terrain, map-backgrounds
│   └── settings/
│       └── components/      # settings
│
└── shared/                  # Cross-cutting concerns used by multiple features
    ├── services/            # game-system.service.ts, dice.service.ts, ui-state.service.ts, export.service.ts
    ├── models/              # character-stats.model.ts, game-system.model.ts, combat-participant.model.ts
    ├── constants/           # equipment.constants.ts
    └── styles/              # variables.css, shared-form-styles.css, docs-common.css
```

### TypeScript Path Aliases

All cross-feature imports use path aliases (configured in `tsconfig.app.json`) — never use long relative paths like `../../../../` for cross-feature imports:

```typescript
@shared/*        → src/app/shared/*
@characters/*    → src/app/features/characters/*
@combat/*        → src/app/features/combat/*
@bestiary/*      → src/app/features/bestiary/*
@campaigns/*     → src/app/features/campaigns/*
@docs/*          → src/app/features/docs/*
@maps/*          → src/app/features/maps/*
@dice-roller/*   → src/app/features/dice-roller/*
@settings/*      → src/app/features/settings/*
```

**Example usage:**
```typescript
import { Character } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { CombatParticipant } from '@combat/models/combat.model';
```

### Services Layer

**Shared services** (`shared/services/`) — used by multiple features, injected via `providedIn: 'root'`:
- **`GameSystemService`** — URL-based game system (Runequest/Dragonbane); uses Angular signals; reads system from URL on navigation; provides `link()` helper and `switchSystem()`; serves system-specific cults/occupations/homelands and localized labels
- **`DiceService`** — Dice roll logic (XdY+modifier); imports `UIStateService` for roll settings
- **`UIStateService`** — Font size, collapsed sections, UI toggles; persisted to localStorage
- **`ExportService`** — File download (browser + Capacitor native)

**Feature services** — owned by their feature, but some are injected cross-feature:
- **`CharacterService`** (`@characters/services/`) — CRUD + localStorage persistence; runs `migrateCharacter()` on every load
- **`CharacterUpdateService`** (`@characters/services/`) — RxJS Subject pub/sub for cross-component character list refresh
- **`CombatService`** (`@combat/services/`) — Combat participants, strike rank, map state
- **`CombatLogService`** (`@combat/services/`) — Event log for combat actions
- **`CustomMonsterService`** (`@bestiary/services/`) — Persistence for user-created monsters
- **`CampaignService`** (`@campaigns/services/`) — Campaign CRUD and session/objective persistence
- **`MarkdownService`** (`@docs/services/`) — Markdown rendering and TOC generation
- **`WildernessMapService`** (`@maps/services/`) — Wilderness map state persistence

### Models & Data Flow

**Character Model** (`@characters/models/character.model.ts`) — the authoritative source for all character types:
```
Character {
  id, name, color
  background { cult, occupation, homeland, age, gender }
  stats { STR, CON, SIZ, DEX, INT, POW, CHA }
  derivedStats { HP, MP, damage bonus, strike rank, encumbrance, healing rate, movement }
  hitLocations { Right Leg, Left Leg, Abdomen, Chest, Right Arm, Left Arm, Head }
  armor { per location }
  weapons [ { name, damage, skill, currentHitPoints } ]
  shields [ { name, ... } ]
  runes { elemental, power, form }
  passions [ { name, value } ]
  magic { spiritMagic[], runeMagic[], sorcery[] }
  resources { lunars, wheels, clacks, reputation, ransom }
  equipment [ { name, quantity, cost, hitPoints, encumbrance } ]
  conditions [ string[] ]
  familyHistory, cultStatus, notes
}
```

Also exported from `character.model.ts`: `WEAPON_LIST`, `SHIELD_LIST`, `ARMOR_TYPES`, and all calculation functions (`calculateDerivedStats`, `calculateHitLocations`, `getSizeModifier`, `getDexterityModifier`, etc.). Combat and bestiary features import these directly via `@characters/models/character.model` — this is an intentional dependency since combat rules are character rules.

**Key Calculations** (all pure functions in `character.model.ts`):
- `calculateDerivedStats()` — Damage bonus, strike rank, healing rate, magic points, movement; encumbrance includes shields
- `calculateHitLocations()` — HP per location from CON + SIZ
- `calculateEncumbrance()` — Total weight from equipment + weapons + shields; applies defense penalty if over capacity
- `calculateArmorFromShields()` — Adds shield AP to relevant hit locations
- `calculateTotalArmor()` — Combines worn armor and shields per location

### Constants & Game Data

Constants are co-located with their feature:

| Constants | Location |
|---|---|
| `skill-categories`, `cult-ranks`, `fantasy-names`, `character-colors` | `@characters/constants/` |
| `equipment` (EQUIPMENT_DEFAULTS, MAGIC_DEFAULTS) | `@shared/constants/` |
| `monsters`, `encounters`, `hit-location-templates` | `@bestiary/constants/` |
| `runequest-publications`, `dragonbane-publications` | `@docs/constants/` |
| `terrain`, `map-backgrounds` | `@maps/constants/` |

### Data Persistence & Migration

All data stored in localStorage:

| Key | Owner |
|---|---|
| `runequest-characters` | `CharacterService` |
| `gameSystem` | `GameSystemService` |
| `runequest-combat`, `runequest-monsters`, `runequest-combat-log-history`, `runequest-combat-map`, `runequest-combat-map-templates` | `CombatService` |
| `runequest-wilderness-map` | `WildernessMapService` |
| `combat-log` | `CombatLogService` |
| `runequest-ui-state` | `UIStateService` |
| `custom-monsters` | `CustomMonsterService` |
| `rq-campaigns-index`, `rq-campaign-*` | `CampaignService` |

`CharacterService.migrateCharacter()` runs on every load to add missing fields, upgrade old formats, and maintain backward compatibility.

**To add a new character field**:
1. Add to `Character` interface in `@characters/models/character.model.ts`
2. Add default in `DEFAULT_CHARACTER` or relevant `DEFAULT_*` constant
3. Add migration logic in `CharacterService.migrateCharacter()`
4. Default will auto-fill on load for existing characters

### Styling & Theming

- **Global styles** — `src/styles.css` (reset, typography, root variables)
- **Component styles** — Each component has a co-located `.css` file
- **Variables** — `src/app/shared/styles/variables.css` (colors, spacing, breakpoints)
- **Shared form styles** — `src/app/shared/styles/shared-form-styles.css`

**CSS Variable Usage**: All new CSS must use CSS variables from `variables.css`. Do not hardcode color values (`#fff`, `rgb()`, named colors) or font properties (`font-size`, `font-weight`, `font-family`). Always use `var(--variable-name)`.

**CSS import paths**: Component CSS files import shared styles using relative paths. From `features/<feature>/components/<component>/`:
```css
@import '../../../../shared/styles/shared-form-styles.css';
@import '../../../../shared/styles/variables.css';
```

**Font Size Scaling**: Font sizes use `rem` units (base: 14px = 1rem):
- `--font-size-xs` (10px), `--font-size-sm` (11px), `--font-size-md` (12px), `--font-size-base` (13px)
- `--font-size-lg` (14px), `--font-size-xl` (16px), `--font-size-2xl` (24px)

**Spacing Variables**: `--spacing-xs` (2px) through `--spacing-6xl` (30px)

**Border Radius**: `--border-radius-sm` (3px) through `--border-radius-xl` (8px)

### Routing

Game system is embedded in the URL prefix (`/runequest/...` or `/dragonbane/...`). Navigating to `/` redirects to the last used system (stored in `localStorage['gameSystem']`).

All routes use **`loadComponent()` lazy loading** — each feature is a separate JS chunk loaded on demand:

```
/:system/characters          → CharacterListComponent
/:system/create              → CharacterFormComponent
/:system/combat              → CombatTrackerComponent
/:system/combat-map          → CombatMapComponent
/:system/wilderness-map      → WildernessMapComponent
/:system/bestiary            → BestiaryComponent
/:system/monster-creator     → MonsterCreatorComponent
/:system/campaigns           → CampaignPlannerComponent
/:system/campaigns/:id       → CampaignDetailComponent
/:system/settings            → SettingsComponent
/:system/docs                → DocsComponent (shell)
/:system/docs/rules          → RulesReferenceComponent
/:system/docs/publications   → PublicationsComponent
/:system/docs/gm-screen      → GameMastersScreenComponent
/:system/docs/page           → MarkdownPageComponent
```

`GameSystemService.link()` builds route arrays prefixed with the current system.

## Key Implementation Details

### Character Form Flow

1. **Create Mode**: `character-form` loads with `null` id; shows "Create Character" button
2. **Edit Mode**: Router passes character `:id`; form loads character data; button becomes "Update Character"; visual orange border shows edit state
3. **Sub-component Communication**: Parent form passes character data as `@Input()` and captures updates via `@Output()` events
4. **Auto-calculations**: "Calculate from Stats" button triggers `calculateDerivedStats()` and refreshes all dependent fields
5. **Save**: Calls `CharacterService.saveCharacter()` → persists to localStorage → routes back to list

### Derived Stats & Combat Rules

- **Damage Bonus** — Formula: `(STR + SIZ) / 8` → maps to d4/d6/d8/d10/d12 increments
- **Strike Rank** — `SIZ modifier + DEX modifier`; base 0, modified by SIZ (22+=0, 15-21=+1, 7-14=+2, 1-6=+3) and DEX (19+=0, 16-18=+1, 13-15=+2, 9-12=+3, 6-8=+4, 1-5=+5)
- **Hit Points per Location** — `(CON + SIZ) / 2`, distributed by location
- **Healing Rate** — `(CON / 4)` per week
- **Encumbrance** — Total equipment weight; if over STR limit, applies defense penalty
- **Spirit Combat Damage** — `POW` stat used directly (no damage bonus)

### Game System Switching

`GameSystemService` (URL-based, Angular signals):
- `gameSystem` — Signal containing `'runequest' | 'dragonbane'`; updated automatically on navigation
- `switchSystem(system)` — Navigate to the equivalent page under the other system
- `link(...segments)` — Build a `routerLink` array prefixed with the current system
- `getSystemName()` — Returns `'RuneQuest'` or `'Dragonbane'`
- `getCults()`, `getOccupations()`, `getHomelands()` — System-specific dropdown values
- `getCultLabel()`, `getOccupationLabel()`, `getHomelandLabel()` — System-specific field labels

### Cross-Feature Dependencies

These are intentional, explicit dependencies (not accidents):

| Consumer | Imports from | Reason |
|---|---|---|
| `combat-tracker`, `combat-map` | `@characters/models/character.model` | `Character`, `WEAPON_LIST`, `SHIELD_LIST`, calculation functions — combat rules are character rules |
| `bestiary` | `@characters/models/character.model` | `getSizeModifier`, `getDexterityModifier` for monster strike rank |
| `wilderness-map` | `@characters/models/character.model` | `Character` type for map tokens |
| `bestiary` | `@combat/models/combat.model`, `@combat/services/combat.service` | Adding monsters to active combat |
| `wilderness-map` | `@bestiary/constants/encounters.constants` | Encounter tables for hex encounters |
| `settings` | `@combat/services/combat-log.service`, `@bestiary/services/custom-monster.service`, `@maps/services/wilderness-map.service` | Export/import/clear all data |

## Testing Notes

- **Vitest** is configured; tests are co-located (`.spec.ts` files)
- `jsdom` provides DOM emulation
- Services are injectable and can be mocked via DI in test specs

## Common Patterns

### Adding a New Feature Component

1. Create the component under `src/app/features/<feature>/components/<name>/`
2. Use Angular CLI: `ng generate component features/<feature>/components/<name>`
3. Import shared services via aliases: `from '@shared/services/game-system.service'`
4. Import feature-local files with relative paths: `from '../../models/...'`
5. Add to `app.routes.ts` using `loadComponent()`
6. CSS shared styles: `@import '../../../../shared/styles/shared-form-styles.css'`

### Adding a New Character Field

1. Extend `Character` interface in `@characters/models/character.model.ts`
2. Add default in appropriate `DEFAULT_*` constant
3. Add migration in `CharacterService.migrateCharacter()`
4. Create/extend sub-component to display/edit the field
5. Add to `character-form` template and wire `@Input/@Output`

### Adding a New Game System Variant

1. Extend `GameSystemService` in `@shared/services/game-system.service.ts` with system-specific data and label getters
2. Use `gameSystemService.gameSystem() === 'dragonbane'` where rules differ
3. Add system-specific constants to the relevant feature's `constants/` folder

### Component Communication

- Parent-to-child: `@Input()` properties
- Child-to-parent: `@Output()` events (avoid two-way binding)
- Shared state: Services with RxJS observables (used sparingly; mostly event-driven)

## Build & Deploy

- **Development** — `npm start` hot-reloads on file changes; port 4202
- **Production** — `npm run build` outputs to `dist/runequest-characters/`; all routes code-split as lazy chunks
- **Android** — Capacitor handles native app build; `npm run android` syncs and opens Android Studio
- **Icons** — Auto-generated from source image via Capacitor Assets CLI

## Notes for Future Work

- Movement in combat system
- Improved UI theme, fonts, colors
- Dragonbane-specific rules and stat differences
- Advanced dice roller (modifiers, boon/bane with dual d20)
- Editable character colors (no duplicates among first 5 characters)
