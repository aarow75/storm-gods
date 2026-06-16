import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignData, CampaignObjective, SessionLogEntry } from '@campaigns/models/campaign.model';
import { Character } from '@characters/models/character.model';
import { CharacterService } from '@characters/services/character.service';

interface SkillEntry {
  name: string;
  value: number;
}

interface AttendanceData {
  character: Character;
  sessionsAttended: number;
  attendancePercent: number;
}

@Component({
  selector: 'app-campaign-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './campaign-analytics.component.html',
  styleUrl: './campaign-analytics.component.css'
})
export class CampaignAnalyticsComponent implements OnInit {
  @Input() campaignData!: CampaignData;

  campaignCharacters: Character[] = [];
  sessions: SessionLogEntry[] = [];
  objectives: CampaignObjective[] = [];

  totalSessions = 0;
  totalCharacters = 0;
  completedObjectives = 0;
  activeObjectives = 0;
  totalPlayTime = 0;

  attendanceData: AttendanceData[] = [];
  topSkillsMap = new Map<string, SkillEntry[]>();

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.loadAndCompute();
  }

  loadAndCompute(): void {
    // Load characters
    this.campaignCharacters = this.campaignData.campaign.characterIds
      .map(id => this.characterService.getCharacter(id))
      .filter((c): c is Character => c !== undefined);

    // Load sessions and objectives
    this.sessions = this.campaignData.sessionLogs.sort((a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    this.objectives = this.campaignData.objectives.sort((a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    // Basic stats
    this.totalSessions = this.sessions.length;
    this.totalCharacters = this.campaignCharacters.length;
    this.completedObjectives = this.objectives.filter(o => o.status === 'completed').length;
    this.activeObjectives = this.objectives.filter(o => o.status === 'active').length;
    this.totalPlayTime = this.sessions.reduce((sum, s) => sum + (s.duration || 0), 0);

    // Attendance data
    this.computeAttendance();

    // Top skills
    this.computeTopSkills();
  }

  private computeAttendance(): void {
    this.attendanceData = this.campaignCharacters.map(character => {
      const sessionsAttended = this.sessions.filter(s =>
        s.attendeeIds.includes(character.id)
      ).length;
      const attendancePercent = this.totalSessions > 0
        ? Math.round((sessionsAttended / this.totalSessions) * 100)
        : 0;

      return { character, sessionsAttended, attendancePercent };
    });

    // Sort by attendance descending
    this.attendanceData.sort((a, b) => b.sessionsAttended - a.sessionsAttended);
  }

  private computeTopSkills(): void {
    this.topSkillsMap.clear();

    this.campaignCharacters.forEach(character => {
      if (!character.skills) return;

      const skills: SkillEntry[] = Object.entries(character.skills)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);

      this.topSkillsMap.set(character.id, skills);
    });
  }

  getObjectiveStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'major': return 'priority-major';
      case 'minor': return 'priority-minor';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatPlayTime(minutes: number): string {
    if (minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }

  getTruncatedSummary(text: string, maxLength: number = 80): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '…';
  }

  getObjectiveTitle(id: string): string {
    const obj = this.objectives.find(o => o.id === id);
    return obj?.title || 'Unknown';
  }

  getAttendeeNames(attendeeIds: string[]): string {
    if (attendeeIds.length === 0) return '—';
    return attendeeIds
      .map(id => this.campaignCharacters.find(c => c.id === id)?.name || 'Unknown')
      .join(', ');
  }

  getSessionLocation(session: SessionLogEntry): string {
    return session.location || '—';
  }
}
