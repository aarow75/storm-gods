import { vi } from 'vitest';
import { SpellCastingService } from './spell-casting.service';
import { CharacterService } from '@characters/services/character.service';
import { CharacterUpdateService } from '@characters/services/character-update.service';
import { DiceService } from '@shared/services/dice.service';
import { Character } from '@characters/models/character.model';
import { RuneQuestRules } from '@shared/rules/runequest-rules';
import { DragonbaneRules } from '@shared/rules/dragonbane-rules';
import { KalArathRules } from '@shared/rules/kal-arath-rules';
import { OsricRules } from '@shared/rules/osric-rules';
import { CastableSpell } from '@shared/rules/spell-effects.model';

function makeCharacter(overrides: any = {}): Character {
  return {
    id: 'c1', name: 'Tester',
    background: { cult: 'Orlanth', occupation: 'Warrior', homeland: 'Sartar', age: 21, gender: '' },
    stats: { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 12, CHA: 10 },
    derivedStats: {
      totalHitPoints: 10, maxHitPoints: 10, magicPoints: 12, currentMagicPoints: 12,
      damageBonus: '0', spiritCombatDamage: '1d6', healingRate: 2, movementRate: 8,
      strikeRank: 0, maxEncumbrance: 10, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
    },
    skills: {} as any,
    hitLocations: {} as any,
    armor: {} as any,
    weapons: [], shields: [],
    runes: { elemental: { Air: 60 } as any, power: { Death: 75 } as any, form: {} as any },
    passions: [],
    magic: { spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0, currentRunePoints: 0 },
    resources: { lunars: 0, wheels: 0, clacks: 0, reputation: 0, ransom: 0, level: 1 },
    equipment: [], notes: '',
    ...overrides,
  } as Character;
}

describe('SpellCastingService', () => {
  let service: SpellCastingService;
  let characterService: { updateCharacter: ReturnType<typeof vi.fn> };
  let updateService: { notifyCharacterUpdated: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    characterService = { updateCharacter: vi.fn() };
    updateService = { notifyCharacterUpdated: vi.fn() };
    const dice = new DiceService({ use2d6Plus6: () => false } as any);
    service = new SpellCastingService(
      characterService as unknown as CharacterService,
      updateService as unknown as CharacterUpdateService,
      dice,
    );
  });

  describe('getCastableSpells', () => {
    it('RuneQuest: combines spirit, rune, and sorcery spells with the right resources', () => {
      const character = makeCharacter({
        magic: {
          spiritMagic: [{ name: 'Disruption', points: 1 }, { name: 'Heal', points: 3 }],
          runeMagic: [{ name: 'Lightning', runePointCost: 2, associatedRune: 'Air', reusable: true }],
          sorcery: [{ name: 'Palsy', points: 2 }],
          runePoints: 3, currentRunePoints: 3,
        },
      });
      const spells = service.getCastableSpells(character, new RuneQuestRules());
      expect(spells.map(s => s.name)).toEqual(['Disruption', 'Heal', 'Lightning', 'Palsy']);
      expect(spells[0]).toMatchObject({ category: 'spirit', cost: 1, resource: 'magic-points' });
      expect(spells[1]).toMatchObject({ cost: 3, costLabel: '3 MP' });
      expect(spells[2]).toMatchObject({ category: 'rune', resource: 'rune-points', discipline: 'Air' });
      expect(spells[3]).toMatchObject({ category: 'sorcery', resource: 'magic-points' });
      // Registry hit vs utility fallback
      expect(spells[0].effect.kind).toBe('damage');
      expect(spells[3].effect.kind).toBe('utility');
    });

    it('Dragonbane: uses dragonbaneSpells with WP costs from the registry', () => {
      const character = makeCharacter({
        magic: {
          spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0,
          dragonbaneSpells: [
            { discipline: 'General Magic', name: 'Cantrip' },
            { discipline: 'General Magic', name: 'Flaming Hands' },
          ],
        },
      });
      const spells = service.getCastableSpells(character, new DragonbaneRules());
      expect(spells[0]).toMatchObject({ name: 'Cantrip', cost: 1, resource: 'willpower-points' });
      expect(spells[1]).toMatchObject({ name: 'Flaming Hands', cost: 2, costLabel: '2 WP' });
    });

    it('Kal-Arath: reads pacts from sorcery with tier costs and no resource', () => {
      const character = makeCharacter({
        magic: {
          spiritMagic: [], runeMagic: [], runePoints: 0,
          sorcery: [{ name: 'Crimson Palm Scripture', points: 1 }],
        },
      });
      const spells = service.getCastableSpells(character, new KalArathRules());
      expect(spells[0]).toMatchObject({
        name: 'Crimson Palm Scripture', category: 'pact', cost: 1,
        costLabel: 'Tier 1', resource: 'none',
      });
      expect(spells[0].effect.kind).toBe('damage');
    });

    it('OSRIC: reads known spells from sorcery as slot levels', () => {
      const character = makeCharacter({
        magic: {
          spiritMagic: [], runeMagic: [], runePoints: 0,
          sorcery: [{ name: 'Magic Missile', points: 1 }, { name: 'Fireball', points: 3 }],
        },
      });
      const spells = service.getCastableSpells(character, new OsricRules());
      expect(spells[0]).toMatchObject({ cost: 1, costLabel: 'L1 slot', resource: 'spell-slot' });
      expect(spells[1]).toMatchObject({ cost: 3, costLabel: 'L3 slot' });
    });
  });

  describe('buildCasterInfo', () => {
    it('flattens rune groups into one lookup', () => {
      const info = service.buildCasterInfo(makeCharacter());
      expect(info.runes?.['Air']).toBe(60);
      expect(info.runes?.['Death']).toBe(75);
      expect(info.className).toBe('Warrior');
      expect(info.level).toBe(1);
    });
  });

  describe('canAfford', () => {
    const mpSpell: CastableSpell = {
      name: 'Heal', category: 'spirit', cost: 3, costLabel: '3 MP',
      resource: 'magic-points', effect: { name: 'Heal', target: 'ally', kind: 'healing', notation: '1' },
    };

    it('rejects when current magic points are too low', () => {
      const character = makeCharacter();
      character.derivedStats.currentMagicPoints = 2;
      expect(service.canAfford(character, mpSpell).ok).toBe(false);
      character.derivedStats.currentMagicPoints = 3;
      expect(service.canAfford(character, mpSpell).ok).toBe(true);
    });

    it('rejects rune spells when rune points are spent', () => {
      const character = makeCharacter();
      character.magic.runePoints = 3;
      character.magic.currentRunePoints = 1;
      const runeSpell: CastableSpell = {
        name: 'Lightning', category: 'rune', cost: 2, costLabel: '2 RP',
        resource: 'rune-points', effect: { name: 'Lightning', target: 'enemy', kind: 'damage', notation: '3d6' },
      };
      expect(service.canAfford(character, runeSpell).ok).toBe(false);
    });

    it('tracks OSRIC slot exhaustion per level', () => {
      const character = makeCharacter();
      const slotSpell: CastableSpell = {
        name: 'Magic Missile', category: 'osric', cost: 1, costLabel: 'L1 slot',
        resource: 'spell-slot', effect: { name: 'Magic Missile', target: 'enemy', kind: 'damage', notation: '1d4+1' },
      };
      expect(service.canAfford(character, slotSpell, {}, [2, 1]).ok).toBe(true);
      expect(service.canAfford(character, slotSpell, { 1: 2 }, [2, 1]).ok).toBe(false);
    });

    it('Kal-Arath pact spells are always affordable', () => {
      const spell: CastableSpell = {
        name: 'Vision of Transience', category: 'pact', cost: 1, costLabel: 'Tier 1',
        resource: 'none', effect: { name: 'Vision of Transience', target: 'enemy', kind: 'damage', notation: 'd6' },
      };
      expect(service.canAfford(makeCharacter(), spell).ok).toBe(true);
    });
  });

  describe('deductCost', () => {
    const mpSpell: CastableSpell = {
      name: 'Heal', category: 'spirit', cost: 3, costLabel: '3 MP',
      resource: 'magic-points', effect: { name: 'Heal', target: 'ally', kind: 'healing', notation: '1' },
    };

    it('charges full MP on success and 1 MP on failure', () => {
      const character = makeCharacter();
      service.deductCost(character, mpSpell, { success: true });
      expect(character.derivedStats.currentMagicPoints).toBe(9);
      service.deductCost(character, mpSpell, { success: false });
      expect(character.derivedStats.currentMagicPoints).toBe(8);
      expect(characterService.updateCharacter).toHaveBeenCalledTimes(2);
    });

    it('floors magic points at zero', () => {
      const character = makeCharacter();
      character.derivedStats.currentMagicPoints = 1;
      service.deductCost(character, mpSpell, { success: true });
      expect(character.derivedStats.currentMagicPoints).toBe(0);
    });

    it('Dragonbane WP is spent even on failure', () => {
      const character = makeCharacter();
      const wpSpell: CastableSpell = { ...mpSpell, cost: 2, resource: 'willpower-points' };
      service.deductCost(character, wpSpell, { success: false });
      expect(character.derivedStats.currentMagicPoints).toBe(10);
    });

    it('rune points are only spent on success', () => {
      const character = makeCharacter();
      character.magic.runePoints = 3;
      character.magic.currentRunePoints = 3;
      const runeSpell: CastableSpell = { ...mpSpell, cost: 2, resource: 'rune-points' };
      service.deductCost(character, runeSpell, { success: false });
      expect(character.magic.currentRunePoints).toBe(3);
      service.deductCost(character, runeSpell, { success: true });
      expect(character.magic.currentRunePoints).toBe(1);
    });
  });

  describe('rollCastCheck', () => {
    it('auto checks always succeed', () => {
      expect(service.rollCastCheck({ kind: 'auto' })).toMatchObject({ success: true, crit: false, fumble: false });
    });

    it('percentile checks respect the target bounds', () => {
      expect(service.rollCastCheck({ kind: 'percentile-under', target: 100, label: 'x' }).success).toBe(true);
      expect(service.rollCastCheck({ kind: 'percentile-under', target: 0, label: 'x' }).success).toBe(false);
    });

    it('2d6 checks always succeed when the target is trivially low', () => {
      const result = service.rollCastCheck({ kind: '2d6-over', bonus: 0, target: 2, label: 'INT' });
      expect(result.success || result.fumble).toBe(true);
    });
  });

  describe('rollResistance', () => {
    it('clamps the resistance chance to 5–95%', () => {
      expect(service.rollResistance(30, 1).display).toContain('vs 95%');
      expect(service.rollResistance(1, 30).display).toContain('vs 5%');
      expect(service.rollResistance(12, 12).display).toContain('vs 50%');
    });
  });

  describe('rollSpellAmount', () => {
    it('rolls per point for variable spells', () => {
      const healSpell: CastableSpell = {
        name: 'Heal', category: 'spirit', cost: 3, costLabel: '3 MP',
        resource: 'magic-points',
        effect: { name: 'Heal', target: 'ally', kind: 'healing', notation: '1', perPoint: true },
      };
      const amount = service.rollSpellAmount(healSpell, 1, { explode: false, doubleDice: false });
      expect(amount).toMatchObject({ total: 3 }); // '1' three times
    });

    it("returns 'full' for full heals and null when nothing is rollable", () => {
      const fullHeal: CastableSpell = {
        name: 'Heal Body', category: 'rune', cost: 3, costLabel: '3 RP',
        resource: 'rune-points',
        effect: { name: 'Heal Body', target: 'ally', kind: 'healing', notation: 'full' },
      };
      expect(service.rollSpellAmount(fullHeal, 1, { explode: false, doubleDice: false })).toBe('full');
      const utility: CastableSpell = {
        name: 'Bless', category: 'osric', cost: 1, costLabel: 'L1 slot',
        resource: 'spell-slot', effect: { name: 'Bless', target: 'ally', kind: 'utility' },
      };
      expect(service.rollSpellAmount(utility, 1, { explode: false, doubleDice: false })).toBeNull();
    });

    it('uses notationForLevel with the caster level', () => {
      const missile: CastableSpell = {
        name: 'Magic Missile', category: 'osric', cost: 1, costLabel: 'L1 slot',
        resource: 'spell-slot',
        effect: {
          name: 'Magic Missile', target: 'enemy', kind: 'damage',
          notationForLevel: (lvl) => `${lvl}`,  // deterministic: flat number equal to level
        },
      };
      const amount = service.rollSpellAmount(missile, 7, { explode: false, doubleDice: false });
      expect(amount).toMatchObject({ total: 7 });
    });

    it('doubles the dice on a crit', () => {
      const bolt: CastableSpell = {
        name: 'Test', category: 'pact', cost: 1, costLabel: 'Tier 1', resource: 'none',
        effect: { name: 'Test', target: 'enemy', kind: 'damage', notation: '5' },
      };
      const amount = service.rollSpellAmount(bolt, 1, { explode: false, doubleDice: true });
      expect(amount).toMatchObject({ total: 10 });
    });
  });

  describe('restoreResources', () => {
    it('refills MP and rune points to max', () => {
      const character = makeCharacter();
      character.derivedStats.currentMagicPoints = 2;
      character.magic.runePoints = 3;
      character.magic.currentRunePoints = 0;
      service.restoreResources(character);
      expect(character.derivedStats.currentMagicPoints).toBe(12);
      expect(character.magic.currentRunePoints).toBe(3);
      expect(characterService.updateCharacter).toHaveBeenCalled();
    });
  });

  describe('getResourceDisplay', () => {
    it('shows MP and RP for RuneQuest', () => {
      const character = makeCharacter();
      character.magic.runePoints = 3;
      character.magic.currentRunePoints = 2;
      expect(service.getResourceDisplay(character, new RuneQuestRules())).toBe('MP 12/12 · RP 2/3');
    });

    it('shows WP for Dragonbane', () => {
      const character = makeCharacter();
      character.derivedStats.currentMagicPoints = 5;
      expect(service.getResourceDisplay(character, new DragonbaneRules())).toBe('WP 5/12');
    });

    it('shows remaining OSRIC slots', () => {
      const character = makeCharacter({
        background: { cult: '', occupation: 'Magic User', homeland: '', age: 21, gender: '' },
        resources: { lunars: 0, wheels: 0, clacks: 0, reputation: 0, ransom: 0, level: 5 },
      });
      expect(service.getResourceDisplay(character, new OsricRules(), { 1: 1 }))
        .toBe('Slots L1 3/4, L2 2/2, L3 1/1');
    });

    it('returns null for Kal-Arath (no pool)', () => {
      expect(service.getResourceDisplay(makeCharacter(), new KalArathRules())).toBeNull();
    });
  });
});
