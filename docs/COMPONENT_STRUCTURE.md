# RuneQuest Character Manager - Component Structure

## Application Routes

Game system (`runequest` or `dragonbane`) is part of the URL. Navigating to `/` redirects to the last used system.

| Path | Component |
|------|-----------|
| `/:system/characters` | CharacterListComponent |
| `/:system/create` | CharacterFormComponent |
| `/:system/combat` | CombatTrackerComponent |
| `/:system/combat-map` | CombatMapComponent |
| `/:system/wilderness-map` | WildernessMapComponent |
| `/:system/docs/rules` | RulesReferenceComponent (inside DocsComponent) |
| `/:system/docs/publications` | PublicationsComponent (inside DocsComponent) |
| `/:system/docs/gm-screen` | GameMastersScreenComponent (inside DocsComponent) |
| `/:system/bestiary` | BestiaryComponent |
| `/:system/monster-creator` | MonsterCreatorComponent |
| `/:system/settings` | SettingsComponent |

## Character Form Component Hierarchy

```
character-form (Main Container — 407 HTML / 732 TS lines)
│
├── Character Name (inline in main form)
│
├── character-characteristics
│   ├── STR, CON, SIZ, DEX, INT, POW, CHA (each with dice roller)
│   └── Roll All Stats button
│
├── character-background
│   ├── Cult/Religion (dropdown with validation)
│   ├── Occupation (dropdown with validation)
│   ├── Homeland (dropdown with validation)
│   ├── Age (number input)
│   └── Gender (text input)
│
├── character-skills
│   ├── Combat, Magic, Knowledge, Communication, Manipulation,
│   │   Perception, Stealth, Agility categories
│   └── Apply Bonuses button
│
├── character-derived-stats
│   ├── Total Hit Points, Magic Points, Damage Bonus,
│   │   Healing Rate, Strike Rank, Encumbrance (all readonly)
│   └── Calculate from Stats button
│
├── character-hit-locations
│   └── HP per body location
│
├── character-armor
│   └── Armor points per location
│
├── character-shields
│   └── Shield list with add/remove
│
├── character-weapons
│   └── Weapons list with add/remove
│
├── character-runes
│   ├── Elemental Runes
│   ├── Power Runes
│   └── Form Runes
│
├── character-cult-status
│   ├── Cult Name, Rank
│   └── Rune Spells
│
├── character-passions
│   └── Passions list with add/remove
│
├── character-magic
│   ├── Spirit Magic
│   ├── Rune Magic
│   └── Sorcery
│
├── character-resources
│   └── Lunars, Wheels, Clacks, Reputation, Ransom
│
├── character-equipment
│   └── Equipment list with add/remove
│
├── character-notes
│   └── Notes textarea
│
├── character-conditions
│   └── Active conditions/status effects
│
└── Form Actions (inline in main form)
    ├── Save/Update button
    └── Cancel button (edit mode only)
```

**Note**: `character-family-history` exists as a component but is not currently used in the character form.

## Other Page Components

| Component | Purpose |
|-----------|---------|
| `character-list` | Grid of character cards; CRUD entry point |
| `combat-tracker` | Initiative tracking, participants, combat rounds |
| `combat-map` | Hex-grid tactical combat map |
| `wilderness-map` | Overworld hex map with terrain and encounters |
| `bestiary` | Monster reference browser |
| `monster-creator` | Custom monster builder |
| `docs` | Shell component with sub-route navigation |
| `rules-reference` | In-app game rules viewer |
| `publications` | Game publication reference lists |
| `game-masters-screen` | GM quick-reference screen |
| `settings` | App settings (game system, preferences) |
| `dice-roller` | Global overlay component (managed by app root) |

## Data Flow

### Input Flow (Parent → Child)
```
character-form.component.ts
        ↓ [property]="value"
    child-component.ts
        ↓ template binding
    child-component.html
```

### Output Flow (Child → Parent)
```
child-component.html
        ↓ (click)="event.emit()"
    child-component.ts
        ↓ @Output() event
    character-form.component.ts
```

## Component Communication Examples

### Background Component
**Input**
```typescript
[background]="character.background!"
[cults]="cults"
[isFieldInvalid]="isFieldInvalid.bind(this)"
```
**Output**
```typescript
(cultChange)="onCultChange()"
```

### Characteristics Component
**Input**
```typescript
[stats]="character.stats!"
[isFieldRandomized]="isFieldRandomized.bind(this)"
```
**Output**
```typescript
(rollAll)="rollAll3D6()"
(rollStat)="roll3D6($event)"
```

## File Organization

```
src/app/
├── app.ts                          — Root; nav, dice roller overlay, game-system switching
├── app.routes.ts                   — Route definitions
├── app.config.ts                   — Angular providers
│
├── components/
│   ├── character-form/             — Main character editor (732 TS / 407 HTML lines)
│   ├── character-list/             — Character card grid
│   ├── character-background/       — Background fields sub-component
│   ├── character-characteristics/  — Stats with dice rolling
│   ├── character-skills/           — Skills by category
│   ├── character-derived-stats/    — Calculated stats display
│   ├── character-hit-locations/    — HP per body location
│   ├── character-armor/            — Armor by location
│   ├── character-shields/          — Shield list
│   ├── character-weapons/          — Weapon list
│   ├── character-runes/            — Elemental/Power/Form runes
│   ├── character-cult-status/      — Cult rank and rune spells
│   ├── character-passions/         — Passions list
│   ├── character-magic/            — Spirit/Rune/Sorcery magic
│   ├── character-resources/        — Currency and reputation
│   ├── character-equipment/        — Equipment list
│   ├── character-notes/            — Notes textarea
│   ├── character-conditions/       — Active conditions
│   ├── character-family-history/   — Family tree (unused in form)
│   ├── combat-tracker/             — Combat initiative/round tracker
│   ├── combat-map/                 — Hex tactical map
│   ├── wilderness-map/             — Overworld hex map
│   ├── bestiary/                   — Monster browser
│   ├── monster-creator/            — Custom monster builder
│   ├── docs/                       — Docs shell (sub-routes)
│   ├── rules-reference/            — Rules viewer
│   ├── publications/               — Publications list
│   ├── game-masters-screen/        — GM reference screen
│   ├── settings/                   — App settings
│   └── dice-roller/                — Global dice overlay
│
├── services/
│   ├── character.service.ts        — CRUD + localStorage persistence
│   ├── character-update.service.ts — Reactive character updates
│   ├── combat.service.ts           — Combat mechanics
│   ├── combat-log.service.ts       — Combat event log
│   ├── custom-monster.service.ts   — Custom monster persistence
│   ├── dice.service.ts             — Dice roll logic
│   ├── game-system.service.ts      — Runequest/Dragonbane switching
│   ├── markdown.service.ts         — Markdown rendering for docs
│   ├── ui-state.service.ts         — Shared UI state
│   └── wilderness-map.service.ts   — Wilderness map state
│
├── models/
│   ├── character.model.ts          — Character interface + defaults + calculations
│   ├── combat.model.ts             — Combat types
│   ├── monster.model.ts            — Monster types
│   └── wilderness-map.model.ts     — Map types
│
├── constants/                      — Game data (skills, cults, equipment, monsters, etc.)
└── utils/                          — Pure utilities (damage-parser, hex-pathfinding)
```
