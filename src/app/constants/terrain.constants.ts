import { TerrainType } from '../models/wilderness-map.model';

export interface TerrainDefinition {
  id: TerrainType;
  label: string;
  moveCost: number;
  fillColor: string;
  strokeColor: string;
}

export const TERRAIN_DEFINITIONS: TerrainDefinition[] = [
  { id: 'none', label: 'Clear', moveCost: 1, fillColor: '#f5f0e8', strokeColor: '#ccc' },
  { id: 'road', label: 'Road', moveCost: 0.5, fillColor: '#d4b483', strokeColor: '#b8956a' },
  { id: 'plains', label: 'Plains', moveCost: 1, fillColor: '#c8e6a0', strokeColor: '#a0c060' },
  { id: 'forest', label: 'Forest', moveCost: 2, fillColor: '#4a7c40', strokeColor: '#2e5a28' },
  { id: 'dense-forest', label: 'Dense Forest', moveCost: 3, fillColor: '#2d5a22', strokeColor: '#1a3a14' },
  { id: 'hills', label: 'Hills', moveCost: 2, fillColor: '#c8a878', strokeColor: '#a08050' },
  { id: 'mountains', label: 'Mountains', moveCost: 4, fillColor: '#8c7b6b', strokeColor: '#6b5a4a' },
  { id: 'river', label: 'River', moveCost: 3, fillColor: '#6bbbd4', strokeColor: '#4a9ab8' },
  { id: 'swamp', label: 'Swamp', moveCost: 4, fillColor: '#7a9a6a', strokeColor: '#5a7a4a' },
  { id: 'desert', label: 'Desert', moveCost: 2, fillColor: '#e8d0a0', strokeColor: '#c8b070' },
];

export const TERRAIN_MAP: Record<TerrainType, TerrainDefinition> = Object.fromEntries(
  TERRAIN_DEFINITIONS.map((t) => [t.id, t])
) as Record<TerrainType, TerrainDefinition>;
