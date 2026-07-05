export interface WeaponDefinition {
  name: string;
  damage: string;
  defaultSkill: string;
  strikeRank: number;
  encumbrance: number;
  hitPoints: number;
  minSTR: number;
  minDEX: number;
  cost: number;
  isMissile: boolean;
  range?: string;
  rateOfFire?: number;
  canParry: boolean;
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
  /** Percentage added to parry rolls made with this shield (RQ2 shield Defense Bonus). */
  parryBonus?: number;
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

// RQ2 weapon stats (RuneQuest Classic Mechanics Reference, Weapon Statistics Table)
// SR listed is weapon SR only; total SR = weapon SR + character SR modifier
export const WEAPON_LIST: WeaponDefinition[] = [
  // Swords
  { name: 'Broadsword',    damage: '1d8+1',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 2, hitPoints: 12, minSTR: 9,  minDEX: 7,  cost: 100, isMissile: false, canParry: true },
  { name: 'Longsword',     damage: '1d8',    defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 2, hitPoints: 15, minSTR: 11, minDEX: 7,  cost: 120, isMissile: false, canParry: true },
  { name: 'Shortsword',    damage: '1d6+1',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 1, hitPoints: 12, minSTR: 7,  minDEX: 7,  cost: 80,  isMissile: false, canParry: true },
  { name: 'Scimitar',      damage: '1d8+1',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 2, hitPoints: 12, minSTR: 7,  minDEX: 9,  cost: 110, isMissile: false, canParry: true },
  { name: 'Falchion',      damage: '1d6+2',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 2, hitPoints: 10, minSTR: 7,  minDEX: 7,  cost: 80,  isMissile: false, canParry: true },
  { name: 'Rapier',        damage: '1d6+1',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 8,  minSTR: 7,  minDEX: 13, cost: 100, isMissile: false, canParry: true },
  { name: '2H Sword',      damage: '2d8',    defaultSkill: 'Two-Handed Weapon', strikeRank: 4, encumbrance: 2, hitPoints: 20, minSTR: 13, minDEX: 9,  cost: 150, isMissile: false, canParry: false },

  // Axes
  { name: 'Battle Axe',    damage: '1d8+1',  defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 2, hitPoints: 8,  minSTR: 9,  minDEX: 7,  cost: 30,  isMissile: false, canParry: true },
  { name: 'Great Axe',     damage: '2d6+2',  defaultSkill: 'Two-Handed Weapon', strikeRank: 4, encumbrance: 2, hitPoints: 10, minSTR: 13, minDEX: 9,  cost: 50,  isMissile: false, canParry: false },
  { name: 'Hand Axe',      damage: '1d6',    defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 6,  minSTR: 7,  minDEX: 5,  cost: 20,  isMissile: false, canParry: true },

  // Polearms & Spears
  { name: 'Spear',         damage: '1d6+1',  defaultSkill: 'Spear',             strikeRank: 3, encumbrance: 2, hitPoints: 10, minSTR: 9,  minDEX: 7,  cost: 20,  isMissile: false, canParry: true },
  { name: '2H Spear',      damage: '1d10+1', defaultSkill: 'Spear',             strikeRank: 3, encumbrance: 2, hitPoints: 12, minSTR: 11, minDEX: 9,  cost: 25,  isMissile: false, canParry: false },
  { name: 'Javelin',       damage: '1d10',   defaultSkill: 'Spear',             strikeRank: 2, encumbrance: 1, hitPoints: 8,  minSTR: 9,  minDEX: 7,  cost: 15,  isMissile: true,  range: '20/40/-',    rateOfFire: 1, canParry: false },
  { name: 'Halberd',       damage: '3d6',    defaultSkill: 'Two-Handed Weapon', strikeRank: 4, encumbrance: 3, hitPoints: 12, minSTR: 11, minDEX: 9,  cost: 45,  isMissile: false, canParry: false },
  { name: 'Pike Axe',      damage: '1d10',   defaultSkill: 'Spear',             strikeRank: 4, encumbrance: 2, hitPoints: 10, minSTR: 11, minDEX: 7,  cost: 35,  isMissile: false, canParry: false },

  // Bows & Ranged
  { name: 'Self Bow',      damage: '1d6+1',  defaultSkill: 'Bow',               strikeRank: 3, encumbrance: 1, hitPoints: 7,  minSTR: 7,  minDEX: 9,  cost: 20,  isMissile: true,  range: '50/100/150', rateOfFire: 2, canParry: false },
  { name: 'Composite Bow', damage: '2d6+1',  defaultSkill: 'Bow',               strikeRank: 3, encumbrance: 2, hitPoints: 10, minSTR: 9,  minDEX: 9,  cost: 150, isMissile: true,  range: '80/160/320', rateOfFire: 1, canParry: false },
  { name: 'Sling',         damage: '1d8',    defaultSkill: 'Sling',             strikeRank: 3, encumbrance: 1, hitPoints: 0,  minSTR: 5,  minDEX: 7,  cost: 5,   isMissile: true,  range: '50/100/150', rateOfFire: 1, canParry: false },
  { name: 'Crossbow',      damage: '2d6',    defaultSkill: 'Bow',               strikeRank: 4, encumbrance: 2, hitPoints: 8,  minSTR: 7,  minDEX: 7,  cost: 75,  isMissile: true,  range: '60/120/200', rateOfFire: 1, canParry: false },

  // Clubs, Maces & Flails
  { name: 'Club',          damage: '1d6',    defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 1, hitPoints: 20, minSTR: 9,  minDEX: 5,  cost: 5,   isMissile: false, canParry: true },
  { name: 'Mace',          damage: '1d8',    defaultSkill: 'Sword & Shield',    strikeRank: 3, encumbrance: 2, hitPoints: 10, minSTR: 9,  minDEX: 5,  cost: 25,  isMissile: false, canParry: true },
  { name: 'War Maul',      damage: '2d6',    defaultSkill: 'Two-Handed Weapon', strikeRank: 5, encumbrance: 2, hitPoints: 20, minSTR: 11, minDEX: 7,  cost: 30,  isMissile: false, canParry: false },
  { name: 'Quarterstaff',  damage: '1d8',    defaultSkill: 'Two-Handed Weapon', strikeRank: 3, encumbrance: 2, hitPoints: 20, minSTR: 9,  minDEX: 9,  cost: 5,   isMissile: false, canParry: true },

  // Daggers & Knives
  { name: 'Dagger',        damage: '1d4+2',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 6,  minSTR: 5,  minDEX: 5,  cost: 10,  isMissile: false, canParry: true },
  { name: 'Main Gauche',   damage: '1d4+2',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 1, hitPoints: 8,  minSTR: 7,  minDEX: 13, cost: 35,  isMissile: false, canParry: true },
  { name: 'Knife',         damage: '1d3+2',  defaultSkill: 'Sword & Shield',    strikeRank: 2, encumbrance: 0, hitPoints: 4,  minSTR: 3,  minDEX: 5,  cost: 5,   isMissile: false, canParry: true },

  // Unarmed
  { name: 'Fist',          damage: '1d3',    defaultSkill: 'Unarmed',           strikeRank: 3, encumbrance: 0, hitPoints: 0,  minSTR: 0,  minDEX: 0,  cost: 0,   isMissile: false, canParry: false },
  { name: 'Kick',          damage: '1d6',    defaultSkill: 'Unarmed',           strikeRank: 3, encumbrance: 0, hitPoints: 0,  minSTR: 0,  minDEX: 0,  cost: 0,   isMissile: false, canParry: false },
  { name: 'Grapple',       damage: 'Special',defaultSkill: 'Unarmed',           strikeRank: 3, encumbrance: 0, hitPoints: 0,  minSTR: 0,  minDEX: 0,  cost: 0,   isMissile: false, canParry: false }
];

// RQ2 shields (RuneQuest Classic Mechanics Reference, Shield Statistics): shields grant a
// parry bonus and absorb damage with their HP when parrying — they do not armor locations.
export const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Small Shield',  armorPoints: 0, hitPoints: 9,  encumbrance: 1, cost: 15, protectedLocations: [], parryBonus: 15 },
  { name: 'Medium Shield', armorPoints: 0, hitPoints: 12, encumbrance: 2, cost: 20, protectedLocations: [], parryBonus: 20 },
  { name: 'Large Shield',  armorPoints: 0, hitPoints: 15, encumbrance: 2, cost: 25, protectedLocations: [], parryBonus: 25 }
];

// RQ2 armor values (RuneQuest Classic Mechanics Reference, Armor Statistics table)
export const ARMOR_TYPES = [
  { name: 'None',         points: 0 },
  { name: 'Leather',      points: 1 },
  { name: 'Ring Mail',    points: 2 },
  { name: 'Scale Mail',   points: 3 },
  { name: 'Chain Mail',   points: 4 },
  { name: 'Bronze Plate', points: 4 },
  { name: 'Plate Mail',   points: 5 },
];

export function getSizeModifier(siz: number): number {
  if (siz >= 22) return 0;
  if (siz >= 15) return 1;
  if (siz >= 7) return 2;
  return 3;
}

// RQ2 DEX strike rank modifier table: lower SR = acts sooner
export function getDexterityModifier(dex: number): number {
  if (dex >= 19) return -1;
  if (dex >= 16) return 0;
  if (dex >= 13) return 1;
  if (dex >= 9)  return 2;
  if (dex >= 6)  return 3;
  return 4;
}

// RQ2 hit location HP lookup table (RuneQuest Classic Mechanics Reference, p.3)
const HIT_LOCATION_TABLE: Array<{ maxHP: number; head: number; arm: number; abdomen: number; chest: number; leg: number }> = [
  { maxHP:  3, head: 1, arm: 1, abdomen: 2, chest: 2, leg: 2 },
  { maxHP:  6, head: 2, arm: 2, abdomen: 3, chest: 3, leg: 3 },
  { maxHP:  9, head: 3, arm: 3, abdomen: 4, chest: 4, leg: 4 },
  { maxHP: 12, head: 4, arm: 3, abdomen: 4, chest: 5, leg: 5 },
  { maxHP: 15, head: 5, arm: 4, abdomen: 5, chest: 6, leg: 6 },
  { maxHP: 18, head: 6, arm: 5, abdomen: 6, chest: 7, leg: 7 },
  { maxHP: 21, head: 7, arm: 5, abdomen: 7, chest: 8, leg: 8 },
];

export function calculateHitLocations(totalHP: number): HitLocations {
  const row = HIT_LOCATION_TABLE.find(r => totalHP <= r.maxHP) ?? HIT_LOCATION_TABLE[HIT_LOCATION_TABLE.length - 1];
  return {
    'Right Leg': row.leg,
    'Left Leg': row.leg,
    'Abdomen': row.abdomen,
    'Chest': row.chest,
    'Right Arm': row.arm,
    'Left Arm': row.arm,
    'Head': row.head,
  };
}

export function canWeaponParry(weaponName: string): boolean {
  const weapon = WEAPON_LIST.find(w => w.name === weaponName);
  return weapon?.canParry ?? false;
}
