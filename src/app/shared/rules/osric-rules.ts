import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem } from '@characters/models/character.model';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses,
  AbilityDefinition, ClassHitDie
} from './game-system-rules.interface';

// OSRIC uses 6 ability scores. SIZ is hidden; POW field stores Wisdom.
const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',     visible: true  },
  { key: 'CON', label: 'CON (Constitution)', visible: true  },
  { key: 'SIZ', label: 'SIZ',               visible: false },
  { key: 'DEX', label: 'DEX (Dexterity)',    visible: true  },
  { key: 'INT', label: 'INT (Intelligence)', visible: true  },
  { key: 'POW', label: 'WIS (Wisdom)',       visible: true  },
  { key: 'CHA', label: 'CHA (Charisma)',     visible: true  },
];

// Descending AC: base 10 (unarmored), lower = better. Shield reduces AC by 1.
export const OSRIC_ARMOR_TYPES: ArmorTypeDefinition[] = [
  { name: 'None',                points: 10 },
  { name: 'Leather',             points: 8  },
  { name: 'Padded Gambeson',     points: 8  },
  { name: 'Studded Leather',     points: 7  },
  { name: 'Ring Mail',           points: 7  },
  { name: 'Scale / Lamellar',    points: 6  },
  { name: 'Chain Mail',          points: 5  },
  { name: 'Elfin Chain',         points: 5  },
  { name: 'Banded Mail',         points: 4  },
  { name: 'Splint Mail',         points: 4  },
  { name: 'Plate Mail',          points: 3  },
  { name: 'Field Plate',         points: 2  },
];

// DEX-to-AC modifier table (subtract from AC; high DEX improves AC)
function getDexAcModifier(dex: number): number {
  if (dex >= 18) return 4;   // AC −4 (better)
  if (dex >= 17) return 3;   // AC −3
  if (dex >= 16) return 2;   // AC −2
  if (dex >= 15) return 1;   // AC −1
  if (dex >= 8)  return 0;   // no change (DEX 8–14)
  if (dex >= 6)  return -1;  // AC +1 (DEX 6–7)
  if (dex >= 5)  return -2;  // AC +2
  if (dex >= 4)  return -3;  // AC +3
  return -4;                  // AC +4 (DEX 3)
}

// DEX reaction/attack adjustment for missile weapons (add to attack roll)
function getDexMissileModifier(dex: number): number {
  if (dex >= 18) return 3;
  if (dex >= 17) return 2;
  if (dex >= 16) return 1;
  if (dex >= 6)  return 0;   // DEX 6–15: no modifier
  if (dex >= 5)  return -1;
  if (dex >= 4)  return -2;
  return -3;
}

// STR-based max carrying capacity in lbs (base 150 + STR weight adjustment)
function getStrMaxEncumbrance(str: number): number {
  if (str >= 18) return 225;  // +75 lbs
  if (str >= 17) return 200;  // +50 lbs
  if (str >= 16) return 185;  // +35 lbs
  if (str >= 14) return 170;  // +20 lbs
  if (str >= 12) return 160;  // +10 lbs
  if (str >= 8)  return 150;  // no adjustment (STR 8–11)
  if (str >= 6)  return 135;  // −15 lbs
  if (str >= 4)  return 125;  // −25 lbs
  return 115;                  // −35 lbs (STR 3)
}

// STR-to-hit/damage bonus string (hit/damage format)
function getStrBonus(str: number): string {
  if (str >= 18) return '+1/+2';
  if (str >= 17) return '+1/+1';
  if (str >= 16) return '+0/+1';
  if (str >= 8)  return '+0/+0';
  if (str >= 6)  return '-1/+0';
  if (str >= 4)  return '-2/-1';
  return '-3/-1';
}

// CON-to-HP modifier per hit die (fighter values used for CON 17+)
function getConHpModifier(con: number): number {
  if (con >= 19) return 5;
  if (con >= 18) return 4;
  if (con >= 17) return 3;
  if (con >= 16) return 2;
  if (con >= 15) return 1;
  if (con >= 8)  return 0;
  if (con >= 4)  return -1;
  return -2;
}

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Prone',       effect: '+4 to attacker\'s hit roll; defender loses shield & Dex AC bonus' },
  { name: 'Stunned',     effect: 'Cannot act; can only defend' },
  { name: 'Paralyzed',   effect: 'No actions; AC 10 vs. melee, AC 10 vs. missile' },
  { name: 'Blinded',     effect: '-4 to hit; opponents +4 to hit' },
  { name: 'Slowed',      effect: 'Only 1 attack per round; movement halved' },
  { name: 'Silenced',    effect: 'Cannot cast spells with verbal components' },
  { name: 'Unconscious', effect: 'At 0 HP; lose 1 HP/round until aided or dead' },
];

const RACE_ABILITIES: Record<string, AbilityDefinition[]> = {
  'Dwarf': [
    { name: 'Infravision 60 ft', description: 'See in darkness up to 60 ft in shades of grey.' },
    { name: 'Stonesense', description: 'Within 10 ft: detect slopes 75%, new construction 75%, shifting rooms 66%, stone traps 50%, depth underground 50%.' },
    { name: 'Magic & Poison Resistance', description: '+1 to saves vs. magic and poison per 3.5 points of Con (rounded down).' },
    { name: 'Combat Bonus vs. Goblinoids/Orcs', description: '+1 to hit against goblinoids and orcs.' },
    { name: 'Giant/Ogre Evasion', description: 'Giants and ogres suffer −4 to attack rolls against dwarfs.' },
  ],
  'Elf': [
    { name: 'Charm & Sleep Immunity', description: '90% immunity to sleep and charm spells.' },
    { name: 'Infravision 60 ft', description: 'See in darkness up to 60 ft in shades of grey.' },
    { name: 'Combat Bonus (Bows & Swords)', description: '+1 to hit with any pulled bow; +1 to hit with longsword and short sword.' },
    { name: 'Secret Door Detection', description: 'Detect secret doors 1–3 in 6 depending on circumstance; automatically notice concealed doors within 10 ft (1-in-6).' },
    { name: 'Surprise Advantage', description: '4-in-6 chance to surprise opponents under optimal conditions.' },
  ],
  'Gnome': [
    { name: 'Infravision 60 ft', description: 'See in darkness up to 60 ft in shades of grey.' },
    { name: 'Stonesense', description: 'Within 10 ft: detect slopes, new construction, shifting rooms, and stone traps at 50–80% success.' },
    { name: 'Magic & Poison Resistance', description: '+1 to saves vs. magic and poison per 3.5 Con points (rounded down).' },
    { name: 'Combat Bonus vs. Kobolds/Goblins', description: '+1 to hit against kobolds and goblins.' },
    { name: 'Large Creature Evasion', description: 'Larger creatures (ogres, etc.) suffer −4 to attack rolls against gnomes.' },
    { name: 'Animal Communication', description: 'Can communicate with burrowing animals.' },
  ],
  'Half-Elf': [
    { name: 'Infravision 60 ft', description: 'See in darkness up to 60 ft in shades of grey.' },
    { name: 'Partial Charm & Sleep Resistance', description: '30% immunity to sleep and charm spells.' },
    { name: 'Secret Door Detection', description: 'Detect secret doors 2-in-6, concealed doors 3-in-6; auto-notice within 10 ft (1-in-6).' },
  ],
  'Half-Orc': [
    { name: 'Infravision 60 ft', description: 'See in darkness up to 60 ft in shades of grey.' },
  ],
  'Halfling': [
    { name: 'Infravision 60 ft', description: 'See in darkness up to 60 ft in shades of grey.' },
    { name: 'Magic & Poison Resistance', description: '+1 to saves vs. magic and poison per 3.5 Con points (rounded down).' },
    { name: 'Missile Combat Bonus', description: '+3 to attack rolls with bow or sling.' },
    { name: 'Surprise Advantage', description: '4-in-6 chance to surprise opponents when traveling in non-metal armor (2-in-6 if opening doors).' },
  ],
  'Human': [
    { name: 'Unlimited Advancement', description: 'No level caps in any permitted class.' },
  ],
};

const CLASS_HIT_DICE: Record<string, ClassHitDie> = {
  'Assassin':    { sides: 6,  maxHdLevel: 15, bonusPerLevel: 2 },
  'Cleric':      { sides: 8,  maxHdLevel: 11, bonusPerLevel: 2 },
  'Druid':       { sides: 8,  maxHdLevel: 14, bonusPerLevel: 1 },
  'Fighter':     { sides: 10, maxHdLevel: 9,  bonusPerLevel: 3 },
  'Illusionist': { sides: 4,  maxHdLevel: 11, bonusPerLevel: 1 },
  'Magic User':  { sides: 4,  maxHdLevel: 11, bonusPerLevel: 1 },
  'Paladin':     { sides: 10, maxHdLevel: 9,  bonusPerLevel: 3 },
  'Ranger':      { sides: 8,  maxHdLevel: 10, bonusPerLevel: 2 },
  'Thief':       { sides: 6,  maxHdLevel: 10, bonusPerLevel: 2 },
};

const CLASS_ABILITIES: Record<string, AbilityDefinition[]> = {
  'Assassin': [
    { name: 'Assassination', description: 'With surprise: 50% instant kill + 5% per assassin level − 5% per two victim levels.' },
    { name: 'Backstab', description: '+4 to hit from behind; ×2 damage (levels 1–4), ×3 (5–8), ×4 (9–12).' },
    { name: 'Disguise', description: 'Only a 2% daily base chance for observers to detect the disguise.' },
    { name: 'Thief Abilities', description: 'Access to thief skills at two class levels below current rank.' },
    { name: 'Special Languages (Level 9+)', description: 'High-Int (15+) assassins can learn special languages.', minLevel: 9 },
    { name: 'Arcane Scroll Use (Level 12+)', description: 'Can cast spells from arcane scrolls.', minLevel: 12 },
  ],
  'Cleric': [
    { name: 'Turn Undead', description: 'Compel undead to flee (3d4 rounds) by rolling ≥ target on d20 while holding holy symbol. Evil clerics may control undead instead.' },
    { name: 'Spellcasting', description: 'Spells acquired automatically on leveling; no proficiency check required. Wis 13+ grants bonus spells.' },
    { name: 'Stronghold (Level 9)', description: 'May establish a temple or stronghold and attract followers.', minLevel: 9 },
  ],
  'Druid': [
    { name: 'Fire & Lightning Saves', description: '+2 saving throw bonus against fire and lightning.' },
    { name: "Druids' Cant", description: 'Secret language known only to druids.' },
    { name: 'Plant & Animal Identification (Level 3+)', description: 'Identify all plants and animals; move silently through undergrowth.', minLevel: 3 },
    { name: 'Shapeshift (Level 7+)', description: 'Immunity to fey charm; shapeshift into animals up to 3×/day.', minLevel: 7 },
    { name: 'Spellcasting', description: 'Druid spells require mistletoe, holly, or oak leaves as components.' },
  ],
  'Fighter': [
    { name: 'Bonus Attacks', description: 'Levels 1–6: 1 attack/round; Levels 7–12: 3 attacks/2 rounds; Levels 13+: 2 attacks/round.' },
    { name: 'Multiple Attacks vs. Weak Foes', description: 'Vs. creatures with <1d8 HP: one attack per character level per round.' },
    { name: 'Weapon Specialization (Optional)', description: '+1 to hit, +2 damage, and bonus attacks. Double specialization: +3 to hit, +3 damage.' },
  ],
  'Illusionist': [
    { name: 'Illusionist Spellcasting', description: 'Memorize and cast from spell books written in phantasmal script; only illusionists can read them.' },
    { name: 'Stronghold (Level 10)', description: 'May establish a stronghold similar to a fighter\'s.', minLevel: 10 },
  ],
  'Magic User': [
    { name: 'Arcane Spellcasting', description: 'Depend entirely on spell books. Int determines spell-learning chance (35%–90%) and spells learnable per level.' },
    { name: 'Eldritch Craft (Level 7+)', description: 'Create potions, scribe scrolls, recharge rods/staves/wands.', minLevel: 7 },
    { name: 'Eldritch Power (Level 12+)', description: 'Attempt creation of other magical items.', minLevel: 12 },
    { name: 'Tower or Keep (Level 11)', description: 'May establish a tower or keep.', minLevel: 11 },
  ],
  'Paladin': [
    { name: 'Improved Saving Throws', description: 'More favorable saving throw table than other classes.' },
    { name: 'Detect Evil', description: 'Detect evil within 60 ft while concentrating.' },
    { name: 'Protection from Evil', description: '10-ft aura equivalent to the Protection from Evil spell.' },
    { name: 'Lay On Hands', description: 'Once daily, heal 2 HP per character level by touch.' },
    { name: 'Cure Disease', description: 'Cure disease by touch once per week (more uses at higher levels).' },
    { name: 'Turn Undead (Level 3+)', description: 'Turn undead as a cleric two levels lower.', minLevel: 3 },
    { name: 'Warhorse (Level 4+)', description: 'Summon a special warhorse once per decade.', minLevel: 4 },
    { name: 'Bonus Attacks (Level 8+)', description: '3 attacks per 2 rounds.', minLevel: 8 },
    { name: 'Clerical Spellcasting (Level 9+)', description: 'Access to clerical spells.', minLevel: 9 },
  ],
  'Ranger': [
    { name: 'Surprise Detection', description: 'Enhanced chance to detect opponents attempting to surprise the party.' },
    { name: 'Damage Bonus vs. Evil Humanoids', description: 'Bonus damage against evil humanoids, scaling with level.' },
    { name: 'Tracking', description: '90% base chance to track in wilderness, 65% in urban settings.' },
    { name: 'Spellcasting & Followers (Level 8+)', description: 'Access to druid and magic-user spell lists; bonus attacks; special followers.', minLevel: 8 },
  ],
  'Thief': [
    { name: 'Backstab', description: 'Unobserved melee: +4 to hit, ×2 damage (×3 at 5th, ×4 at 9th, ×5 at 13th); multipliers don\'t apply to bonus damage.' },
    { name: 'Climb Walls', description: 'Scale vertical surfaces impossible for non-thieves.' },
    { name: 'Find & Remove Traps', description: 'Locate and disarm traps with a minute of visual inspection.' },
    { name: 'Hide in Shadows', description: 'Become effectively invisible while stationary in shadow.' },
    { name: 'Move Quietly', description: 'Move with supernatural silence across any surface.' },
    { name: 'Open Locks', description: 'Pick locks; class-exclusive skill.' },
    { name: 'Pick Pockets', description: 'Steal from targets; 20%+ failure alerts the target.' },
    { name: 'Read Languages', description: 'Decipher non-magical ciphers and unknown languages.' },
    { name: "Thieves' Cant", description: 'Specialized criminal language shared among thieves and assassins.' },
    { name: 'Read Scrolls (Level 10+)', description: 'Cast from arcane or illusionist scrolls with variable success based on Int.', minLevel: 10 },
  ],
};

// Only Thieves and Assassins have tracked skill percentages in OSRIC.
// All characters carry the skill sheet; non-thieves default to 0.
const SKILL_DEFINITIONS: SkillDefinition[] = [
  { name: 'Climb Walls',       defaultValue: 85 },
  { name: 'Find/Remove Traps', defaultValue: 10 },
  { name: 'Hide in Shadows',   defaultValue: 10 },
  { name: 'Move Quietly',      defaultValue: 15 },
  { name: 'Open Locks',        defaultValue: 15 },
  { name: 'Pick Pockets',      defaultValue: 30 },
  { name: 'Read Languages',    defaultValue: 1  },
];

const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'Thief Skills', skills: SKILL_DEFINITIONS.map(s => s.name) },
];

// Spells organized by class → spell level
export const OSRIC_CLASS_SPELLS: Record<string, Record<number, string[]>> = {
  'Magic User': {
    1: ['Affect Normal Fires', 'Charm Person', 'Comprehend Languages', 'Dancing Lights', 'Detect Magic',
        'Enlarge', 'Erase', 'Feather Fall', 'Find Familiar', 'Floating Disc', 'Friends', 'Hold Portal',
        'Identify', 'Jump', 'Light', 'Magic Missile', 'Mending', 'Message', "Nystul's Magical Aura",
        'Protection from Evil', 'Push', 'Read Magic', 'Shield', 'Shocking Grasp', 'Sleep',
        'Spider Climb', 'Unseen Servant', 'Ventriloquism', 'Write'],
    2: ['Audible Glamour', 'Continual Light', "Darkness 15' Radius", 'Detect Evil', 'Detect Invisibility',
        'ESP', 'Flaming Sphere', "Fool's Gold", 'Forget', 'Invisibility', 'Knock', "Leomund's Trap",
        'Levitate', 'Locate Object', 'Magic Mouth', 'Mirror Image', 'Misdirection', 'Pyrotechnics',
        'Ray of Enfeeblement', 'Rope Trick', 'Scare', 'Shatter', 'Stinking Cloud', 'Strength', 'Web', 'Wizard Lock'],
    3: ['Blink', 'Clairaudience', 'Clairvoyance', 'Dispel Magic', 'Explosive Runes', 'Feign Death',
        'Fireball', 'Fly', 'Gust of Wind', 'Haste', 'Hold Person', 'Infravision',
        "Invisibility 10' Radius", 'Item', "Leomund's Tiny Hut", 'Lightning Bolt',
        'Monster Summoning I', 'Phantasmal Force', "Protection from Evil 10' Radius",
        'Protection from Normal Missiles', 'Secret Page', 'Sepia Snake Sigil', 'Slow', 'Suggestion',
        'Tongues', 'Water Breathing'],
    4: ['Charm Monster', 'Confusion', 'Dig', 'Dimension Door', 'Enchant Weapon', 'Extension I', 'Fear',
        'Fire Shield', 'Fire Trap', 'Fumble', 'Hallucinatory Terrain', 'Ice Storm',
        "Leomund's Secure Shelter", 'Massmorph', 'Minor Globe of Invulnerability',
        'Monster Summoning II', 'Plant Growth', 'Polymorph Other', 'Polymorph Self', 'Remove Curse',
        "Rary's Mnemonic Enhancer", 'Shout', 'Stoneskin', 'Wall of Fire', 'Wall of Ice', 'Wizard Eye'],
    5: ['Airy Water', 'Animal Growth', 'Animate Dead', "Bigby's Interposing Hand", 'Cloudkill',
        'Cone of Cold', 'Contact Other Plane', 'Distance Distortion', 'Domination', 'Extension II',
        'Feeblemind', 'Hold Monster', "Leomund's Lamentable Belabourment", "Leomund's Secret Chest",
        'Magic Jar', 'Monster Summoning III', "Mordenkainen's Faithful Hound", 'Passwall',
        'Stone Shape', 'Telekinesis', 'Teleport', 'Transmute Rock to Mud', 'Wall of Force',
        'Wall of Iron', 'Wall of Stone'],
    6: ['Anti-Magic Shell', "Bigby's Forceful Hand", 'Chain Lightning', 'Contingency',
        'Control Weather', 'Death Fog', 'Disintegrate', 'Enchant an Item', 'Ensnarement',
        'Extension III', 'Eyebite', 'Geas', 'Globe of Invulnerability', 'Guards and Wards',
        'Invisible Stalker', 'Legend Lore', 'Lower Water', 'Monster Summoning IV', 'Move Earth',
        "Otiluke's Freezing Sphere", 'Part Water', 'Project Image', 'Programmed Illusion',
        'Reincarnation', 'Repulsion', 'Spiritwrack', 'Stone to Flesh', 'Transformation'],
    7: ["Bigby's Grasping Hand", 'Cacodemon', 'Charm Plants', 'Delayed Blast Fireball',
        "Drawmij's Instant Summons", 'Duo-Dimension', 'Finger of Death', 'Limited Wish',
        'Mass Invisibility', 'Monster Summoning V', "Mordenkainen's Magnificent Mansion",
        "Mordenkainen's Sword", 'Phase Door', 'Power Word Stun', 'Prismatic Spray',
        'Reverse Gravity', 'Sequester', 'Simulacrum', 'Spell Turning', 'Statue',
        'Teleport without Error', 'Vanish'],
    8: ["Bigby's Clenched Fist", 'Binding', 'Clone', 'Glassteel', 'Incendiary Cloud', 'Mass Charm',
        'Maze', 'Mind Blank', 'Monster Summoning VI', "Otiluke's Telekinetic Sphere",
        "Otto's Irresistible Dance", 'Permanency', 'Polymorph Any Object', 'Power Word Blind',
        'Sink', 'Symbol', 'Trap the Soul'],
    9: ['Astral Spell', "Bigby's Crushing Hand", 'Gate', 'Imprisonment', 'Meteor Swarm',
        'Monster Summoning VII', "Mordenkainen's Disjunction", 'Power Word Kill', 'Prismatic Sphere',
        'Shapechange', 'Temporal Stasis', 'Time Stop', 'Wish'],
  },
  'Illusionist': {
    1: ['Audible Glamour', 'Change Self', 'Colour Spray', 'Dancing Lights', 'Darkness',
        'Detect Illusion', 'Detect Invisibility', 'Gaze Reflection', 'Hypnotism', 'Light',
        'Phantasmal Force', 'Wall of Fog'],
    2: ['Blindness', 'Blur', 'Deafness', 'Detect Magic', 'Fog Cloud', 'Hypnotic Pattern',
        'Improved Phantasmal Force', 'Invisibility', 'Magic Mouth', 'Mirror Image',
        'Misdirection', 'Ventriloquism'],
    3: ['Continual Darkness', 'Continual Light', 'Dispel Illusion', 'Fear', 'Hallucinatory Terrain',
        'Illusionary Script', "Invisibility 10' Radius", 'Non-Detection', 'Paralysation',
        'Rope Trick', 'Spectral Force', 'Suggestion'],
    4: ['Confusion', 'Emotion', 'Improved Invisibility', 'Massmorph', 'Minor Creation',
        'Phantasmal Killer', 'Rainbow Pattern', 'Shadow Monsters', 'Solid Fog'],
    5: ['Chaos', 'Demi-Shadow Monsters', 'Dream', 'Magic Mirror', 'Major Creation', 'Maze',
        'Project Image', 'Shadow Door', 'Shadow Magic', 'Summon Shadow'],
    6: ['Conjure Animals', 'Death', 'Demi-Shadow Magic', 'Mass Suggestion', 'Mirage Arcane',
        'Mislead', 'Permanent Illusion', 'Programmed Illusion', 'Shades', 'True Sight', 'Veil'],
    7: ['Alter Reality', 'Astral Spell', 'First Level Magic-User Spells', 'Mass Invisibility',
        'Prismatic Spray', 'Prismatic Wall', 'Shadow Walk', 'Vision'],
  },
  'Cleric': {
    1: ['Bless', 'Command', 'Create Water', 'Cure Light Wounds', 'Detect Evil', 'Detect Magic',
        'Light', 'Protection from Evil', 'Purify Food and Drink', 'Remove Fear', 'Resist Cold',
        'Sanctuary'],
    2: ['Augury', 'Chant', 'Detect Charm', 'Find Traps', 'Hold Person', 'Know Alignment',
        'Resist Fire', "Silence 15' Radius", 'Slow Poison', 'Snake Charm', 'Speak with Animals',
        'Spiritual Weapon'],
    3: ['Animate Dead', 'Continual Light', 'Create Food and Water', 'Cure Blindness', 'Cure Disease',
        'Dispel Magic', 'Feign Death', 'Glyph of Warding', 'Locate Object', 'Prayer',
        'Remove Curse', 'Speak with Dead'],
    4: ['Cure Serious Wounds', 'Detect Lie', 'Divination', 'Exorcise', 'Lower Water',
        'Neutralise Poison', "Protection from Evil 10' Radius", 'Speak with Plants',
        'Sticks to Snakes', 'Tongues'],
    5: ['Atonement', 'Commune', 'Cure Critical Wounds', 'Dispel Evil', 'Flame Strike',
        'Insect Plague', 'Plane Shift', 'Quest', 'Raise Dead', 'True Seeing'],
    6: ['Animate Object', 'Blade Barrier', 'Conjure Animals', 'Find the Path', 'Heal',
        'Part Water', 'Speak with Monsters', 'Stone Tell', 'Word of Recall'],
    7: ['Aerial Servant', 'Astral Spell', 'Control Weather', 'Earthquake', 'Gate', 'Holy Word',
        'Regenerate', 'Restoration', 'Resurrection', 'Symbol', 'Wind Walk'],
  },
  'Druid': {
    1: ['Animal Friendship', 'Detect Magic', 'Detect Snares and Pits', 'Entangle', 'Faerie Fire',
        'Invisibility to Animals', 'Locate Animals', 'Pass without Trace', 'Predict Weather',
        'Purify Water', 'Speak with Animals'],
    2: ['Barkskin', 'Charm Person or Mammal', 'Create Water', 'Cure Light Wounds', 'Fire Trap',
        'Heat Metal', 'Obscurement', 'Produce Flame', 'Slow Poison', 'Speak with Plants',
        'Warp Wood'],
    3: ['Call Lightning', 'Cure Disease', 'Hold Animal', 'Neutralise Poison', 'Plant Growth',
        'Protection from Fire', 'Snare', 'Stone Shape', 'Summon Insects', 'Tree', 'Water Breathing'],
    4: ['Animal Summoning I', 'Call Woodland Beings', "Control Temperature 10' Radius",
        'Cure Serious Wounds', 'Dispel Magic', 'Hallucinatory Forest', 'Hold Plant', 'Plant Door',
        'Produce Fire', 'Protection from Lightning', 'Repel Insects', 'Speak with Plants'],
    5: ['Animal Growth', 'Animal Summoning II', 'Anti-Plant Shell', 'Commune with Nature',
        'Control Winds', 'Insect Plague', 'Pass Plant', 'Sticks to Snakes',
        'Transmute Rock to Mud', 'Wall of Fire'],
    6: ['Animal Summoning III', 'Anti-Animal Shell', 'Conjure Fire Elemental',
        'Cure Critical Wounds', 'Feeblemind', 'Fire Seeds', 'Transport via Plants',
        'Turn Wood', 'Wall of Thorns', 'Weather Summoning'],
    7: ['Animate Rock', 'Chariot of Fire', 'Confusion', 'Conjure Earth Elemental',
        'Control Weather', 'Creeping Doom', 'Earthquake', 'Finger of Death', 'Fire Storm',
        'Reincarnate', 'Transmute Metal to Wood'],
  },
};

// Paladin and Ranger borrow from existing lists
OSRIC_CLASS_SPELLS['Paladin'] = OSRIC_CLASS_SPELLS['Cleric'];
OSRIC_CLASS_SPELLS['Ranger'] = { ...OSRIC_CLASS_SPELLS['Druid'], ...OSRIC_CLASS_SPELLS['Magic User'] };

// Returns the highest spell level a class can cast at a given character level
export function getOsricMaxSpellLevel(className: string, charLevel: number): number {
  const table: Record<string, number[]> = {
    // index = spell level - 1, value = min class level required
    'Magic User':  [1, 3, 5, 7,  9, 11, 13, 15, 17],
    'Illusionist': [1, 3, 5, 7,  9, 11, 13],
    'Cleric':      [1, 3, 5, 7,  9, 11, 13],
    'Druid':       [1, 3, 5, 7,  9, 11, 14],
    'Paladin':     [9, 9, 9, 9,  9, 11, 13],
    'Ranger':      [8, 8, 9, 11, 13],
  };
  const thresholds = table[className];
  if (!thresholds) return 0;
  let max = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (charLevel >= thresholds[i]) max = i + 1;
  }
  return max;
}

// Returns all spells available to a class up to their accessible spell level
export function getOsricAvailableSpells(className: string, charLevel: number): { name: string; spellLevel: number }[] {
  const spellList = OSRIC_CLASS_SPELLS[className];
  if (!spellList) return [];
  const maxLevel = getOsricMaxSpellLevel(className, charLevel);
  const result: { name: string; spellLevel: number }[] = [];
  for (let lvl = 1; lvl <= maxLevel; lvl++) {
    for (const name of (spellList[lvl] ?? [])) {
      result.push({ name, spellLevel: lvl });
    }
  }
  return result;
}

// OSRIC weapon table — damage vs Small/Medium creatures (primary); encumbrance in lbs.
const WEAPON_LIST: WeaponDefinition[] = [
  // Melee — simple
  { name: 'Dagger',            damage: '1d4',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 1,  hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 2,  isMissile: false, canParry: true  },
  { name: 'Hand Axe',          damage: '1d6',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 5,  hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 1,  isMissile: true,  range: '10/20', rateOfFire: 1, canParry: false },
  { name: 'Spear',             damage: '1d6',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 5,  hitPoints: 10, minSTR: 0, minDEX: 0, cost: 1,  isMissile: false, canParry: true  },
  { name: 'Staff',             damage: '1d6',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 5,  hitPoints: 12, minSTR: 0, minDEX: 0, cost: 0,  isMissile: false, canParry: true  },
  { name: 'Club',              damage: '1d4',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 3,  hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 0,  isMissile: false, canParry: false },
  // Melee — martial
  { name: 'Short Sword',       damage: '1d6',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 3,  hitPoints: 12, minSTR: 0, minDEX: 0, cost: 8,  isMissile: false, canParry: true  },
  { name: 'Long Sword',        damage: '1d8',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 7,  hitPoints: 14, minSTR: 0, minDEX: 0, cost: 15, isMissile: false, canParry: true  },
  { name: 'Battle Axe',        damage: '1d8',    defaultSkill: 'Melee', strikeRank: 0, encumbrance: 7,  hitPoints: 12, minSTR: 0, minDEX: 0, cost: 5,  isMissile: false, canParry: false },
  { name: 'Mace (Heavy)',      damage: '1d6+1',  defaultSkill: 'Melee', strikeRank: 0, encumbrance: 10, hitPoints: 10, minSTR: 0, minDEX: 0, cost: 10, isMissile: false, canParry: true  },
  { name: 'Flail',             damage: '1d6+1',  defaultSkill: 'Melee', strikeRank: 0, encumbrance: 15, hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 3,  isMissile: false, canParry: false },
  { name: 'Warhammer',         damage: '1d4+1',  defaultSkill: 'Melee', strikeRank: 0, encumbrance: 5,  hitPoints: 10, minSTR: 0, minDEX: 0, cost: 2,  isMissile: false, canParry: false },
  { name: 'Lance',             damage: '2d4+1',  defaultSkill: 'Melee', strikeRank: 0, encumbrance: 15, hitPoints: 12, minSTR: 0, minDEX: 0, cost: 6,  isMissile: false, canParry: false },
  // Two-handed melee
  { name: 'Two-Handed Sword',  damage: '1d10',   defaultSkill: 'Melee', strikeRank: 0, encumbrance: 25, hitPoints: 16, minSTR: 0, minDEX: 0, cost: 30, isMissile: false, canParry: false },
  { name: 'Halberd',           damage: '1d10',   defaultSkill: 'Melee', strikeRank: 0, encumbrance: 17, hitPoints: 12, minSTR: 0, minDEX: 0, cost: 9,  isMissile: false, canParry: false },
  { name: 'Pole Arm',          damage: '1d6+1',  defaultSkill: 'Melee', strikeRank: 0, encumbrance: 15, hitPoints: 12, minSTR: 0, minDEX: 0, cost: 7,  isMissile: false, canParry: false },
  // Ranged
  { name: 'Short Bow',         damage: '1d6',    defaultSkill: 'Missile', strikeRank: 0, encumbrance: 8,  hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 15, isMissile: true,  range: '50/100',  rateOfFire: 2, canParry: false },
  { name: 'Long Bow',          damage: '1d6',    defaultSkill: 'Missile', strikeRank: 0, encumbrance: 12, hitPoints: 10, minSTR: 0, minDEX: 0, cost: 60, isMissile: true,  range: '70/140',  rateOfFire: 2, canParry: false },
  { name: 'Light Crossbow',    damage: '1d4+1',  defaultSkill: 'Missile', strikeRank: 0, encumbrance: 4,  hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 12, isMissile: true,  range: '60/120',  rateOfFire: 1, canParry: false },
  { name: 'Heavy Crossbow',    damage: '1d6+1',  defaultSkill: 'Missile', strikeRank: 0, encumbrance: 12, hitPoints: 10, minSTR: 0, minDEX: 0, cost: 20, isMissile: true,  range: '60/120',  rateOfFire: 1, canParry: false },
  { name: 'Sling',             damage: '1d4+1',  defaultSkill: 'Missile', strikeRank: 0, encumbrance: 1,  hitPoints: 4,  minSTR: 0, minDEX: 0, cost: 0,  isMissile: true,  range: '35/70',   rateOfFire: 1, canParry: false },
  { name: 'Javelin',           damage: '1d6',    defaultSkill: 'Missile', strikeRank: 0, encumbrance: 2,  hitPoints: 6,  minSTR: 0, minDEX: 0, cost: 1,  isMissile: true,  range: '20/40',   rateOfFire: 1, canParry: false },
  // Unarmed
  { name: 'Brawling',          damage: '1d2',    defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 0,  hitPoints: 0,  minSTR: 0, minDEX: 0, cost: 0,  isMissile: false, canParry: false },
];

const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Shield', armorPoints: 1, hitPoints: 12, encumbrance: 10, cost: 10, protectedLocations: [] },
];

export class OsricRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[],
    _background?: BackgroundForBonuses,
    armorType?: string
  ): DerivedStats {
    const con = stats.CON;
    const str = stats.STR;
    const dex = stats.DEX;

    // Base HP: average Fighter (d10) at level 1 + CON modifier. Player adjusts per class/level.
    const conMod = getConHpModifier(con);
    const maxHitPoints = Math.max(1, 6 + conMod);

    // Armor Class: base from worn armor, improved by Dex and shield(s)
    const baseAc = OSRIC_ARMOR_TYPES.find(a => a.name === armorType)?.points ?? 10;
    const dexMod = getDexAcModifier(dex);
    const shieldBonus = shields.length;
    const ac = Math.max(-10, baseAc - dexMod - shieldBonus);

    // Encumbrance: STR-based max carry. Movement rate drops by tier.
    const maxEncumbrance = getStrMaxEncumbrance(str);
    const equipmentENC = equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
    const weaponsENC = weapons.reduce((sum, w) => {
      const def = WEAPON_LIST.find(wd => wd.name === w.name);
      return sum + (def?.encumbrance ?? 0);
    }, 0);
    const shieldENC = shields.reduce((sum, s) => {
      const def = SHIELD_LIST.find(sd => sd.name === s.name);
      return sum + (def?.encumbrance ?? 0);
    }, 0);
    const totalENC = equipmentENC + weaponsENC + shieldENC;

    // Effective weight for tier lookup: subtract STR bonus from carried weight
    const strAdj = maxEncumbrance - 150;
    const effectiveENC = totalENC - strAdj;
    // Fixed movement tiers per OSRIC encumbrance table (lbs → ft/round)
    let movementRate: number;
    if (effectiveENC > 150)      movementRate = 0;
    else if (effectiveENC > 105) movementRate = 3;
    else if (effectiveENC > 70)  movementRate = 6;
    else if (effectiveENC > 35)  movementRate = 9;
    else                         movementRate = 12;

    // STR bonus string (hit/damage) and DEX missile attack adjustment
    const strBonus = getStrBonus(str);
    const missileAttackBonus = getDexMissileModifier(dex);

    return {
      totalHitPoints: maxHitPoints,
      maxHitPoints,
      magicPoints: 0,
      damageBonus: strBonus,
      spiritCombatDamage: '0',
      healingRate: 1,
      movementRate,
      strikeRank: 0,
      armorClass: ac,
      missileAttackBonus,
      maxEncumbrance,
      totalEncumbrance: totalENC,
      encumbranceDefensePenalty: totalENC > maxEncumbrance ? 1 : 0,
    };
  }

  usesHitLocations(): boolean {
    return false;
  }

  calculateHitLocations(_stats: CharacterStats): HitLocations | null {
    return null;
  }

  getSkillDefinitions(): SkillDefinition[] {
    return SKILL_DEFINITIONS;
  }

  getDefaultSkills(): Record<string, number> {
    const skills: Record<string, number> = {};
    for (const s of SKILL_DEFINITIONS) skills[s.name] = s.defaultValue;
    return skills;
  }

  getSkillCategories(): SkillCategory[] {
    return SKILL_CATEGORIES;
  }

  calculateSkillCategoryModifiers(_stats: CharacterStats): Record<string, number> {
    return {};
  }

  applyBackgroundBonuses(
    skills: Record<string, number>,
    _background: BackgroundForBonuses
  ): Record<string, number> {
    return { ...skills };
  }

  getWeaponList(): WeaponDefinition[] {
    return WEAPON_LIST;
  }

  getShieldList(): ShieldDefinition[] {
    return SHIELD_LIST;
  }

  getArmorTypes(): ArmorTypeDefinition[] {
    return OSRIC_ARMOR_TYPES;
  }

  getConditions(): ConditionDefinition[] {
    return CONDITIONS;
  }

  getMagicSystemType(): string {
    return 'osric';
  }

  getCurrencyLabel(): string {
    return 'GP';
  }

  getRaceAbilities(race: string): AbilityDefinition[] {
    return RACE_ABILITIES[race] ?? [];
  }

  getClassAbilities(className: string): AbilityDefinition[] {
    return CLASS_ABILITIES[className] ?? [];
  }

  classUsesMagic(className: string): boolean {
    return (CLASS_ABILITIES[className] ?? []).some(a => a.name.includes('Spellcasting'));
  }

  getClassHitDie(className: string): ClassHitDie | null {
    return CLASS_HIT_DICE[className] ?? null;
  }

  getConHpModifier(con: number): number {
    return getConHpModifier(con);
  }
}
