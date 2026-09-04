import { CampaignScenario } from './scenario.model';

export interface Campaign {
  id: string;
  name: string;
  gameSystem: 'runequest' | 'dragonbane' | 'kal-arath' | 'osric' | 'mothership' | 'brp';
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  primarySetting: string;
  description?: string;
  characterIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CampaignObjective {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  priority: 'critical' | 'major' | 'minor';
  status: 'active' | 'completed' | 'failed' | 'paused';
  progress: number;
  relatedSessionIds: string[];
  createdAt: string;
  completedAt?: string;
  notes?: string;
}

export interface SessionLogEntry {
  id: string;
  campaignId: string;
  sessionNumber: number;
  date: string;
  duration?: number;
  location?: string;
  attendeeIds: string[];
  summary: string;
  objectivesProgressed: string[];
  notes?: string;
  combatNotes?: string;
}

export interface CampaignData {
  campaign: Campaign;
  objectives: CampaignObjective[];
  sessionLogs: SessionLogEntry[];
  scenarios: CampaignScenario[];
}

export const DEFAULT_CAMPAIGN: Partial<Campaign> = {
  status: 'active',
  characterIds: [],
  description: ''
};

export const DEFAULT_OBJECTIVE: Partial<CampaignObjective> = {
  status: 'active',
  progress: 0,
  relatedSessionIds: [],
  notes: ''
};

export const DEFAULT_SESSION: Partial<SessionLogEntry> = {
  attendeeIds: [],
  objectivesProgressed: [],
  notes: ''
};
