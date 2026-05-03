import { Injectable } from '@angular/core';
import { DEFAULT_WILDERNESS_STATE, TerrainMapExport, WildernessMapState } from '../models/wilderness-map.model';

@Injectable({ providedIn: 'root' })
export class WildernessMapService {
  private readonly STORAGE_KEY = 'runequest-wilderness-map';

  getState(): WildernessMapState {
    const data = localStorage.getItem(this.STORAGE_KEY);
    const loaded = data ? JSON.parse(data) : { ...DEFAULT_WILDERNESS_STATE };
    loaded.terrainMaps ??= {};
    loaded.tokenMaps ??= {};
    loaded.customMaps ??= [];
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
