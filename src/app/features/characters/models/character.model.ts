import { DB_SKILL_BY_ATTR } from "../constants";
import { CharacterStats } from '@shared/models/character-stats.model';
import {
  WeaponDefinition, Weapon, Shield, ShieldDefinition, HitLocations,
  WEAPON_LIST, SHIELD_LIST, ARMOR_TYPES,
  getSizeModifier, getDexterityModifier, calculateHitLocations, canWeaponParry
} from '@shared/rules/game-rules';

// Re-export for use within the characters feature without changing internal imports
export type { CharacterStats, WeaponDefinition, Weapon, Shield, ShieldDefinition, HitLocations };
export { WEAPON_LIST, SHIELD_LIST, ARMOR_TYPES, getSizeModifier, getDexterityModifier, calculateHitLocations, canWeaponParry };

export interface Character {
  id: string;
  name: string;
  color?: string;
  gameSystem?: 'runequest' | 'dragonbane' | 'kal-arath' | 'osric' | 'mothership';
  background: CharacterBackground;
  stats: CharacterStats;
  derivedStats: DerivedStats;
  skills: CharacterSkills;
  hitLocations: HitLocations;
  armor: ArmorLocations;
  armorType?: string; // Type of worn armor (e.g., 'Leather', 'Chain Mail')
  shields?: Shield[];
  weapons: Weapon[];
  runes: Runes;
  passions: Passion[];
  magic: Magic;
  resources: Resources;
  equipment: EquipmentItem[];
  conditions?: string[]; // Active conditions like 'disease', 'poisoned', etc.
  acquiredAbilities?: string[]; // OSRIC: names of race/class abilities the character has acquired
  notes: string;
  cultStatus?: CultStatus;
}

export interface EquipmentItem {
  name: string;
  quantity: number;
  cost: number;
  hitPoints: number;
  encumbrance: number;
}

export interface EquipmentDefinition {
  name: string;
  category: string;
  cost: number;
  hitPoints: number;
  encumbrance: number;
  supply?: string; // Dragonbane: 'Common' | 'Uncommon' | 'Rare'
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
  armorClass?: number; // OSRIC only — computed AC (10 = unarmored, lower = better)
  missileAttackBonus?: number; // OSRIC only — DEX reaction/attack adjustment for missile weapons
  maxEncumbrance: number;
  totalEncumbrance: number;
  encumbranceDefensePenalty: number;
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

export interface DragonbaneSpell {
  discipline: string;
  name: string;
}

export interface Magic {
  spiritMagic: Spell[];
  runeMagic: RuneSpell[];
  sorcery: Spell[];
  runePoints: number;
  doom?: string;
  dragonbaneSpells?: DragonbaneSpell[];
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
  // Kal-Arath fields
  silver?: number;
  fatePoints?: number;
  level?: number;
  xp?: number;
  // Dragonbane fields
  copper?: number;
  gold?: number;
  advancementMarks?: number;
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
  'Shield': number;

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

// TODO: add attributes here for dragonbane
export const DEFAULT_SKILLS: CharacterSkills = {
  'Sword & Shield': 15,
  'Two-Handed Weapon': 10,
  'Spear': 10,
  'Bow': 5,
  'Sling': 5,
  'Unarmed': 25,
  'Shield': 15,
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
  strikeRank: 0,
  maxEncumbrance: 10,
  totalEncumbrance: 0,
  encumbranceDefensePenalty: 0
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
  lunars: 200,
  wheels: 0,
  clacks: 0,
  reputation: 0,
  ransom: 0,
  level: 1,
  xp: 0,
  silver: 0,
  gold: 0,
  fatePoints: 1,
  copper: 0,
  advancementMarks: 0,
};

function calculateArmorFromWornArmor(armorType?: string): ArmorLocations {
  const baseArmor: ArmorLocations = {
    'Right Leg': 0,
    'Left Leg': 0,
    'Abdomen': 0,
    'Chest': 0,
    'Right Arm': 0,
    'Left Arm': 0,
    'Head': 0
  };

  if (!armorType) return baseArmor;

  const armorDef = ARMOR_TYPES.find(a => a.name === armorType);
  if (!armorDef) return baseArmor;

  // Worn armor applies to all locations
  return {
    'Right Leg': armorDef.points,
    'Left Leg': armorDef.points,
    'Abdomen': armorDef.points,
    'Chest': armorDef.points,
    'Right Arm': armorDef.points,
    'Left Arm': armorDef.points,
    'Head': armorDef.points
  };
}

function calculateArmorFromShields(shields: Shield[]): ArmorLocations {
  const shieldArmor: ArmorLocations = {
    'Right Leg': 0,
    'Left Leg': 0,
    'Abdomen': 0,
    'Chest': 0,
    'Right Arm': 0,
    'Left Arm': 0,
    'Head': 0
  };

  shields.forEach(shield => {
    const shieldDef = SHIELD_LIST.find(s => s.name === shield.name);
    if (shieldDef) {
      shieldDef.protectedLocations.forEach(location => {
        shieldArmor[location as keyof ArmorLocations] += shieldDef.armorPoints;
      });
    }
  });

  return shieldArmor;
}

export function calculateTotalArmor(armorType?: string, shields: Shield[] = []): ArmorLocations {
  const wornArmor = calculateArmorFromWornArmor(armorType);
  const shieldArmor = calculateArmorFromShields(shields);

  return {
    'Right Leg': wornArmor['Right Leg'] + shieldArmor['Right Leg'],
    'Left Leg': wornArmor['Left Leg'] + shieldArmor['Left Leg'],
    'Abdomen': wornArmor['Abdomen'] + shieldArmor['Abdomen'],
    'Chest': wornArmor['Chest'] + shieldArmor['Chest'],
    'Right Arm': wornArmor['Right Arm'] + shieldArmor['Right Arm'],
    'Left Arm': wornArmor['Left Arm'] + shieldArmor['Left Arm'],
    'Head': wornArmor['Head'] + shieldArmor['Head']
  };
}

export function getConHPModifier(con: number): number {
  if (con <= 4)  return -2;
  if (con <= 6)  return -1;
  if (con <= 12) return 0;
  if (con <= 16) return 1;
  if (con <= 20) return 2;
  return 3;
}

export function getPowHPModifier(pow: number): number {
  if (pow <= 8)  return -1;
  if (pow <= 12) return 0;
  return 1;
}

export function calculateDerivedStats(stats: CharacterStats, equipment: EquipmentItem[] = [], weapons: Weapon[] = [], shields: Shield[] = []): DerivedStats {
  // RQ2: Total HP = SIZ + HP modifier(CON) + HP modifier(POW)
  const totalHP = Math.max(1, stats.SIZ + getConHPModifier(stats.CON) + getPowHPModifier(stats.POW));
  const strSiz = stats.STR + stats.SIZ;

  // Damage Bonus: RQ2 table — 1–6: -1D4, 7–12: none, 13–16: +1D4, 17–20: +1D6, each +8 adds +1D6
  let damageBonus = '0';
  if (strSiz <= 6)  damageBonus = '-1d4';
  else if (strSiz <= 12) damageBonus = '0';
  else if (strSiz <= 16) damageBonus = '+1d4';
  else if (strSiz <= 20) damageBonus = '+1d6';
  else {
    const extraD6 = Math.floor((strSiz - 13) / 8) + 1;
    damageBonus = `+${extraD6}d6`;
  }

  // RQ2 spirit combat damage is 1D6 per round for winner; POW affects Spirit Combat skill (POW×3%), not damage
  const spiritCombatDamage = '1d6';

  // Strike Rank: base 0 + SIZ modifier + DEX modifier
  let strikeRank = getSizeModifier(stats.SIZ) + getDexterityModifier(stats.DEX);

  // RQ2: Max ENC = (STR + CON) / 2, capped at STR
  const maxEncumbrance = Math.min(stats.STR, Math.floor((stats.STR + stats.CON) / 2));
  const equipmentENC = equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
  const weaponsENC = weapons.reduce((sum, w) => sum + (WEAPON_LIST.find(wd => wd.name === w.name)?.encumbrance || 0), 0);
  const shieldsENC = shields.reduce((sum, s) => sum + (SHIELD_LIST.find(sd => sd.name === s.name)?.encumbrance || 0), 0);
  const totalENC = equipmentENC + weaponsENC + shieldsENC;
  const overENC = Math.max(0, totalENC - maxEncumbrance);

  // RQ2 encumbrance penalties per point over max: -1 MOV, +1 SR, -5% defense
  const movementRate = Math.max(0, 8 - overENC);
  strikeRank += overENC;
  const encumbranceDefensePenalty = overENC * 5;

  return {
    totalHitPoints: totalHP,
    maxHitPoints: totalHP,
    magicPoints: stats.POW,
    damageBonus: damageBonus,
    spiritCombatDamage: spiritCombatDamage,
    healingRate: Math.ceil(stats.CON / 4), // RQG-style (CON/4); RQ2 Classic uses flat 1 HP/week
    movementRate: movementRate,
    strikeRank: strikeRank,
    maxEncumbrance: maxEncumbrance,
    totalEncumbrance: totalENC,
    encumbranceDefensePenalty: encumbranceDefensePenalty
  };
}


// For Runequest
export const COMBAT_SKILLS = [
  'Sword & Shield',
  'Two-Handed Weapon',
  'Spear',
  'Bow',
  'Sling',
  'Unarmed',
  'Shield'
];
// For Dragonbane — 9 weapon skills matching the core rulebook
export const WEAPON_SKILLS = [
  'Axes (STR)',
  'Bows (AGL)',
  'Crossbows (AGL)',
  'Hammers (STR)',
  'Knives (AGL)',
  'Shields (STR)',
  'Spears (STR)',
  'Staves (AGL)',
  'Swords (STR)',
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

// FIXME: Dragonbane kin stat modifiers are not implemented — kin dropdown values exist in GameSystemService
// but no base-chance adjustments are applied for Wolfkin, Stillkin, etc. during character creation.
// Add a DB_KIN_BASE_CHANCE record here and apply it in initializeSkillsWithModifiers for the dragonbane system.

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

// Skill category mappings for applying characteristic modifiers (RQ2 rule)
const SKILL_CATEGORY_MAP: Record<string, string> = {
  // Agility Skills (STR, SIZ, DEX, POW)
  'Climb': 'Agility',
  'Dodge': 'Agility',
  'Ride': 'Agility',
  'Swim': 'Agility',
  // Communication Skills (INT, POW, CHA)
  'Speak (Native)': 'Communication',
  'Speak (Other)': 'Communication',
  'Read/Write': 'Communication',
  // Knowledge Skills (INT, POW)
  'Lore (World)': 'Knowledge',
  'Lore (Animal)': 'Knowledge',
  'Lore (Plant)': 'Knowledge',
  // Magic Skills (POW, CHA)
  'Spirit Combat': 'Magic',
  'Sorcery': 'Magic',
  'Rune Magic': 'Magic',
  // Manipulation Skills (STR, DEX, INT, POW) - includes all weapon skills
  'Sword & Shield': 'Manipulation',
  'Two-Handed Weapon': 'Manipulation',
  'Spear': 'Manipulation',
  'Bow': 'Manipulation',
  'Sling': 'Manipulation',
  'Unarmed': 'Manipulation',
  'Shield': 'Manipulation',
  'Craft': 'Manipulation',
  'Farm': 'Manipulation',
  'Heal': 'Manipulation',
  // Perception Skills (INT, POW)
  'Listen': 'Perception',
  'Scan': 'Perception',
  'Search': 'Perception',
  'Track': 'Perception',
  // Stealth Skills (SIZ, DEX, INT, POW)
  'Hide': 'Stealth',
  'Move Quietly': 'Stealth'
};

// Calculate skill category modifier from characteristics (RQ2: characteristic modifiers per category)
// Each skill category gets a modifier based on the average of its tied characteristics
// Formula: (average of tied characteristics - 10) * 5 / number of characteristics
export function calculateSkillCategoryModifiers(stats: CharacterStats): Record<string, number> {
  const calculateModifier = (characteristics: number[]): number => {
    if (characteristics.length === 0) return 0;
    const average = characteristics.reduce((a, b) => a + b, 0) / characteristics.length;
    // Each characteristic point above/below 10 contributes to skill modifiers
    // Standard range: 3-21, average is ~10-11
    // Modifier = (average - 10) * 5
    return Math.round((average - 10) * 5);
  };

  return {
    'Agility': calculateModifier([stats.STR, stats.SIZ, stats.DEX, stats.POW]),
    'Communication': calculateModifier([stats.INT, stats.POW, stats.CHA]),
    'Knowledge': calculateModifier([stats.INT, stats.POW]),
    'Magic': calculateModifier([stats.POW, stats.CHA]),
    'Manipulation': calculateModifier([stats.STR, stats.DEX, stats.INT, stats.POW]),
    'Perception': calculateModifier([stats.INT, stats.POW]),
    'Stealth': calculateModifier([stats.SIZ, stats.DEX, stats.INT, stats.POW])
  };
}

// Apply skill category modifiers to skills (RQ2: add modifier to base chance)
function applySkillCategoryModifiers(
  skills: CharacterSkills,
  categoryModifiers: Record<string, number>
): CharacterSkills {
  const modified = { ...skills };

  Object.entries(SKILL_CATEGORY_MAP).forEach(([skill, category]) => {
    if (modified[skill] !== undefined && categoryModifiers[category] !== undefined) {
      modified[skill] += categoryModifiers[category];
      // Ensure skill doesn't exceed 95% (RQ2 cap before magical enhancement)
      modified[skill] = Math.min(modified[skill], 95);
      // Ensure skill doesn't go below 0%
      modified[skill] = Math.max(modified[skill], 0);
    }
  });

  return modified;
}

// Initialize skills with category modifiers applied based on characteristics
export function initializeSkillsWithModifiers(stats: CharacterStats, baseSkills: CharacterSkills = DEFAULT_SKILLS): CharacterSkills {
  const modifiers = calculateSkillCategoryModifiers(stats);
  return applySkillCategoryModifiers(baseSkills, modifiers);
}

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
