import { TerrainType } from '@maps/models/wilderness-map.model';

export interface TerrainDefinition {
  id: TerrainType;
  label: string;
  moveCost: number;
  fillColor: string;
  strokeColor: string;
  encounterChance: number;
}

// Using moveCost of 1 being 3 miles per hour (1 hex every 2 hours on a typical 6 mile hex, or 4 "road" hexes per day) as a baseline for roads, other terrains are scaled accordingly.
// This allows for easy calculation of travel times based on terrain types.
// encounterChance is out of 6 (rolled as a d6) - how likely an automatic encounter check triggers when a scenario party enters a hex of this terrain.
export const TERRAIN_DEFINITIONS: TerrainDefinition[] = [
  { id: 'none', label: 'Clear', moveCost: 2, fillColor: '#f5f0e8', strokeColor: '#ccc', encounterChance: 0 },
  { id: 'road', label: 'Road', moveCost: 1, fillColor: '#d4b483', strokeColor: '#b8956a', encounterChance: 0 },
  { id: 'plains', label: 'Plains', moveCost: 2, fillColor: '#c8e6a0', strokeColor: '#a0c060', encounterChance: 1 },
  { id: 'forest', label: 'Forest', moveCost: 4, fillColor: '#4a7c40', strokeColor: '#2e5a28', encounterChance: 2 },
  { id: 'dense-forest', label: 'Dense Forest', moveCost: 6, fillColor: '#2d5a22', strokeColor: '#1a3a14', encounterChance: 3 },
  { id: 'hills', label: 'Hills', moveCost: 4, fillColor: '#c8a878', strokeColor: '#a08050', encounterChance: 1 },
  { id: 'mountains', label: 'Mountains', moveCost: 8, fillColor: '#8c7b6b', strokeColor: '#6b5a4a', encounterChance: 3 },
  { id: 'river', label: 'River', moveCost: 6, fillColor: '#6bbbd4', strokeColor: '#4a9ab8', encounterChance: 2 },
  { id: 'swamp', label: 'Swamp', moveCost: 8, fillColor: '#7a9a6a', strokeColor: '#7a4a4a', encounterChance: 3 },
  { id: 'desert', label: 'Desert', moveCost: 4, fillColor: '#e8d0a0', strokeColor: '#c8b070', encounterChance: 1 },
];

export const TERRAIN_MAP: Record<TerrainType, TerrainDefinition> = Object.fromEntries(
  TERRAIN_DEFINITIONS.map((t) => [t.id, t])
) as Record<TerrainType, TerrainDefinition>;
