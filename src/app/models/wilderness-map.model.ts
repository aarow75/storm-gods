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
}

export interface WildernessToken {
  id: string;
  name: string;
  color: string;
  sourceType: 'character' | 'custom';
  characterId?: string;
  position?: HexCoord;
}

export interface WildernessMapState {
  tiles: Record<string, TerrainType>;
  tokens: WildernessToken[];
  terrainMaps: Record<string, Record<string, TerrainType>>;
  tokenMaps: Record<string, WildernessToken[]>;
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
