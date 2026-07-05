import { vi } from 'vitest';
import { CombatService } from './combat.service';
import { CombatParticipant } from '@combat/models/combat.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { DiceService } from '@shared/services/dice.service';
import { CharacterStats } from '@shared/models/character-stats.model';

function participant(overrides: Partial<CombatParticipant>): CombatParticipant {
  return {
    id: Math.random().toString(36).slice(2),
    name: 'P',
    type: 'character',
    maxHitPoints: 10,
    currentHitPoints: [],
    baseStrikeRank: 0,
    finalStrikeRank: 0,
    ...overrides,
  };
}

function stats(overrides: Partial<CharacterStats> = {}): CharacterStats {
  return { STR: 0, CON: 0, SIZ: 0, DEX: 0, INT: 0, POW: 0, CHA: 0, ...overrides };
}

describe('CombatService', () => {
  let service: CombatService;
  let dice: { rollD6: ReturnType<typeof vi.fn>; rollPercentile: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    dice = { rollD6: vi.fn(), rollPercentile: vi.fn() };
    service = new CombatService(
      { gameSystem: () => 'runequest', getRules: () => ({}) } as unknown as GameSystemService,
      dice as unknown as DiceService
    );
  });

  describe('sortParticipantsByStrikeRank', () => {
    it('sorts by effectiveSR/finalStrikeRank when no initiative was rolled (RuneQuest regression)', () => {
      const a = participant({ name: 'a', finalStrikeRank: 5 });
      const b = participant({ name: 'b', finalStrikeRank: 2 });
      const c = participant({ name: 'c', finalStrikeRank: 4, effectiveSR: 1 });
      expect(service.sortParticipantsByStrikeRank([a, b, c]).map(p => p.name)).toEqual(['c', 'b', 'a']);
    });

    it('prefers rolled initiativeOrder over strike rank', () => {
      const a = participant({ name: 'a', finalStrikeRank: 0, initiativeOrder: 2 });
      const b = participant({ name: 'b', finalStrikeRank: 9, initiativeOrder: 0 });
      expect(service.sortParticipantsByStrikeRank([a, b]).map(p => p.name)).toEqual(['b', 'a']);
    });
  });

  describe('rollInitiativeForRound', () => {
    it('is a no-op for strike-rank systems', () => {
      const p = participant({ finalStrikeRank: 3 });
      const lines = service.rollInitiativeForRound([p], { kind: 'strike-rank' }, () => stats());
      expect(lines).toEqual([]);
      expect(p.initiativeOrder).toBeUndefined();
    });

    it('side-d6: the lower-rolling side acts first (OSRIC)', () => {
      dice.rollD6.mockReturnValueOnce(2).mockReturnValueOnce(4); // party 2, enemies 4
      const pc = participant({ name: 'pc', type: 'character' });
      const npc = participant({ name: 'npc', type: 'monster' });
      const lines = service.rollInitiativeForRound([pc, npc], { kind: 'side-d6' }, () => stats());
      expect(pc.initiativeOrder).toBe(2);
      expect(npc.initiativeOrder).toBe(4);
      expect(lines[0]).toContain('party acts first');
    });

    it('side-d6: a tie is simultaneous (equal keys, stable order)', () => {
      dice.rollD6.mockReturnValue(3);
      const pc = participant({ name: 'pc', type: 'character' });
      const npc = participant({ name: 'npc', type: 'monster' });
      const lines = service.rollInitiativeForRound([pc, npc], { kind: 'side-d6' }, () => stats());
      expect(pc.initiativeOrder).toBe(npc.initiativeOrder);
      expect(lines[0]).toContain('simultaneous');
    });

    it('d6-plus-stat: natural 1 loses initiative even with a high stat', () => {
      dice.rollD6.mockReturnValue(1);
      const pc = participant({ type: 'character' });
      service.rollInitiativeForRound(
        [pc], { kind: 'd6-plus-stat', stat: 'DEX', statLabel: 'AGI', target: 4 },
        () => stats({ DEX: 5 })
      );
      expect(pc.initiativeOrder).toBe(2);
      expect(pc.initiativeDisplay).toContain('natural 1');
    });

    it('d6-plus-stat: meeting the target acts before monsters; failing acts after', () => {
      dice.rollD6.mockReturnValueOnce(3).mockReturnValueOnce(2);
      const fast = participant({ name: 'fast', type: 'character' });   // 3 + 2 = 5 ≥ 4
      const slow = participant({ name: 'slow', type: 'character' });   // 2 + 0 = 2 < 4
      const npc = participant({ name: 'npc', type: 'monster' });
      service.rollInitiativeForRound(
        [fast, slow, npc], { kind: 'd6-plus-stat', stat: 'DEX', statLabel: 'AGI', target: 4 },
        p => stats({ DEX: p.name === 'fast' ? 2 : 0 })
      );
      expect(fast.initiativeOrder).toBe(0);
      expect(npc.initiativeOrder).toBe(1);
      expect(slow.initiativeOrder).toBe(2);
    });

    it('unique-cards: every participant gets a distinct card, even beyond deck size', () => {
      const many = Array.from({ length: 12 }, (_, i) => participant({ name: `p${i}` }));
      service.rollInitiativeForRound([...many], { kind: 'unique-cards', deckSize: 10 }, () => stats());
      const cards = many.map(p => p.initiativeOrder);
      expect(new Set(cards).size).toBe(12);
      cards.forEach(c => {
        expect(c).toBeGreaterThanOrEqual(1);
        expect(c).toBeLessThanOrEqual(12);
      });
    });

    it('stat-check: passing acts before monsters, failing acts after', () => {
      dice.rollPercentile.mockReturnValueOnce(30).mockReturnValueOnce(90);
      const pass = participant({ name: 'pass', type: 'character' }); // 30 ≤ 40
      const fail = participant({ name: 'fail', type: 'character' }); // 90 > 40
      const npc = participant({ name: 'npc', type: 'monster' });
      service.rollInitiativeForRound(
        [pass, fail, npc], { kind: 'stat-check', stat: 'CON', statLabel: 'Speed' },
        () => stats({ CON: 40 })
      );
      expect(pass.initiativeOrder).toBe(0);
      expect(npc.initiativeOrder).toBe(1);
      expect(fail.initiativeOrder).toBe(2);
      expect(pass.initiativeDisplay).toContain('pass');
      expect(fail.initiativeDisplay).toContain('fail');
    });
  });

  describe('clearInitiative', () => {
    it('removes all rolled initiative fields', () => {
      const p = participant({ initiativeRoll: 5, initiativeOrder: 0, initiativeDisplay: 'Card 5' });
      service.clearInitiative([p]);
      expect(p.initiativeRoll).toBeUndefined();
      expect(p.initiativeOrder).toBeUndefined();
      expect(p.initiativeDisplay).toBeUndefined();
    });
  });
});
