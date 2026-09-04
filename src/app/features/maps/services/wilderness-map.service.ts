import { Injectable } from '@angular/core';
import { CustomMap, DEFAULT_WILDERNESS_STATE, TerrainMapExport, TerrainType, WildernessMapState, WildernessToken } from '@maps/models/wilderness-map.model';
import { DataPort } from '@shared/services/data-port.service';
import { GameSystemService } from '@shared/services/game-system.service';

@Injectable({ providedIn: 'root' })
export class WildernessMapService implements DataPort {
  readonly dataPortLabel = 'Terrain Maps';
  readonly dataPortKey = 'terrain-data';

  constructor(private gameSystemService: GameSystemService) {
    const existing = localStorage.getItem('wilderness-map');
    if (existing && !localStorage.getItem(this.key())) {
      localStorage.setItem(this.key(), existing);
      localStorage.removeItem('wilderness-map');
    }
  }

  private key(): string {
    return `${this.gameSystemService.gameSystem()}-wilderness-map`;
  }

  exportData(): unknown {
    const state = this.getState();
    return {
      exportType: 'terrain-maps',
      version: 2,
      exportedAt: new Date().toISOString(),
      customMaps: state.customMaps,
      terrainMaps: state.terrainMaps,
      tokenMaps: state.tokenMaps,
    };
  }

  importData(rawData: unknown): string {
    const data = rawData as any;
    let result: { imported: number; skipped: number };
    if (data.terrainMaps || data.customMaps || data.tokenMaps) {
      result = this.importStateData(data);
    } else if (Array.isArray(data.maps)) {
      result = this.importMaps(data.maps);
    } else {
      result = { imported: 0, skipped: 0 };
    }
    return `Imported ${result.imported} map(s). ${result.skipped} skipped (already exist).`;
  }

  getState(): WildernessMapState {
    const data = localStorage.getItem(this.key());
    // Deep-clone the default: a shallow spread would share DEFAULT_WILDERNESS_STATE's
    // nested arrays/objects (customMaps, terrainMaps, ...) by reference across every
    // caller with no saved state yet, so mutating one would corrupt the shared default.
    const loaded = data ? JSON.parse(data) : JSON.parse(JSON.stringify(DEFAULT_WILDERNESS_STATE));
    loaded.terrainMaps ??= {};
    loaded.tokenMaps ??= {};
    loaded.hexDataMaps ??= {};
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
    localStorage.setItem(this.key(), JSON.stringify(state));
  }

  clearState(): void {
    localStorage.removeItem(this.key());
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
