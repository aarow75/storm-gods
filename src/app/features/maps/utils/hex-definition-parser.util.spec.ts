import { HexData, TerrainType, tileKey } from '@maps/models/wilderness-map.model';
import {
  applyHexDefinitions,
  computeRequiredGridSize,
  parseHexDefinitionFile,
} from './hex-definition-parser.util';
import { hexIdToCoord } from './hex-id.util';

const SAMPLE = `
# lines starting with # or blank are ignored

0102 forest "Old watchtower ruins - bandits camped here"
0203 mountains
0305 swamp "Will-o-wisps lure travelers into the bog"
0410 "Abandoned shrine, no monsters"
`;

describe('parseHexDefinitionFile', () => {
  it('parses all four line shapes (terrain+desc, terrain only, terrain+desc, desc only)', () => {
    const { entries, errors } = parseHexDefinitionFile(SAMPLE);
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { hexId: '0102', row: 1, col: 2, terrain: 'forest', description: 'Old watchtower ruins - bandits camped here' },
      { hexId: '0203', row: 2, col: 3, terrain: 'mountains', description: undefined },
      { hexId: '0305', row: 3, col: 5, terrain: 'swamp', description: 'Will-o-wisps lure travelers into the bog' },
      { hexId: '0410', row: 4, col: 10, terrain: undefined, description: 'Abandoned shrine, no monsters' },
    ]);
  });

  it('treats an unrecognized word after the id as part of the description, not an error', () => {
    const { entries, errors } = parseHexDefinitionFile('0001 haunted woods nearby');
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { hexId: '0001', row: 0, col: 1, terrain: undefined, description: 'haunted woods nearby' },
    ]);
  });

  it('allows an id-only line as a no-op entry', () => {
    const { entries, errors } = parseHexDefinitionFile('0007');
    expect(errors).toEqual([]);
    expect(entries).toEqual([{ hexId: '0007', row: 0, col: 7, terrain: undefined, description: undefined }]);
  });

  it('reports an error for a malformed id and skips the line', () => {
    const { entries, errors } = parseHexDefinitionFile('12 forest\n0001 plains');
    expect(entries).toEqual([{ hexId: '0001', row: 0, col: 1, terrain: 'plains', description: undefined }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/Line 1.*4-digit/);
  });

  it('reports an error for a duplicate hex id and keeps only the first occurrence', () => {
    const { entries, errors } = parseHexDefinitionFile('0001 plains\n0001 forest');
    expect(entries).toEqual([{ hexId: '0001', row: 0, col: 1, terrain: 'plains', description: undefined }]);
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatch(/Line 2.*duplicate hex id 0001/);
  });

  it('parses a danger level word after the terrain', () => {
    const { entries, errors } = parseHexDefinitionFile('0132 mountains dangerous "Triton stronghold"');
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { hexId: '0132', row: 1, col: 32, terrain: 'mountains', dangerLevel: 'dangerous', description: 'Triton stronghold' },
    ]);
  });

  it('parses a danger level word without terrain', () => {
    const { entries, errors } = parseHexDefinitionFile('0201 caution "Bandit ambush spot"');
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { hexId: '0201', row: 2, col: 1, terrain: undefined, dangerLevel: 'caution', description: 'Bandit ambush spot' },
    ]);
  });

  it('parses a danger level word before terrain', () => {
    const { entries, errors } = parseHexDefinitionFile('0301 safe hills');
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { hexId: '0301', row: 3, col: 1, terrain: 'hills', dangerLevel: 'safe', description: undefined },
    ]);
  });

  it('parses a bare danger level word with no terrain or description', () => {
    const { entries, errors } = parseHexDefinitionFile('0007 unknown');
    expect(errors).toEqual([]);
    expect(entries).toEqual([
      { hexId: '0007', row: 0, col: 7, terrain: undefined, dangerLevel: 'unknown', description: undefined },
    ]);
  });
});

describe('applyHexDefinitions', () => {
  it('paints terrain and adds a point of interest for described hexes', () => {
    const { entries } = parseHexDefinitionFile(SAMPLE);
    const tiles: Record<string, TerrainType> = {};
    const hexData: Record<string, HexData> = {};

    const result = applyHexDefinitions(entries, tiles, hexData);

    expect(result).toEqual({ painted: 3, described: 3, flagged: 0 });

    const forestCoord = hexIdToCoord('0102')!;
    expect(tiles[tileKey(forestCoord.q, forestCoord.r)]).toBe('forest');

    const shrineCoord = hexIdToCoord('0410')!;
    expect(tiles[tileKey(shrineCoord.q, shrineCoord.r)]).toBeUndefined();
    const shrineData = hexData[tileKey(shrineCoord.q, shrineCoord.r)];
    expect(shrineData.pointsOfInterest).toEqual([
      { id: 'import-0410', label: 'Abandoned shrine, no monsters', source: 'import' },
    ]);
  });

  it('re-importing the same file replaces the prior import POI instead of duplicating it', () => {
    const { entries } = parseHexDefinitionFile('0001 forest "First description"');
    const tiles: Record<string, TerrainType> = {};
    const hexData: Record<string, HexData> = {};

    applyHexDefinitions(entries, tiles, hexData);
    const { entries: entries2 } = parseHexDefinitionFile('0001 forest "Updated description"');
    applyHexDefinitions(entries2, tiles, hexData);

    const coord = hexIdToCoord('0001')!;
    const data = hexData[tileKey(coord.q, coord.r)];
    expect(data.pointsOfInterest).toEqual([
      { id: 'import-0001', label: 'Updated description', source: 'import' },
    ]);
  });

  it('sets the danger level on a hex and counts it as flagged', () => {
    const { entries } = parseHexDefinitionFile('0132 mountains dangerous "Triton stronghold"');
    const tiles: Record<string, TerrainType> = {};
    const hexData: Record<string, HexData> = {};

    const result = applyHexDefinitions(entries, tiles, hexData);

    expect(result).toEqual({ painted: 1, described: 1, flagged: 1 });
    const coord = hexIdToCoord('0132')!;
    expect(hexData[tileKey(coord.q, coord.r)].dangerLevel).toBe('dangerous');
  });

  it('preserves manually-added points of interest on the same hex', () => {
    const { entries } = parseHexDefinitionFile('0001 forest "Imported note"');
    const tiles: Record<string, TerrainType> = {};
    const coord = hexIdToCoord('0001')!;
    const key = tileKey(coord.q, coord.r);
    const hexData: Record<string, HexData> = {
      [key]: {
        visited: false,
        dangerLevel: 'unknown',
        pointsOfInterest: [{ id: 'manual-1', label: 'GM-added landmark' }],
        encounterHistory: [],
      },
    };

    applyHexDefinitions(entries, tiles, hexData);

    expect(hexData[key].pointsOfInterest).toEqual([
      { id: 'manual-1', label: 'GM-added landmark' },
      { id: 'import-0001', label: 'Imported note', source: 'import' },
    ]);
  });
});

describe('computeRequiredGridSize', () => {
  it('returns the max row+1 / col+1 needed to fit all entries', () => {
    const { entries } = parseHexDefinitionFile(SAMPLE);
    expect(computeRequiredGridSize(entries)).toEqual({ width: 11, height: 5 });
  });

  it('returns zero size for no entries', () => {
    expect(computeRequiredGridSize([])).toEqual({ width: 0, height: 0 });
  });
});
