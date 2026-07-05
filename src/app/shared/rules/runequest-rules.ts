import { CharacterStats } from '@shared/models/character-stats.model';
import { RUNEQUEST_NAMES } from '@characters/constants/runequest-names.constants';
import {
  WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield,
  WEAPON_LIST, SHIELD_LIST, ARMOR_TYPES,
  getSizeModifier, getDexterityModifier, calculateHitLocations as rqCalculateHitLocations
} from '@shared/rules/game-rules';
import {
  DerivedStats, EquipmentItem, CharacterBackground, Resources,
  calculateDerivedStats as rqCalculateDerivedStats,
  calculateSkillCategoryModifiers as rqCalculateSkillCategoryModifiers,
  applySkillBonuses as rqApplySkillBonuses,
  getSizHPModifier, getPowHPModifier, getCharacteristicModifier,
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
    // RQ2: Total HP = CON + HP modifier(SIZ) + HP modifier(POW)
    const totalHP = Math.max(1, stats.CON + getSizHPModifier(stats.SIZ) + getPowHPModifier(stats.POW));
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

  getCharacterNames(): string[] {
    return RUNEQUEST_NAMES;
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

  // RQ2 Damage Results: at 0 location HP, limbs go useless and vital locations knock the
  // character out (dying in 1d6 rounds); `fatal` locations kill only at −(location max),
  // i.e. once total damage to the location reaches double its HP.
  getLocationEffects(): Record<string, { label: string; fatal: boolean }> {
    return {
      'Head':      { label: 'Unconscious — dies in 1d6 rounds without healing', fatal: true  },
      'Chest':     { label: 'Unconscious — dies in 1d6 rounds without healing', fatal: true  },
      'Abdomen':   { label: 'Unconscious — dies in 1d6 rounds without healing', fatal: true  },
      'Right Arm': { label: 'Arm Useless', fatal: false },
      'Left Arm':  { label: 'Arm Useless', fatal: false },
      'Right Leg': { label: 'Leg Useless', fatal: false },
      'Left Leg':  { label: 'Leg Useless', fatal: false },
    };
  }

  getHitLocationsDisplayOrder(): string[] {
    return ['Head', 'Right Arm (Weapon)', 'Chest', 'Left Arm (Shield)', 'Abdomen', 'Right Leg', 'Left Leg'];
  }

  // RQ2 Attack/Parry/Defense modifiers all use the same DEX-based table
  // (RuneQuest Classic Mechanics Reference, Ability Modifier Tables).
  getAttackBonuses(stats: CharacterStats): { attack: number; parry: number; dodge: number } {
    const dexMod = getCharacteristicModifier(stats.DEX ?? 10);
    return { attack: dexMod, parry: dexMod, dodge: dexMod };
  }

  getParryRepeatPenalty(): number {
    return 20;
  }

  usesParryDodge(): boolean { return true; }
  usesWeaponHP(): boolean { return true; }

  getMagicSystemType(): string {
    return 'runequest';
  }

  getCurrencyLabel(): string {
    return 'L';
  }

  getSystemName(): string { return 'RuneQuest'; }
  getStatRange(): { min: number; max: number } { return { min: 1, max: 30 }; }
  canRollStats(): boolean { return true; }

  // RQ2 characteristic generation: 3D6 for most stats, 2D6+6 for SIZ and INT
  rollStat(stat: keyof CharacterStats): number {
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    if (stat === 'SIZ' || stat === 'INT') return d6() + d6() + 6;
    return d6() + d6() + d6();
  }
  showsMagicPoints(): boolean { return true; }
  getMagicPointsLabel(): string { return 'Magic Points'; }
  showsDamageBonus(): boolean { return true; }
  getDamageBonusLabel(): string { return 'Damage Bonus'; }
  showsHealingRate(): boolean { return true; }
  getHealingRateLabel(): string { return 'Healing Rate'; }
  showsMovementRate(): boolean { return true; }

  getEncumbrancePenaltyText(derivedStats: DerivedStats): string {
    return `-${derivedStats.encumbranceDefensePenalty}% Dodge`;
  }

  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[] {
    return [
      { key: 'wheels',     label: 'Wheels (2 Gold)' },
      { key: 'lunars',     label: 'Lunars (Silver)' },
      { key: 'clacks',     label: 'Clacks (Copper)' },
      { key: 'reputation', label: 'Reputation' },
      { key: 'ransom',     label: 'Ransom' },
    ];
  }

  getPrimaryWealthAmount(resources: Resources): number {
    return (resources.wheels ?? 0) * 20 + (resources.lunars ?? 0) + (resources.clacks ?? 0) / 10;
  }

  weaponSkillIsFixed(): boolean { return false; }
  weaponHasSelectableSkill(): boolean { return true; }
  getDefaultStats(): CharacterStats { return { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 10, CHA: 10 }; }
  getArmorHint(): string { return ''; }
}
