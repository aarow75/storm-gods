export type LandmarkIconType =
  | 'city' | 'town' | 'village' | 'temple'
  | 'ruins' | 'keep' | 'dungeon' | 'poi';

export interface LandmarkIconDefinition {
  id: LandmarkIconType;
  label: string;
  symbol: string;
  defaultColor: string;
}

export const LANDMARK_ICONS: LandmarkIconDefinition[] = [
  { id: 'city',    label: 'City',    symbol: '⌂', defaultColor: '#8B4513' },
  { id: 'town',    label: 'Town',    symbol: '▣', defaultColor: '#CD853F' },
  { id: 'village', label: 'Village', symbol: '△', defaultColor: '#DAA520' },
  { id: 'temple',  label: 'Temple',  symbol: '✙', defaultColor: '#9932CC' },
  { id: 'ruins',   label: 'Ruins',   symbol: '◈', defaultColor: '#808080' },
  { id: 'keep',    label: 'Keep',    symbol: '◆', defaultColor: '#4682B4' },
  { id: 'dungeon', label: 'Dungeon', symbol: '⬡', defaultColor: '#2F4F4F' },
  { id: 'poi',     label: 'Point',   symbol: '●', defaultColor: '#20B2AA' },
];

export type TerrainType =
  | 'plains'
  | 'forest'
  | 'dense-forest'
  | 'hills'
  | 'mountains'
  | 'river'
  | 'road'
  | 'swamp'
  | 'desert'
  | 'none';

export interface HexCoord {
  q: number;
  r: number;
}

export interface CustomMap {
  id: string;
  label: string;
  width: number;
  height: number;
  scale: number;
  scaleUnit: 'miles' | 'kilometers';
  /** Id of a MAP_BACKGROUNDS entry to render behind this map's hex grid, if any. */
  backgroundImage?: string;
}

export interface WildernessToken {
  id: string;
  name: string;
  color: string;
  sourceType: 'character' | 'custom';
  characterId?: string;
  position?: HexCoord;
  iconType?: LandmarkIconType;
}

export type DangerLevel = 'unknown' | 'safe' | 'caution' | 'dangerous';

export interface HexEncounterLogEntry {
  day: number;
  description: string;
  outcome?: string;
}

export interface PointOfInterest {
  id: string;
  label: string;
  notes?: string;
  source?: 'import';
}

export interface HexData {
  visited: boolean;
  firstVisitedDay?: number;
  lastVisitedDay?: number;
  dangerLevel: DangerLevel;
  pointsOfInterest: PointOfInterest[];
  notes?: string;
  encounterHistory: HexEncounterLogEntry[];
}

export const DEFAULT_HEX_DATA: HexData = {
  visited: false,
  dangerLevel: 'unknown',
  pointsOfInterest: [],
  encounterHistory: [],
};

export interface WildernessMapState {
  tiles: Record<string, TerrainType>;
  tokens: WildernessToken[];
  terrainMaps: Record<string, Record<string, TerrainType>>;
  tokenMaps: Record<string, WildernessToken[]>;
  hexDataMaps?: Record<string, Record<string, HexData>>;
  customMaps: CustomMap[];
  currentMapId?: string;
  backgroundImage?: string;
  mapMode?: 'terrain' | 'image';
  gridWidth?: number;
  gridHeight?: number;
  scale?: number;
  scaleUnit?: 'miles' | 'kilometers';
  showTerrainOverlay?: boolean;
  hexBorderOpacity?: number;
  terrainOpacity?: number;
  viewZoom?: number;
  viewPanX?: number;
  viewPanY?: number;
}

export const GRID_COLS = 40;
export const GRID_ROWS = 40;
export const HEX_SIZE = 18;

export const DEFAULT_WILDERNESS_STATE: WildernessMapState = {
  tiles: {},
  tokens: [],
  terrainMaps: {},
  tokenMaps: {},
  hexDataMaps: {},
  customMaps: [],
  mapMode: 'terrain',
  gridWidth: GRID_COLS,
  gridHeight: GRID_ROWS,
  hexBorderOpacity: 1,
  viewZoom: 1,
  viewPanX: 0,
  viewPanY: 0,
};

export function tileKey(q: number, r: number): string {
  return `${q},${r}`;
}

export function parseTileKey(key: string): HexCoord {
  const [q, r] = key.split(',').map(Number);
  return { q, r };
}

export interface TerrainMapExport {
  id: string;
  label: string;
  width: number;
  height: number;
  scale: number;
  scaleUnit: 'miles' | 'kilometers';
  terrain: Record<string, TerrainType>;
  tokens?: WildernessToken[];
}

export interface TerrainExportFile {
  exportType: 'terrain-maps';
  version: 1;
  exportedAt: string;
  maps: TerrainMapExport[];
}

export interface TerrainExportFileV2 {
  exportType: 'terrain-maps';
  version: 2;
  exportedAt: string;
  customMaps: CustomMap[];
  terrainMaps: Record<string, Record<string, TerrainType>>;
  tokenMaps: Record<string, WildernessToken[]>;
}
