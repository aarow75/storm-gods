import { CombatMonster, CombatParticipant, MonsterWeapon } from '@shared/models/combat-participant.model';

// Re-export under existing names so combat-feature code doesn't need updating
export type Monster = CombatMonster;
export type { CombatMonster, CombatParticipant, MonsterWeapon };

export interface CombatLogEntry {
  timestamp: number;
  date: string;
  entries: string[];
}

export interface CombatPosition {
  x: number;
  y: number;
}

export type DungeonTokenType =
  | 'door' | 'stairs-up' | 'stairs-down' | 'chest'
  | 'trap' | 'fire' | 'altar' | 'pillar' | 'pit' | 'barrel';

export interface DungeonTokenDefinition {
  id: DungeonTokenType;
  label: string;
  symbol: string;
  defaultColor: string;
}

export const DUNGEON_TOKEN_DEFS: DungeonTokenDefinition[] = [
  { id: 'door',        label: 'Door',       symbol: '⛩', defaultColor: '#8B4513' },
  { id: 'stairs-up',   label: 'Stairs Up',  symbol: '▲', defaultColor: '#4682B4' },
  { id: 'stairs-down', label: 'Stairs Down', symbol: '▼', defaultColor: '#4682B4' },
  { id: 'chest',       label: 'Chest',      symbol: '◈', defaultColor: '#DAA520' },
  { id: 'trap',        label: 'Trap',       symbol: '⊗', defaultColor: '#DC2626' },
  { id: 'fire',        label: 'Fire',       symbol: '✶', defaultColor: '#F97316' },
  { id: 'altar',       label: 'Altar',      symbol: '✙', defaultColor: '#7C3AED' },
  { id: 'pillar',      label: 'Pillar',     symbol: '◉', defaultColor: '#6B7280' },
  { id: 'pit',         label: 'Pit',        symbol: '⊙', defaultColor: '#1F2937' },
  { id: 'barrel',      label: 'Barrel',     symbol: '⊕', defaultColor: '#92400E' },
];

export interface DungeonToken {
  type: DungeonTokenType;
  color: string;
}

export interface CombatMapState {
  positions: Record<string, CombatPosition>;
  movedThisRound: string[];
  walls?: Record<string, 'black' | 'brown'>; // key: "x,y"
  dungeonTokens?: Record<string, DungeonToken>; // key: "x,y"
}

export interface CombatMapTemplate {
  id: string;
  name: string;
  createdAt: number;
  walls: Record<string, 'black' | 'brown'>;
  dungeonTokens: Record<string, DungeonToken>;
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
