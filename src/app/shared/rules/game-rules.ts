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

export const ARMOR_TYPES = [
  { name: 'None',             points: 0 },
  { name: 'Leather',          points: 1 },
  { name: 'Studded Leather',  points: 2 },
  { name: 'Heavy Leather',    points: 2 },
  { name: 'Ring Mail',        points: 3 },
  { name: 'Scale Mail',       points: 4 },
  { name: 'Chain Mail',       points: 5 },
  { name: 'Plate Mail',       points: 6 }
];

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

export function canWeaponParry(weaponName: string): boolean {
  const weapon = WEAPON_LIST.find(w => w.name === weaponName);
  return weapon?.canParry ?? false;
}
