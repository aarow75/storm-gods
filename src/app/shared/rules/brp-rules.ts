import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, Resources } from '@characters/models/character.model';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses, ToHitMechanic,
  ArmorModel, InitiativeMechanic
} from './game-system-rules.interface';

// Basic Role-Playing (Chaosium, 1980 introductory booklet).
// Seven characteristics rolled on 3D6; hit points equal CON (single pool, no
// locations); everything resolves as D100 roll-under. Combat order is strict
// descending DEX, modeled as a computed "DEX rank" so the strike-rank sorting
// in the combat tracker yields highest-DEX-first.

const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',     visible: true },
  { key: 'CON', label: 'CON (Constitution)', visible: true },
  { key: 'SIZ', label: 'SIZ (Size)',         visible: true },
  { key: 'DEX', label: 'DEX (Dexterity)',    visible: true },
  { key: 'INT', label: 'INT (Intelligence)', visible: true },
  { key: 'POW', label: 'POW (Power)',        visible: true },
  { key: 'CHA', label: 'CHA (Charisma)',     visible: true },
];

// Starting percentages from the BRP weapon table (combat) and skill list.
const SKILL_DEFINITIONS: SkillDefinition[] = [
  { name: 'Fist',             defaultValue: 50 },
  { name: 'Mace',             defaultValue: 30 },
  { name: 'Axe',              defaultValue: 25 },
  { name: 'Spear',            defaultValue: 25 },
  { name: 'Sword',            defaultValue: 15 },
  { name: 'Rock',             defaultValue: 45 },
  { name: 'Javelin',          defaultValue: 20 },
  { name: 'Bow',              defaultValue: 10 },
  { name: 'Shield',           defaultValue: 25 },
  { name: 'Climbing',         defaultValue: 55 },
  { name: 'Hide',             defaultValue: 55 },
  { name: 'Jumping',          defaultValue: 45 },
  { name: 'Throw',            defaultValue: 45 },
  { name: 'Listening',        defaultValue: 45 },
  { name: 'First Aid',        defaultValue: 45 },
  { name: 'Spot Hidden Item', defaultValue: 25 },
  { name: 'Move Quietly',     defaultValue: 25 },
];

const COMBAT_SKILLS = ['Fist', 'Mace', 'Axe', 'Spear', 'Sword', 'Rock', 'Javelin', 'Bow', 'Shield'];

const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'Combat Skills', skills: COMBAT_SKILLS },
  {
    name: 'Adventuring Skills',
    skills: [
      'Climbing', 'Hide', 'Jumping', 'Throw', 'Listening',
      'First Aid', 'Spot Hidden Item', 'Move Quietly',
    ],
  },
];

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Unconscious', effect: 'At 1 HP or less; will not wake naturally — must be tended or given First Aid' },
  { name: 'Surprised',   effect: 'Attacker gets one free attack before the normal melee sequence' },
  { name: 'Impaled',     effect: 'Weapon stuck in body; pulling it out takes a full round and D100 ≤ impale chance ×2' },
  { name: 'Turned Away', effect: 'Cannot parry attacks from that foe; the attacker gains +20% to hit' },
  { name: 'Weapon Broken', effect: 'Parrying weapon took damage past its breakage points and is destroyed' },
];

// Armor subtracts its points from every hit that lands.
const ARMOR_TYPES: ArmorTypeDefinition[] = [
  { name: 'None',                  points: 0 },
  { name: 'Leather',               points: 2 },
  { name: 'Ring Mail',             points: 4 },
  { name: 'Ring Mail over Leather', points: 6 },
  { name: 'Plate',                 points: 6 },
];

// From the BRP weapons table. `hitPoints` holds the weapon's breakage points;
// `strikeRank` is 0 because order is pure DEX. Prices are not given in the
// booklet, so costs are plausible silver-piece values.
const WEAPON_LIST: WeaponDefinition[] = [
  { name: 'Fist',           damage: '1d3',   defaultSkill: 'Fist',    strikeRank: 0, encumbrance: 0, hitPoints: 0,  minSTR: 0, minDEX: 0, cost: 0,   isMissile: false,               canParry: false },
  { name: 'Mace',           damage: '1d6+2', defaultSkill: 'Mace',    strikeRank: 0, encumbrance: 1, hitPoints: 20, minSTR: 0, minDEX: 0, cost: 30,  isMissile: false,               canParry: true  },
  { name: 'Axe',            damage: '1d8+2', defaultSkill: 'Axe',     strikeRank: 0, encumbrance: 1, hitPoints: 15, minSTR: 0, minDEX: 0, cost: 50,  isMissile: false,               canParry: true  },
  { name: '2-Handed Spear', damage: '1d8+1', defaultSkill: 'Spear',   strikeRank: 0, encumbrance: 2, hitPoints: 15, minSTR: 0, minDEX: 0, cost: 20,  isMissile: false,               canParry: true  },
  { name: 'Sword',          damage: '1d8+1', defaultSkill: 'Sword',   strikeRank: 0, encumbrance: 1, hitPoints: 20, minSTR: 0, minDEX: 0, cost: 100, isMissile: false,               canParry: true  },
  { name: 'Rock',           damage: '1d4',   defaultSkill: 'Rock',    strikeRank: 0, encumbrance: 0, hitPoints: 0,  minSTR: 0, minDEX: 0, cost: 0,   isMissile: true,  range: '20m',  rateOfFire: 1, canParry: false },
  { name: 'Javelin',        damage: '1d10',  defaultSkill: 'Javelin', strikeRank: 0, encumbrance: 1, hitPoints: 0,  minSTR: 0, minDEX: 0, cost: 10,  isMissile: true,  range: '30m',  rateOfFire: 1, canParry: false },
  { name: 'Bow',            damage: '1d6+1', defaultSkill: 'Bow',     strikeRank: 0, encumbrance: 1, hitPoints: 0,  minSTR: 0, minDEX: 0, cost: 75,  isMissile: true,  range: '100m', rateOfFire: 1, canParry: false },
];

// A successful shield parry blocks 12 points of damage (hitPoints drives the
// parry absorption in the tracker). Shields never break in BRP.
const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Shield', armorPoints: 0, hitPoints: 12, encumbrance: 2, cost: 50, protectedLocations: [] },
];

// Names drawn from the booklet's examples plus period-neutral picks it suggests.
const BRP_NAMES = [
  'Torban', 'Jomo', 'Able', 'Dair', 'Godfrey', 'Ogbert', 'Holm', 'Marshum',
  'Mudd', 'Glop', 'John', 'Arnold', 'Sam', 'Bob', 'Willa', 'Edda', 'Bryn',
  'Corin', 'Hale', 'Ivo', 'Marta', 'Nell', 'Osric', 'Piper', 'Rowan', 'Tam',
];

export class BrpRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    _weapons: Weapon[],
    _shields: Shield[],
    _background?: BackgroundForBonuses,
    _armorType?: string
  ): DerivedStats {
    // Hit points equal CON
    const maxHitPoints = Math.max(1, stats.CON);

    const totalEncumbrance = equipment.reduce(
      (sum, item) => sum + item.encumbrance * item.quantity, 0
    );

    return {
      totalHitPoints: maxHitPoints,
      maxHitPoints,
      magicPoints: 0,
      damageBonus: '0',
      spiritCombatDamage: '0',
      healingRate: 1,           // 1 HP per game week
      movementRate: 24,         // meters per melee round (2-legged)
      strikeRank: this.dexRank(stats.DEX),
      armorClass: undefined,
      missileAttackBonus: undefined,
      maxEncumbrance: stats.STR,
      totalEncumbrance,
      encumbranceDefensePenalty: 0,  // BRP has no encumbrance penalty rule
    };
  }

  // Combat order is strict descending DEX; the tracker sorts strike rank
  // ascending, so rank = 20 − DEX puts the highest DEX first.
  private dexRank(dex: number): number {
    return Math.max(0, 20 - (dex ?? 10));
  }

  usesHitLocations(): boolean { return false; }
  calculateHitLocations(_stats: CharacterStats): HitLocations | null { return null; }

  getSkillDefinitions(): SkillDefinition[] {
    return SKILL_DEFINITIONS;
  }

  getDefaultSkills(): Record<string, number> {
    const skills: Record<string, number> = {};
    for (const s of SKILL_DEFINITIONS) skills[s.name] = s.defaultValue;
    return skills;
  }

  getSkillCategories(): SkillCategory[] {
    return SKILL_CATEGORIES;
  }

  calculateSkillCategoryModifiers(_stats: CharacterStats): Record<string, number> {
    return {};
  }

  // BRP's introductory rules have no occupation/homeland skill packages.
  applyBackgroundBonuses(
    skills: Record<string, number>,
    _background: BackgroundForBonuses
  ): Record<string, number> {
    return { ...skills };
  }

  getWeaponList(): WeaponDefinition[] { return WEAPON_LIST; }
  getShieldList(): ShieldDefinition[] { return SHIELD_LIST; }
  getArmorTypes(): ArmorTypeDefinition[] { return ARMOR_TYPES; }
  getConditions(): ConditionDefinition[] { return CONDITIONS; }
  getCharacterNames(): string[] { return BRP_NAMES; }

  getMagicSystemType(): string { return 'brp'; }
  getCurrencyLabel(): string { return 'SP'; }

  getToHitMechanic(): ToHitMechanic { return { type: 'percentile' }; }
  getArmorModel(): ArmorModel { return { kind: 'flat' }; }
  getInitiativeMechanic(): InitiativeMechanic { return { kind: 'strike-rank' }; }

  usesStrikeRank(): boolean { return true; }
  getInitiativeLabel(): string { return 'DEX Rank'; }
  getMovementInitiativeCost(_meters: number): number { return 0; }
  getSurpriseInitiativePenalty(_distanceMeters: number): number { return 0; }
  getHitLocationRollTable(): null { return null; }
  getLocationEffects(): null { return null; }
  getHitLocationsDisplayOrder(): string[] { return []; }

  // Dodge is a characteristic roll: DEX×5. Attack and parry use raw weapon skill.
  getAttackBonuses(stats: CharacterStats): { attack: number; parry: number; dodge: number } {
    return { attack: 0, parry: 0, dodge: (stats.DEX ?? 10) * 5 };
  }

  getParryRepeatPenalty(): number { return 0; }
  usesParryDodge(): boolean { return true; }
  usesWeaponHP(): boolean { return true; }

  getSystemName(): string { return 'Basic Role-Playing'; }
  getStatRange(): { min: number; max: number } { return { min: 1, max: 21 }; }
  canRollStats(): boolean { return true; }

  // All seven characteristics are rolled on 3D6.
  rollStat(_stat: keyof CharacterStats): number {
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    return d6() + d6() + d6();
  }

  showsMagicPoints(): boolean { return false; }
  getMagicPointsLabel(): string { return ''; }
  showsDamageBonus(): boolean { return false; }
  getDamageBonusLabel(): string { return ''; }
  showsHealingRate(): boolean { return true; }
  getHealingRateLabel(): string { return 'Healing Rate (HP/week)'; }
  showsMovementRate(): boolean { return true; }

  getEncumbrancePenaltyText(derivedStats: DerivedStats): string {
    return `Over ${derivedStats.maxEncumbrance} (STR) — overloaded`;
  }

  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[] {
    return [
      { key: 'gold',       label: 'Gold (20 SP)' },
      { key: 'silver',     label: 'Silver (SP)' },
      { key: 'reputation', label: 'Reputation' },
    ];
  }

  getPrimaryWealthAmount(resources: Resources): number {
    return (resources.gold ?? 0) * 20 + (resources.silver ?? 0);
  }

  weaponSkillIsFixed(): boolean { return true; }
  weaponHasSelectableSkill(): boolean { return false; }

  getDefaultStats(): CharacterStats {
    return { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 10, CHA: 10 };
  }

  getArmorHint(): string {
    return 'Armor subtracts its points from every hit. A successful shield parry blocks 12 points first. Ring Mail can be worn over Leather for 6 points total.';
  }
}
