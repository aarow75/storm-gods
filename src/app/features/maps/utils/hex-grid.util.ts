import { TerrainType } from '@maps/models/wilderness-map.model';
import { TERRAIN_DEFINITIONS } from '@maps/constants/terrain.constants';

export interface HexCell {
  q: number;
  r: number;
  cx: number;
  cy: number;
  points: string;
}

export interface HexGrid {
  hexes: HexCell[];
  svgWidth: number;
  svgHeight: number;
}

export function buildHexGrid(cols: number, rows: number, hexSize: number): HexGrid {
  const S = hexSize;
  const sqrt3 = Math.sqrt(3);
  const hexes: HexCell[] = [];

  for (let r = 0; r < rows; r++) {
    for (let qOffset = 0; qOffset < cols; qOffset++) {
      const q = qOffset - Math.floor(r / 2);

      const cx = S * (sqrt3 * q + (sqrt3 / 2) * r);
      const cy = S * ((3 / 2) * r);

      const pts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const angleDeg = 60 * i - 30;
        const angleRad = (Math.PI / 180) * angleDeg;
        pts.push(`${cx + S * Math.cos(angleRad)},${cy + S * Math.sin(angleRad)}`);
      }

      hexes.push({ q, r, cx, cy, points: pts.join(' ') });
    }
  }

  const svgWidth = hexSize * Math.sqrt(3) * (cols + 0.5) + hexSize * 2;
  const svgHeight = hexSize * 1.5 * rows + hexSize * 2;

  return { hexes, svgWidth, svgHeight };
}

export function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function terrainFillColor(
  terrain: TerrainType,
  mode: 'terrain' | 'image',
  terrainOpacity: number
): string {
  if (mode === 'image') {
    if (terrain !== 'none') {
      const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
      const baseColor = def?.fillColor ?? '#f5f0e8';
      return hexToRgba(baseColor, terrainOpacity);
    }
    return 'rgba(255, 255, 255, 0.05)';
  }
  const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
  return def?.fillColor ?? '#f5f0e8';
}

export function terrainStrokeColor(terrain: TerrainType, mode: 'terrain' | 'image'): string {
  if (mode === 'image') {
    return 'rgba(0, 0, 0, 1)';
  }
  const def = TERRAIN_DEFINITIONS.find((t) => t.id === terrain);
  return def?.strokeColor ?? '#ccc';
}
