import { CharacterStats } from '@shared/models/character-stats.model';
import { GameSystem } from '@shared/models/game-system.model';
import { getRulesForSystem } from '@shared/rules/game-system-rules.factory';

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
  gameSystem: 'runequest' | 'dragonbane' | 'kal-arath' | 'osric' | 'mothership';
  gameSystems?: ('runequest' | 'dragonbane' | 'kal-arath' | 'osric' | 'mothership')[];
  category: 'humanoid' | 'beast' | 'undead' | 'chaos' | 'dragon' | 'spirit' | 'npc' | 'mount';
  description: string;
  stats: CharacterStats;
  hitPoints: number;
  // Meaning follows the entry's native gameSystem: damage-reduction points
  // (RuneQuest/Dragonbane/Kal-Arath), descending AC (OSRIC), or Armor Save %
  // (Mothership). Use getMonsterCombatArmor() when adding to another system's combat.
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

/**
 * Armor value to use when this monster enters combat under the given system.
 * Entries authored for the system keep their value as-is. Shared multi-system
 * entries store RuneQuest-style damage-reduction points (0-8); when they enter
 * an AC-based system's combat, convert to descending AC (10 = unarmored).
 */
export function getMonsterCombatArmor(monster: Monster, system: GameSystem): number {
  if (monster.gameSystem === system) return monster.armor;
  const model = getRulesForSystem(system).getArmorModel?.();
  if (model?.kind === 'ac') return Math.max(-2, 10 - monster.armor);
  return monster.armor;
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
