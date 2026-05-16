import { Injectable } from '@angular/core';
import { CustomMap, DEFAULT_WILDERNESS_STATE, TerrainMapExport, TerrainType, WildernessMapState, WildernessToken } from '../models/wilderness-map.model';

@Injectable({ providedIn: 'root' })
export class WildernessMapService {
  private readonly STORAGE_KEY = 'runequest-wilderness-map';

  getState(): WildernessMapState {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const loaded = data ? JSON.parse(data) : { ...DEFAULT_WILDERNESS_STATE };
    loaded.terrainMaps ??= {};
    loaded.tokenMaps ??= {};
    loaded.customMaps ??= [];
    if (loaded.currentMapId) {
      // Migrate top-level tiles into terrainMaps if terrainMaps is missing the current map's data
      const tileCount = Object.keys(loaded.tiles ?? {}).length;
      if (tileCount > 0 && !Object.keys(loaded.terrainMaps[loaded.currentMapId] ?? {}).length) {
        loaded.terrainMaps[loaded.currentMapId] = loaded.tiles;
      }
      // Migrate top-level tokens into tokenMaps if tokenMaps is missing the current map's data
      if ((loaded.tokens ?? []).length > 0 && !(loaded.tokenMaps[loaded.currentMapId] ?? []).length) {
        loaded.tokenMaps[loaded.currentMapId] = loaded.tokens;
      }
    }
    console.log('WildernessMapService.getState():', loaded);
    return loaded;
  }

  saveState(state: WildernessMapState): void {
    console.log('WildernessMapService.saveState():', state);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
  }

  clearState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  importStateData(data: { customMaps?: CustomMap[]; terrainMaps?: Record<string, Record<string, TerrainType>>; tokenMaps?: Record<string, WildernessToken[]> }): { imported: number; skipped: number } {
    const state = this.getState();
    let imported = 0;
    let skipped = 0;
    for (const cm of (data.customMaps ?? [])) {
      if (state.customMaps.some((m) => m.id === cm.id)) {
        skipped++;
      } else {
        state.customMaps.push(cm);
        imported++;
      }
    }
    for (const [id, terrain] of Object.entries(data.terrainMaps ?? {})) {
      if (!Object.keys(state.terrainMaps[id] ?? {}).length) {
        state.terrainMaps[id] = terrain;
      }
    }
    for (const [id, tokens] of Object.entries(data.tokenMaps ?? {})) {
      if (!(state.tokenMaps[id] ?? []).length) {
        state.tokenMaps[id] = tokens;
      }
    }
    this.saveState(state);
    return { imported, skipped };
  }

  importMaps(maps: TerrainMapExport[]): { imported: number; skipped: number } {
    const state = this.getState();
    let imported = 0;
    let skipped = 0;
    for (const map of maps) {
      if (state.customMaps.some((m) => m.id === map.id)) {
        skipped++;
        continue;
      }
      state.customMaps.push({
        id: map.id,
        label: map.label,
        width: map.width,
        height: map.height,
        scale: map.scale,
        scaleUnit: map.scaleUnit,
      });
      state.terrainMaps[map.id] = map.terrain ?? {};
      state.tokenMaps[map.id] = map.tokens ?? [];
      imported++;
    }
    this.saveState(state);
    return { imported, skipped };
  }
}
