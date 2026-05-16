import { COMBAT_SKILLS, WEAPON_SKILLS } from "../models/character.model";

/**
 * Skill categories for organizing character skills in the UI
 */
export const SKILL_CATEGORIES = {
  'Combat Skills': COMBAT_SKILLS,
  'Magic Skills': ['Spirit Combat', 'Sorcery', 'Rune Magic'],
  'Knowledge Skills': ['Lore (World)', 'Lore (Animal)', 'Lore (Plant)'],
  'Communication Skills': ['Speak (Native)', 'Speak (Other)', 'Read/Write'],
  'Manipulation Skills': ['Craft', 'Farm', 'Heal'],
  'Perception Skills': ['Listen', 'Scan', 'Search', 'Track'],
  'Stealth Skills': ['Hide', 'Move Quietly'],
  'Agility Skills': ['Climb', 'Dodge', 'Ride', 'Swim']
};

export const DB_SKILLS = [
  'Acrobatics (AGL)',
  'Awareness (INT)',
  'Bartering (CHA)',
  'Beast Lore (INT)',
  'Bluffing (CHA)',
  'Brawling (STR)',
  'Bushcraft (INT)',
  'Crafting (STR)',
  'Evade (AGL)',
  'Healing (INT)',
  'Hunting & Fishing (AGL)',
  'Languages (INT)',
  'Myths & Legends (INT)',
  'Performance (CHA)',
  'Persuasion (CHA)',
  'Riding (AGL)',
  'Seamanship (AGL)',
  'Sleight of Hand (AGL)',
  'Sneaking (AGL)',
  'Spot Hidden (INT)',
  'Swimming (AGL)',
];

export const DB_SKILL_BY_ATTR = {
  'STR': ['Brawling (STR)', 'Crafting (STR)', 'Axes (STR)', 'Hammers (STR)', 'Spears (STR)', 'Swords (STR)'],
  'INT': ['Awareness (INT)', 'Beast Lore (INT)', 'Bushcraft (INT)', 'Healing (INT)', 'Languages (INT)', 'Myths & Legends (INT)', 'Spot Hidden (INT)'],
  'AGL': ['Acrobatics (AGL)', 'Evade (AGL)', 'Hunting & Fishing (AGL)', 'Riding (AGL)', 'Seamanship (AGL)', 'Sleight of Hand (AGL)', 'Sneaking (AGL)', 'Swimming (AGL)', 'Bows (AGL)', 'Crossbows (AGL)', 'Knives (AGL)', 'Slings (AGL)', 'Staves (AGL)'],
  'CHA': ['Bartering (CHA)', 'Bluffing (CHA)', 'Performance (CHA)', 'Persuasion (CHA)'],
}

export const DB_SKILL_CATEGORIES = {
  'Core Skills': DB_SKILLS,
  'Weapon Skills': WEAPON_SKILLS,
  'Secondary Skills': [], // TODO: custom skills can be added
}
