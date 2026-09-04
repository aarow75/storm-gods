import { computeDaysForCost, computeHoursForCost } from './travel-time.util';

describe('computeHoursForCost', () => {
  it('converts move cost + scale into hours using the 3mph/moveCost-1 baseline', () => {
    // 1 moveCost at 6-mile hexes = 1 hour per hex (matches the wilderness map's road baseline)
    expect(computeHoursForCost(1, 6)).toBe(1);
    expect(computeHoursForCost(4, 6)).toBe(4);
    expect(computeHoursForCost(1, 12)).toBe(2);
  });
});

describe('computeDaysForCost', () => {
  it('divides hours by the hours-per-day (default 8)', () => {
    expect(computeDaysForCost(8, 6)).toBe(1);
    expect(computeDaysForCost(4, 6)).toBe(0.5);
  });

  it('respects a custom hoursPerDay', () => {
    expect(computeDaysForCost(12, 6, 12)).toBe(1);
  });
});
