# Runequest Character Manager

A comprehensive Angular application for creating and managing Runequest and Dragonbane RPG characters with complete character sheet functionality, combat tracking, dice rolling, and localStorage persistence.

![Angular](https://img.shields.io/badge/Angular-21.2.7-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### Complete Character Sheet Management
- **Full CRUD Operations**: Create, Read, Update, Delete characters
- **30 Skills** organized in 8 categories (Combat, Magic, Knowledge, Communication, etc.)
- **7 Characteristics**: STR, CON, SIZ, DEX, INT, POW, CHA with 3d6 dice rollers
- **Derived Stats**: Auto-calculated HP, Magic Points, Damage Bonus, Strike Rank, Healing Rate
- **Hit Locations**: Individual HP tracking for 7 body locations
- **Armor System**: Armor points per location with quick-apply feature
- **26 Weapons**: Pre-defined weapons with auto-fill damage and skill association
- **Runes System**: Elemental, Power, and Form Runes (17 total)
- **Passions**: Dynamic passion tracking with percentage values
- **Magic System**: Spirit Magic, Rune Magic, and Sorcery spell management
- **Resources**: Currency (Lunars/Wheels/Clacks), Reputation, Ransom
- **Equipment**: Dynamic equipment list
- **Character Background**: Cult, Occupation, Homeland, Age, Gender
- **Notes**: Large text area for character backstory

### Dice Rolling Utility
- **8 Dice Types**: d4, d6, d8, d10, d12, d20, 3d6, d% (percentile)
- **Advanced Dice Features**: Boons and Banes with dual d20 rolling
- **Animated Results**: Large display with roll animations
- **Roll History**: Track last 10 rolls with clear function
- **Color-coded Buttons**: Gradient-styled dice buttons
- **Contextual Display**: Accessible on character/combat pages, hidden on reference pages

### Combat Tracking
- **Combat Tracker**: Full combat encounter management with initiative, damage, and hit location tracking
- **Initiative System**: Automatic strike rank calculation for all combatants
- **Damage Resolution**: Hit location-specific damage tracking with armor mitigation
- **Movement Tracking**: Movement phase management during combat
- **NPC/Monster Support**: Add custom monsters to combat encounters

### Reference & Database
- **Rules Reference**: Complete rules database with game system-specific content (includes melee round phases)
- **Publications**: Browse all RuneQuest 2 (1978-1983) and modern RuneQuest: Roleplaying in Glorantha (2014-Present) publications with Chaosium catalog numbers and publication years
- **Bestiary**: Pre-populated monster database with creature stats and abilities (searchable and filterable by game system)
- **Monster Creator**: Create and save custom monsters with full stat blocks
- **Game System Filtering**: Filter creatures and rules by RuneQuest or Dragonbane system

### Settings & Customization
- **Game System Toggle**: Switch between RuneQuest and Dragonbane with system-specific rules and labels
- **Text Size Adjustment**: Scalable UI with three text size options (decrease, reset, increase)
- **Multi-Language Support**: English and Swedish localization with dynamic switching
- **Settings Page**: Dedicated settings interface accessible from header gear icon

### User Experience
- **localStorage Persistence**: All data saved locally in JSON format
- **Character Color Coding**: Unique colors for character cards for easy visual identification
- **Edit Mode**: Visual indicators with orange borders and character name banner
- **Auto-calculations**: Derived stats and hit points calculated from characteristics
- **Responsive Design**: Multi-column layouts (5-10 columns) with compact inputs on desktop, optimized for mobile
- **Space-Optimized**: Numeric fields only 45-70px wide for efficiency
- **Migration System**: Backward compatibility for data schema changes
- **Form Validation**: Required fields and numeric range enforcement
- **Optimized Navigation**: Context-sensitive page structure (Create Character on Characters page, Monster Creator on Bestiary page)

## Quick Start

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Or use Angular CLI directly
ng serve --port 4201
```

Navigate to `http://localhost:4201/` in your browser.

## Project Structure

```
runequest-characters/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── character-form/        # Character creation/editing form
│   │   │   ├── character-list/        # Character cards display with create button
│   │   │   ├── dice-roller/           # Standalone dice roller with boons/banes
│   │   │   ├── combat-tracker/        # Full combat encounter management
│   │   │   ├── combat-map/            # Tactical combat map with hex grid
│   │   │   ├── wilderness-map/        # Wilderness map with terrain and token placement
│   │   │   ├── rules-reference/       # Game rules database
│   │   │   ├── bestiary/              # Monster database with filtering
│   │   │   ├── monster-creator/       # Custom monster creation tool
│   │   │   ├── publications/          # RuneQuest publications browser
│   │   │   └── settings/              # Settings page (language, text size, game system)
│   │   ├── models/
│   │   │   ├── character.model.ts     # Character data models & calculations
│   │   │   ├── combat.model.ts        # Combat mechanics and monster data
│   │   │   └── monster.model.ts       # Monster definitions
│   │   ├── services/
│   │   │   ├── character.service.ts   # localStorage & migration
│   │   │   ├── dice.service.ts        # Dice rolling logic
│   │   │   ├── combat.service.ts      # Combat mechanics
│   │   │   ├── game-system.service.ts # Game system state (RQ/Dragonbane)
│   │   │   ├── translation.service.ts # i18n and localization
│   │   │   └── ui-state.service.ts    # UI preferences (font size, etc.)
│   │   ├── i18n/
│   │   │   └── translations.ts        # English and Swedish translations
│   │   ├── constants/
│   │   │   ├── skill-categories.constants.ts
│   │   │   ├── monsters.constants.ts
│   │   │   ├── runequest-publications.constants.ts  # 47 RuneQuest publications (RQ2 & modern)
│   │   │   └── [other game data constants]
│   │   ├── styles.css                 # Global styles
│   │   └── index.html
├── CLAUDE.md                          # Project documentation for Claude Code
├── SESSION_REPORT.md                  # Detailed development report
└── README.md
```

## Navigation Guide

The main navigation provides quick access to core features:

- **Characters** — View all characters, create new characters (button in header)
- **Bestiary** — Browse creatures, create custom monsters (button in header)
- **Combat Tracker** — Manage active combat encounters and initiative
- **Wilderness Map** — Tactical hex-grid map for combat and exploration with token placement and pathfinding
- **Rules Reference** — Look up game rules and mechanics including melee round phases
- **Publications** — Browse RuneQuest publications by Chaosium catalog number across RQ2 and modern eras
- **⚙️ Settings** — Configure game system, text size, and language

The Dice Roller is available on character management and combat pages for quick dice rolls. It's hidden on reference pages (Bestiary, Rules Reference, Publications, Settings, Wilderness Map) to reduce visual clutter.

## Usage

### Creating a Character
1. Enter character name
2. Fill in background (cult, occupation, homeland, age, gender)
3. Roll characteristics using 3d6 buttons or enter manually
4. Click "Calculate from Stats" to auto-generate derived attributes and hit points
5. Adjust skills as needed (30 skills organized by category)
6. Add weapons from dropdown list (26 pre-defined weapons)
7. Set armor values per location
8. Configure runes (Elemental, Power, Form)
9. Add passions, magic spells, equipment, and notes
10. Click "Create Character" to save

### Using the Dice Roller
- Click any dice button (d4, d6, d8, d10, d12, d20, 3d6, d%)
- View large animated result display
- Add Boons (advantages) or Banes (disadvantages) to reroll dice
- See roll history (last 10 rolls)
- Use for skill checks, damage rolls, etc.

### Editing Characters
- Click "Edit" button on any character card
- Form highlights with orange border showing edit mode
- Modify any fields
- Click "Update Character" to save changes

### Combat Encounters
1. Go to Combat Tracker
2. Add characters or monsters to the encounter
3. Initiative automatically calculated based on Strike Rank
4. Apply damage to specific hit locations
5. Track unconsciousness and death states
6. Use dice roller for attack and damage rolls

### Using the Wilderness Map
1. Go to Wilderness Map page
2. **Paint Mode**: Paint terrain on the hex grid (plains, forest, hills, mountains, etc.)
3. **Move Mode**: Add and position tokens representing characters or custom markers
   - **Character Tokens**: Click character names to add them to the map
   - **Custom Tokens**: Create custom tokens with names and colors
   - **Delete Tokens**: Click the × button next to any token to remove it individually
   - **Pathfinding**: Hover over hexes while a token is selected to see movement cost and path
4. Switch between Terrain and Background Image modes for different map views
5. Manage multiple maps: Create, load, and delete custom maps
6. Scale maps with miles or kilometer units per hex

### Using the Bestiary & Monster Creator
- **Bestiary**: Search and filter monsters by game system (RuneQuest/Dragonbane)
- **Monster Creator**: Create custom creatures with full stat blocks and save them
- Filter by system to see only relevant creatures

### Browsing Publications
- Go to Publications page
- View all RuneQuest publications organized by era:
  - **RuneQuest 2 (1978-1983)**: Classic editions and supplements
  - **Modern RuneQuest: Roleplaying in Glorantha (2014-Present)**: Current edition releases
- Sort by Chaosium catalog number (CHA####)
- See publication year and descriptions for each title
- View summary statistics at the bottom

### Customizing Settings
- Click ⚙️ gear icon in the top-right header
- **Game System**: Toggle between RuneQuest (orange) and Dragonbane (green)
- **Text Size**: Adjust UI text size with −/Reset/+ buttons
- **Language**: Switch between English and Swedish

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
- ✅ Parry and dodge mechanics
- ✅ Hit location-specific armor application

### Dragonbane Support
- ✅ Alternate characteristic names and ranges
- ✅ Dragonbane-specific professions and beliefs
- ✅ System-agnostic combat calculations with Dragonbane variants
- ✅ Creature database with Dragonbane-specific monsters
- ✅ Dynamic UI labels based on game system selection
- ✅ Full character creation for both systems

## Data Storage

Characters are stored in browser localStorage with the key `runequest-characters`. Data is automatically migrated when schema changes occur, ensuring backward compatibility.

### Data Format
```json
{
  "id": "unique-id",
  "name": "Character Name",
  "background": { "cult": "Orlanth", "occupation": "Warrior", ... },
  "stats": { "STR": 15, "CON": 12, ... },
  "derivedStats": { "totalHitPoints": 13, "damageBonus": "+1d4", ... },
  "skills": { "Sword & Shield": 45, "Dodge": 35, ... },
  "hitLocations": { "Head": 4, "Chest": 5, ... },
  "armor": { "Head": 3, "Chest": 6, ... },
  "weapons": [{ "name": "Broadsword", "damage": "1d8+1", "skill": "Sword & Shield" }],
  "runes": { "elemental": {...}, "power": {...}, "form": {...} },
  "passions": [{ "name": "Love (Family)", "value": 60 }],
  "magic": { "spiritMagic": [...], "runeMagic": [...], "sorcery": [...] },
  "resources": { "lunars": 100, "wheels": 50, ... },
  "equipment": ["Backpack", "Rope", ...],
  "notes": "Character backstory..."
}
```

## Session Statistics

- **Development Time**: 44 minutes 53 seconds
- **Total Changes**: 2,963 lines added, 641 lines removed
- **Components Created**: 3 (CharacterForm, CharacterList, DiceRoller)
- **Services Created**: 2 (CharacterService, DiceService)
- **Cost**: $11.04 (Claude Sonnet 4.5)

For detailed session information, see [SESSION_REPORT.md](SESSION_REPORT.md).

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Recent Updates (Session 2026-04-28)

### New Features
- **Wilderness Map Enhancements**: Added individual token deletion functionality. Each token now displays a delete button (×) that removes only that token, rather than requiring deletion of all tokens at once.
- **Publications Browser**: New Publications page displaying all 47 RuneQuest publications:
  - 22 RuneQuest 2 publications (CHA4001-CHA4023, 1978-1983)
  - 25 Modern RuneQuest: Roleplaying in Glorantha publications (CHA4025-CHA4060, 2014-Present)
  - Sortable by Chaosium catalog number with publication years and descriptions
  - Statistics showing publication counts by era
  - Added navigation link with 📚 library icon

### Rules Reference Updates
- **Melee Round Phases**: New comprehensive section detailing all 6 phases of combat:
  1. Declare Actions & Modifiers
  2. Calculate Strike Ranks
  3. Act by Strike Rank
  4. Resolve Attacks & Defenses
  5. Apply Conditions
  6. Round End & Reset
  - Includes key points about simultaneous action at same Strike Rank

### UI/UX Improvements
- Dice roller now hidden on Publications page (consistent with other reference pages)
- Updated navigation guide to reflect new Publications feature
- Improved component organization with modular token management

## Future Features

### High Priority
- [ ] Parry restrictions based on arm injuries (if left arm useless, can't parry with shield; if right arm useless, must drop shield)
- [ ] Enhanced Dragonbane-specific rules and mechanics
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
- [ ] Campaign/world management features
