export type ScenarioType = 'hex-crawl'; // extend later: 'hex-crawl' | 'dungeon-crawl'
export type ScenarioStatus = 'active' | 'completed' | 'abandoned';

export interface CampaignScenario {
  id: string;
  campaignId: string;
  name: string;
  type: ScenarioType;
  status: ScenarioStatus;
  mapId: string;
  currentDay: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SCENARIO: Partial<CampaignScenario> = {
  type: 'hex-crawl',
  status: 'active',
  currentDay: 1,
  notes: ''
};
