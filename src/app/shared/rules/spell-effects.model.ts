import { CharacterStats } from '@shared/models/character-stats.model';

// Spell-casting types for the combat tracker / combat map.
// Effect values are sourced from the per-system spell reference docs in
// public/docs/ (RuneQuest-Spells.md, Dragonbane-Spells.md, Kal-Arath-Spells.md,
// OSRIC-Spells.md) — those docs are the authority when tuning these registries.

export type SpellTargetType = 'enemy' | 'ally' | 'self';

export interface SpellEffect {
  /** Registry key; matched case-insensitively against the character's spell names. */
  name: string;
  target: SpellTargetType;
  kind: 'damage' | 'healing' | 'utility';
  /** Dice notation for damage/healing. For healing, 'full' heals to max HP. */
  notation?: string;
  /** Roll `notation` once per point the spell was bought/cast at (RQ variable spells). */
  perPoint?: boolean;
  /** Caster-level-scaled notation (OSRIC). Takes precedence over `notation`. */
  notationForLevel?: (casterLevel: number) => string;
  ignoresArmor?: boolean;
  /** RuneQuest: caster's POW must overcome the target's POW on the resistance table. */
  resisted?: boolean;
  /**
   * With `resisted`: the target still takes half the rolled amount (rounded
   * down) when it resists, instead of the cast fizzling entirely (RQ Venom).
   */
  halfOnResistFailure?: boolean;
  /**
   * Damage equals the target's remaining HP (instant kill). With `resisted`,
   * the kill applies only when the caster overcomes; `notation` then serves as
   * the fallback damage when the target resists (RQ Sever Spirit).
   */
  slays?: boolean;
  /** Damage applies to total HP only — skip the hit-location roll (RQ Thunderbolt). */
  targetsTotalHp?: boolean;
  /** Casting succeeds without a roll (Dragonbane magic tricks). */
  autoSuccess?: boolean;
  /** Dragonbane WP cost override (default 2; magic tricks cost 1). */
  wpCost?: number;
  /** Rules text logged for utility spells and rider notes ("save for half — apply manually"). */
  description?: string;
}

/** Declarative casting check, rolled generically by SpellCastingService. */
export type CastCheck =
  | { kind: 'percentile-under'; target: number; label: string } // RuneQuest
  | { kind: 'd20-under'; target: number; label: string }        // Dragonbane (1 = Dragon, 20 = Demon)
  | { kind: '2d6-over'; bonus: number; target: number; label: string } // Kal-Arath (12 = crit, 2 = disaster)
  | { kind: 'auto' };                                           // OSRIC (Vancian — no roll)

export type SpellResource = 'magic-points' | 'rune-points' | 'willpower-points' | 'spell-slot' | 'none';

/** A spell the character can cast right now, resolved from character data + registry. */
export interface CastableSpell {
  name: string;
  category: 'spirit' | 'rune' | 'sorcery' | 'dragonbane' | 'pact' | 'osric';
  /** MP / RP / WP cost, OSRIC slot level, or Kal-Arath tier. */
  cost: number;
  costLabel: string;
  resource: SpellResource;
  /** Dragonbane school used for the casting roll. */
  discipline?: string;
  effect: SpellEffect;
}

/** Caster data the rules need to compute a cast check. */
export interface SpellCasterInfo {
  stats: CharacterStats;
  skills: Record<string, number>;
  /** Flattened rune name → affinity % (RuneQuest rune magic). */
  runes?: Record<string, number>;
  className?: string;
  level?: number;
}

export const DEFAULT_UTILITY_EFFECT: SpellEffect = {
  name: '',
  target: 'self',
  kind: 'utility',
  description: 'Effect not automated — apply manually',
};

/** Case-insensitive registry lookup key. */
export function normalizeSpellName(name: string): string {
  return name.trim().toLowerCase();
}

/** Build a name → effect map with normalized keys from a list of effects. */
export function buildSpellEffectIndex(effects: SpellEffect[]): Map<string, SpellEffect> {
  return new Map(effects.map(e => [normalizeSpellName(e.name), e]));
}
