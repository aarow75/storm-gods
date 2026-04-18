# Runequest Character Manager

A comprehensive Angular application for creating and managing Runequest RPG characters with complete character sheet functionality, dice rolling, and localStorage persistence.

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
- **Animated Results**: Large display with roll animations
- **Roll History**: Track last 10 rolls with clear function
- **Color-coded Buttons**: Gradient-styled dice buttons

### User Experience
- **localStorage Persistence**: All data saved locally in JSON format
- **Edit Mode**: Visual indicators with orange borders and character name banner
- **Auto-calculations**: Derived stats and hit points calculated from characteristics
- **Responsive Design**: Multi-column layouts (5-10 columns) with compact inputs
- **Space-Optimized**: Numeric fields only 45-70px wide for efficiency
- **Migration System**: Backward compatibility for data schema changes
- **Form Validation**: Required fields and numeric range enforcement

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
│   │   │   ├── character-form/      # Character creation/editing form
│   │   │   ├── character-list/      # Character cards display
│   │   │   └── dice-roller/         # Standalone dice roller
│   │   ├── models/
│   │   │   └── character.model.ts   # Data models & calculations
│   │   └── services/
│   │       ├── character.service.ts # localStorage & migration
│   │       └── dice.service.ts      # Dice rolling logic
│   ├── styles.css                   # Global styles
│   └── index.html
├── SESSION_REPORT.md                # Detailed development report
└── README.md
```

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
- See roll history (last 10 rolls)
- Use for skill checks, damage rolls, etc.

### Editing Characters
- Click "Edit" button on any character card
- Form highlights with orange border showing edit mode
- Modify any fields
- Click "Update Character" to save changes

## Game System Accuracy

This application accurately implements Runequest rules:
- ✅ Correct characteristic ranges (3-18 for 3d6)
- ✅ Accurate damage bonus formula (STR + SIZ)
- ✅ Proper hit location distribution
- ✅ Spirit combat damage based on POW
- ✅ Strike rank calculation (DEX + INT / 2)
- ✅ Canonical Glorantha lore (cults, homelands, skills)
- ✅ Three magic systems (Spirit, Rune, Sorcery)
- ✅ Rune affinities system

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
