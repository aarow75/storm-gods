import { CharacterStats } from '@shared/models/character-stats.model';

export type { CharacterStats };

export interface MonsterAttack {
  name: string;
  damage: string;
  skill: number;
}

export interface HitLocationEntry {
  name: string;
  weight: number;
}

export interface HitLocationTemplate {
  id: string;
  label: string;
  locations: HitLocationEntry[];
}

export interface Monster {
  id: string;
  name: string;
  gameSystem: 'runequest' | 'dragonbane' | 'both';
  category: 'humanoid' | 'beast' | 'undead' | 'chaos' | 'dragon' | 'spirit' | 'npc' | 'mount';
  description: string;
  stats: CharacterStats;
  hitPoints: number;
  armor: number;
  armorDescription: string;
  movement: number;
  attacks: MonsterAttack[];
  specialAbilities?: string[];
  isCustom?: boolean;
  strikeRank?: number;
  terrain?: string[];
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
  hitLocationTemplateId?: string;
}

export function calculateMonsterHitLocations(
  con: number,
  siz: number,
  template: HitLocationTemplate
): { name: string; hp: number }[] {
  const totalHP = Math.round((con + siz) / 2);
  return template.locations.map(entry => ({
    name: entry.name,
    hp: Math.max(1, Math.round(totalHP * entry.weight)),
  }));
}
