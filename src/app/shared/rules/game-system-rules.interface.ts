import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, CharacterBackground } from '@characters/models/character.model';

export interface StatDefinition {
  key: keyof CharacterStats;
  label: string;
  visible: boolean;
}

export interface ConditionDefinition {
  name: string;
  effect: string;
}

export interface SkillDefinition {
  name: string;
  defaultValue: number;
  attribute?: string;
}

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ArmorTypeDefinition {
  name: string;
  points: number;
}

export interface GameSystemRules {
  /** Which stats exist and how to display them for this system. */
  getStatDefinitions(): StatDefinition[];

  /** Calculate all derived stats from character data. */
  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[]
  ): DerivedStats;

  /** Whether this system uses per-location hit points. */
  usesHitLocations(): boolean;

  /** Calculate per-location HP. Returns null when usesHitLocations() is false. */
  calculateHitLocations(stats: CharacterStats): HitLocations | null;

  /** All skills defined for this system. */
  getSkillDefinitions(): SkillDefinition[];

  /** Default starting skill values for a new character. */
  getDefaultSkills(): Record<string, number>;

  /** Skill categories and which skills belong to each. */
  getSkillCategories(): SkillCategory[];

  /** Per-category modifiers derived from characteristics (e.g. RQ2 category bonuses). */
  calculateSkillCategoryModifiers(stats: CharacterStats): Record<string, number>;

  /** Apply occupation, homeland, and cult bonuses to a skill set. */
  applyBackgroundBonuses(
    skills: Record<string, number>,
    background: Pick<CharacterBackground, 'occupation' | 'homeland' | 'cult'>
  ): Record<string, number>;

  /** Weapon definitions available for this system. */
  getWeaponList(): WeaponDefinition[];

  /** Shield definitions available for this system. */
  getShieldList(): ShieldDefinition[];

  /** Armor type options and their protection values. */
  getArmorTypes(): ArmorTypeDefinition[];

  /** Combat/status conditions available for this system. */
  getConditions(): ConditionDefinition[];

  /** Identifier for the magic system used by this game system. */
  getMagicSystemType(): string;
}
