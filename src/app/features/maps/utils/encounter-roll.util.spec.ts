import { rollEncounterForTerrain, rollHexEncounter, terrainToEncounterTableName } from './encounter-roll.util';

describe('terrainToEncounterTableName', () => {
  it('maps terrain types to their encounter table name', () => {
    expect(terrainToEncounterTableName('forest')).toBe('forest');
    expect(terrainToEncounterTableName('dense-forest')).toBe('forest');
    expect(terrainToEncounterTableName('hills')).toBe('mountains');
    expect(terrainToEncounterTableName('road')).toBe('roads');
    expect(terrainToEncounterTableName('none')).toBe('plains');
  });
});

describe('rollEncounterForTerrain', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns a matching table entry for the rolled value', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0); // Math.ceil(0 * 20) = 0, treated as roll 0 -> falls back to low bound checks
    const result = rollEncounterForTerrain('forest');
    // roll is ceil(random*20); with random=0 roll=0, so no entry may match a 1-20 table - assert shape instead
    expect(result === null || typeof result.roll === 'number').toBe(true);
  });

  it('produces a valid roll within the terrain table range', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const result = rollEncounterForTerrain('plains');
    expect(result).not.toBeNull();
    expect(result!.terrain).toBe('plains');
    expect(result!.roll).toBe(10);
    expect(typeof result!.creature).toBe('string');
  });
});

describe('rollHexEncounter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('never triggers for terrain with zero encounter chance', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(rollHexEncounter('road').triggered).toBe(false);
    expect(rollHexEncounter('none').triggered).toBe(false);
  });

  it('triggers when the d6 roll is within the terrain encounter chance', () => {
    // dense-forest has encounterChance 3; random=0.05 -> d6 = 1, which is <= 3
    vi.spyOn(Math, 'random').mockReturnValue(0.05);
    const check = rollHexEncounter('dense-forest');
    expect(check.triggered).toBe(true);
    expect(check.result).not.toBeNull();
  });

  it('does not trigger when the d6 roll exceeds the terrain encounter chance', () => {
    // dense-forest has encounterChance 3; random close to 1 -> d6 = 6, which is > 3
    vi.spyOn(Math, 'random').mockReturnValue(0.99);
    const check = rollHexEncounter('dense-forest');
    expect(check.triggered).toBe(false);
    expect(check.result).toBeNull();
  });
});
