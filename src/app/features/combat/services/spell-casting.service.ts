import { Injectable } from '@angular/core';
import { Character } from '@characters/models/character.model';
import { CharacterService } from '@characters/services/character.service';
import { CharacterUpdateService } from '@characters/services/character-update.service';
import { DiceService } from '@shared/services/dice.service';
import { GameSystemRules } from '@shared/rules/game-system-rules.interface';
import {
  CastableSpell, CastCheck, SpellCasterInfo, DEFAULT_UTILITY_EFFECT,
} from '@shared/rules/spell-effects.model';

export interface CastCheckResult {
  success: boolean;
  crit: boolean;    // Dragonbane Dragon (1), Kal-Arath natural 12: damage dice doubled
  fumble: boolean;  // Dragonbane Demon (20), Kal-Arath snake eyes
  display: string;
}

/**
 * System-agnostic spell casting engine for the combat tracker and combat map.
 * Owns the castable-spell list, casting rolls, resource deduction (with
 * character write-back), and damage/healing amount rolls. The combat
 * components apply the results to participants through their existing
 * damage/healing paths.
 */
@Injectable({ providedIn: 'root' })
export class SpellCastingService {
  constructor(
    private characterService: CharacterService,
    private characterUpdateService: CharacterUpdateService,
    private diceService: DiceService,
  ) {}

  /** Spells the character can cast under the active system, with costs and effects resolved. */
  getCastableSpells(character: Character, rules: GameSystemRules): CastableSpell[] {
    if (!rules.getCastCheck) return [];
    const magic = character.magic;
    if (!magic) return [];
    const effectFor = (name: string) =>
      rules.getSpellEffect?.(name) ?? { ...DEFAULT_UTILITY_EFFECT, name };

    switch (rules.getMagicSystemType()) {
      case 'runequest': {
        const spirit: CastableSpell[] = (magic.spiritMagic ?? []).map(s => ({
          name: s.name, category: 'spirit' as const,
          cost: Math.max(1, s.points), costLabel: `${Math.max(1, s.points)} MP`,
          resource: 'magic-points' as const, effect: effectFor(s.name),
        }));
        const rune: CastableSpell[] = (magic.runeMagic ?? []).map(s => ({
          name: s.name, category: 'rune' as const,
          cost: Math.max(1, s.runePointCost), costLabel: `${Math.max(1, s.runePointCost)} RP`,
          resource: 'rune-points' as const, discipline: s.associatedRune,
          effect: effectFor(s.name),
        }));
        const sorcery: CastableSpell[] = (magic.sorcery ?? []).map(s => ({
          name: s.name, category: 'sorcery' as const,
          cost: Math.max(1, s.points), costLabel: `${Math.max(1, s.points)} MP`,
          resource: 'magic-points' as const, effect: effectFor(s.name),
        }));
        return [...spirit, ...rune, ...sorcery];
      }
      case 'dragonbane':
        return (magic.dragonbaneSpells ?? []).map(s => {
          const effect = effectFor(s.name);
          const cost = effect.wpCost ?? 2;
          return {
            name: s.name, category: 'dragonbane' as const,
            cost, costLabel: `${cost} WP`,
            resource: 'willpower-points' as const, discipline: s.discipline, effect,
          };
        });
      case 'kal-arath':
        // Pact spells are stored in magic.sorcery with points = tier
        return (magic.sorcery ?? []).map(s => ({
          name: s.name, category: 'pact' as const,
          cost: Math.max(1, s.points), costLabel: `Tier ${Math.max(1, s.points)}`,
          resource: 'none' as const, effect: effectFor(s.name),
        }));
      case 'osric':
        // Known spells are stored in magic.sorcery with points = spell level
        return (magic.sorcery ?? []).map(s => ({
          name: s.name, category: 'osric' as const,
          cost: Math.max(1, s.points), costLabel: `L${Math.max(1, s.points)} slot`,
          resource: 'spell-slot' as const, effect: effectFor(s.name),
        }));
      default:
        return [];
    }
  }

  /** Caster info for GameSystemRules.getCastCheck, with runes flattened. */
  buildCasterInfo(character: Character): SpellCasterInfo {
    const runes: Record<string, number> = {};
    for (const group of [character.runes?.elemental, character.runes?.power, character.runes?.form]) {
      for (const [name, value] of Object.entries(group ?? {})) {
        runes[name] = value as number;
      }
    }
    return {
      stats: character.stats,
      skills: character.skills as unknown as Record<string, number>,
      runes,
      className: character.background?.occupation,
      level: character.resources?.level ?? 1,
    };
  }

  /**
   * Whether the character can pay the spell's cost. OSRIC callers pass the
   * participant's per-combat slot usage and the class's slot capacities.
   */
  canAfford(
    character: Character,
    spell: CastableSpell,
    slotsUsed?: { [spellLevel: number]: number },
    slotCaps?: number[],
  ): { ok: boolean; reason: string } {
    switch (spell.resource) {
      case 'magic-points':
      case 'willpower-points': {
        const current = character.derivedStats.currentMagicPoints
          ?? character.derivedStats.magicPoints ?? 0;
        return current >= spell.cost
          ? { ok: true, reason: '' }
          : { ok: false, reason: `Not enough ${spell.resource === 'willpower-points' ? 'WP' : 'magic points'} (${current}/${spell.cost} needed)` };
      }
      case 'rune-points': {
        const current = character.magic?.currentRunePoints ?? character.magic?.runePoints ?? 0;
        return current >= spell.cost
          ? { ok: true, reason: '' }
          : { ok: false, reason: `Not enough rune points (${current}/${spell.cost} needed)` };
      }
      case 'spell-slot': {
        const cap = slotCaps?.[spell.cost - 1] ?? 0;
        const used = slotsUsed?.[spell.cost] ?? 0;
        return used < cap
          ? { ok: true, reason: '' }
          : { ok: false, reason: `No level ${spell.cost} spell slots remaining (${used}/${cap} used)` };
      }
      default:
        return { ok: true, reason: '' };
    }
  }

  rollCastCheck(check: CastCheck): CastCheckResult {
    switch (check.kind) {
      case 'auto':
        return { success: true, crit: false, fumble: false, display: 'auto' };
      case 'percentile-under': {
        const roll = Math.floor(Math.random() * 100) + 1;
        const success = roll <= check.target;
        return { success, crit: false, fumble: false, display: `${check.label}: ${roll} vs ${check.target}%` };
      }
      case 'd20-under': {
        const roll = Math.floor(Math.random() * 20) + 1;
        const crit = roll === 1;
        const fumble = roll === 20;
        const success = !fumble && roll <= check.target;
        let display = `${check.label} d20: ${roll} vs ${check.target}`;
        if (crit) display += ' — DRAGON! Damage dice doubled';
        if (fumble) display += ' — DEMON!';
        return { success, crit, fumble, display };
      }
      case '2d6-over': {
        const d1 = Math.floor(Math.random() * 6) + 1;
        const d2 = Math.floor(Math.random() * 6) + 1;
        const total = d1 + d2 + check.bonus;
        const crit = d1 === 6 && d2 === 6;
        const fumble = d1 === 1 && d2 === 1;
        const success = crit || (!fumble && total >= check.target);
        const bonusStr = check.bonus > 0 ? `+${check.bonus}` : check.bonus < 0 ? `${check.bonus}` : '';
        let display = `2d6+${check.label}: ${d1}+${d2}${bonusStr} = ${total} vs ${check.target}+`;
        if (crit) display += ' — natural 12! Effect doubled';
        if (fumble) display += ' — snake eyes!';
        return { success, crit, fumble, display };
      }
    }
  }

  /**
   * RuneQuest resistance table: the caster's POW must overcome the target's.
   * Chance = 50% + 5% per point of difference, clamped to 5–95.
   */
  rollResistance(casterPow: number, targetPow: number): { success: boolean; display: string } {
    const chance = Math.min(95, Math.max(5, 50 + 5 * (casterPow - targetPow)));
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= chance;
    return {
      success,
      display: `POW ${casterPow} vs ${targetPow}: ${roll} vs ${chance}%`,
    };
  }

  /**
   * Roll the spell's damage or healing amount. Returns 'full' for full heals
   * and null when the effect has no rollable notation.
   */
  rollSpellAmount(
    spell: CastableSpell,
    casterLevel: number,
    opts: { explode: boolean; doubleDice: boolean },
  ): { total: number; breakdown: string } | 'full' | null {
    const effect = spell.effect;
    const notation = effect.notationForLevel?.(casterLevel) ?? effect.notation;
    if (!notation) return null;
    if (notation === 'full') return 'full';

    const rollTimes = effect.perPoint ? Math.max(1, spell.cost) : 1;
    let total = 0;
    const parts: string[] = [];
    for (let i = 0; i < rollTimes; i++) {
      const r = this.diceService.rollDiceNotation(notation, { explode: opts.explode });
      total += r.total;
      parts.push(r.breakdown);
    }
    let breakdown = parts.join(' + ');
    if (opts.doubleDice) {
      const extra: string[] = [];
      for (let i = 0; i < rollTimes; i++) {
        const r = this.diceService.rollDiceNotation(notation, { explode: opts.explode });
        total += r.total;
        extra.push(r.breakdown);
      }
      breakdown += ` + ${extra.join(' + ')} (crit — dice doubled)`;
    }
    return { total, breakdown };
  }

  /**
   * Deduct the spell's cost from the character and persist. Returns a log
   * fragment like ", −2 MP (6/12 left)". OSRIC slot usage is participant
   * state and is handled by the caller.
   */
  deductCost(character: Character, spell: CastableSpell, outcome: { success: boolean }): string {
    switch (spell.resource) {
      case 'magic-points': {
        // RQ: a failed casting roll still burns 1 MP; success costs full
        const amount = outcome.success ? spell.cost : 1;
        const max = character.derivedStats.magicPoints ?? 0;
        const current = character.derivedStats.currentMagicPoints ?? max;
        const next = Math.max(0, current - amount);
        character.derivedStats.currentMagicPoints = next;
        this.persist(character);
        return `, −${amount} MP (${next}/${max} left)`;
      }
      case 'willpower-points': {
        // Dragonbane: WP is spent win or lose
        const amount = spell.cost;
        const max = character.derivedStats.magicPoints ?? 0;
        const current = character.derivedStats.currentMagicPoints ?? max;
        const next = Math.max(0, current - amount);
        character.derivedStats.currentMagicPoints = next;
        this.persist(character);
        return `, −${amount} WP (${next}/${max} left)`;
      }
      case 'rune-points': {
        // Rune magic only expends points when the casting succeeds
        if (!outcome.success) return '';
        const max = character.magic.runePoints ?? 0;
        const current = character.magic.currentRunePoints ?? max;
        const next = Math.max(0, current - spell.cost);
        character.magic.currentRunePoints = next;
        this.persist(character);
        return `, −${spell.cost} RP (${next}/${max} left)`;
      }
      default:
        return '';
    }
  }

  /** Deal failure side-effect damage (e.g. Kal-Arath's 1 HP) to the caster's character record. */
  applyDamageToCasterCharacter(character: Character, damage: number): void {
    if (damage <= 0) return;
    character.derivedStats.totalHitPoints = character.derivedStats.totalHitPoints - damage;
    this.persist(character);
  }

  /** Compact resource summary for the cast button row, or null when the system has none. */
  getResourceDisplay(
    character: Character,
    rules: GameSystemRules,
    slotsUsed?: { [spellLevel: number]: number },
  ): string | null {
    switch (rules.getMagicSystemType()) {
      case 'runequest': {
        const max = character.derivedStats.magicPoints ?? 0;
        const current = character.derivedStats.currentMagicPoints ?? max;
        let display = `MP ${current}/${max}`;
        const rpMax = character.magic?.runePoints ?? 0;
        if (rpMax > 0) {
          const rp = character.magic.currentRunePoints ?? rpMax;
          display += ` · RP ${rp}/${rpMax}`;
        }
        return display;
      }
      case 'dragonbane': {
        const max = character.derivedStats.magicPoints ?? 0;
        const current = character.derivedStats.currentMagicPoints ?? max;
        return `WP ${current}/${max}`;
      }
      case 'osric': {
        const caps = rules.getSpellSlotsPerDay?.(
          character.background?.occupation, character.resources?.level ?? 1
        ) ?? [];
        if (caps.length === 0) return 'No spell slots';
        return 'Slots ' + caps
          .map((cap, i) => `L${i + 1} ${Math.max(0, cap - (slotsUsed?.[i + 1] ?? 0))}/${cap}`)
          .filter((_, i) => caps[i] > 0)
          .join(', ');
      }
      default:
        return null;
    }
  }

  /** Rest: restore MP/WP and rune points to max and persist. */
  restoreResources(character: Character): void {
    character.derivedStats.currentMagicPoints = character.derivedStats.magicPoints ?? 0;
    if (character.magic) {
      character.magic.currentRunePoints = character.magic.runePoints ?? 0;
    }
    this.persist(character);
  }

  private persist(character: Character): void {
    this.characterService.updateCharacter(character);
    this.characterUpdateService.notifyCharacterUpdated();
  }
}
