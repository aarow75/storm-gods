import { vi } from 'vitest';
import { CampaignService } from './campaign.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { ScenarioMapService } from '@maps/services/scenario-map.service';

function makeService(overrides?: { wildernessState?: any }) {
  const gameSystemService = { gameSystem: () => 'runequest' } as unknown as GameSystemService;
  const wildernessMapService = {
    getState: vi.fn(() => overrides?.wildernessState ?? { terrainMaps: {}, customMaps: [] }),
  } as unknown as WildernessMapService;
  const scenarioMapService = {
    createMapFromSource: vi.fn(),
    deleteMap: vi.fn(),
  } as unknown as ScenarioMapService;

  const service = new CampaignService(gameSystemService, wildernessMapService, scenarioMapService);
  return { service, wildernessMapService, scenarioMapService };
}

describe('CampaignService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('createCampaign / getCampaignData', () => {
    it('creates a campaign with an empty scenarios array', () => {
      const { service } = makeService();
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const data = service.getCampaignData(campaign.id);
      expect(data?.scenarios).toEqual([]);
    });

    it('backfills scenarios on old-shaped saved campaign data', () => {
      const { service } = makeService();
      const campaign = service.createCampaign({ name: 'Legacy' });
      // Simulate a pre-scenarios blob by writing over it directly
      localStorage.setItem(
        'campaign-' + campaign.id,
        JSON.stringify({ campaign, objectives: [], sessionLogs: [] })
      );
      const data = service.getCampaignData(campaign.id);
      expect(data?.scenarios).toEqual([]);
    });
  });

  describe('scenario CRUD', () => {
    it('creates a scenario, seeding its map via ScenarioMapService', () => {
      const { service, scenarioMapService } = makeService({
        wildernessState: {
          terrainMaps: { 'src-map': { '0,0': 'forest' } },
          customMaps: [{ id: 'src-map', label: 'Source', width: 15, height: 15, scale: 6, scaleUnit: 'miles' }],
        },
      });
      const campaign = service.createCampaign({ name: 'Test Campaign' });

      const scenario = service.createScenario(campaign.id, { name: 'Into the Wilds' }, 'src-map');

      expect(scenario.type).toBe('hex-crawl');
      expect(scenario.status).toBe('active');
      expect(scenario.currentDay).toBe(1);
      expect(scenarioMapService.createMapFromSource).toHaveBeenCalledWith(
        scenario.mapId,
        'Into the Wilds',
        { '0,0': 'forest' },
        { width: 15, height: 15, scale: 6, scaleUnit: 'miles' }
      );

      const scenarios = service.getScenariosByCampaign(campaign.id);
      expect(scenarios).toHaveLength(1);
      expect(scenarios[0].id).toBe(scenario.id);
    });

    it('falls back to a built-in background map\'s dimensions when the source id is not a custom map', () => {
      // Background maps (e.g. "Dragon Pass", id '2') aren't in customMaps - only their
      // painted terrain lives in terrainMaps, keyed by the background's id.
      const { service, scenarioMapService } = makeService({
        wildernessState: {
          terrainMaps: { '2': { '0,0': 'mountains' } },
          customMaps: [],
        },
      });
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const scenario = service.createScenario(campaign.id, { name: 'Dragon Pass Trek' }, '2');

      expect(scenarioMapService.createMapFromSource).toHaveBeenCalledWith(
        scenario.mapId,
        'Dragon Pass Trek',
        { '0,0': 'mountains' },
        { width: 34, height: 24, scale: 10, scaleUnit: 'miles', backgroundImage: '2' }
      );
    });

    it('carries the background image reference through even with no painted terrain on it', () => {
      const { service, scenarioMapService } = makeService({
        wildernessState: { terrainMaps: {}, customMaps: [] },
      });
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const scenario = service.createScenario(campaign.id, { name: 'Image Only' }, '2');

      expect(scenarioMapService.createMapFromSource).toHaveBeenCalledWith(
        scenario.mapId,
        'Image Only',
        undefined,
        { width: 34, height: 24, scale: 10, scaleUnit: 'miles', backgroundImage: '2' }
      );
    });

    it('creates a blank scenario map when no source map is given', () => {
      const { service, scenarioMapService } = makeService();
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const scenario = service.createScenario(campaign.id, { name: 'Blank Start' });

      expect(scenarioMapService.createMapFromSource).toHaveBeenCalledWith(
        scenario.mapId,
        'Blank Start',
        undefined,
        { width: 20, height: 20, scale: 6, scaleUnit: 'miles' }
      );
    });

    it('updates a scenario without touching its id/campaignId/mapId', () => {
      const { service } = makeService();
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const scenario = service.createScenario(campaign.id, { name: 'Into the Wilds' });

      service.updateScenario(campaign.id, scenario.id, { currentDay: 5, status: 'completed' });

      const updated = service.getScenario(campaign.id, scenario.id);
      expect(updated?.currentDay).toBe(5);
      expect(updated?.status).toBe('completed');
      expect(updated?.id).toBe(scenario.id);
      expect(updated?.mapId).toBe(scenario.mapId);
    });

    it('deletes a scenario and cascades deletion of its map data', () => {
      const { service, scenarioMapService } = makeService();
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const scenario = service.createScenario(campaign.id, { name: 'Into the Wilds' });

      service.deleteScenario(campaign.id, scenario.id);

      expect(scenarioMapService.deleteMap).toHaveBeenCalledWith(scenario.mapId);
      expect(service.getScenariosByCampaign(campaign.id)).toEqual([]);
    });
  });

  describe('DataPort', () => {
    it('exports only campaigns for the active game system', () => {
      const { service } = makeService();
      service.createCampaign({ name: 'RQ Campaign', gameSystem: 'runequest' });
      service.createCampaign({ name: 'OSRIC Campaign', gameSystem: 'osric' });

      const exported = service.exportData() as { campaigns: Array<{ campaign: { name: string } }> };
      expect(exported.campaigns).toHaveLength(1);
      expect(exported.campaigns[0].campaign.name).toBe('RQ Campaign');
    });

    it('imports campaigns, skipping ones that already exist by id', () => {
      const { service } = makeService();
      const campaign = service.createCampaign({ name: 'Test Campaign' });
      const exported = service.exportData();

      const message = service.importData(exported);
      expect(message).toContain('Imported 0 campaign(s)');
      expect(message).toContain('1 skipped');
      expect(service.getCampaigns().filter(c => c.id === campaign.id)).toHaveLength(1);
    });
  });
});
