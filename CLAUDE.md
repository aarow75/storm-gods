# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Runequest Character Manager** — An Angular application for creating and managing Runequest/Dragonbane RPG characters with complete character sheet functionality, dice rolling, combat tracking, and localStorage persistence.

- **Framework**: Angular 21.2.7 with standalone components
- **Language**: TypeScript 5.9
- **Testing**: Vitest
- **Mobile**: Capacitor 8 for Android
- **Supported Systems**: Runequest and Dragonbane (switchable via `GameSystemService`)

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

### High-Level Structure

The app uses a **modular component architecture** where each major character sheet section is an independent, self-contained component:

- **Root Component** (`app.ts`): Manages navigation, language/game-system switching, and the dice roller overlay
- **Character List** (`character-list.component.ts`): Grid of character cards; entry point for CRUD operations
- **Character Form** (`character-form.component.ts`): Main editor; imports 12+ sub-components for different sections
- **Sub-components** (e.g., `character-characteristics`, `character-skills`, `character-armor`): Focused on a single data section each

### Services Layer

**Core Services**:
- **`CharacterService`** — CRUD operations and localStorage persistence
  - Loads/saves characters from `localStorage['runequest-characters']`
  - Runs `migrateCharacter()` on every load to handle schema changes (backward compatibility)
  - Applies schema defaults for missing fields
- **`DiceService`** — Dice roll logic (XdY+modifier)
- **`GameSystemService`** — Switches between Runequest and Dragonbane systems; affects UI labels, rules, and calculations
- **`TranslationService`** — i18n with English (en) and Swedish (sv) locales

**Supporting Services**:
- **`CharacterUpdateService`** — Reactive updates to character data (used by form sub-components)
- **`CombatService`** — Combat mechanics (hit locations, damage, parry/dodge, encumbrance)

### Models & Data Flow

**Character Model** (`character.model.ts`):
```
Character {
  id, name, color
  background { cult, occupation, homeland, age, gender }
  stats { STR, CON, SIZ, DEX, INT, POW, CHA }
  derivedStats { HP, MP, damage bonus, strike rank, encumbrance, healing rate, movement }
  hitLocations { Right Leg, Left Leg, Abdomen, Chest, Right Arm, Left Arm, Head }
  armor { per location }
  weapons [ { name, damage, skill, currentHitPoints } ]
  runes { elemental, power, form }
  passions [ { name, value } ]
  magic { spiritMagic[], runeMagic[], sorcery[] }
  resources { lunars, wheels, clacks, reputation, ransom }
  equipment [ { name, quantity, cost, hitPoints, encumbrance } ]
  familyHistory, cultStatus, notes
}
```

**Key Calculations**:
- `calculateDerivedStats()` — Damage bonus, strike rank, healing rate, magic points, movement
- `calculateHitLocations()` — HP per location from CON + SIZ
- `calculateEncumbrance()` — Total weight from equipment + weapons; applies defense penalty if over capacity

All calculations are pure functions exported from `character.model.ts` and called by services.

### Constants & Game Data

All game data (cults, skills, weapons, runes, passions, equipment definitions) are stored as TypeScript constants in `src/app/constants/`:
- `skill-categories.constants.ts` — 30 skills organized by 8 categories
- `cult-ranks.constants.ts` — Cult status ranks
- `fantasy-names.constants.ts` — Name generation
- `character-colors.constants.ts` — Unique colors for character cards

### Data Persistence & Migration

- Characters stored in single localStorage key: `'runequest-characters'` as JSON
- `CharacterService.migrateCharacter()` runs on load to:
  - Add missing fields with defaults
  - Upgrade old string-array equipment format to objects
  - Recalculate derived stats if missing
  - Ensure backward compatibility when schema changes

**To add a new field**:
1. Add to `Character` interface in `character.model.ts`
2. Add default in `DEFAULT_CHARACTER` or specific interface (e.g., `DEFAULT_RUNES`)
3. Add migration logic in `CharacterService.migrateCharacter()` if field may be missing in old data
4. Default will auto-fill on load for existing characters

### Styling & Theming

- **Global styles** — `src/styles.css` (reset, typography, root variables)
- **Component styles** — Each component has co-located `.component.css` file
- **Variables file** — `src/app/shared/styles/variables.css` (colors, spacing, responsive breakpoints)
- **Shared form styles** — `src/app/shared/styles/shared-form-styles.css` (reusable form input classes)

**CSS Variable Usage**: All new CSS must use CSS variables from `variables.css` for colors and font properties. Do not hardcode color values (`#fff`, `rgb()`, named colors) or font properties (`font-size`, `font-weight`, `font-family`) in component `.css` files. Always reference variables via `var(--variable-name)` to ensure consistency and simplify future theme changes.

**Font Size Scaling**: Font sizes use `rem` units (base: 14px = 1rem) with semantic names:
- `--font-size-xs` (10px) — Extra small, hints
- `--font-size-sm` (11px) — Small, labels
- `--font-size-md` (12px) — Medium-small
- `--font-size-base` (13px) — Base variant
- `--font-size-lg` (14px) — Large, default body text
- `--font-size-xl` (16px) — Extra large, headings
- `--font-size-2xl` (24px) — 2x large, main headings

**Spacing Variables**: All padding, margin, and gap values use semantic spacing variables:
- `--spacing-xs` (2px), `--spacing-sm` (4px), `--spacing-md` (6px), `--spacing-lg` (8px), `--spacing-xl` (10px)
- `--spacing-2xl` (12px), `--spacing-3xl` (15px), `--spacing-4xl` (16px), `--spacing-5xl` (20px), `--spacing-6xl` (30px)

**Border Radius**: Border radius values use `--border-radius-sm` (3px), `--border-radius-md` (4px), `--border-radius-lg` (6px), `--border-radius-xl` (8px)

Color scheme is configurable per character (`character.color` property). Form edit mode uses orange border/banner visual indicator.

### Routing

Standalone routes in `app.routes.ts`:
- `/` — Character list
- `/character/create` — Create new character
- `/character/:id` — Edit character

Uses Angular Router's standalone APIs; no module-based routing.

## Key Implementation Details

### Character Form Flow

1. **Create Mode**: `character-form` loads with `null` id; shows "Create Character" button
2. **Edit Mode**: Router passes character `:id`; form loads character data; button becomes "Update Character"; visual orange border shows edit state
3. **Sub-component Communication**: Parent form passes character data as `@Input()` and captures updates via `@Output()` events
4. **Auto-calculations**: "Calculate from Stats" button triggers `calculateDerivedStats()` and refreshes all dependent fields
5. **Save**: Calls `CharacterService.saveCharacter()` → persists to localStorage → routes back to list

### Derived Stats & Combat Rules

- **Damage Bonus** — Formula: `(STR + SIZ) / 8` → maps to d4/d6/d8/d10/d12 increments
- **Strike Rank** — `(DEX + INT) / 2`, affects turn order in combat
- **Hit Points per Location** — `(CON + SIZ) / 2`, distributed by location (head=1/4, limbs=1/4 each, torso=2/4)
- **Healing Rate** — `(CON / 4)` per week
- **Encumbrance** — Total equipment weight; if over STR limit, applies defense penalty
- **Spirit Combat Damage** — `POW` stat used directly (no damage bonus)

These formulas are game-system agnostic; `GameSystemService` allows Dragonbane variants to override labels/calculations if needed.

### i18n & Multi-Language

- `TranslationService` holds locale state (English/Swedish)
- Components inject `TranslationService` and call `get(key, default)` for labels
- Fall back to English if key not found in Swedish
- Game system name (`getSystemName()`) also translatable

### Game System Switching

`GameSystemService` provides:
- `toggleGameSystem()` — Switch between "Runequest" and "Dragonbane"
- `getSystemName()` — Returns localized system name
- Used in app root for title and in form to show system-specific rules/fields

## Testing Notes

- **Vitest** is configured; tests are co-located (`.spec.ts` files)
- `jsdom` provides DOM emulation
- Services are injectable and can be mocked via DI in test specs

## Common Patterns

### Adding a New Character Field

1. Extend `Character` interface in `character.model.ts`
2. Add default in appropriate `DEFAULT_*` constant
3. Add migration in `CharacterService.migrateCharacter()`
4. Create/extend sub-component to display/edit the field
5. Add to form template and wire `@Input/@Output`

### Adding a New Game System Variant

1. Extend `GameSystemService` with game-system-specific logic
2. Wrap calculations with `if (this.gameSystemService.isDragonbane())` where rules differ
3. Update translation keys for system-specific labels

### Component Communication

- Parent-to-child: `@Input()` properties
- Child-to-parent: `@Output()` events (avoid two-way binding)
- Shared state: Services with RxJS observables (used sparingly; mostly event-driven)

## Build & Deploy

- **Development** — `npm start` hot-reloads on file changes
- **Production** — `npm run build` outputs to `dist/runequest-characters/`
- **Android** — Capacitor handles native app build; `npm run android` syncs and opens Android Studio
- **Icons** — Auto-generated from source image via Capacitor Assets CLI

## Notes for Future Work

See README.md for the TODO section. Key upcoming features:
- Movement in combat system
- Improved UI theme, fonts, colors
- Dragonbane-specific rules
- Monster Builder page
- Advanced dice roller (modifiers, boon/bane with dual d20)
- Editable character colors (no duplicates among first 5 characters)
- Game system indicator per character (RQ vs DB)
