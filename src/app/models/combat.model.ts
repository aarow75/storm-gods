export interface Monster {
  id: string;
  name: string;
  hitPoints: number;
  strikeRank: number;
  armor: number;
  weapons: MonsterWeapon[];
  color?: string;
}

export interface MonsterWeapon {
  name: string;
  damage: string;
  strikeRankModifier: number;
}

export interface CombatParticipant {
  id: string;
  name: string;
  type: 'character' | 'monster';
  characterId?: string;
  monsterId?: string;
  maxHitPoints: number;
  currentHitPoints: boolean[]; // Array of checkboxes for tracking HP
  baseStrikeRank: number;
  selectedWeapon?: string;
  finalStrikeRank: number;
  selectedOpponentId?: string;
  isDead?: boolean;
  kills?: number;
  color?: string;
}

export interface CombatLogEntry {
  timestamp: number;
  date: string;
  entries: string[];
}

export interface WeaponStrikeRankModifier {
  [weaponName: string]: number;
}

// Strike rank modifiers by weapon type (from RQ rules)
export const WEAPON_STRIKE_RANKS: WeaponStrikeRankModifier = {
  // Swords
  'Broadsword': 2,
  'Shortsword': 2,
  'Greatsword': 1,
  'Scimitar': 2,

  // Axes
  'Battle Axe': 1,
  'Great Axe': 0,
  'Hand Axe': 2,

  // Polearms
  'Spear': 3,
  'Javelin': 3,
  'Halberd': 1,
  'Pike': 4,

  // Bows & Ranged
  'Shortbow': 3,
  'Longbow': 2,
  'Composite Bow': 2,
  'Sling': 3,
  'Staff Sling': 2,

  // Clubs & Hammers
  'Club': 2,
  'Mace': 1,
  'War Hammer': 1,
  'Maul': 0,

  // Daggers
  'Dagger': 3,
  'Main Gauche': 3,

  // Unarmed
  'Fist': 3,
  'Kick': 2,
  'Grapple': 2
};

// Default monsters for RuneQuest
export const DEFAULT_MONSTERS: Monster[] = [
  {
    id: 'broo-1',
    name: 'Broo Warrior',
    hitPoints: 11,
    strikeRank: 12,
    armor: 2,
    weapons: [
      { name: 'Shortsword', damage: '1d6+1', strikeRankModifier: 2 },
      { name: 'Spear', damage: '1d8+1', strikeRankModifier: 3 },
      { name: 'Club', damage: '1d6', strikeRankModifier: 2 }
    ]
  },
  {
    id: 'troll-1',
    name: 'Dark Troll',
    hitPoints: 14,
    strikeRank: 10,
    armor: 3,
    weapons: [
      { name: 'Battle Axe', damage: '1d8+2+1d4', strikeRankModifier: 1 },
      { name: 'Great Axe', damage: '3d6+1d4', strikeRankModifier: 0 },
      { name: 'Fist', damage: '1d3+1d4', strikeRankModifier: 3 }
    ]
  },
  {
    id: 'scorpion-man-1',
    name: 'Scorpion Man',
    hitPoints: 16,
    strikeRank: 14,
    armor: 5,
    weapons: [
      { name: 'Spear', damage: '1d8+1+1d6', strikeRankModifier: 3 },
      { name: 'Shortsword', damage: '1d6+1+1d6', strikeRankModifier: 2 },
      { name: 'Sting', damage: '1d6+1d6+poison', strikeRankModifier: 1 }
    ]
  },
  {
    id: 'duck-1',
    name: 'Durulz Warrior',
    hitPoints: 8,
    strikeRank: 14,
    armor: 1,
    weapons: [
      { name: 'Shortsword', damage: '1d6+1', strikeRankModifier: 2 },
      { name: 'Sling', damage: '1d6', strikeRankModifier: 3 },
      { name: 'Dagger', damage: '1d4+2', strikeRankModifier: 3 }
    ]
  },
  {
    id: 'ghost-1',
    name: 'Ghost',
    hitPoints: 10,
    strikeRank: 15,
    armor: 0,
    weapons: [
      { name: 'Spirit Combat', damage: '1d6', strikeRankModifier: 0 },
      { name: 'Fear Attack', damage: 'Special', strikeRankModifier: 1 }
    ]
  },
  {
    id: 'skeleton-1',
    name: 'Skeleton Warrior',
    hitPoints: 9,
    strikeRank: 11,
    armor: 0,
    weapons: [
      { name: 'Shortsword', damage: '1d6+1', strikeRankModifier: 2 },
      { name: 'Spear', damage: '1d8+1', strikeRankModifier: 3 },
      { name: 'Bow', damage: '1d6+1', strikeRankModifier: 3 }
    ]
  }
];
