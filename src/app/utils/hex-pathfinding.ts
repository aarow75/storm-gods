import { HexCoord, TerrainType } from '../models/wilderness-map.model';
import { TERRAIN_MAP } from '../constants/terrain.constants';

const HEX_DIRECTIONS: HexCoord[] = [
  { q: 1, r: 0 },
  { q: 1, r: -1 },
  { q: 0, r: -1 },
  { q: -1, r: 0 },
  { q: -1, r: 1 },
  { q: 0, r: 1 },
];

export interface PathResult {
  path: HexCoord[];
  totalCost: number;
}

export function dijkstra(
  start: HexCoord,
  end: HexCoord,
  getTerrain: (q: number, r: number) => TerrainType,
  cols: number,
  rows: number
): PathResult | null {
  // Priority queue: { cost, q, r }
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const visited = new Set<string>();

  const startKey = `${start.q},${start.r}`;
  const endKey = `${end.q},${end.r}`;

  dist[startKey] = 0;

  const queue: Array<{ cost: number; q: number; r: number }> = [{ cost: 0, ...start }];

  while (queue.length > 0) {
    // Extract minimum (simple linear search is fine for 1600 hexes)
    queue.sort((a, b) => a.cost - b.cost);
    const current = queue.shift();

    if (!current) break;

    const currentKey = `${current.q},${current.r}`;

    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    // Found the end
    if (current.q === end.q && current.r === end.r) break;

    const currentDist = dist[currentKey] ?? Infinity;

    for (const dir of HEX_DIRECTIONS) {
      const nq = current.q + dir.q;
      const nr = current.r + dir.r;

      // Bounds check
      if (!inBounds(nq, nr, cols, rows)) continue;

      const nKey = `${nq},${nr}`;

      if (visited.has(nKey)) continue;

      const terrain = getTerrain(nq, nr);
      const terrainCost = TERRAIN_MAP[terrain]?.moveCost ?? Infinity;

      if (terrainCost === Infinity) continue;

      const newCost = currentDist + terrainCost;

      if (newCost < (dist[nKey] ?? Infinity)) {
        dist[nKey] = newCost;
        prev[nKey] = currentKey;
        queue.push({ cost: newCost, q: nq, r: nr });
      }
    }
  }

  // Reconstruct path
  if (dist[endKey] === undefined) return null;

  const path: HexCoord[] = [];
  let cur: string | null = endKey;

  while (cur && cur !== startKey) {
    const [q, r] = cur.split(',').map(Number);
    path.unshift({ q, r });
    cur = prev[cur] ?? null;
  }

  return { path, totalCost: dist[endKey] };
}

function inBounds(q: number, r: number, cols: number, rows: number): boolean {
  // For offset grid: col = q + floor(r/2), row = r
  const col = q + Math.floor(r / 2);
  return col >= 0 && col < cols && r >= 0 && r < rows;
}
