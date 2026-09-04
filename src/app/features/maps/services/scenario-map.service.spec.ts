import { ScenarioMapService } from './scenario-map.service';
import { GameSystemService } from '@shared/services/game-system.service';

function makeService(system = 'runequest'): ScenarioMapService {
  return new ScenarioMapService({ gameSystem: () => system } as unknown as GameSystemService);
}

describe('ScenarioMapService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getState', () => {
    it('returns default empty state when nothing is stored', () => {
      const service = makeService();
      const state = service.getState();
      expect(state.customMaps).toEqual([]);
      expect(state.terrainMaps).toEqual({});
      expect(state.tokenMaps).toEqual({});
      expect(state.hexDataMaps).toEqual({});
    });

    it('backfills hexDataMaps for old-shaped saved state', () => {
      const service = makeService();
      localStorage.setItem(
        'runequest-scenario-maps',
        JSON.stringify({ tiles: {}, tokens: [], terrainMaps: { m1: {} }, tokenMaps: { m1: [] }, customMaps: [] })
      );
      const state = service.getState();
      expect(state.hexDataMaps).toEqual({});
    });

    it('is isolated per game system', () => {
      const rqService = makeService('runequest');
      rqService.saveState({ ...rqService.getState(), customMaps: [{ id: 'x', label: 'X', width: 5, height: 5, scale: 6, scaleUnit: 'miles' }] });

      const dbService = makeService('dragonbane');
      expect(dbService.getState().customMaps).toEqual([]);
    });
  });

  describe('createMapFromSource', () => {
    it('clones terrain from a source map and seeds empty tokens/hexData', () => {
      const service = makeService();
      service.createMapFromSource('scenario-map-1', 'My Scenario', { '0,0': 'forest', '1,0': 'plains' }, {
        width: 10, height: 10, scale: 6, scaleUnit: 'miles',
      });

      const state = service.getState();
      expect(state.customMaps).toEqual([{ id: 'scenario-map-1', label: 'My Scenario', width: 10, height: 10, scale: 6, scaleUnit: 'miles' }]);
      expect(state.terrainMaps['scenario-map-1']).toEqual({ '0,0': 'forest', '1,0': 'plains' });
      expect(state.tokenMaps['scenario-map-1']).toEqual([]);
      expect(state.hexDataMaps?.['scenario-map-1']).toEqual({});
    });

    it('seeds a blank terrain map when no source is given', () => {
      const service = makeService();
      service.createMapFromSource('scenario-map-2', 'Blank', undefined, {
        width: 10, height: 10, scale: 6, scaleUnit: 'miles',
      });
      expect(service.getState().terrainMaps['scenario-map-2']).toEqual({});
    });
  });

  describe('deleteMap', () => {
    it('removes all data associated with the map id', () => {
      const service = makeService();
      service.createMapFromSource('m1', 'Map 1', { '0,0': 'forest' }, { width: 10, height: 10, scale: 6, scaleUnit: 'miles' });
      service.deleteMap('m1');

      const state = service.getState();
      expect(state.customMaps).toEqual([]);
      expect(state.terrainMaps['m1']).toBeUndefined();
      expect(state.tokenMaps['m1']).toBeUndefined();
      expect(state.hexDataMaps?.['m1']).toBeUndefined();
    });
  });

  describe('export/import', () => {
    it('round-trips scenario map data through exportData/importData', () => {
      const source = makeService('runequest');
      source.createMapFromSource('m1', 'Map 1', { '0,0': 'forest' }, { width: 10, height: 10, scale: 6, scaleUnit: 'miles' });
      const exported = source.exportData();

      localStorage.clear();
      const target = makeService('runequest');
      const message = target.importData(exported);

      expect(message).toContain('Imported 1 map(s)');
      expect(target.getState().terrainMaps['m1']).toEqual({ '0,0': 'forest' });
    });

    it('skips maps that already exist by id', () => {
      const source = makeService('runequest');
      source.createMapFromSource('m1', 'Map 1', { '0,0': 'forest' }, { width: 10, height: 10, scale: 6, scaleUnit: 'miles' });
      const exported = source.exportData();

      const message = source.importData(exported);
      expect(message).toContain('Imported 0 map(s)');
      expect(message).toContain('1 skipped');
    });
  });
});
