import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  Campaign,
  CampaignData,
  CampaignObjective,
  SessionLogEntry,
  DEFAULT_CAMPAIGN,
  DEFAULT_OBJECTIVE,
  DEFAULT_SESSION
} from '@campaigns/models/campaign.model';
import { CampaignScenario } from '@campaigns/models/scenario.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { DataPort } from '@shared/services/data-port.service';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { ScenarioMapService } from '@maps/services/scenario-map.service';
import { getMapBackgroundById } from '@maps/constants/map-backgrounds.constants';

@Injectable({
  providedIn: 'root'
})
export class CampaignService implements DataPort {
  readonly dataPortLabel = 'Campaigns';
  readonly dataPortKey = 'campaigns';

  private readonly INDEX_KEY = 'campaigns-index';
  private readonly CAMPAIGN_KEY_PREFIX = 'campaign-';

  campaignsUpdated$ = new BehaviorSubject<Campaign[]>([]);

  constructor(
    private gameSystemService: GameSystemService,
    private wildernessMapService: WildernessMapService,
    private scenarioMapService: ScenarioMapService
  ) {
    this.migrateStorageKeys();
  }

  exportData(): unknown {
    const system = this.gameSystemService.gameSystem();
    const campaigns = this.getIndexIds()
      .map((id) => this.getCampaignData(id))
      .filter((d): d is CampaignData => d !== null && d.campaign.gameSystem === system);
    return {
      exportType: 'campaigns',
      version: 1,
      exportedAt: new Date().toISOString(),
      campaigns,
    };
  }

  importData(rawData: unknown): string {
    const data = rawData as { campaigns?: CampaignData[] };
    let imported = 0;
    let skipped = 0;
    for (const cd of data.campaigns ?? []) {
      if (this.getCampaignData(cd.campaign.id)) {
        skipped++;
        continue;
      }
      cd.scenarios ??= [];
      this.saveCampaignData(cd);
      this.addToIndex(cd.campaign.id);
      imported++;
    }
    this.campaignsUpdated$.next(this.getCampaigns());
    return `Imported ${imported} campaign(s). ${skipped} skipped (already exist).`;
  }

  private migrateStorageKeys(): void {
    const oldIndex = localStorage.getItem('rq-campaigns-index');
    if (oldIndex && !localStorage.getItem(this.INDEX_KEY)) {
      localStorage.setItem(this.INDEX_KEY, oldIndex);
      localStorage.removeItem('rq-campaigns-index');
      const ids: string[] = JSON.parse(oldIndex);
      for (const id of ids) {
        const oldCampaignKey = 'rq-campaign-' + id;
        const newCampaignKey = this.CAMPAIGN_KEY_PREFIX + id;
        const data = localStorage.getItem(oldCampaignKey);
        if (data && !localStorage.getItem(newCampaignKey)) {
          localStorage.setItem(newCampaignKey, data);
          localStorage.removeItem(oldCampaignKey);
        }
      }
    }
  }

  getCampaigns(): Campaign[] {
    const system = this.gameSystemService.gameSystem();
    const ids = this.getIndexIds();
    return ids
      .map(id => this.getCampaignData(id)?.campaign)
      .filter((c): c is Campaign => c !== undefined && c.gameSystem === system);
  }

  getCampaign(id: string): Campaign | null {
    return this.getCampaignData(id)?.campaign ?? null;
  }

  getCampaignData(id: string): CampaignData | null {
    const key = this.CAMPAIGN_KEY_PREFIX + id;
    const data = localStorage.getItem(key);
    if (!data) return null;

    try {
      const parsed = JSON.parse(data) as CampaignData;
      parsed.scenarios ??= [];
      return parsed;
    } catch {
      return null;
    }
  }

  createCampaign(campaign: Partial<Campaign>): Campaign {
    const id = this.generateId();
    const now = new Date().toISOString();

    const newCampaign: Campaign = {
      id,
      name: campaign.name || 'Unnamed Campaign',
      gameSystem: campaign.gameSystem || this.gameSystemService.gameSystem(),
      startDate: campaign.startDate || now,
      endDate: campaign.endDate,
      status: campaign.status || 'active',
      primarySetting: campaign.primarySetting || '',
      description: campaign.description || '',
      characterIds: campaign.characterIds || [],
      createdAt: now,
      updatedAt: now
    };

    const campaignData: CampaignData = {
      campaign: newCampaign,
      objectives: [],
      sessionLogs: [],
      scenarios: []
    };

    this.saveCampaignData(campaignData);
    this.addToIndex(id);
    this.campaignsUpdated$.next(this.getCampaigns());

    return newCampaign;
  }

  updateCampaign(id: string, updates: Partial<Campaign>): void {
    const data = this.getCampaignData(id);
    if (!data) return;

    data.campaign = {
      ...data.campaign,
      ...updates,
      id: data.campaign.id,
      createdAt: data.campaign.createdAt,
      updatedAt: new Date().toISOString()
    };

    this.saveCampaignData(data);
    this.campaignsUpdated$.next(this.getCampaigns());
  }

  deleteCampaign(id: string): void {
    const key = this.CAMPAIGN_KEY_PREFIX + id;
    localStorage.removeItem(key);
    this.removeFromIndex(id);
    this.campaignsUpdated$.next(this.getCampaigns());
  }

  addCharacterToCampaign(campaignId: string, characterId: string): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    if (!data.campaign.characterIds.includes(characterId)) {
      data.campaign.characterIds.push(characterId);
      data.campaign.updatedAt = new Date().toISOString();
      this.saveCampaignData(data);
      this.campaignsUpdated$.next(this.getCampaigns());
    }
  }

  removeCharacterFromCampaign(campaignId: string, characterId: string): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    data.campaign.characterIds = data.campaign.characterIds.filter(id => id !== characterId);
    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
    this.campaignsUpdated$.next(this.getCampaigns());
  }

  // Session operations
  getSessionsByCampaign(campaignId: string): SessionLogEntry[] {
    const data = this.getCampaignData(campaignId);
    return data?.sessionLogs ?? [];
  }

  createSession(campaignId: string, session: Partial<SessionLogEntry>): SessionLogEntry {
    const data = this.getCampaignData(campaignId);
    if (!data) throw new Error('Campaign not found');

    const id = this.generateId();
    const sessionNumber = Math.max(0, ...data.sessionLogs.map(s => s.sessionNumber)) + 1;

    const newSession: SessionLogEntry = {
      id,
      campaignId,
      sessionNumber,
      date: session.date || new Date().toISOString(),
      duration: session.duration,
      location: session.location || '',
      attendeeIds: session.attendeeIds || [],
      summary: session.summary || '',
      objectivesProgressed: session.objectivesProgressed || [],
      notes: session.notes || ''
    };

    data.sessionLogs.push(newSession);
    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);

    return newSession;
  }

  updateSession(campaignId: string, sessionId: string, updates: Partial<SessionLogEntry>): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    const session = data.sessionLogs.find(s => s.id === sessionId);
    if (!session) return;

    Object.assign(session, updates, { id: session.id, campaignId, sessionNumber: session.sessionNumber });
    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
  }

  deleteSession(campaignId: string, sessionId: string): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    data.sessionLogs = data.sessionLogs.filter(s => s.id !== sessionId);
    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
  }

  // Objective operations
  getObjectivesByCampaign(campaignId: string): CampaignObjective[] {
    const data = this.getCampaignData(campaignId);
    return data?.objectives ?? [];
  }

  createObjective(campaignId: string, objective: Partial<CampaignObjective>): CampaignObjective {
    const data = this.getCampaignData(campaignId);
    if (!data) throw new Error('Campaign not found');

    const id = this.generateId();
    const now = new Date().toISOString();

    const newObjective: CampaignObjective = {
      id,
      campaignId,
      title: objective.title || 'Unnamed Objective',
      description: objective.description || '',
      priority: objective.priority || 'major',
      status: objective.status || 'active',
      progress: objective.progress ?? 0,
      relatedSessionIds: objective.relatedSessionIds || [],
      createdAt: now,
      completedAt: objective.completedAt,
      notes: objective.notes || ''
    };

    data.objectives.push(newObjective);
    data.campaign.updatedAt = now;
    this.saveCampaignData(data);

    return newObjective;
  }

  updateObjective(campaignId: string, objectiveId: string, updates: Partial<CampaignObjective>): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    const objective = data.objectives.find(o => o.id === objectiveId);
    if (!objective) return;

    Object.assign(objective, updates, {
      id: objective.id,
      campaignId,
      createdAt: objective.createdAt,
      completedAt: updates.status === 'completed' && !objective.completedAt ? new Date().toISOString() : objective.completedAt
    });

    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
  }

  deleteObjective(campaignId: string, objectiveId: string): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    data.objectives = data.objectives.filter(o => o.id !== objectiveId);
    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
  }

  // Scenario operations
  getScenariosByCampaign(campaignId: string): CampaignScenario[] {
    const data = this.getCampaignData(campaignId);
    return data?.scenarios ?? [];
  }

  getScenario(campaignId: string, scenarioId: string): CampaignScenario | null {
    const data = this.getCampaignData(campaignId);
    return data?.scenarios.find((s) => s.id === scenarioId) ?? null;
  }

  createScenario(
    campaignId: string,
    scenario: Partial<CampaignScenario>,
    sourceMapId?: string
  ): CampaignScenario {
    const data = this.getCampaignData(campaignId);
    if (!data) throw new Error('Campaign not found');

    const id = this.generateId();
    const mapId = this.generateId();
    const now = new Date().toISOString();

    const newScenario: CampaignScenario = {
      id,
      campaignId,
      name: scenario.name || 'Unnamed Scenario',
      type: scenario.type || 'hex-crawl',
      status: scenario.status || 'active',
      mapId,
      currentDay: scenario.currentDay ?? 1,
      notes: scenario.notes || '',
      createdAt: now,
      updatedAt: now,
    };

    let sourceTerrain;
    let width = 20, height = 20, scale = 6;
    let scaleUnit: 'miles' | 'kilometers' = 'miles';
    let backgroundImage: string | undefined;
    if (sourceMapId) {
      const sourceState = this.wildernessMapService.getState();
      sourceTerrain = sourceState.terrainMaps[sourceMapId];
      const sourceCustomMap = sourceState.customMaps.find((m) => m.id === sourceMapId);
      if (sourceCustomMap) {
        ({ width, height, scale, scaleUnit } = sourceCustomMap);
      } else {
        // Not a user-created custom map - it may be one of the built-in background
        // maps (e.g. "Dragon Pass"), with or without a painted terrain overlay on top.
        const bg = getMapBackgroundById(sourceMapId);
        if (bg) {
          width = bg.width;
          height = bg.height;
          scale = bg.scale ?? 6;
          scaleUnit = bg.scaleUnit ?? 'miles';
          backgroundImage = bg.id;
        }
      }
    }
    this.scenarioMapService.createMapFromSource(mapId, newScenario.name, sourceTerrain, {
      width,
      height,
      scale,
      scaleUnit,
      backgroundImage,
    });

    data.scenarios.push(newScenario);
    data.campaign.updatedAt = now;
    this.saveCampaignData(data);

    return newScenario;
  }

  updateScenario(campaignId: string, scenarioId: string, updates: Partial<CampaignScenario>): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    const scenario = data.scenarios.find((s) => s.id === scenarioId);
    if (!scenario) return;

    Object.assign(scenario, updates, {
      id: scenario.id,
      campaignId,
      mapId: scenario.mapId,
      createdAt: scenario.createdAt,
      updatedAt: new Date().toISOString(),
    });

    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
  }

  deleteScenario(campaignId: string, scenarioId: string): void {
    const data = this.getCampaignData(campaignId);
    if (!data) return;

    const scenario = data.scenarios.find((s) => s.id === scenarioId);
    if (scenario) {
      this.scenarioMapService.deleteMap(scenario.mapId);
    }

    data.scenarios = data.scenarios.filter((s) => s.id !== scenarioId);
    data.campaign.updatedAt = new Date().toISOString();
    this.saveCampaignData(data);
  }

  // Private methods
  private saveCampaignData(data: CampaignData): void {
    const key = this.CAMPAIGN_KEY_PREFIX + data.campaign.id;
    localStorage.setItem(key, JSON.stringify(data));
  }

  private getIndexIds(): string[] {
    const data = localStorage.getItem(this.INDEX_KEY);
    if (!data) return [];

    try {
      return JSON.parse(data) as string[];
    } catch {
      return [];
    }
  }

  private addToIndex(id: string): void {
    const ids = this.getIndexIds();
    if (!ids.includes(id)) {
      ids.push(id);
      localStorage.setItem(this.INDEX_KEY, JSON.stringify(ids));
    }
  }

  private removeFromIndex(id: string): void {
    const ids = this.getIndexIds().filter(x => x !== id);
    localStorage.setItem(this.INDEX_KEY, JSON.stringify(ids));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
