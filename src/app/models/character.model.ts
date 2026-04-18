export interface Character {
  id: string;
  name: string;
  color?: string;
  background: CharacterBackground;
  stats: CharacterStats;
  derivedStats: DerivedStats;
  skills: CharacterSkills;
  hitLocations: HitLocations;
  armor: ArmorLocations;
  weapons: Weapon[];
  runes: Runes;
  passions: Passion[];
  magic: Magic;
  resources: Resources;
  equipment: string[];
  notes: string;
  familyHistory?: FamilyHistory;
  cultStatus?: CultStatus;
}

export interface CharacterBackground {
  cult: string;
  occupation: string;
  homeland: string;
  age: number;
  gender: string;
}

export interface DerivedStats {
  totalHitPoints: number;
  maxHitPoints?: number; // Maximum HP, used for healing reference
  magicPoints: number;
  damageBonus: string;
  spiritCombatDamage: string;
  healingRate: number;
  movementRate: number;
  strikeRank: number;
}

export interface HitLocations {
  [key: string]: number;

  'Right Leg': number;
  'Left Leg': number;
  'Abdomen': number;
  'Chest': number;
  'Right Arm': number;
  'Left Arm': number;
  'Head': number;
}

export interface ArmorLocations {
  [key: string]: number;

  'Right Leg': number;
  'Left Leg': number;
  'Abdomen': number;
  'Chest': number;
  'Right Arm': number;
  'Left Arm': number;
  'Head': number;
}

export interface Weapon {
  name: string;
  damage: string;
  skill: string;
}

export interface Runes {
  elemental: ElementalRunes;
  power: PowerRunes;
  form: FormRunes;
}

export interface ElementalRunes {
  [key: string]: number;
  Air: number;
  Earth: number;
  Fire: number;
  Water: number;
  Moon: number;
  Darkness: number;
}

export interface PowerRunes {
  [key: string]: number;
  Death: number;
  Fertility: number;
  Harmony: number;
  Disorder: number;
  Truth: number;
  Illusion: number;
  Stasis: number;
  Movement: number;
}

export interface FormRunes {
  [key: string]: number;
  Man: number;
  Beast: number;
  Plant: number;
}

export interface Passion {
  name: string;
  value: number;
}

export interface Magic {
  spiritMagic: Spell[];
  runeMagic: RuneSpell[];
  sorcery: Spell[];
  runePoints: number;
}

export interface Spell {
  name: string;
  points: number;
}

export interface RuneSpell {
  name: string;
  runePointCost: number;
  associatedRune: string;
  reusable: boolean;
}

export interface FamilyHistory {
  grandfather: string;
  grandmother: string;
  father: string;
  mother: string;
  events: string[];
}

export interface CultStatus {
  cultName: string;
  rank: 'Lay Member' | 'Initiate' | 'Rune Lord/Priest' | 'High Priest';
  runeSpells: string[];
}

export interface Resources {
  lunars: number;
  wheels: number;
  clacks: number;
  reputation: number;
  ransom: number;
}

export interface CharacterStats {
  STR: number; // Strength
  CON: number; // Constitution
  SIZ: number; // Size
  DEX: number; // Dexterity
  INT: number; // Intelligence
  POW: number; // Power
  CHA: number; // Charisma
}

export interface CharacterSkills {
  [key: string]: number;

  // Combat Skills
  'Sword & Shield': number;
  'Two-Handed Weapon': number;
  'Spear': number;
  'Bow': number;
  'Sling': number;
  'Unarmed': number;

  // Magic Skills
  'Spirit Combat': number;
  'Sorcery': number;
  'Rune Magic': number;

  // Knowledge Skills
  'Lore (World)': number;
  'Lore (Animal)': number;
  'Lore (Plant)': number;

  // Communication Skills
  'Speak (Native)': number;
  'Speak (Other)': number;
  'Read/Write': number;

  // Manipulation Skills
  'Craft': number;
  'Farm': number;
  'Heal': number;

  // Perception Skills
  'Listen': number;
  'Scan': number;
  'Search': number;
  'Track': number;

  // Stealth Skills
  'Hide': number;
  'Move Quietly': number;

  // Agility Skills
  'Climb': number;
  'Dodge': number;
  'Ride': number;
  'Swim': number;
}

export const DEFAULT_STATS: CharacterStats = {
  STR: 10,
  CON: 10,
  SIZ: 10,
  DEX: 10,
  INT: 10,
  POW: 10,
  CHA: 10
};

export const DEFAULT_SKILLS: CharacterSkills = {
  'Sword & Shield': 15,
  'Two-Handed Weapon': 10,
  'Spear': 10,
  'Bow': 5,
  'Sling': 5,
  'Unarmed': 25,
  'Spirit Combat': 20,
  'Sorcery': 0,
  'Rune Magic': 0,
  'Lore (World)': 15,
  'Lore (Animal)': 5,
  'Lore (Plant)': 5,
  'Speak (Native)': 50,
  'Speak (Other)': 0,
  'Read/Write': 0,
  'Craft': 10,
  'Farm': 10,
  'Heal': 10,
  'Listen': 25,
  'Scan': 25,
  'Search': 25,
  'Track': 5,
  'Hide': 10,
  'Move Quietly': 10,
  'Climb': 40,
  'Dodge': 20,
  'Ride': 5,
  'Swim': 15
};

export const DEFAULT_BACKGROUND: CharacterBackground = {
  cult: '',
  occupation: '',
  homeland: '',
  age: 21,
  gender: ''
};

export const DEFAULT_DERIVED_STATS: DerivedStats = {
  totalHitPoints: 10,
  magicPoints: 10,
  damageBonus: '0',
  spiritCombatDamage: '1d6',
  healingRate: 2,
  movementRate: 8,
  strikeRank: 10
};

export const DEFAULT_HIT_LOCATIONS: HitLocations = {
  'Right Leg': 5,
  'Left Leg': 5,
  'Abdomen': 5,
  'Chest': 6,
  'Right Arm': 4,
  'Left Arm': 4,
  'Head': 4
};

export const DEFAULT_ARMOR: ArmorLocations = {
  'Right Leg': 0,
  'Left Leg': 0,
  'Abdomen': 0,
  'Chest': 0,
  'Right Arm': 0,
  'Left Arm': 0,
  'Head': 0
};

export const DEFAULT_RUNES: Runes = {
  elemental: {
    Air: 0,
    Earth: 0,
    Fire: 0,
    Water: 0,
    Moon: 0,
    Darkness: 0
  },
  power: {
    Death: 0,
    Fertility: 0,
    Harmony: 0,
    Disorder: 0,
    Truth: 0,
    Illusion: 0,
    Stasis: 0,
    Movement: 0
  },
  form: {
    Man: 0,
    Beast: 0,
    Plant: 0
  }
};

export const DEFAULT_MAGIC: Magic = {
  spiritMagic: [],
  runeMagic: [],
  sorcery: [],
  runePoints: 0
};

export const DEFAULT_RESOURCES: Resources = {
  lunars: 0,
  wheels: 0,
  clacks: 0,
  reputation: 0,
  ransom: 0
};

export function calculateHitLocations(con: number, siz: number): HitLocations {
  const totalHP = Math.round((con + siz) / 2);
  return {
    'Right Leg': Math.max(1, Math.round(totalHP * 0.33)),
    'Left Leg': Math.max(1, Math.round(totalHP * 0.33)),
    'Abdomen': Math.max(1, Math.round(totalHP * 0.33)),
    'Chest': Math.max(1, Math.round(totalHP * 0.40)),
    'Right Arm': Math.max(1, Math.round(totalHP * 0.25)),
    'Left Arm': Math.max(1, Math.round(totalHP * 0.25)),
    'Head': Math.max(1, Math.round(totalHP * 0.33))
  };
}

export function calculateDerivedStats(stats: CharacterStats): DerivedStats {
  const totalHP = Math.round((stats.CON + stats.SIZ) / 2);
  const strSiz = stats.STR + stats.SIZ;

  // Damage Bonus calculation
  let damageBonus = '0';
  if (strSiz <= 12) damageBonus = '-1d4';
  else if (strSiz <= 24) damageBonus = '0';
  else if (strSiz <= 32) damageBonus = '+1d4';
  else if (strSiz <= 40) damageBonus = '+1d6';
  else if (strSiz <= 56) damageBonus = '+2d6';
  else if (strSiz <= 72) damageBonus = '+3d6';
  else damageBonus = '+4d6';

  // Spirit Combat Damage
  let spiritCombatDamage = '1d6';
  if (stats.POW <= 6) spiritCombatDamage = '1d3';
  else if (stats.POW <= 12) spiritCombatDamage = '1d6';
  else if (stats.POW <= 18) spiritCombatDamage = '1d6+1';
  else spiritCombatDamage = '1d6+2';

  // Strike Rank
  const strikeRank = Math.round((stats.DEX + stats.INT) / 2);

  return {
    totalHitPoints: totalHP,
    maxHitPoints: totalHP,
    magicPoints: stats.POW,
    damageBonus: damageBonus,
    spiritCombatDamage: spiritCombatDamage,
    healingRate: Math.max(1, Math.round(stats.CON / 6)),
    movementRate: 8,
    strikeRank: strikeRank
  };
}

export interface WeaponDefinition {
  name: string;
  damage: string;
  defaultSkill: string;
}

export const WEAPON_LIST: WeaponDefinition[] = [
  // Swords
  { name: 'Broadsword', damage: '1d8+1', defaultSkill: 'Sword & Shield' },
  { name: 'Shortsword', damage: '1d6+1', defaultSkill: 'Sword & Shield' },
  { name: 'Greatsword', damage: '2d8', defaultSkill: 'Two-Handed Weapon' },
  { name: 'Scimitar', damage: '1d8', defaultSkill: 'Sword & Shield' },

  // Axes
  { name: 'Battle Axe', damage: '1d8+2', defaultSkill: 'Sword & Shield' },
  { name: 'Great Axe', damage: '3d6', defaultSkill: 'Two-Handed Weapon' },
  { name: 'Hand Axe', damage: '1d6+1', defaultSkill: 'Sword & Shield' },

  // Polearms
  { name: 'Spear', damage: '1d8+1', defaultSkill: 'Spear' },
  { name: 'Javelin', damage: '1d8', defaultSkill: 'Spear' },
  { name: 'Halberd', damage: '1d8+2', defaultSkill: 'Two-Handed Weapon' },
  { name: 'Pike', damage: '1d10+2', defaultSkill: 'Spear' },

  // Bows & Ranged
  { name: 'Shortbow', damage: '1d6+1', defaultSkill: 'Bow' },
  { name: 'Longbow', damage: '1d8+1', defaultSkill: 'Bow' },
  { name: 'Composite Bow', damage: '1d8+2', defaultSkill: 'Bow' },
  { name: 'Sling', damage: '1d6', defaultSkill: 'Sling' },
  { name: 'Staff Sling', damage: '1d8', defaultSkill: 'Sling' },

  // Clubs & Hammers
  { name: 'Club', damage: '1d6', defaultSkill: 'Sword & Shield' },
  { name: 'Mace', damage: '1d8+1', defaultSkill: 'Sword & Shield' },
  { name: 'War Hammer', damage: '1d8+1', defaultSkill: 'Sword & Shield' },
  { name: 'Maul', damage: '2d6+2', defaultSkill: 'Two-Handed Weapon' },

  // Daggers
  { name: 'Dagger', damage: '1d4+2', defaultSkill: 'Sword & Shield' },
  { name: 'Main Gauche', damage: '1d4+1', defaultSkill: 'Sword & Shield' },

  // Unarmed
  { name: 'Fist', damage: '1d3', defaultSkill: 'Unarmed' },
  { name: 'Kick', damage: '1d6', defaultSkill: 'Unarmed' },
  { name: 'Grapple', damage: 'Special', defaultSkill: 'Unarmed' }
];

export const COMBAT_SKILLS = [
  'Sword & Shield',
  'Two-Handed Weapon',
  'Spear',
  'Bow',
  'Sling',
  'Unarmed'
];

export const CULTS = [
  'Orlanth',
  'Ernalda',
  'Seven Mothers',
  'Yelm',
  'Humakt',
  'Chalana Arroy',
  'Issaries',
  'Lhankor Mhy',
  'Storm Bull',
  'Babeester Gor',
  'Daka Fal',
  'Waha',
  'Yelmalio',
  'Kyger Litor',
  'Zorak Zoran',
  'Asrelia',
  'Other'
];

export const HOMELANDS = [
  'Sartar',
  'Esrolia',
  'Prax',
  'Lunar Tarsh',
  'Grazelands',
  'Old Tarsh',
  'Dragon Pass',
  'Sun County',
  'Dagori Inkarth',
  'Other'
];

export const OCCUPATIONS = [
  'Warrior',
  'Farmer',
  'Hunter',
  'Herder',
  'Merchant',
  'Crafter',
  'Fisher',
  'Noble',
  'Priest',
  'Shaman',
  'Thief',
  'Entertainer',
  'Scribe',
  'Healer'
];

export const COMMON_PASSIONS = [
  'Love (Family)',
  'Loyalty (Clan)',
  'Loyalty (Tribe)',
  'Loyalty (Temple)',
  'Hate (Chaos)',
  'Hate (Lunar Empire)',
  'Fear (Dragon)',
  'Honor',
  'Devotion (Deity)'
];

export const SPIRIT_MAGIC_SPELLS = [
  'Bladesharp',
  'Countermagic',
  'Detect',
  'Disruption',
  'Extinguish',
  'Fanaticism',
  'Firearrow',
  'Fireblade',
  'Glamour',
  'Heal',
  'Ignite',
  'Light',
  'Lightwall',
  'Mobility',
  'Protection',
  'Shimmer',
  'Speedart',
  'Spirit Screen',
  'Strength',
  'Vigor'
];

export const SORCERY_SPELLS = [
  'Animate (Substance)',
  'Banish',
  'Beast Form',
  'Blessing',
  'Castback',
  'Curse',
  'Damage Boosting',
  'Damage Resistance',
  'Diminish (Characteristic)',
  'Dispel Magic',
  'Dominate (Species)',
  'Enhance (Characteristic)',
  'Flight',
  'Forge (Substance)',
  'Glow',
  'Haste',
  'Illusion',
  'Neutralize Magic',
  'Palsy',
  'Phantom (Sense)',
  'Regenerate',
  'Sculpt (Substance)',
  'Sense (Substance)',
  'Slow',
  'Spirit Screen',
  'Summon (Entity)',
  'Teleport',
  'Venom',
  'Ward'
];

export const ARMOR_TYPES = [
  { name: 'None', points: 0 },
  { name: 'Leather', points: 1 },
  { name: 'Studded Leather', points: 2 },
  { name: 'Heavy Leather', points: 2 },
  { name: 'Ring Mail', points: 3 },
  { name: 'Scale Mail', points: 4 },
  { name: 'Chain Mail', points: 5 },
  { name: 'Plate Mail', points: 6 }
];

// Skill bonuses by occupation
export const OCCUPATION_SKILL_BONUSES: Record<string, Partial<CharacterSkills>> = {
  'Warrior': {
    'Sword & Shield': 15,
    'Spear': 10,
    'Bow': 5,
    'Dodge': 10,
    'Ride': 10
  },
  'Farmer': {
    'Farm': 20,
    'Craft': 10,
    'Lore (Plant)': 10,
    'Ride': 5
  },
  'Hunter': {
    'Bow': 15,
    'Track': 15,
    'Scan': 10,
    'Hide': 10,
    'Lore (Animal)': 10
  },
  'Herder': {
    'Lore (Animal)': 15,
    'Ride': 10,
    'Track': 5,
    'Sling': 10
  },
  'Merchant': {
    'Speak (Other)': 20,
    'Read/Write': 10,
    'Lore (World)': 10
  },
  'Crafter': {
    'Craft': 25,
    'Lore (World)': 5
  },
  'Priest': {
    'Rune Magic': 20,
    'Lore (World)': 15,
    'Speak (Native)': 10
  },
  'Shaman': {
    'Spirit Combat': 20,
    'Lore (Animal)': 10,
    'Lore (Plant)': 10
  },
  'Thief': {
    'Hide': 15,
    'Move Quietly': 15,
    'Climb': 15
  }
};

// Homeland skill bonuses
export const HOMELAND_SKILL_BONUSES: Record<string, Partial<CharacterSkills>> = {
  'Sartar': {
    'Speak (Native)': 10,
    'Lore (World)': 5
  },
  'Esrolia': {
    'Speak (Native)': 10,
    'Farm': 5
  },
  'Prax': {
    'Ride': 15,
    'Lore (Animal)': 10
  }
};

// Cult skill bonuses
export const CULT_SKILL_BONUSES: Record<string, Partial<CharacterSkills>> = {
  'Orlanth': {
    'Rune Magic': 15,
    'Speak (Native)': 5
  },
  'Ernalda': {
    'Rune Magic': 15,
    'Farm': 10
  },
  'Humakt': {
    'Sword & Shield': 15,
    'Rune Magic': 15
  },
  'Seven Mothers': {
    'Rune Magic': 15,
    'Lore (World)': 5
  }
};

// Opposed rune pairs
export const OPPOSED_ELEMENTAL_RUNES = [
  ['Air', 'Earth'],
  ['Fire', 'Water'],
  ['Moon', 'Darkness']
];

export const OPPOSED_POWER_RUNES = [
  ['Death', 'Fertility'],
  ['Harmony', 'Disorder'],
  ['Truth', 'Illusion'],
  ['Stasis', 'Movement']
];

// Rune spell definitions
export const RUNE_SPELL_LIBRARY: Record<string, RuneSpell[]> = {
  'Orlanth': [
    { name: 'Wind Words', runePointCost: 1, associatedRune: 'Air', reusable: true },
    { name: 'Lightning', runePointCost: 2, associatedRune: 'Air', reusable: true },
    { name: 'Thunderbolt', runePointCost: 3, associatedRune: 'Air', reusable: false }
  ],
  'Ernalda': [
    { name: 'Bless Crops', runePointCost: 1, associatedRune: 'Earth', reusable: true },
    { name: 'Heal Body', runePointCost: 3, associatedRune: 'Fertility', reusable: true }
  ],
  'Humakt': [
    { name: 'Truesword', runePointCost: 1, associatedRune: 'Death', reusable: true },
    { name: 'Shield', runePointCost: 2, associatedRune: 'Death', reusable: true },
    { name: 'Sever Spirit', runePointCost: 3, associatedRune: 'Death', reusable: false }
  ],
  'Seven Mothers': [
    { name: 'Reflection', runePointCost: 2, associatedRune: 'Moon', reusable: true },
    { name: 'Axis Mundi', runePointCost: 3, associatedRune: 'Harmony', reusable: true }
  ]
};

export const DEFAULT_FAMILY_HISTORY: FamilyHistory = {
  grandfather: '',
  grandmother: '',
  father: '',
  mother: '',
  events: []
};

export const DEFAULT_CULT_STATUS: CultStatus = {
  cultName: '',
  rank: 'Lay Member',
  runeSpells: []
};

// Function to apply skill bonuses from occupation, homeland, and cult
export function applySkillBonuses(
  baseSkills: CharacterSkills,
  occupation: string,
  homeland: string,
  cult: string
): CharacterSkills {
  const skills = { ...baseSkills };

  // Apply occupation bonuses
  if (OCCUPATION_SKILL_BONUSES[occupation]) {
    Object.entries(OCCUPATION_SKILL_BONUSES[occupation]).forEach(([skill, bonus]) => {
      if (skills[skill] !== undefined && bonus) {
        skills[skill] += bonus;
      }
    });
  }

  // Apply homeland bonuses
  if (HOMELAND_SKILL_BONUSES[homeland]) {
    Object.entries(HOMELAND_SKILL_BONUSES[homeland]).forEach(([skill, bonus]) => {
      if (skills[skill] !== undefined && bonus) {
        skills[skill] += bonus;
      }
    });
  }

  // Apply cult bonuses
  if (CULT_SKILL_BONUSES[cult]) {
    Object.entries(CULT_SKILL_BONUSES[cult]).forEach(([skill, bonus]) => {
      if (skills[skill] !== undefined && bonus) {
        skills[skill] += bonus;
      }
    });
  }

  return skills;
}

// Character color palette
export const CHARACTER_COLORS = [
  '#3498db', // Blue
  '#ef4444', // Red
  '#f59e0b', // Orange
  '#eab308', // Yellow
  '#10b981', // Green
  '#8b5cf6', // Purple
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#84cc16', // Lime
  '#f97316'  // Deep Orange
];

// Function to enforce opposed rune constraints
export function enforceOpposedRunes(runes: Runes): Runes {
  const updated = JSON.parse(JSON.stringify(runes));

  // Enforce elemental rune oppositions
  OPPOSED_ELEMENTAL_RUNES.forEach(([rune1, rune2]) => {
    const total = updated.elemental[rune1] + updated.elemental[rune2];
    if (total > 100) {
      // Scale down proportionally
      const ratio = 100 / total;
      updated.elemental[rune1] = Math.round(updated.elemental[rune1] * ratio);
      updated.elemental[rune2] = 100 - updated.elemental[rune1];
    }
  });

  // Enforce power rune oppositions
  OPPOSED_POWER_RUNES.forEach(([rune1, rune2]) => {
    const total = updated.power[rune1] + updated.power[rune2];
    if (total > 100) {
      // Scale down proportionally
      const ratio = 100 / total;
      updated.power[rune1] = Math.round(updated.power[rune1] * ratio);
      updated.power[rune2] = 100 - updated.power[rune1];
    }
  });

  return updated;
}
