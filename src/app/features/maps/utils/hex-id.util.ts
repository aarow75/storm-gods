import { HexCoord } from '@maps/models/wilderness-map.model';

/**
 * 4-digit hex IDs (row*100 + col, zero-padded) for hex-crawl definition files.
 * Row-major, top-left = "0000". Maps onto the same offset grid used by
 * hex-grid.util.ts / hex-pathfinding.ts: row = r, col = q + floor(r/2).
 */

export function formatHexId(row: number, col: number): string {
  return String(row * 100 + col).padStart(4, '0');
}

export function parseHexId(id: string): { row: number; col: number } | null {
  if (!/^\d{4}$/.test(id)) return null;
  const n = Number(id);
  return { row: Math.floor(n / 100), col: n % 100 };
}

export function hexIdToCoord(id: string): HexCoord | null {
  const parsed = parseHexId(id);
  if (!parsed) return null;
  const { row, col } = parsed;
  return { q: col - Math.floor(row / 2), r: row };
}

export function coordToHexId(q: number, r: number): string {
  const col = q + Math.floor(r / 2);
  return formatHexId(r, col);
}
