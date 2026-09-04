import { RuneQuestRules, RQ_SPIRIT_SPELL_EFFECTS, RQ_RUNE_SPELL_EFFECTS, RQ_SORCERY_SPELL_EFFECTS } from './runequest-rules';
import { DragonbaneRules, DB_SPELL_EFFECTS, DB_SPELLS_BY_DISCIPLINE, DB_MAGICAL_MISHAPS } from './dragonbane-rules';
import { KalArathRules, KA_SPELL_EFFECTS, KA_PACT_SPELLS, KA_ARCANE_DISASTERS } from './kal-arath-rules';
import { OsricRules, OSRIC_SPELL_EFFECTS, OSRIC_CLASS_SPELLS } from './osric-rules';
import { MothershipRules } from './mothership-rules';
import { BrpRules } from './brp-rules';
import { SPIRIT_MAGIC_SPELLS, RUNE_SPELL_LIBRARY, SORCERY_SPELLS } from '@characters/models/character.model';
import { CastableSpell, SpellCasterInfo, SpellEffect } from './spell-effects.model';
import { GameSystemRules } from './game-system-rules.interface';
import { CharacterStats } from '@shared/models/character-stats.model';

const stats: CharacterStats = { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 14, CHA: 10 };

function caster(overrides: Partial<SpellCasterInfo> = {}): SpellCasterInfo {
  return { stats, skills: {}, runes: {}, ...overrides };
}

function spell(overrides: Partial<CastableSpell>): CastableSpell {
  return {
    name: 'Test', category: 'spirit', cost: 1, costLabel: '1 MP',
    resource: 'magic-points',
    effect: { name: 'Test', target: 'enemy', kind: 'utility' },
    ...overrides,
  };
}

// Every damage/healing entry must be resolvable to an amount at cast time
function expectRollable(effects: SpellEffect[]): void {
  for (const e of effects) {
    if (e.kind === 'damage' || e.kind === 'healing') {
      const rollable = !!e.notation || !!e.notationForLevel || !!e.slays;
      expect(rollable, `${e.name} has no rollable notation`).toBe(true);
    }
  }
}

describe('Spell effect registries', () => {
  it('every RuneQuest spirit effect name exists in SPIRIT_MAGIC_SPELLS', () => {
    for (const e of RQ_SPIRIT_SPELL_EFFECTS) {
      expect(SPIRIT_MAGIC_SPELLS, `${e.name} not in spirit magic library`).toContain(e.name);
    }
  });

  it('every RuneQuest rune effect name exists in RUNE_SPELL_LIBRARY', () => {
    const libraryNames = Object.values(RUNE_SPELL_LIBRARY).flat().map(s => s.name);
    for (const e of RQ_RUNE_SPELL_EFFECTS) {
      expect(libraryNames, `${e.name} not in rune spell library`).toContain(e.name);
    }
  });

  it('RuneQuest sorcery effects cover the full SORCERY_SPELLS library both ways', () => {
    const effectNames = RQ_SORCERY_SPELL_EFFECTS.map(e => e.name);
    for (const e of RQ_SORCERY_SPELL_EFFECTS) {
      expect(SORCERY_SPELLS, `${e.name} not in sorcery library`).toContain(e.name);
    }
    // 'Spirit Screen' is intentionally omitted — it resolves through the
    // spirit magic entry of the same name via the shared effect index.
    for (const name of SORCERY_SPELLS) {
      if (name === 'Spirit Screen') continue;
      expect(effectNames, `${name} has no sorcery effect entry`).toContain(name);
    }
  });

  it('every Dragonbane effect name exists in DB_SPELLS_BY_DISCIPLINE', () => {
    const libraryNames = Object.values(DB_SPELLS_BY_DISCIPLINE).flat();
    for (const e of DB_SPELL_EFFECTS) {
      expect(libraryNames, `${e.name} not in Dragonbane spell library`).toContain(e.name);
    }
  });

  it('every Kal-Arath effect name exists in KA_PACT_SPELLS', () => {
    const libraryNames = Object.values(KA_PACT_SPELLS).flat().map(s => s.name);
    for (const e of KA_SPELL_EFFECTS) {
      expect(libraryNames, `${e.name} not in pact spell library`).toContain(e.name);
    }
  });

  it('every OSRIC effect name exists in OSRIC_CLASS_SPELLS', () => {
    const libraryNames = new Set(
      Object.values(OSRIC_CLASS_SPELLS).flatMap(byLevel => Object.values(byLevel).flat())
    );
    for (const e of OSRIC_SPELL_EFFECTS) {
      expect(libraryNames.has(e.name), `${e.name} not in OSRIC spell library`).toBe(true);
    }
  });

  it('all damage and healing effects are rollable', () => {
    expectRollable(RQ_SPIRIT_SPELL_EFFECTS);
    expectRollable(RQ_RUNE_SPELL_EFFECTS);
    expectRollable(RQ_SORCERY_SPELL_EFFECTS);
    expectRollable(DB_SPELL_EFFECTS);
    expectRollable(KA_SPELL_EFFECTS);
    expectRollable(OSRIC_SPELL_EFFECTS);
  });

  it('Venom deals half potency when the target resists', () => {
    const rq = new RuneQuestRules();
    const venom = rq.getSpellEffect('Venom')!;
    expect(venom).toMatchObject({
      kind: 'damage', notation: '6', perPoint: true,
      resisted: true, halfOnResistFailure: true, ignoresArmor: true,
    });
  });

  it('getSpellEffect is case-insensitive', () => {
    const rq = new RuneQuestRules();
    expect(rq.getSpellEffect('disruption')?.name).toBe('Disruption');
    expect(rq.getSpellEffect('HEAL BODY')?.name).toBe('Heal Body');
    expect(rq.getSpellEffect('No Such Spell')).toBeNull();
  });

  it('mishap and disaster tables are complete', () => {
    expect(DB_MAGICAL_MISHAPS).toHaveLength(20);
    for (let roll = 2; roll <= 12; roll++) {
      expect(KA_ARCANE_DISASTERS[roll], `Arcane Disaster missing entry ${roll}`).toBeTruthy();
    }
  });
});

describe('RuneQuest cast checks', () => {
  const rules = new RuneQuestRules();

  it('spirit magic rolls under POW×5', () => {
    const check = rules.getCastCheck(spell({ category: 'spirit' }), caster());
    expect(check).toEqual({ kind: 'percentile-under', target: 70, label: 'POW×5' });
  });

  it('rune magic rolls under the associated rune affinity', () => {
    const check = rules.getCastCheck(
      spell({ category: 'rune', discipline: 'Air', resource: 'rune-points' }),
      caster({ runes: { Air: 85 } })
    );
    expect(check).toEqual({ kind: 'percentile-under', target: 85, label: 'Air rune' });
  });

  it('rune magic falls back to POW×5 when the rune is untrained', () => {
    const check = rules.getCastCheck(
      spell({ category: 'rune', discipline: 'Air', resource: 'rune-points' }),
      caster({ runes: { Air: 0 } })
    );
    expect(check).toEqual({ kind: 'percentile-under', target: 70, label: 'POW×5' });
  });

  it('sorcery rolls under the Sorcery skill', () => {
    const check = rules.getCastCheck(
      spell({ category: 'sorcery' }), caster({ skills: { Sorcery: 45 } })
    );
    expect(check).toEqual({ kind: 'percentile-under', target: 45, label: 'Sorcery' });
  });
});

describe('Dragonbane cast checks', () => {
  const rules = new DragonbaneRules();

  it('rolls d20 under the discipline skill', () => {
    const check = rules.getCastCheck(
      spell({ category: 'dragonbane', discipline: 'Elementalism' }),
      caster({ skills: { 'Elementalism (INT)': 12 } })
    );
    expect(check).toEqual({ kind: 'd20-under', target: 12, label: 'Elementalism' });
  });

  it('magic tricks always succeed', () => {
    const cantrip = rules.getSpellEffect('Cantrip')!;
    expect(cantrip.autoSuccess).toBe(true);
    expect(cantrip.wpCost).toBe(1);
    const check = rules.getCastCheck(
      spell({ category: 'dragonbane', effect: cantrip }), caster()
    );
    expect(check).toEqual({ kind: 'auto' });
  });

  it('a Demon roll produces a magical mishap note', () => {
    const failure = rules.getCastFailureEffects(true);
    expect(failure.logNotes).toHaveLength(1);
    expect(failure.logNotes[0]).toContain('MAGICAL MISHAP');
    expect(rules.getCastFailureEffects(false).logNotes).toHaveLength(0);
  });
});

describe('Kal-Arath cast checks', () => {
  const rules = new KalArathRules();
  const kaStats: CharacterStats = { STR: 1, CON: 1, SIZ: 0, DEX: 1, INT: 2, POW: 0, CHA: 0 };

  it('rolls 2d6 + INT against 8 + tier', () => {
    const check = rules.getCastCheck(
      spell({ category: 'pact', cost: 3, resource: 'none' }),
      caster({ stats: kaStats })
    );
    expect(check).toEqual({ kind: '2d6-over', bonus: 2, target: 11, label: 'INT' });
  });

  it('failure deals 1 damage and blocks casting until rest', () => {
    const failure = rules.getCastFailureEffects(false);
    expect(failure.damageToCaster).toBe(1);
    expect(failure.blockCastingUntilRest).toBe(true);
    expect(failure.logNotes).toHaveLength(0);
  });

  it('critical failure rolls on the Arcane Disaster table', () => {
    const failure = rules.getCastFailureEffects(true);
    expect(failure.logNotes).toHaveLength(1);
    expect(failure.logNotes[0]).toContain('ARCANE DISASTER');
  });
});

describe('OSRIC casting', () => {
  const rules = new OsricRules();

  it('casting is automatic (Vancian)', () => {
    expect(rules.getCastCheck(spell({ category: 'osric' }), caster())).toEqual({ kind: 'auto' });
  });

  it('spell slots follow the class progression', () => {
    expect(rules.getSpellSlotsPerDay('Magic User', 1)).toEqual([1]);
    expect(rules.getSpellSlotsPerDay('Magic User', 5)).toEqual([4, 2, 1]);
    expect(rules.getSpellSlotsPerDay('Cleric', 3)).toEqual([2, 1]);
    expect(rules.getSpellSlotsPerDay('Paladin', 5)).toEqual([]);
    expect(rules.getSpellSlotsPerDay('Paladin', 9)).toEqual([1]);
    expect(rules.getSpellSlotsPerDay('Fighter', 10)).toEqual([]);
  });

  it('Magic Missile scales with caster level', () => {
    const effect = rules.getSpellEffect('Magic Missile')!;
    expect(effect.notationForLevel!(1)).toBe('1d4+1');
    expect(effect.notationForLevel!(3)).toBe('2d4+2');
    expect(effect.notationForLevel!(9)).toBe('5d4+5');
    expect(effect.notationForLevel!(20)).toBe('5d4+5'); // capped at 5 bolts
  });

  it('Fireball caps at 10 dice', () => {
    const effect = rules.getSpellEffect('Fireball')!;
    expect(effect.notationForLevel!(5)).toBe('5d6');
    expect(effect.notationForLevel!(14)).toBe('10d6');
  });
});

describe('Systems without magic', () => {
  it('Mothership exposes no spell casting', () => {
    const rules: GameSystemRules = new MothershipRules();
    expect(rules.getCastCheck).toBeUndefined();
    expect(rules.getSpellEffect).toBeUndefined();
  });

  // BRP models the 1980 introductory booklet, which has no player magic system
  // (public/Basic Role Playing.md — POW only "resists spells cast at the
  // character" in games with an expanded magic system). No cast UI should
  // appear for it in the combat tracker/map, same as Mothership.
  it('BRP exposes no spell casting', () => {
    const rules: GameSystemRules = new BrpRules();
    expect(rules.getCastCheck).toBeUndefined();
    expect(rules.getSpellEffect).toBeUndefined();
    expect(rules.showsMagicPoints()).toBe(false);
  });
});
