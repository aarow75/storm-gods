import { TerrainType } from '@maps/models/wilderness-map.model';
import { TERRAIN_MAP } from '@maps/constants/terrain.constants';
import { ENCOUNTER_TABLES, EncounterEntry } from '@bestiary/constants/encounters.constants';

export interface EncounterRollResult {
  roll: number;
  creature: string;
  count: string;
  difficulty: EncounterEntry['difficulty'];
  terrain: string;
}

const TERRAIN_TO_TABLE: Partial<Record<TerrainType, string>> = {
  plains: 'plains',
  forest: 'forest',
  'dense-forest': 'forest',
  hills: 'mountains',
  mountains: 'mountains',
  desert: 'desert',
  road: 'roads',
  swamp: 'forest',
  river: 'forest',
  none: 'plains',
};

export function terrainToEncounterTableName(terrain: TerrainType): string {
  return TERRAIN_TO_TABLE[terrain] ?? 'plains';
}

export function rollEncounterForTerrain(terrain: TerrainType): EncounterRollResult | null {
  const tableName = terrainToEncounterTableName(terrain);
  const table = ENCOUNTER_TABLES.find((t) => t.terrain === tableName);
  if (!table) return null;

  const roll = Math.ceil(Math.random() * 20);

  const entry = table.entries.find((e) => {
    const [low, high] = e.roll.includes('-') ? e.roll.split('-').map(Number) : [Number(e.roll), Number(e.roll)];
    return roll >= low && roll <= high;
  });

  if (!entry) return null;
  return {
    roll,
    creature: entry.creature,
    count: entry.count,
    difficulty: entry.difficulty,
    terrain: tableName,
  };
}

export interface HexEncounterCheck {
  triggered: boolean;
  result: EncounterRollResult | null;
}

/**
 * Automatic per-hex-entry check used by scenario travel: rolls a d6 against the
 * terrain's encounterChance (number of faces out of 6 that trigger a check), and
 * if triggered, rolls the terrain's encounter table for the actual encounter.
 */
export function rollHexEncounter(terrain: TerrainType): HexEncounterCheck {
  const chance = TERRAIN_MAP[terrain]?.encounterChance ?? 0;
  if (chance <= 0) return { triggered: false, result: null };

  const d6 = Math.floor(Math.random() * 6) + 1;
  if (d6 > chance) return { triggered: false, result: null };

  return { triggered: true, result: rollEncounterForTerrain(terrain) };
}
