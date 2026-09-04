import { DangerLevel, DEFAULT_HEX_DATA, HexData, PointOfInterest, TerrainType, tileKey } from '@maps/models/wilderness-map.model';
import { TERRAIN_MAP } from '@maps/constants/terrain.constants';
import { hexIdToCoord } from './hex-id.util';

const DANGER_WORDS: ReadonlySet<string> = new Set(['unknown', 'safe', 'caution', 'dangerous']);

export interface HexDefinitionEntry {
  hexId: string;
  row: number;
  col: number;
  terrain?: TerrainType;
  dangerLevel?: DangerLevel;
  description?: string;
}

export interface HexDefinitionParseResult {
  entries: HexDefinitionEntry[];
  errors: string[];
}

function stripQuotes(text: string): string {
  const match = text.match(/^"([\s\S]*)"$/);
  return match ? match[1] : text;
}

export function parseHexDefinitionFile(text: string): HexDefinitionParseResult {
  const entries: HexDefinitionEntry[] = [];
  const errors: string[] = [];
  const seen = new Map<string, number>();

  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const lineNum = i + 1;
    const line = lines[i].trim();
    if (!line || line.startsWith('#')) continue;

    const tokenMatch = line.match(/^(\S+)(?:\s+([\s\S]*))?$/);
    const id = tokenMatch?.[1] ?? '';
    if (!/^\d{4}$/.test(id)) {
      errors.push(`Line ${lineNum}: expected a 4-digit hex id, got "${id}"`);
      continue;
    }

    if (seen.has(id)) {
      errors.push(`Line ${lineNum}: duplicate hex id ${id} (first seen on line ${seen.get(id)})`);
      continue;
    }
    seen.set(id, lineNum);

    const row = Math.floor(Number(id) / 100);
    const col = Number(id) % 100;

    let remaining = (tokenMatch?.[2] ?? '').trim();
    let terrain: TerrainType | undefined;
    let dangerLevel: DangerLevel | undefined;

    // Up to two leading marker words (terrain and/or danger level, in either order)
    // may precede the description.
    for (let markers = 0; markers < 2 && remaining; markers++) {
      const wordMatch = remaining.match(/^([A-Za-z-]+)(?:\s+([\s\S]*))?$/);
      const candidate = wordMatch?.[1]?.toLowerCase();
      if (candidate && !terrain && candidate in TERRAIN_MAP) {
        terrain = candidate as TerrainType;
        remaining = (wordMatch?.[2] ?? '').trim();
      } else if (candidate && !dangerLevel && DANGER_WORDS.has(candidate)) {
        dangerLevel = candidate as DangerLevel;
        remaining = (wordMatch?.[2] ?? '').trim();
      } else {
        break;
      }
    }

    const description = remaining ? stripQuotes(remaining) : undefined;

    entries.push({ hexId: id, row, col, terrain, dangerLevel, description });
  }

  return { entries, errors };
}

export interface HexDefinitionApplyResult {
  painted: number;
  described: number;
  flagged: number;
}

export function applyHexDefinitions(
  entries: HexDefinitionEntry[],
  tiles: Record<string, TerrainType>,
  hexData: Record<string, HexData>
): HexDefinitionApplyResult {
  let painted = 0;
  let described = 0;
  let flagged = 0;

  for (const entry of entries) {
    const coord = hexIdToCoord(entry.hexId);
    if (!coord) continue;
    const key = tileKey(coord.q, coord.r);

    if (entry.terrain) {
      tiles[key] = entry.terrain;
      painted++;
    }

    if (entry.description) {
      const existing = hexData[key] ?? { ...DEFAULT_HEX_DATA };
      const importPoiId = `import-${entry.hexId}`;
      const withoutOldImport = existing.pointsOfInterest.filter((p) => p.id !== importPoiId);
      const poi: PointOfInterest = { id: importPoiId, label: entry.description, source: 'import' };
      existing.pointsOfInterest = [...withoutOldImport, poi];
      hexData[key] = existing;
      described++;
    }

    if (entry.dangerLevel) {
      const existing = hexData[key] ?? { ...DEFAULT_HEX_DATA };
      existing.dangerLevel = entry.dangerLevel;
      hexData[key] = existing;
      flagged++;
    }
  }

  return { painted, described, flagged };
}

export function computeRequiredGridSize(entries: HexDefinitionEntry[]): { width: number; height: number } {
  let width = 0;
  let height = 0;
  for (const entry of entries) {
    width = Math.max(width, entry.col + 1);
    height = Math.max(height, entry.row + 1);
  }
  return { width, height };
}
