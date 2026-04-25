export interface MonsterAttack {
  name: string;
  damage: string;
  skill: number;
}

export interface Monster {
  id: string;
  name: string;
  gameSystem: 'runequest' | 'dragonbane' | 'both';
  category: 'humanoid' | 'beast' | 'undead' | 'chaos' | 'dragon' | 'spirit';
  description: string;
  stats: {
    STR: number;
    CON: number;
    SIZ: number;
    DEX: number;
    INT: number;
    POW: number;
    CHA: number;
  };
  hitPoints: number;
  armor: number;
  armorDescription: string;
  movement: number;
  attacks: MonsterAttack[];
  specialAbilities?: string[];
  isCustom?: boolean;
  strikeRank?: number;
}
