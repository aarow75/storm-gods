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
  hitPoints?: number;
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
  selectedParryItem?: string; // weapon or shield name for parrying
  finalStrikeRank: number;
  selectedOpponentId?: string;
  isDead?: boolean;
  kills?: number;
  color?: string;
  locationDamage?: { [location: string]: number };
  attacksUsed?: number;    // shots fired this round (for missile rate-of-fire tracking)
  parriesAgainst?: { [attackerId: string]: number }; // parry attempts vs each attacker this round
}

export interface CombatLogEntry {
  timestamp: number;
  date: string;
  entries: string[];
}

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
