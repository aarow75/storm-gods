import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, CharacterBackground, Resources } from '@characters/models/character.model';
import { SpellEffect, CastCheck, CastableSpell, SpellCasterInfo } from './spell-effects.model';

export type BackgroundForBonuses = Pick<CharacterBackground, 'occupation' | 'homeland' | 'cult' | 'age'>;

export type ToHitMechanic =
  | { type: 'percentile' }                       // d100 ≤ skill (RuneQuest)
  | { type: 'percentile-under-stat';             // d100 ≤ raw stat (Mothership Combat check)
      stat: keyof CharacterStats; statLabel: string }
  | { type: 'd20-under' }                        // d20 ≤ skill (Dragonbane)
  | { type: 'd20-over-ac' }                      // d20 + bonus ≥ (20 − defenderAC) (OSRIC)
  | { type: '2d6-over'; target: number;          // 2d6 + stat ≥ target (Kal-Arath)
      meleeStat: keyof CharacterStats; meleeStatLabel: string;
      missileStat: keyof CharacterStats; missileStatLabel: string };
      // double-6 = critical hit (damage dice doubled); double-1 = fumble (automatic miss)

/** How armor mitigates damage in the combat tracker. */
export type ArmorModel =
  | { kind: 'locations' }             // RuneQuest: per-hit-location AP subtracted from damage
  | { kind: 'flat' }                  // Dragonbane / Kal-Arath: armor points subtracted from damage
  | { kind: 'ac' }                    // OSRIC: AC affects to-hit only; no damage reduction
  | { kind: 'save'; skill: string };  // Mothership: defender rolls d100 ≤ (skill + armor points); opposed vs attack roll

/** How turn order is determined in the combat tracker. */
export type InitiativeMechanic =
  | { kind: 'strike-rank' }                            // RuneQuest: computed SR, ascending; no roll
  | { kind: 'side-d6' }                                // OSRIC: one d6 per side each round; lower side acts first
  | { kind: 'd6-plus-stat'; stat: keyof CharacterStats; statLabel: string; target: number }
      // Kal-Arath: each character d6 + stat; ≥ target acts before enemies; natural 1 always loses initiative
  | { kind: 'unique-cards'; deckSize: number }         // Dragonbane: unique card 1..deckSize each; low acts first
  | { kind: 'stat-check'; stat: keyof CharacterStats; statLabel: string };
      // Mothership: each character d100 ≤ stat; pass acts before enemies, fail after

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
  /** Weight in lbs counted toward encumbrance (OSRIC). */
  encumbrance?: number;
  /** Movement cap imposed by the armor regardless of weight, in app movement units (ft/10, OSRIC). */
  maxMove?: number;
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
  firstLevelDice?: number; // dice rolled at level 1 (OSRIC Ranger rolls 2); default 1
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

  /**
   * Location name → wound effect when the location reaches 0 HP. `fatal: true` means the
   * character dies when the location's damage reaches −(location max), i.e. double its HP
   * (RQ2: head/chest/abdomen destroyed = instant death; limbs are severed instead).
   * Null for systems without hit location effects.
   */
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

  /**
   * Which defensive reactions the combat tracker offers when usesParryDodge() is true.
   * Default when omitted: { parry: true, dodge: true }. Kal-Arath is dodge-only.
   */
  getDefenseOptions?(): { parry: boolean; dodge: boolean };

  /** Skill name used for dodge rolls. Default when omitted: 'Dodge' (Dragonbane uses 'Evade (AGL)'). */
  getDodgeSkillName?(): string;

  /** Whether damage dice explode (Kal-Arath: a die showing its maximum is rerolled once and added). */
  damageDiceExplode?(): boolean;

  /** Whether parry weapons/shields take HP damage when blocking. False hides weapon HP tracking in the combat tracker. */
  usesWeaponHP(): boolean;

  /**
   * Describes the to-hit mechanic used in combat.
   * - 'percentile': d100 roll-under a skill % (RuneQuest default)
   * - 'percentile-under-stat': d100 roll-under a raw stat (Mothership Combat check)
   * - 'd20-under':  d20 roll-under a skill value (Dragonbane)
   * - 'd20-over-ac': d20 + bonus ≥ (20 − defenderAC) (OSRIC)
   * - '2d6-over':   2d6 + stat ≥ target; double-6 crit, double-1 fumble (Kal-Arath)
   * Omit (or return undefined) to default to 'percentile'.
   */
  getToHitMechanic?(): ToHitMechanic;

  /**
   * For the 'd20-over-ac' mechanic: integer bonus added to the d20 roll.
   * isRanged = true for missile weapons (DEX-based), false for melee (STR-based).
   */
  getD20AttackBonus?(stats: CharacterStats, isRanged: boolean): number;

  /**
   * For the 'd20-over-ac' mechanic: d20 target number before subtracting the
   * defender's AC (THAC0). Characters pass className/level; monsters pass
   * monsterMaxHp (hit dice derived from HP). Default 20 when omitted.
   */
  getD20AttackTarget?(attacker: { className?: string; level?: number; monsterMaxHp?: number }): number;

  /**
   * Melee attacks allowed for a combatant this round (multi-attack progressions).
   * Systems that omit this allow unlimited melee attacks within the turn structure.
   */
  getMeleeAttacksPerRound?(className: string | undefined, level: number, roundNumber: number): number;

  /** How armor mitigates damage. Default when omitted: usesHitLocations() ? 'locations' : 'flat'. */
  getArmorModel?(): ArmorModel;

  /** Turn-order mechanic. Default when omitted: { kind: 'strike-rank' }. */
  getInitiativeMechanic?(): InitiativeMechanic;

  // ─────────────────────────────────────────────────────────────────────────

  /** Identifier for the magic system used by this game system. */
  getMagicSystemType(): string;

  // ── Spell Casting (combat) ────────────────────────────────────────────────
  // Systems without combat magic (Mothership, BRP) omit these methods, which
  // hides all cast UI in the combat tracker and combat map.

  /**
   * Combat effect for a spell name (matched case-insensitively). Null when the
   * spell isn't in the registry — it then resolves as a utility cast (roll +
   * cost + log entry).
   */
  getSpellEffect?(spellName: string): SpellEffect | null;

  /** Casting check for a spell, from the system's casting rules. */
  getCastCheck?(spell: CastableSpell, caster: SpellCasterInfo): CastCheck;

  /**
   * OSRIC: spells castable per day for a class at a character level; index =
   * spellLevel − 1. Empty array = no slots at that level.
   */
  getSpellSlotsPerDay?(className: string | undefined, level: number): number[];

  /**
   * System-specific consequences of a failed casting roll (fumble = critical
   * failure). Kal-Arath: 1 damage to the caster + no casting until rest, and an
   * Arcane Disaster on a fumble. Dragonbane: a Magical Mishap on a Demon (20).
   */
  getCastFailureEffects?(fumble: boolean): {
    logNotes: string[];
    damageToCaster: number;
    blockCastingUntilRest: boolean;
  };

  /** Short currency label used when displaying weapon costs (e.g. "L", "GC", "S"). */
  getCurrencyLabel(): string;

  /** Race abilities for a given race name. Returns [] for systems without racial abilities. */
  getRaceAbilities?(race: string): AbilityDefinition[];

  /** Class abilities for a given class name. Returns [] for systems without class abilities. */
  getClassAbilities?(className: string): AbilityDefinition[];

  /** Hit die info for a class (for level-up HP rolling). Returns null for systems without class-based HD. */
  getClassHitDie?(className: string): ClassHitDie | null;

  /**
   * CON modifier applied per hit die roll. Returns 0 for systems that don't use this.
   * OSRIC: bonuses above +2 (CON 17+) apply only to fighters, paladins, and rangers,
   * so pass the class name when known.
   */
  getConHpModifier?(con: number, className?: string): number;

  /** Maximum level for a race/class combination. Returns unlimited (999) if no restriction. OSRIC-specific. */
  getMaxCharacterLevel?(race: string, className: string): number;

  // ── Character Sheet Display ───────────────────────────────────────────────

  /** Human-readable name for this system (e.g. 'RuneQuest', 'Dragonbane'). */
  getSystemName(): string;

  /** Valid range for stat entry inputs. */
  getStatRange(): { min: number; max: number };

  /** Whether stat-rolling buttons are shown on the character form. */
  canRollStats(): boolean;

  /**
   * Roll a starting value for one stat using this system's generation method
   * (RQ2: 3d6 / 2d6+6 for SIZ+INT; Dragonbane: 4d6 drop lowest; Mothership: 6d10).
   * Omit to fall back to the app-wide default roll.
   */
  rollStat?(stat: keyof CharacterStats): number;

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
