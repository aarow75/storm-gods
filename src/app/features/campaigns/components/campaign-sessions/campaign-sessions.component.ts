import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignData, SessionLogEntry } from '@campaigns/models/campaign.model';
import { CampaignService } from '@campaigns/services/campaign.service';
import { CharacterService } from '@characters/services/character.service';

@Component({
  selector: 'app-campaign-sessions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-sessions.component.html',
  styleUrl: './campaign-sessions.component.css'
})
export class CampaignSessionsComponent implements OnInit, OnChanges {
  @Input() campaignData!: CampaignData;
  @Output() dataChanged = new EventEmitter<void>();

  showCreateModal = false;
  sessions: SessionLogEntry[] = [];
  newSessionForm = {
    date: new Date().toISOString().split('T')[0],
    duration: '',
    location: '',
    attendees: new Set<string>(),
    summary: '',
    objectivesProgressed: new Set<string>(),
    notes: '',
    combatNotes: ''
  };

  constructor(
    private campaignService: CampaignService,
    public characterService: CharacterService
  ) {}

  ngOnInit(): void {
    this.loadSessions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData'] && !changes['campaignData'].firstChange) {
      this.loadSessions();
    }
  }

  loadSessions(): void {
    this.sessions = this.campaignService.getSessionsByCampaign(this.campaignData.campaign.id)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  openCreateModal(): void {
    this.resetForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  toggleAttendee(characterId: string): void {
    if (this.newSessionForm.attendees.has(characterId)) {
      this.newSessionForm.attendees.delete(characterId);
    } else {
      this.newSessionForm.attendees.add(characterId);
    }
  }

  toggleObjective(objectiveId: string): void {
    if (this.newSessionForm.objectivesProgressed.has(objectiveId)) {
      this.newSessionForm.objectivesProgressed.delete(objectiveId);
    } else {
      this.newSessionForm.objectivesProgressed.add(objectiveId);
    }
  }

  createSession(): void {
    if (!this.newSessionForm.summary.trim()) {
      alert('Session summary is required');
      return;
    }

    this.campaignService.createSession(this.campaignData.campaign.id, {
      date: new Date(this.newSessionForm.date).toISOString(),
      duration: this.newSessionForm.duration ? parseInt(this.newSessionForm.duration) : undefined,
      location: this.newSessionForm.location,
      attendeeIds: Array.from(this.newSessionForm.attendees),
      summary: this.newSessionForm.summary,
      objectivesProgressed: Array.from(this.newSessionForm.objectivesProgressed),
      notes: this.newSessionForm.notes,
      combatNotes: this.newSessionForm.combatNotes
    });

    this.closeCreateModal();
    this.loadSessions();
    this.dataChanged.emit();
  }

  deleteSession(sessionId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this session? This cannot be undone.')) {
      this.campaignService.deleteSession(this.campaignData.campaign.id, sessionId);
      this.loadSessions();
      this.dataChanged.emit();
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatTime(dateString: string): string {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getAttendeeNames(attendeeIds: string[]): string {
    if (attendeeIds.length === 0) return 'No attendees';
    const names = attendeeIds.map(id => {
      const character = this.characterService.getCharacter(id);
      return character?.name || 'Unknown';
    });
    return names.join(', ');
  }

  getObjectiveTitle(objectiveId: string): string {
    const objective = this.campaignData.objectives.find(o => o.id === objectiveId);
    return objective?.title || 'Unknown Objective';
  }

  getProgressedObjectiveTitles(objectiveIds: string[]): string {
    if (objectiveIds.length === 0) return 'None';
    return objectiveIds.map(id => this.getObjectiveTitle(id)).join(', ');
  }

  private resetForm(): void {
    this.newSessionForm = {
      date: new Date().toISOString().split('T')[0],
      duration: '',
      location: '',
      attendees: new Set(),
      summary: '',
      objectivesProgressed: new Set(),
      notes: '',
      combatNotes: ''
    };
  }
}
