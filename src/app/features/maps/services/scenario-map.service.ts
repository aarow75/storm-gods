import { Injectable } from '@angular/core';
import {
  CustomMap,
  DEFAULT_WILDERNESS_STATE,
  TerrainType,
  WildernessMapState,
} from '@maps/models/wilderness-map.model';
import { DataPort } from '@shared/services/data-port.service';
import { GameSystemService } from '@shared/services/game-system.service';

/**
 * Private map state for campaign scenarios (hex-crawls). Structurally the same shape
 * as WildernessMapService's state, but persisted under its own storage key so scenario
 * maps/hex-history never mix with the standalone, ad-hoc GM wilderness map.
 */
@Injectable({ providedIn: 'root' })
export class ScenarioMapService implements DataPort {
  readonly dataPortLabel = 'Scenario Maps';
  readonly dataPortKey = 'scenario-maps';

  constructor(private gameSystemService: GameSystemService) {}

  private key(): string {
    return `${this.gameSystemService.gameSystem()}-scenario-maps`;
  }

  exportData(): unknown {
    const state = this.getState();
    return {
      exportType: 'scenario-maps',
      version: 1,
      exportedAt: new Date().toISOString(),
      customMaps: state.customMaps,
      terrainMaps: state.terrainMaps,
      tokenMaps: state.tokenMaps,
      hexDataMaps: state.hexDataMaps,
    };
  }

  importData(rawData: unknown): string {
    const data = rawData as {
      customMaps?: WildernessMapState['customMaps'];
      terrainMaps?: WildernessMapState['terrainMaps'];
      tokenMaps?: WildernessMapState['tokenMaps'];
      hexDataMaps?: WildernessMapState['hexDataMaps'];
    };
    const state = this.getState();
    let imported = 0;
    let skipped = 0;
    for (const cm of data.customMaps ?? []) {
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
    for (const [id, hexData] of Object.entries(data.hexDataMaps ?? {})) {
      if (!Object.keys(state.hexDataMaps?.[id] ?? {}).length) {
        state.hexDataMaps![id] = hexData;
      }
    }
    this.saveState(state);
    return `Imported ${imported} map(s). ${skipped} skipped (already exist).`;
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
    return loaded;
  }

  saveState(state: WildernessMapState): void {
    localStorage.setItem(this.key(), JSON.stringify(state));
  }

  clearState(): void {
    localStorage.removeItem(this.key());
  }

  /** Seeds a new scenario map, optionally cloning terrain copied from an existing standalone map. */
  createMapFromSource(
    newMapId: string,
    label: string,
    sourceTerrain: Record<string, TerrainType> | undefined,
    map: Omit<CustomMap, 'id' | 'label'>
  ): void {
    const state = this.getState();
    state.customMaps.push({ id: newMapId, label, ...map });
    state.terrainMaps[newMapId] = sourceTerrain ? { ...sourceTerrain } : {};
    state.tokenMaps[newMapId] = [];
    state.hexDataMaps![newMapId] = {};
    this.saveState(state);
  }

  /** Cascades deletion of a scenario's map data - called when the owning scenario is deleted. */
  deleteMap(mapId: string): void {
    const state = this.getState();
    state.customMaps = state.customMaps.filter((m) => m.id !== mapId);
    delete state.terrainMaps[mapId];
    delete state.tokenMaps[mapId];
    if (state.hexDataMaps) delete state.hexDataMaps[mapId];
    this.saveState(state);
  }
}
