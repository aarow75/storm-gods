import { DiceService } from './dice.service';
import { UIStateService } from './ui-state.service';

describe('DiceService', () => {
  let service: DiceService;

  beforeEach(() => {
    service = new DiceService({ use2d6Plus6: () => false } as unknown as UIStateService);
  });

  describe('rollDiceNotation', () => {
    it('parses 1d% as a percentile die (1-100)', () => {
      for (let i = 0; i < 50; i++) {
        const result = service.rollDiceNotation('1d%');
        expect(result.total).toBeGreaterThanOrEqual(1);
        expect(result.total).toBeLessThanOrEqual(100);
        expect(result.breakdown).toContain('1d%');
      }
    });

    it('parses plain dice with modifiers (2d6+1)', () => {
      const result = service.rollDiceNotation('2d6+1');
      expect(result.total).toBeGreaterThanOrEqual(3);
      expect(result.total).toBeLessThanOrEqual(13);
      expect(result.breakdown).toContain('2d6');
      expect(result.breakdown).toContain('+1');
    });

    it('parses advantage notation (d6/a)', () => {
      const result = service.rollDiceNotation('d6/a');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(6);
      expect(result.breakdown).toContain('1d6/a');
    });

    it('parses disadvantage notation (d6/d)', () => {
      const result = service.rollDiceNotation('d6/d');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(6);
      expect(result.breakdown).toContain('1d6/d');
    });

    it('parses multi-dice expressions (1d8+1d4-1)', () => {
      const result = service.rollDiceNotation('1d8+1d4-1');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(11);
      expect(result.breakdown).toContain('1d8');
      expect(result.breakdown).toContain('1d4');
    });

    it('returns Special for special damage', () => {
      expect(service.rollDiceNotation('special')).toEqual({ total: 0, breakdown: 'Special' });
    });

    it('keeps text riders in the breakdown (1d6+poison)', () => {
      const result = service.rollDiceNotation('1d6+poison');
      expect(result.total).toBeGreaterThanOrEqual(1);
      expect(result.total).toBeLessThanOrEqual(6);
      expect(result.breakdown).toContain('poison');
    });

    it('parses large Mothership dice pools (5d10)', () => {
      const result = service.rollDiceNotation('5d10');
      expect(result.total).toBeGreaterThanOrEqual(5);
      expect(result.total).toBeLessThanOrEqual(50);
    });
  });
});
