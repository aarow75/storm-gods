# Game System Toggle Feature

## Overview
The character creator now supports toggling between **RuneQuest** and **Dragonbane** game systems with a single click.

## How It Works

### Toggle Buttons
Two buttons in the header allow switching between game systems:
- **RuneQuest** button - Shows traditional RQ content
- **Dragonbane** button - Shows Dragonbane content

### What Changes When You Toggle

#### Background Section
| Field | RuneQuest | Dragonbane |
|-------|-----------|------------|
| **First Field** | Cult/Religion | Belief |
| **Second Field** | Occupation | Profession |
| **Third Field** | Homeland | Kin (Race) |

#### Characteristics Section
| Attribute | RuneQuest | Dragonbane |
|-----------|-----------|------------|
| **STR** | STR (Strength) | STR (Strength) |
| **CON** | CON (Constitution) | CON (Constitution) |
| **SIZ** | SIZ (Size) | *Hidden* |
| **DEX** | DEX (Dexterity) | AGL (Agility) |
| **INT** | INT (Intelligence) | INT (Intelligence) |
| **POW** | POW (Power) | WIL (Willpower) |
| **CHA** | CHA (Charisma) | CHA (Charisma) |

#### Dropdown Options

**RuneQuest Mode:**
- **Cults**: Orlanth, Ernalda, Seven Mothers, Yelm, Humakt, Chalana Arroy, Issaries, Lhankor Mhy, Storm Bull, Babeester Gor, Daka Fal, Waha, Yelmalio, Kyger Litor, Zorak Zoran, Asrelia, Other
- **Occupations**: Warrior, Farmer, Hunter, Herder, Merchant, Crafter, Fisher, Noble, Priest, Shaman, Thief, Entertainer, Scribe, Healer
- **Homelands**: Sartar, Esrolia, Prax, Lunar Tarsh, Grazelands, Old Tarsh, Dragon Pass, Sun County, Dagori Inkarth, Other

**Dragonbane Mode:**
- **Beliefs**: The Old Gods, The One, Elemental Worship, Ancestor Veneration, Nature Spirits, No Religion, Other
- **Professions**: Fighter, Hunter, Knight, Mariner, Minstrel, Merchant, Peddler, Rider, Rogue, Scholar, Thief, Artisan, Mage, Priest
- **Kin (Races)**: Human, Halfling, Dwarf, Elf, Mallard, Wolfkin

### Randomize Character Button
The "Randomize Character" button is **game system aware**:
- In **RuneQuest** mode: Randomizes from RQ cults, occupations, and homelands
- In **Dragonbane** mode: Randomizes from DB beliefs, professions, and kin

### Data Persistence
- **Toggle state** is saved to localStorage and persists across sessions
- **Character data** uses the same object properties regardless of system:
  - `background.cult` stores cult (RQ) or belief (DB)
  - `background.occupation` stores occupation (RQ) or profession (DB)
  - `background.homeland` stores homeland (RQ) or kin (DB)
- You can create a character, switch systems, switch back - data is preserved!

## Technical Implementation

### Key Files
- **Service**: `src/app/services/game-system.service.ts` - Manages game system state
- **Component**: `src/app/components/character-background/` - Dynamic labels and options
- **App Header**: `src/app/app.html` & `src/app/app.ts` - Toggle UI

### Architecture
- Uses Angular signals for reactive updates
- Game system changes immediately reflect in all components
- Centralized data source for lists (cults, occupations, homelands/kin)
- Translation-ready with i18n support for both English and Swedish

## Testing
1. Start the dev server: `npm start`
2. Open http://localhost:4200
3. Click the **Dragonbane** button - labels and dropdowns update
4. Click **Randomize Character** - generates Dragonbane-appropriate values
5. Switch back to **RuneQuest** - labels and dropdowns revert

## Section Visibility

### **RuneQuest Mode - All Sections Visible:**
- ✓ Background (Cult/Occupation/Homeland)
- ✓ Family History
- ✓ Characteristics (7 attributes including SIZ)
- ✓ Skills
- ✓ Derived Stats
- ✓ Hit Locations (per body part)
- ✓ Armor (per hit location)
- ✓ Weapons
- ✓ Runes (Elemental, Power, Form)
- ✓ Cult Status (rank, rune spells)
- ✓ Passions
- ✓ Magic (Spirit/Rune/Sorcery)
- ✓ Resources
- ✓ Equipment
- ✓ Notes

### **Dragonbane Mode - Simplified:**
- ✓ Background (Belief/Profession/Kin)
- ✗ Family History (hidden)
- ✓ Characteristics (6 attributes, no SIZ, AGL/WIL labels)
- ✓ Skills
- ✓ Derived Stats
- ✗ Hit Locations (hidden - DB uses single HP pool)
- ✓ Armor (single rating instead of per-location)
- ✓ Weapons
- ✗ Runes (hidden - no rune system in DB)
- ✗ Cult Status (hidden - simpler belief system)
- ✗ Passions (hidden - DB doesn't use passions)
- ✓ Magic
- ✓ Resources
- ✓ Equipment
- ✓ Notes

## Future Enhancements
The foundation is in place to add more Dragonbane-specific features:
- Heroic Abilities
- Different magic system (General Magic vs Spirit/Rune/Sorcery)
- Conditions system
- Age effects on attributes
