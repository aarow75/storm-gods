import { Injectable } from '@angular/core';
import { DEFAULT_WILDERNESS_STATE, WildernessMapState } from '../models/wilderness-map.model';

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
}
