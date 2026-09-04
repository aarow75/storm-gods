import { coordToHexId, formatHexId, hexIdToCoord, parseHexId } from './hex-id.util';

describe('formatHexId / parseHexId', () => {
  it('formats top-left as 0000 and pads to 4 digits', () => {
    expect(formatHexId(0, 0)).toBe('0000');
    expect(formatHexId(0, 1)).toBe('0001');
    expect(formatHexId(1, 0)).toBe('0100');
    expect(formatHexId(1, 5)).toBe('0105');
  });

  it('round-trips row/col through parseHexId', () => {
    expect(parseHexId('0000')).toEqual({ row: 0, col: 0 });
    expect(parseHexId('0102')).toEqual({ row: 1, col: 2 });
    expect(parseHexId('4099')).toEqual({ row: 40, col: 99 });
  });

  it('rejects ids that are not exactly 4 digits', () => {
    expect(parseHexId('102')).toBeNull();
    expect(parseHexId('10203')).toBeNull();
    expect(parseHexId('abcd')).toBeNull();
  });
});

describe('hexIdToCoord / coordToHexId', () => {
  it('round-trips axial coordinates through a hex id', () => {
    for (const { q, r } of [{ q: 0, r: 0 }, { q: 3, r: 5 }, { q: -2, r: 4 }, { q: 0, r: 7 }]) {
      const id = coordToHexId(q, r);
      expect(hexIdToCoord(id)).toEqual({ q, r });
    }
  });

  it('matches the offset grid math used by hex-grid.util / hex-pathfinding', () => {
    // row 1, col 0 -> q = 0 - floor(1/2) = 0, r = 1
    expect(hexIdToCoord('0100')).toEqual({ q: 0, r: 1 });
    expect(coordToHexId(0, 1)).toBe('0100');
  });

  it('returns null for a malformed id', () => {
    expect(hexIdToCoord('12')).toBeNull();
  });
});
