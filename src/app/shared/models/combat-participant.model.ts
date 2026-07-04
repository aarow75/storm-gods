export interface MonsterWeapon {
  name: string;
  damage: string;
  strikeRankModifier: number;
  hitPoints?: number;
}

/** Lightweight monster record used within active combat (distinct from the bestiary Monster). */
export interface CombatMonster {
  id: string;
  name: string;
  hitPoints: number;
  strikeRank: number;
  armor: number;
  weapons: MonsterWeapon[];
  color?: string;
}

export interface CombatParticipant {
  id: string;
  name: string;
  type: 'character' | 'monster';
  characterId?: string;
  monsterId?: string;
  maxHitPoints: number;
  currentHitPoints: boolean[];
  baseStrikeRank: number;
  selectedWeapon?: string;
  selectedParryItem?: string;
  finalStrikeRank: number;
  selectedOpponentId?: string;
  isDead?: boolean;
  kills?: number;
  color?: string;
  locationDamage?: { [location: string]: number };
  attacksUsed?: number;
  parriesAgainst?: { [attackerId: string]: number };
  distanceToOpponent?: number;
  movementThisRound?: number;
  isSurprised?: boolean;
  effectiveSR?: number;
  movementRate?: number;
  // Rolled initiative (non-strike-rank systems). Absent on strike-rank systems
  // and in saves created before initiative rolls existed; sorting falls back
  // to effectiveSR/finalStrikeRank when initiativeOrder is missing.
  initiativeRoll?: number;
  initiativeOrder?: number;    // normalized ascending sort key; lower acts first
  initiativeDisplay?: string;  // human-readable result, e.g. "Card 3", "d6+2 = 5"
}
