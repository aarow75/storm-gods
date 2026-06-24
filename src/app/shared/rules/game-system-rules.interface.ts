import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, CharacterBackground, Resources } from '@characters/models/character.model';

export type BackgroundForBonuses = Pick<CharacterBackground, 'occupation' | 'homeland' | 'cult' | 'age'>;

export type ToHitMechanic =
  | { type: 'percentile' }                       // d100 ≤ skill (RuneQuest)
  | { type: 'd20-under' }                        // d20 ≤ skill (Dragonbane)
  | { type: 'd20-over-ac' }                      // d20 + bonus ≥ (20 − defenderAC) (OSRIC)
  | { type: 'd6-pool'; difficulty: number };     // d6 + skill ≥ difficulty (Kal-Arath)

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

export interface AbilityDefinition {
  name: string;
  description: string;
  minLevel?: number;
}

export interface ClassHitDie {
  sides: number;
  maxHdLevel: number;      // last level that earns a full hit die
  bonusPerLevel: number;   // flat HP added per level above maxHdLevel
}

export interface GameSystemRules {
  /** Which stats exist and how to display them for this system. */
  getStatDefinitions(): StatDefinition[];

  /** Calculate all derived stats from character data. */
  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[],
    background?: BackgroundForBonuses,
    armorType?: string
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
    background: BackgroundForBonuses,
    stats?: CharacterStats
  ): Record<string, number>;

  /** Weapon definitions available for this system. */
  getWeaponList(): WeaponDefinition[];

  /** Shield definitions available for this system. */
  getShieldList(): ShieldDefinition[];

  /** Armor type options and their protection values. */
  getArmorTypes(): ArmorTypeDefinition[];

  /** Combat/status conditions available for this system. */
  getConditions(): ConditionDefinition[];

  /** Pool of character names appropriate for this game system. */
  getCharacterNames(): string[];

  // ── Initiative / Strike Rank ──────────────────────────────────────────────

  /** Whether this system uses Strike Rank for turn order. False = manual initiative field. */
  usesStrikeRank(): boolean;

  /** Label for the initiative column ("Strike Rank" for RQ, "Initiative" for others). */
  getInitiativeLabel(): string;

  /** SR cost for moving N meters this round. Returns 0 for systems without SR movement cost. */
  getMovementInitiativeCost(meters: number): number;

  /** SR penalty when surprised at a given distance. Returns 0 for systems without SR. */
  getSurpriseInitiativePenalty(distanceMeters: number): number;

  // ── Hit Locations ─────────────────────────────────────────────────────────

  /** d20 roll → hit location name. Null for systems without hit locations. */
  getHitLocationRollTable(): Record<number, string> | null;

  /** Location name → wound effect. Null for systems without hit location effects. */
  getLocationEffects(): Record<string, { label: string; fatal: boolean }> | null;

  /** Ordered list of hit location names for the character sheet grid. Empty for systems without locations. */
  getHitLocationsDisplayOrder(): string[];

  // ── Characteristic Combat Bonuses ─────────────────────────────────────────

  /**
   * Characteristic-based bonuses to attack, parry, and dodge skill rolls.
   * Returns { attack: 0, parry: 0, dodge: 0 } for systems that don't use this.
   */
  getAttackBonuses(stats: CharacterStats): { attack: number; parry: number; dodge: number };

  /** Percentage penalty applied to each repeat parry against the same attacker. 0 for systems without this rule. */
  getParryRepeatPenalty(): number;

  /** Whether this system uses skill-based parry and dodge rolls for defense resolution. False hides those options in the combat tracker. */
  usesParryDodge(): boolean;

  /** Whether parry weapons/shields take HP damage when blocking. False hides weapon HP tracking in the combat tracker. */
  usesWeaponHP(): boolean;

  /**
   * Describes the to-hit mechanic used in combat.
   * - 'percentile': d100 roll-under a skill % (RuneQuest default)
   * - 'd20-under':  d20 roll-under a skill value (Dragonbane)
   * - 'd20-over-ac': d20 + bonus ≥ (20 − defenderAC) (OSRIC)
   * - 'd6-pool':    d6 + skill ≥ difficulty (Kal-Arath)
   * Omit (or return undefined) to default to 'percentile'.
   */
  getToHitMechanic?(): ToHitMechanic;

  /**
   * For the 'd20-over-ac' mechanic: integer bonus added to the d20 roll.
   * isRanged = true for missile weapons (DEX-based), false for melee (STR-based).
   */
  getD20AttackBonus?(stats: CharacterStats, isRanged: boolean): number;

  // ─────────────────────────────────────────────────────────────────────────

  /** Identifier for the magic system used by this game system. */
  getMagicSystemType(): string;

  /** Short currency label used when displaying weapon costs (e.g. "L", "GC", "S"). */
  getCurrencyLabel(): string;

  /** Race abilities for a given race name. Returns [] for systems without racial abilities. */
  getRaceAbilities?(race: string): AbilityDefinition[];

  /** Class abilities for a given class name. Returns [] for systems without class abilities. */
  getClassAbilities?(className: string): AbilityDefinition[];

  /** Hit die info for a class (for level-up HP rolling). Returns null for systems without class-based HD. */
  getClassHitDie?(className: string): ClassHitDie | null;

  /** CON modifier applied per hit die roll. Returns 0 for systems that don't use this. */
  getConHpModifier?(con: number): number;

  // ── Character Sheet Display ───────────────────────────────────────────────

  /** Human-readable name for this system (e.g. 'RuneQuest', 'Dragonbane'). */
  getSystemName(): string;

  /** Valid range for stat entry inputs. */
  getStatRange(): { min: number; max: number };

  /** Whether stat-rolling buttons are shown on the character form. */
  canRollStats(): boolean;

  /** Whether this system tracks magic points (or WP equivalent). */
  showsMagicPoints(): boolean;

  /** Label for the magic points field. */
  getMagicPointsLabel(): string;

  /** Whether this system shows a damage bonus field. */
  showsDamageBonus(): boolean;

  /** Label for the damage bonus field. */
  getDamageBonusLabel(): string;

  /** Whether this system shows a healing rate field. */
  showsHealingRate(): boolean;

  /** Label for the healing rate field. */
  getHealingRateLabel(): string;

  /** Whether this system shows a movement rate field. */
  showsMovementRate(): boolean;

  /** Human-readable description of the encumbrance penalty when over limit. */
  getEncumbrancePenaltyText(derivedStats: DerivedStats): string;

  /** Resource fields to display on the character sheet, in display order. */
  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[];

  /** Primary wealth total for weapon affordability checks. */
  getPrimaryWealthAmount(resources: Resources): number;

  /** Whether weapon skills are fixed by the weapon definition rather than chosen from a list. */
  weaponSkillIsFixed(): boolean;

  /** Whether weapons show a skill chooser drawn from the character's combat skill list. */
  weaponHasSelectableSkill(): boolean;

  /** Default starting stat values for a new character of this system. */
  getDefaultStats(): CharacterStats;

  /** Hint text shown below the armor section (empty string if no hint needed). */
  getArmorHint(): string;
}
