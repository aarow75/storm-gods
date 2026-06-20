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

// Dragonbane core skills — 20 non-weapon, non-magic skills from the rulebook
export const DB_SKILLS = [
  'Acrobatics (AGL)',
  'Animal Handling (CHA)',
  'Awareness (INT)',
  'Bartering (CHA)',
  'Bushcraft (INT)',
  'Evade (AGL)',
  'Healing (INT)',
  'Hunting & Fishing (AGL)',
  'Languages (INT)',
  'Lock Picking (AGL)',
  'Lore (INT)',
  'Music & Dance (CHA)',
  'Myths & Legends (INT)',
  'Performance (CHA)',
  'Persuasion (CHA)',
  'Riding (AGL)',
  'Seamanship (INT)',
  'Sleight of Hand (AGL)',
  'Sneaking (AGL)',
  'Swimming (AGL)',
];

// Magic school skills — prepared during stretch rest, based on INT
export const DB_MAGIC_SKILLS = [
  'Animism (INT)',
  'Elementalism (INT)',
  'General Magic (INT)',
  'Mentalism (INT)',
];

export const DB_SKILL_BY_ATTR: Record<string, string[]> = {
  'STR': ['Axes (STR)', 'Hammers (STR)', 'Shields (STR)', 'Spears (STR)', 'Swords (STR)'],
  'INT': [
    'Awareness (INT)', 'Bushcraft (INT)', 'Healing (INT)', 'Languages (INT)',
    'Lore (INT)', 'Myths & Legends (INT)', 'Seamanship (INT)',
    'Animism (INT)', 'Elementalism (INT)', 'General Magic (INT)', 'Mentalism (INT)',
  ],
  'AGL': [
    'Acrobatics (AGL)', 'Evade (AGL)', 'Hunting & Fishing (AGL)', 'Lock Picking (AGL)',
    'Riding (AGL)', 'Sleight of Hand (AGL)', 'Sneaking (AGL)', 'Swimming (AGL)',
    'Bows (AGL)', 'Crossbows (AGL)', 'Knives (AGL)', 'Staves (AGL)',
  ],
  'CHA': ['Animal Handling (CHA)', 'Bartering (CHA)', 'Music & Dance (CHA)', 'Performance (CHA)', 'Persuasion (CHA)'],
};

export const DB_SKILL_CATEGORIES = {
  'Core Skills': DB_SKILLS,
  'Weapon Skills': WEAPON_SKILLS,
  'Magic Skills': DB_MAGIC_SKILLS,
  'Secondary Skills': [],
};

// Kal-Arath skill abilities — each is a binary acquired ability (0 = not taken, 1 = taken)
export const KA_WARRIOR_SKILLS = [
  'Extra Attack (disadvantage)',
  'Weapon Specialization (+1 attack/damage)',
  'Armor Training (+1 damage reduction)',
  'Unarmored Defense (+1 damage reduction)',
  'Rage (d6 bonus damage)',
];

export const KA_ROGUE_SKILLS = [
  'Shadow (advantage on hiding/sneaking)',
  'Thief (advantage on thieving)',
  'Trap Sense (advantage vs. traps)',
  'Quick Reflexes (+1 initiative)',
  'Backstab (+d6 from hidden)',
];

export const KA_MYSTIC_SKILLS = [
  'Arcane Focus (+1 INT for spells)',
  'Spell Mastery (+2 to specific spell)',
  'Demonic Pact (make pact)',
  'Herbalist (advantage on herb/chemical crafting)',
  'Fate Point (extra Fate Point)',
];

export const KA_EXPLORER_SKILLS = [
  'Forager (advantage on foraging)',
  'Pathfinder (control encounter check advantage/disadvantage)',
  'Scout (discover POI on 4+)',
  'Navigator (advantage on Getting Lost rolls)',
  'Tracker (advantage on tracking/outdoor lore)',
];

export const KA_SKILL_CATEGORIES = {
  'Warrior': KA_WARRIOR_SKILLS,
  'Rogue': KA_ROGUE_SKILLS,
  'Mystic': KA_MYSTIC_SKILLS,
  'Explorer': KA_EXPLORER_SKILLS,
};
