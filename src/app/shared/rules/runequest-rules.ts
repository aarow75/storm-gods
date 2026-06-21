import { CharacterStats } from '@shared/models/character-stats.model';
import {
  WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield,
  WEAPON_LIST, SHIELD_LIST, ARMOR_TYPES,
  getSizeModifier, getDexterityModifier, calculateHitLocations as rqCalculateHitLocations
} from '@shared/rules/game-rules';
import {
  DerivedStats, EquipmentItem, CharacterBackground,
  calculateDerivedStats as rqCalculateDerivedStats,
  calculateSkillCategoryModifiers as rqCalculateSkillCategoryModifiers,
  applySkillBonuses as rqApplySkillBonuses,
  getConHPModifier, getPowHPModifier,
  DEFAULT_SKILLS, COMBAT_SKILLS,
  OCCUPATION_SKILL_BONUSES, HOMELAND_SKILL_BONUSES, CULT_SKILL_BONUSES
} from '@characters/models/character.model';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses
} from './game-system-rules.interface';

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Prone',    effect: 'Melee attackers +20%, ranged attackers -20%' },
  { name: 'Blinded',  effect: '-50% to all skills except close combat' },
  { name: 'Poisoned', effect: 'Varies by poison; often damage/round or -skill modifier' },
  { name: 'Stunned',  effect: 'Cannot act; roll CON to recover' },
  { name: 'Fatigued', effect: '-5% per fatigue level; can only cast 1 spell/round' },
  { name: 'Confused', effect: 'Cannot take effective actions; react randomly' },
];

const SKILL_DEFINITIONS: SkillDefinition[] = [
  { name: 'Sword & Shield',    defaultValue: 15 },
  { name: 'Two-Handed Weapon', defaultValue: 10 },
  { name: 'Spear',             defaultValue: 10 },
  { name: 'Bow',               defaultValue: 5  },
  { name: 'Sling',             defaultValue: 5  },
  { name: 'Unarmed',           defaultValue: 25 },
  { name: 'Shield',            defaultValue: 15 },
  { name: 'Spirit Combat',     defaultValue: 20 },
  { name: 'Sorcery',           defaultValue: 0  },
  { name: 'Rune Magic',        defaultValue: 0  },
  { name: 'Lore (World)',      defaultValue: 15 },
  { name: 'Lore (Animal)',     defaultValue: 5  },
  { name: 'Lore (Plant)',      defaultValue: 5  },
  { name: 'Speak (Native)',    defaultValue: 50 },
  { name: 'Speak (Other)',     defaultValue: 0  },
  { name: 'Read/Write',        defaultValue: 0  },
  { name: 'Craft',             defaultValue: 10 },
  { name: 'Farm',              defaultValue: 10 },
  { name: 'Heal',              defaultValue: 10 },
  { name: 'Listen',            defaultValue: 25 },
  { name: 'Scan',              defaultValue: 25 },
  { name: 'Search',            defaultValue: 25 },
  { name: 'Track',             defaultValue: 5  },
  { name: 'Hide',              defaultValue: 10 },
  { name: 'Move Quietly',      defaultValue: 10 },
  { name: 'Climb',             defaultValue: 40 },
  { name: 'Dodge',             defaultValue: 20 },
  { name: 'Ride',              defaultValue: 5  },
  { name: 'Swim',              defaultValue: 15 },
];

const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'Combat Skills',       skills: COMBAT_SKILLS },
  { name: 'Magic Skills',        skills: ['Spirit Combat', 'Sorcery', 'Rune Magic'] },
  { name: 'Knowledge Skills',    skills: ['Lore (World)', 'Lore (Animal)', 'Lore (Plant)'] },
  { name: 'Communication Skills',skills: ['Speak (Native)', 'Speak (Other)', 'Read/Write'] },
  { name: 'Manipulation Skills', skills: ['Craft', 'Farm', 'Heal'] },
  { name: 'Perception Skills',   skills: ['Listen', 'Scan', 'Search', 'Track'] },
  { name: 'Stealth Skills',      skills: ['Hide', 'Move Quietly'] },
  { name: 'Agility Skills',      skills: ['Climb', 'Dodge', 'Ride', 'Swim'] },
];

const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',      visible: true },
  { key: 'CON', label: 'CON (Constitution)',  visible: true },
  { key: 'SIZ', label: 'SIZ (Size)',          visible: true },
  { key: 'DEX', label: 'DEX (Dexterity)',     visible: true },
  { key: 'INT', label: 'INT (Intelligence)',  visible: true },
  { key: 'POW', label: 'POW (Power)',         visible: true },
  { key: 'CHA', label: 'CHA (Charisma)',      visible: true },
];

export class RuneQuestRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[],
    _background?: BackgroundForBonuses,
    _armorType?: string
  ): DerivedStats {
    return rqCalculateDerivedStats(stats, equipment, weapons, shields);
  }

  usesHitLocations(): boolean {
    return true;
  }

  calculateHitLocations(stats: CharacterStats): HitLocations {
    const totalHP = Math.max(1, stats.SIZ + getConHPModifier(stats.CON) + getPowHPModifier(stats.POW));
    return rqCalculateHitLocations(totalHP);
  }

  getSkillDefinitions(): SkillDefinition[] {
    return SKILL_DEFINITIONS;
  }

  getDefaultSkills(): Record<string, number> {
    return { ...DEFAULT_SKILLS };
  }

  getSkillCategories(): SkillCategory[] {
    return SKILL_CATEGORIES;
  }

  calculateSkillCategoryModifiers(stats: CharacterStats): Record<string, number> {
    return rqCalculateSkillCategoryModifiers(stats);
  }

  applyBackgroundBonuses(
    skills: Record<string, number>,
    background: Pick<CharacterBackground, 'occupation' | 'homeland' | 'cult' | 'age'>,
    _stats?: CharacterStats
  ): Record<string, number> {
    return rqApplySkillBonuses(
      skills as any,
      background.occupation,
      background.homeland,
      background.cult
    );
  }

  getWeaponList(): WeaponDefinition[] {
    return WEAPON_LIST;
  }

  getShieldList(): ShieldDefinition[] {
    return SHIELD_LIST;
  }

  getArmorTypes(): ArmorTypeDefinition[] {
    return ARMOR_TYPES;
  }

  getConditions(): ConditionDefinition[] {
    return CONDITIONS;
  }

  usesStrikeRank(): boolean {
    return true;
  }

  getInitiativeLabel(): string {
    return 'Strike Rank';
  }

  getMovementInitiativeCost(meters: number): number {
    if (!meters || meters <= 0) return 0;
    return Math.ceil(meters / 3);
  }

  getSurpriseInitiativePenalty(distanceMeters: number): number {
    if (distanceMeters <= 3) return 3;
    return 1;
  }

  getHitLocationRollTable(): Record<number, string> {
    return {
      1: 'Right Leg', 2: 'Right Leg', 3: 'Right Leg', 4: 'Right Leg',
      5: 'Left Leg',  6: 'Left Leg',  7: 'Left Leg',  8: 'Left Leg',
      9: 'Abdomen',  10: 'Abdomen',  11: 'Abdomen',
      12: 'Chest',
      13: 'Right Arm', 14: 'Right Arm', 15: 'Right Arm',
      16: 'Left Arm',  17: 'Left Arm',  18: 'Left Arm',
      19: 'Head', 20: 'Head',
    };
  }

  getLocationEffects(): Record<string, { label: string; fatal: boolean }> {
    return {
      'Head':      { label: 'Instant Death', fatal: true  },
      'Chest':     { label: 'Incapacitated', fatal: false },
      'Abdomen':   { label: 'Incapacitated', fatal: false },
      'Right Arm': { label: 'Arm Useless',   fatal: false },
      'Left Arm':  { label: 'Arm Useless',   fatal: false },
      'Right Leg': { label: 'Leg Useless',   fatal: false },
      'Left Leg':  { label: 'Leg Useless',   fatal: false },
    };
  }

  getHitLocationsDisplayOrder(): string[] {
    return ['Head', 'Right Arm (Weapon)', 'Chest', 'Left Arm (Shield)', 'Abdomen', 'Right Leg', 'Left Leg'];
  }

  getAttackBonuses(stats: CharacterStats): { attack: number; parry: number; dodge: number } {
    const str = stats.STR ?? 10;
    const siz = stats.SIZ ?? 10;
    const dex = stats.DEX ?? 10;
    const int = stats.INT ?? 10;
    const pow = stats.POW ?? 10;

    const attackStr = this.atkStr(str);
    const attackInt = this.atkInt(int);
    const attackPow = this.atkPow(pow);
    const attackDex = this.atkDex(dex);

    const parryStr = this.parStr(str);
    const parrySiz = this.parSiz(siz);
    const parryPow = this.parPow(pow);
    const parryDex = this.parDex(dex);

    return {
      attack: attackStr + attackInt + attackPow + attackDex,
      parry:  parryStr + parrySiz + parryPow + parryDex,
      dodge:  parryDex + attackInt,
    };
  }

  getParryRepeatPenalty(): number {
    return 20;
  }

  private atkStr(str: number): number {
    if (str <= 8)  return -5;
    if (str <= 12) return 0;
    if (str <= 16) return 5;
    if (str <= 20) return 10;
    return 10 + Math.floor((str - 20) / 4) * 5;
  }

  private atkInt(int: number): number {
    if (int <= 4)  return 0;
    if (int <= 8)  return -10;
    if (int <= 12) return -5;
    if (int <= 16) return 5;
    if (int <= 20) return 10;
    return 10 + Math.floor((int - 20) / 4) * 5;
  }

  private atkPow(pow: number): number {
    if (pow <= 12) return 0;
    if (pow <= 20) return 5;
    return 5 + Math.floor((pow - 20) / 4) * 5;
  }

  private atkDex(dex: number): number {
    if (dex <= 4)  return -10;
    if (dex <= 8)  return -5;
    if (dex <= 12) return 0;
    if (dex <= 16) return 5;
    if (dex <= 20) return 10;
    return 10 + Math.floor((dex - 20) / 4) * 5;
  }

  private parStr(str: number): number {
    if (str <= 4)  return -5;
    if (str <= 12) return 0;
    if (str <= 16) return 5;
    if (str <= 20) return 5;
    return 5 + Math.floor((str - 20) / 4) * 5;
  }

  private parSiz(siz: number): number {
    if (siz <= 4)  return 5;
    if (siz <= 16) return 0;
    if (siz <= 20) return -5;
    return -5 - Math.floor((siz - 20) / 4) * 5;
  }

  private parPow(pow: number): number {
    if (pow <= 4)  return -5;
    if (pow <= 12) return 0;
    if (pow <= 20) return 5;
    return 5 + Math.floor((pow - 20) / 4) * 5;
  }

  private parDex(dex: number): number {
    if (dex <= 4)  return -10;
    if (dex <= 8)  return -5;
    if (dex <= 12) return 0;
    if (dex <= 16) return 5;
    if (dex <= 20) return 10;
    return 10 + Math.floor((dex - 20) / 4) * 5;
  }

  getMagicSystemType(): string {
    return 'runequest';
  }

  getCurrencyLabel(): string {
    return 'L';
  }
}
