export interface Character {
  id: string;
  name: string;
  color?: string;
  gameSystem?: 'runequest' | 'dragonbane';
  background: CharacterBackground;
  stats: CharacterStats;
  derivedStats: DerivedStats;
  skills: CharacterSkills;
  hitLocations: HitLocations;
  armor: ArmorLocations;
  shields?: Shield[];
  weapons: Weapon[];
  runes: Runes;
  passions: Passion[];
  magic: Magic;
  resources: Resources;
  equipment: EquipmentItem[];
  conditions?: string[]; // Active conditions like 'disease', 'poisoned', etc.
  notes: string;
  familyHistory?: FamilyHistory;
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
  maxEncumbrance: number;
  totalEncumbrance: number;
  encumbranceDefensePenalty: number;
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
  currentHitPoints?: number;
}

export interface Shield {
  name: string;
  skill: string;
  currentHitPoints?: number;
}

export interface ShieldDefinition {
  name: string;
  armorPoints: number;
  hitPoints: number;
  encumbrance: number;
  cost: number;
  protectedLocations: string[];
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
  ransom: 0
};

export function calculateHitLocations(con: number, siz: number): HitLocations {
  const totalHP = Math.ceil((con + siz) / 2);
  return {
    'Right Leg': Math.max(1, Math.round(totalHP / 4)),
    'Left Leg': Math.max(1, Math.round(totalHP / 4)),
    'Abdomen': Math.max(1, Math.round(totalHP / 6)),
    'Chest': Math.max(1, Math.round(totalHP / 3)),
    'Right Arm': Math.max(1, Math.round(totalHP / 6)),
    'Left Arm': Math.max(1, Math.round(totalHP / 6)),
    'Head': Math.max(1, Math.round(totalHP / 8))
  };
}

export function calculateArmorFromShields(shields: Shield[]): ArmorLocations {
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

export function getSizeModifier(siz: number): number {
  if (siz >= 22) return 0;
  if (siz >= 15) return 1;
  if (siz >= 7) return 2;
  return 3;
}

export function getDexterityModifier(dex: number): number {
  if (dex >= 19) return 0;
  if (dex >= 16) return 1;
  if (dex >= 13) return 2;
  if (dex >= 9) return 3;
  if (dex >= 6) return 4;
  return 5;
}

export function calculateDerivedStats(stats: CharacterStats, equipment: EquipmentItem[] = [], weapons: Weapon[] = [], shields: Shield[] = []): DerivedStats {
  const totalHP = Math.round((stats.CON + stats.SIZ) / 2);
  const strSiz = stats.STR + stats.SIZ;

  // Damage Bonus calculation (RQ2 standard progression)
  let damageBonus = '0';
  if (strSiz <= 6) damageBonus = '0';
  else if (strSiz <= 12) damageBonus = '1d4';
  else if (strSiz <= 18) damageBonus = '1d6';
  else if (strSiz <= 24) damageBonus = '1d8';
  else if (strSiz <= 30) damageBonus = '1d10';
  else if (strSiz <= 36) damageBonus = '1d12';
  else if (strSiz <= 42) damageBonus = '1d12+1d4';
  else if (strSiz <= 48) damageBonus = '2d12';
  else if (strSiz <= 54) damageBonus = '2d12+1d4';
  else damageBonus = '3d12';

  // Spirit Combat Damage (RQ2: POW value used directly, not rolled)
  const spiritCombatDamage = stats.POW.toString();

  // Strike Rank: base 0 + SIZ modifier + DEX modifier
  let strikeRank = getSizeModifier(stats.SIZ) + getDexterityModifier(stats.DEX);

  // Encumbrance calculations: equipment + weapons + shields
  const maxEncumbrance = stats.STR;
  const equipmentENC = equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
  const weaponsENC = weapons.reduce((sum, w) => sum + (WEAPON_LIST.find(wd => wd.name === w.name)?.encumbrance || 0), 0);
  const shieldsENC = shields.reduce((sum, s) => sum + (SHIELD_LIST.find(sd => sd.name === s.name)?.encumbrance || 0), 0);
  const totalENC = equipmentENC + weaponsENC + shieldsENC;
  const overENC = Math.max(0, totalENC - maxEncumbrance);

  // Apply encumbrance penalties
  const movementRate = Math.max(0, 8 - overENC);
  strikeRank += overENC;
  const encumbranceDefensePenalty = overENC * 5;

  return {
    totalHitPoints: totalHP,
    maxHitPoints: totalHP,
    magicPoints: stats.POW,
    damageBonus: damageBonus,
    spiritCombatDamage: spiritCombatDamage,
    healingRate: Math.ceil(stats.CON / 4),
    movementRate: movementRate,
    strikeRank: strikeRank,
    maxEncumbrance: maxEncumbrance,
    totalEncumbrance: totalENC,
    encumbranceDefensePenalty: encumbranceDefensePenalty
  };
}

export interface WeaponDefinition {
  name: string;
  damage: string;
  defaultSkill: string;
  strikeRank: number;
  encumbrance: number;
  hitPoints: number;
  minSTR: number;      // minimum STR to wield
  minDEX: number;      // minimum DEX to wield
  cost: number;        // cost in Lunars
  isMissile: boolean;
  range?: string;      // short/medium/long in metres, e.g. "40/80/160"
  rateOfFire?: number; // shots per round (missile weapons only)
  canParry: boolean;   // RQ2: can this weapon be used to parry?
}

export const WEAPON_LIST: WeaponDefinition[] = [
  // Swords
  { name: 'Broadsword',    damage: '1d8+1',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 12, minSTR: 9,  minDEX: 7,  cost: 150, isMissile: false, canParry: true },
  { name: 'Shortsword',    damage: '1d6+1',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 10, minSTR: 7,  minDEX: 7,  cost: 80,  isMissile: false, canParry: true },
  { name: 'Greatsword',    damage: '2d8',    defaultSkill: 'Two-Handed Weapon', strikeRank: 1, encumbrance: 2, hitPoints: 16, minSTR: 13, minDEX: 9,  cost: 300, isMissile: false, canParry: false },
  { name: 'Scimitar',      damage: '1d8',    defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 10, minSTR: 9,  minDEX: 9,  cost: 150, isMissile: false, canParry: true },

  // Axes
  { name: 'Battle Axe',    damage: '1d8+2',  defaultSkill: 'Sword & Shield',    strikeRank: 1, encumbrance: 1, hitPoints: 8,  minSTR: 9,  minDEX: 7,  cost: 75,  isMissile: false, canParry: true },
  { name: 'Great Axe',     damage: '3d6',    defaultSkill: 'Two-Handed Weapon', strikeRank: 0, encumbrance: 2, hitPoints: 10, minSTR: 13, minDEX: 7,  cost: 125, isMissile: false, canParry: false },
  { name: 'Hand Axe',      damage: '1d6+1',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 6,  minSTR: 9,  minDEX: 7,  cost: 50,  isMissile: false, canParry: true },

  // Polearms
  { name: 'Spear',         damage: '1d8+1',  defaultSkill: 'Spear',             strikeRank: 3, encumbrance: 1, hitPoints: 10, minSTR: 9,  minDEX: 7,  cost: 30,  isMissile: false, canParry: true },
  { name: 'Javelin',       damage: '1d8',    defaultSkill: 'Spear',             strikeRank: 3, encumbrance: 1, hitPoints: 8,  minSTR: 9,  minDEX: 9,  cost: 20,  isMissile: true,  range: '20/40/-',     rateOfFire: 1, canParry: false },
  { name: 'Halberd',       damage: '1d8+2',  defaultSkill: 'Two-Handed Weapon', strikeRank: 1, encumbrance: 2, hitPoints: 12, minSTR: 13, minDEX: 9,  cost: 150, isMissile: false, canParry: false },
  { name: 'Pike',          damage: '1d10+2', defaultSkill: 'Spear',             strikeRank: 4, encumbrance: 2, hitPoints: 12, minSTR: 13, minDEX: 7,  cost: 80,  isMissile: false, canParry: false },

  // Bows & Ranged
  { name: 'Shortbow',      damage: '1d6+1',  defaultSkill: 'Bow',               strikeRank: 3, encumbrance: 1, hitPoints: 6,  minSTR: 9,  minDEX: 11, cost: 75,  isMissile: true,  range: '40/80/160',   rateOfFire: 2, canParry: false },
  { name: 'Longbow',       damage: '1d8+1',  defaultSkill: 'Bow',               strikeRank: 2, encumbrance: 1, hitPoints: 8,  minSTR: 13, minDEX: 11, cost: 150, isMissile: true,  range: '50/100/200',  rateOfFire: 1, canParry: false },
  { name: 'Composite Bow', damage: '1d8+2',  defaultSkill: 'Bow',               strikeRank: 2, encumbrance: 1, hitPoints: 8,  minSTR: 11, minDEX: 11, cost: 300, isMissile: true,  range: '50/100/200',  rateOfFire: 1, canParry: false },
  { name: 'Sling',         damage: '1d6',    defaultSkill: 'Sling',             strikeRank: 3, encumbrance: 0, hitPoints: 4,  minSTR: 7,  minDEX: 9,  cost: 10,  isMissile: true,  range: '50/100/200',  rateOfFire: 1, canParry: false },
  { name: 'Staff Sling',   damage: '1d8',    defaultSkill: 'Sling',             strikeRank: 2, encumbrance: 1, hitPoints: 6,  minSTR: 9,  minDEX: 9,  cost: 20,  isMissile: true,  range: '60/120/240',  rateOfFire: 1, canParry: false },

  // Clubs & Hammers
  { name: 'Club',          damage: '1d6',    defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 8,  minSTR: 7,  minDEX: 5,  cost: 10,  isMissile: false, canParry: true },
  { name: 'Mace',          damage: '1d8+1',  defaultSkill: 'Sword & Shield',    strikeRank: 1, encumbrance: 1, hitPoints: 10, minSTR: 9,  minDEX: 5,  cost: 75,  isMissile: false, canParry: true },
  { name: 'War Hammer',    damage: '1d8+1',  defaultSkill: 'Sword & Shield',    strikeRank: 1, encumbrance: 1, hitPoints: 8,  minSTR: 9,  minDEX: 7,  cost: 100, isMissile: false, canParry: true },
  { name: 'Maul',          damage: '2d6+2',  defaultSkill: 'Two-Handed Weapon', strikeRank: 0, encumbrance: 2, hitPoints: 12, minSTR: 13, minDEX: 7,  cost: 80,  isMissile: false, canParry: false },

  // Daggers
  { name: 'Dagger',        damage: '1d4+2',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 0, hitPoints: 6,  minSTR: 5,  minDEX: 5,  cost: 25,  isMissile: false, canParry: true },
  { name: 'Main Gauche',   damage: '1d4+1',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 0, hitPoints: 6,  minSTR: 5,  minDEX: 7,  cost: 30,  isMissile: false, canParry: true },

  // Unarmed
  { name: 'Fist',          damage: '1d3',    defaultSkill: 'Unarmed',           strikeRank: 3, encumbrance: 0, hitPoints: 0,  minSTR: 0,  minDEX: 0,  cost: 0,   isMissile: false, canParry: false },
  { name: 'Kick',          damage: '1d6',    defaultSkill: 'Unarmed',           strikeRank: 2, encumbrance: 0, hitPoints: 0,  minSTR: 0,  minDEX: 0,  cost: 0,   isMissile: false, canParry: false },
  { name: 'Grapple',       damage: 'Special',defaultSkill: 'Unarmed',           strikeRank: 2, encumbrance: 0, hitPoints: 0,  minSTR: 0,  minDEX: 0,  cost: 0,   isMissile: false, canParry: false }
];

export const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Target Shield',  armorPoints: 6,  hitPoints: 9,  encumbrance: 1, cost: 30,  protectedLocations: ['Left Arm', 'Chest'] },
  { name: 'Heater Shield',  armorPoints: 10, hitPoints: 12, encumbrance: 2, cost: 60,  protectedLocations: ['Left Arm', 'Right Arm', 'Chest'] },
  { name: 'Kite Shield',    armorPoints: 12, hitPoints: 14, encumbrance: 3, cost: 100, protectedLocations: ['Left Arm', 'Right Arm', 'Chest', 'Abdomen'] },
  { name: 'Tower Shield',   armorPoints: 14, hitPoints: 16, encumbrance: 4, cost: 150, protectedLocations: ['Left Arm', 'Right Arm', 'Chest', 'Abdomen', 'Head'] }
];

export const EQUIPMENT_LIST: EquipmentDefinition[] = [
  // Adventuring Gear
  { name: 'Backpack', category: 'Adventuring Gear', cost: 3, hitPoints: 4, encumbrance: 1 },
  { name: 'Bedroll', category: 'Adventuring Gear', cost: 2, hitPoints: 3, encumbrance: 1 },
  { name: 'Blanket', category: 'Adventuring Gear', cost: 1, hitPoints: 2, encumbrance: 1 },
  { name: 'Canteen', category: 'Adventuring Gear', cost: 1, hitPoints: 2, encumbrance: 0 },
  { name: 'Flint & Steel', category: 'Adventuring Gear', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Grappling Hook', category: 'Adventuring Gear', cost: 5, hitPoints: 6, encumbrance: 1 },
  { name: 'Lantern', category: 'Adventuring Gear', cost: 5, hitPoints: 4, encumbrance: 0 },
  { name: 'Oil Flask', category: 'Adventuring Gear', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Rope (10m)', category: 'Adventuring Gear', cost: 2, hitPoints: 6, encumbrance: 1 },
  { name: 'Sack', category: 'Adventuring Gear', cost: 1, hitPoints: 3, encumbrance: 0 },
  { name: 'Torch', category: 'Adventuring Gear', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Waterskin', category: 'Adventuring Gear', cost: 1, hitPoints: 2, encumbrance: 0 },
  { name: 'Pole (3m)', category: 'Adventuring Gear', cost: 2, hitPoints: 6, encumbrance: 2 },
  { name: 'Signal Whistle', category: 'Adventuring Gear', cost: 2, hitPoints: 1, encumbrance: 0 },
  { name: 'Mirror (Small)', category: 'Adventuring Gear', cost: 5, hitPoints: 2, encumbrance: 0 },
  { name: 'Bell', category: 'Adventuring Gear', cost: 2, hitPoints: 2, encumbrance: 0 },
  { name: 'Candle', category: 'Adventuring Gear', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Chain (1m)', category: 'Adventuring Gear', cost: 5, hitPoints: 8, encumbrance: 1 },

  // Clothing
  { name: 'Boots', category: 'Clothing', cost: 5, hitPoints: 6, encumbrance: 1 },
  { name: 'Cloak', category: 'Clothing', cost: 2, hitPoints: 4, encumbrance: 1 },
  { name: 'Common Clothes', category: 'Clothing', cost: 3, hitPoints: 4, encumbrance: 1 },
  { name: 'Fine Clothes', category: 'Clothing', cost: 20, hitPoints: 4, encumbrance: 1 },
  { name: 'Gloves', category: 'Clothing', cost: 2, hitPoints: 3, encumbrance: 0 },
  { name: 'Hat', category: 'Clothing', cost: 1, hitPoints: 2, encumbrance: 0 },

  // Food & Provisions
  { name: 'Rations (1 day)', category: 'Food & Provisions', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Rations (1 week)', category: 'Food & Provisions', cost: 6, hitPoints: 1, encumbrance: 2 },
  { name: 'Ale (mug)', category: 'Food & Provisions', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Wine (bottle)', category: 'Food & Provisions', cost: 3, hitPoints: 1, encumbrance: 0 },
  { name: 'Dried Meat', category: 'Food & Provisions', cost: 2, hitPoints: 1, encumbrance: 0 },

  // Tools
  { name: 'Chisel', category: 'Tools', cost: 2, hitPoints: 4, encumbrance: 0 },
  { name: 'Crowbar', category: 'Tools', cost: 4, hitPoints: 10, encumbrance: 1 },
  { name: 'Hammer', category: 'Tools', cost: 2, hitPoints: 6, encumbrance: 1 },
  { name: 'Pickaxe', category: 'Tools', cost: 5, hitPoints: 8, encumbrance: 2 },
  { name: 'Saw', category: 'Tools', cost: 3, hitPoints: 6, encumbrance: 1 },
  { name: 'Shovel', category: 'Tools', cost: 4, hitPoints: 6, encumbrance: 1 },
  { name: 'Thieves\' Tools', category: 'Tools', cost: 20, hitPoints: 3, encumbrance: 0 },
  { name: 'Lock', category: 'Tools', cost: 5, hitPoints: 6, encumbrance: 0 },
  { name: 'Padlock', category: 'Tools', cost: 4, hitPoints: 4, encumbrance: 0 },

  // Medical
  { name: 'Bandages', category: 'Medical', cost: 2, hitPoints: 1, encumbrance: 0 },
  { name: 'Healer\'s Kit', category: 'Medical', cost: 10, hitPoints: 1, encumbrance: 1 },
  { name: 'Healing Herbs', category: 'Medical', cost: 5, hitPoints: 1, encumbrance: 0 },
  { name: 'Antidote', category: 'Medical', cost: 10, hitPoints: 1, encumbrance: 0 },
  { name: 'Poison Antidote', category: 'Medical', cost: 15, hitPoints: 1, encumbrance: 0 },

  // Writing & Navigation
  { name: 'Map', category: 'Writing & Navigation', cost: 5, hitPoints: 1, encumbrance: 0 },
  { name: 'Compass', category: 'Writing & Navigation', cost: 10, hitPoints: 1, encumbrance: 0 },
  { name: 'Ink', category: 'Writing & Navigation', cost: 2, hitPoints: 1, encumbrance: 0 },
  { name: 'Parchment (sheet)', category: 'Writing & Navigation', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Quill', category: 'Writing & Navigation', cost: 1, hitPoints: 1, encumbrance: 0 },
  { name: 'Spellbook', category: 'Writing & Navigation', cost: 30, hitPoints: 4, encumbrance: 1 },

  // Transport & Storage
  { name: 'Saddlebags', category: 'Transport & Storage', cost: 5, hitPoints: 6, encumbrance: 1 },
  { name: 'Saddlebags (Large)', category: 'Transport & Storage', cost: 10, hitPoints: 8, encumbrance: 2 },
  { name: 'Cart', category: 'Transport & Storage', cost: 50, hitPoints: 20, encumbrance: 0 },
  { name: 'Small Boat', category: 'Transport & Storage', cost: 100, hitPoints: 30, encumbrance: 0 },
];

export const COMBAT_SKILLS = [
  'Sword & Shield',
  'Two-Handed Weapon',
  'Spear',
  'Bow',
  'Sling',
  'Unarmed',
  'Shield'
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

// Skill category mappings for applying characteristic modifiers (RQ2 rule)
export const SKILL_CATEGORY_MAP: Record<string, string> = {
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
// NOTE: In a full RQ2 implementation, these modifiers would come from the characteristic set
// selected during character creation. For now, this function is a placeholder for future implementation.
// The stats parameter will be used when characteristic sets with modifiers are fully integrated.
export function calculateSkillCategoryModifiers(_stats: CharacterStats): Record<string, number> {
  // TODO: Implement full RQ2 skill category modifier calculation based on characteristic set
  // For now, returning zero modifiers to maintain current behavior
  // Once characteristic sets are implemented with their associated modifiers,
  // this function should apply them to each skill category
  return {
    'Agility': 0,
    'Communication': 0,
    'Knowledge': 0,
    'Magic': 0,
    'Manipulation': 0,
    'Perception': 0,
    'Stealth': 0
  };
}

// Apply skill category modifiers to skills (RQ2: add modifier to base chance)
export function applySkillCategoryModifiers(
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

export function canWeaponParry(weaponName: string): boolean {
  const weapon = WEAPON_LIST.find(w => w.name === weaponName);
  return weapon?.canParry ?? false;
}
