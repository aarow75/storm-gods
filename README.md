# Runequest Character Manager

A comprehensive Angular application for creating and managing RPG characters across multiple game systems — RuneQuest, Dragonbane, Kal-Arath, and OSRIC — with complete character sheet functionality, combat tracking, dice rolling, bestiary, wilderness maps, campaign management, and localStorage persistence.

![Angular](https://img.shields.io/badge/Angular-21.2.7-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Complete Character Sheet Management
- **Full CRUD Operations**: Create, Read, Update, Delete characters
- **System-specific Stats**: Each game system defines its own visible stats and labels
  - RuneQuest / Dragonbane: STR, CON, SIZ, DEX, INT, POW, CHA (3–18 range)
  - Kal-Arath: STR, TOU, AGI, INT, PRE as signed modifiers (−1 to +5)
  - OSRIC: STR, CON, DEX, INT, WIS, CHA (3–18 range; SIZ hidden)
- **Derived Stats**: Auto-calculated HP, Magic Points, Damage Bonus, Strike Rank, Healing Rate (system-specific formulas)
- **Hit Locations**: Individual HP tracking for 7 body locations (RuneQuest/Dragonbane); single HP pool for OSRIC and Kal-Arath
- **Armor System**: Per-location armor points (RuneQuest); armor-as-damage-reduction (Kal-Arath); descending AC with DEX modifier (OSRIC)
- **Weapon Lists**: Pre-defined weapons per system (26 RuneQuest weapons; Kal-Arath advantage/disadvantage dice d6/a, d6, d6/d; OSRIC melee and missile)
- **Skills**: System-specific skill lists organized into categories, with background-driven starting bonuses
- **Runes System**: Elemental, Power, and Form Runes (RuneQuest)
- **Passions**: Dynamic passion tracking with percentage values (RuneQuest/Dragonbane)
- **Magic Systems**:
  - RuneQuest: Spirit Magic, Rune Magic, and Sorcery
  - Kal-Arath: Pact magic with 6 pacts (Blood, Destruction, Domination, Illumination, Shadow, …) and 5 tiers each
  - OSRIC: Class-based spellcasting (Cleric, Druid, Illusionist, Magic User, Paladin, Ranger)
  - Dragonbane: System-native magic
- **Classes & Races (OSRIC)**: 9 classes (Fighter, Cleric, Thief, Magic User, Paladin, Ranger, Druid, Illusionist, Assassin) × 7 races with class abilities and hit-die tables
- **Resources**: System-appropriate currency (Lunars/Wheels/Clacks for RuneQuest; Gold Coins for OSRIC, etc.)
- **Equipment**: Dynamic equipment list
- **Character Background**: System-specific cults/classes, occupations/professions, homelands/origins, age, gender
- **Notes**: Large text area for character backstory
- **Migration System**: Backward-compatible data migrations run on every load

### Dice Rolling Utility
- **8 Dice Types**: d4, d6, d8, d10, d12, d20, 3d6, d% (percentile)
- **Advanced Dice Features**: Boons and Banes with dual d20 rolling
- **Animated Results**: Large display with roll animations
- **Roll History**: Track last 10 rolls with clear function
- **Contextual Display**: Accessible on character/combat pages, hidden on reference pages

### Combat Tracking
- **Combat Tracker**: Full combat encounter management with initiative, damage, and hit location tracking
- **Initiative System**: Automatic strike rank calculation for all combatants
- **Damage Resolution**: Hit location-specific damage tracking with armor mitigation
- **NPC/Monster Support**: Add custom monsters to combat encounters

### Reference & Database
- **Rules Reference**: Game system-specific rules content
- **Publications**: Browse publications across all supported systems:
  - RuneQuest 2 (1978–1983) and modern RuneQuest: Roleplaying in Glorantha (2014–Present) with Chaosium catalog numbers
  - OSRIC retroclone releases and TSR-era modules
  - Dragonbane publications
- **Bestiary**: Pre-populated monster database filterable by game system (RuneQuest, Dragonbane, OSRIC)
- **Monster Creator**: Create and save custom monsters with full stat blocks
- **GM Screen**: Quick-reference tables

### Settings & Customization
- **Game System Toggle**: Switch between RuneQuest, Dragonbane, Kal-Arath, and OSRIC — each with system-specific rules, stats, labels, and UI
- **Text Size Adjustment**: Scalable UI with three text size options
- **Multi-Language Support**: English and Swedish localization
- **Data Export/Import**: Export and import all character and campaign data

### User Experience
- **localStorage Persistence**: All data saved locally in JSON format
- **Character Color Coding**: Unique colors for character cards
- **Edit Mode**: Visual indicators with orange borders and character name banner
- **Auto-calculations**: Derived stats and hit points calculated from characteristics
- **Responsive Design**: Multi-column layouts optimized for desktop and mobile
- **Migration System**: Schema migrations run automatically on load for backward compatibility

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start
```

Navigate to `http://localhost:4202/` in your browser.

## Project Structure

The app uses a **feature-based module architecture** — each domain owns its components, services, models, and constants:

```
src/app/
├── features/
│   ├── characters/      # character-form, 18 sub-components, character-list + service/model/constants
│   ├── combat/          # combat-tracker, combat-map + service/model/utils
│   ├── bestiary/        # bestiary, monster-creator + service/model/constants
│   ├── campaigns/       # campaign-planner, campaign-detail + 5 tabs + service/model
│   ├── docs/            # rules-reference, publications, gm-screen, markdown-page + service/constants
│   ├── dice-roller/     # dice-roller component
│   ├── maps/            # wilderness-map + service/model/utils/constants
│   └── settings/        # settings component
└── shared/
    ├── services/        # game-system, dice, ui-state, export  (used by all features)
    ├── models/          # CharacterStats, GameSystem type, combat-participant
    ├── rules/           # GameSystemRules interface + factory + per-system implementations
    │                    #   (runequest-rules, dragonbane-rules, kal-arath-rules, osric-rules)
    ├── constants/       # equipment constants
    └── styles/          # variables.css, shared-form-styles.css, docs-common.css
```

All routes use `loadComponent()` lazy loading — each feature loads as a separate JS chunk. TypeScript path aliases (`@characters/*`, `@combat/*`, `@shared/*`, etc.) keep cross-feature imports clean. See [CLAUDE.md](CLAUDE.md) for full architecture details.

### Game System Rules Architecture

Each supported system implements the `GameSystemRules` interface (`shared/rules/game-system-rules.interface.ts`), which covers stat definitions, derived stat calculations, hit location logic, skill lists and categories, weapon/shield/armor lists, conditions, magic system type, and (for OSRIC) race/class ability tables and hit-die data. A factory (`game-system-rules.factory.ts`) returns the correct implementation based on the active `GameSystem` value.

## Supported Game Systems

| System | Stats | HP Model | Magic | Notes |
|---|---|---|---|---|
| **RuneQuest** | STR CON SIZ DEX INT POW CHA | Per location | Spirit / Rune / Sorcery | Glorantha cults and lore |
| **Dragonbane** | Same fields, Dragonbane ranges | Per location | Dragonbane magic | Swedish RPG variant |
| **Kal-Arath** | STR TOU AGI INT PRE (signed modifiers) | Single pool | Pact tiers (6 pacts × 5 tiers) | Custom indie system |
| **OSRIC** | STR CON DEX INT WIS CHA | Single pool, class HD | Class-based spells | Old-school D&D retroclone, descending AC |

## Navigation Guide

The main navigation provides quick access to core features:

- **Characters** — View all characters, create new characters (button in header)
- **Bestiary** — Browse creatures, create custom monsters (button in header)
- **Combat Tracker** — Manage active combat encounters and initiative
- **Wilderness Map** — Tactical hex-grid map for combat and exploration with token placement and pathfinding
- **Rules Reference** — Look up game rules and mechanics
- **Publications** — Browse publications by system (RuneQuest, OSRIC, Dragonbane)
- **⚙️ Settings** — Configure game system, text size, language, and data export/import

The Dice Roller is available on character management and combat pages. It's hidden on reference pages (Bestiary, Rules Reference, Publications, Settings, Wilderness Map) to reduce visual clutter.

## Usage

### Creating a Character
1. Select a game system from Settings (or via the URL prefix)
2. Enter character name and fill in background (system-specific cult/class, occupation, homeland)
3. Roll or enter stats (system-specific stat labels and ranges)
4. Click "Calculate from Stats" to auto-generate derived attributes and hit points
5. Add weapons, armor, skills, magic, equipment, and notes
6. Click "Create Character" to save

### Using the Combat Tracker
1. Go to Combat Tracker
2. Add characters or monsters to the encounter
3. Initiative automatically calculated based on Strike Rank (or equivalent)
4. Apply damage to specific hit locations (or total HP for OSRIC/Kal-Arath)
5. Track conditions, unconsciousness, and death states

### Using the Wilderness Map
1. Go to Wilderness Map page
2. **Paint Mode**: Paint terrain on the hex grid (plains, forest, hills, mountains, etc.)
3. **Move Mode**: Add and position tokens representing characters or custom markers
   - **Character Tokens**: Click character names to add them to the map
   - **Custom Tokens**: Create custom tokens with names and colors
   - **Delete Tokens**: Click the × button next to any token to remove it individually
   - **Pathfinding**: Hover over hexes while a token is selected to see movement cost and path
4. Switch between Terrain and Background Image modes
5. Manage multiple maps: Create, load, and delete saved maps
6. Scale maps with miles or kilometer units per hex

### Using the Bestiary & Monster Creator
- **Bestiary**: Search and filter monsters by game system (RuneQuest / Dragonbane / OSRIC)
- **Monster Creator**: Create custom creatures with full stat blocks and save them

### Browsing Publications
- Go to Publications page and select a system
- **RuneQuest**: 22 RuneQuest 2 classics (CHA4001–CHA4023) + 25 modern RuneQuest: Roleplaying in Glorantha releases
- **OSRIC**: Core rules, supplements, and TSR-era adventures
- **Dragonbane**: Official Dragonbane releases

### Customizing Settings
- **Game System**: Toggle between RuneQuest, Dragonbane, Kal-Arath, and OSRIC
- **Text Size**: Adjust UI text size with −/Reset/+ buttons
- **Language**: Switch between English and Swedish
- **Data**: Export or import all saved data (characters, campaigns, monsters, maps)

## Game System Accuracy

### RuneQuest Rules Implementation
- ✅ Correct characteristic ranges (3-18 for 3d6)
- ✅ Accurate damage bonus formula ((STR + SIZ) / 8)
- ✅ Proper hit location distribution (7 locations with specific HP allocation)
- ✅ Spirit combat damage based on POW
- ✅ Strike rank calculation with SIZ and DEX modifiers
- ✅ Canonical Glorantha lore (cults, homelands, skills)
- ✅ Three magic systems (Spirit Magic, Rune Magic, Sorcery)
- ✅ Rune affinities system (Elemental, Power, Form runes)
- ✅ Encumbrance and movement penalties
- ✅ Hit location-specific armor application

### Dragonbane Support
- ✅ Dragonbane-specific professions and beliefs
- ✅ Creature database with Dragonbane-specific monsters
- ✅ Dynamic UI labels based on game system selection

### Kal-Arath Support
- ✅ 5 stats as signed modifiers (−1 to +5): STR, TOU, AGI, INT, PRE
- ✅ 4 class archetypes: Warrior, Rogue, Mystic, Explorer
- ✅ Pact magic: 6 pacts with 5 tiers each
- ✅ Advantage/disadvantage weapon dice (d6/d, d6, d6/a)
- ✅ Armor as damage reduction (Light 1 / Medium 2 / Heavy 3)
- ✅ System-specific conditions (Broken, Shattered, Fatigued, Silenced, etc.)

### OSRIC Support
- ✅ 6 ability scores (STR, CON, DEX, INT, WIS, CHA; SIZ hidden)
- ✅ 9 classes with class abilities and hit-die tables (Fighter d10, Cleric d8, Thief d6, Magic User d4, etc.)
- ✅ 7 races with racial abilities (Dwarf, Elf, Gnome, Half-Elf, Halfling, Half-Orc, Human)
- ✅ Descending AC with DEX modifier (base 10 unarmored, lower = better)
- ✅ Class-based spellcasting tracked per character
- ✅ OSRIC publications browser (core rules, supplements, adventures)
- ✅ OSRIC monsters in bestiary

## Data Storage

All data is stored in browser localStorage and automatically migrated on load when schema changes occur.

| Key | Feature |
|---|---|
| `runequest-characters` | CharacterService |
| `gameSystem` | GameSystemService |
| `runequest-combat`, `runequest-monsters`, `runequest-combat-log-history`, `runequest-combat-map`, `runequest-combat-map-templates` | CombatService |
| `runequest-wilderness-map` | WildernessMapService |
| `combat-log` | CombatLogService |
| `runequest-ui-state` | UIStateService |
| `custom-monsters` | CustomMonsterService |
| `rq-campaigns-index`, `rq-campaign-*` | CampaignService |

## Development

```bash
npm start          # Dev server on http://localhost:4202
npm run build      # Production build to dist/
npm test           # Vitest unit tests
npm run android    # Sync Capacitor and open Android Studio
```

### Adding a New Game System

1. Create `src/app/shared/rules/<system>-rules.ts` implementing `GameSystemRules`
2. Register it in `game-system-rules.factory.ts`
3. Add the system key to `GameSystem` type in `game-system.model.ts`
4. Extend `GameSystemService` with system-specific cults/occupations/homelands and labels
5. Add publications constants under `features/docs/constants/` if applicable

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Future Features

### High Priority
- [ ] Enhanced Dragonbane-specific rules and mechanics
- [ ] Parry restrictions based on arm injuries
- [ ] Character import/export functionality

### Medium Priority
- [ ] Game system-specific UI themes (images, fonts, color schemes)
- [ ] Advanced character customization and visual appearance editor
- [ ] Save/load combat encounters
- [ ] Expanded bestiary with more creatures and variants

### Low Priority
- [ ] Cloud synchronization (optional account system)
- [ ] Character sheet PDF export
- [ ] Multi-player character management
