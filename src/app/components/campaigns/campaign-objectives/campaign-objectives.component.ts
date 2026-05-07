import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignData, CampaignObjective } from '../../../models/campaign.model';
import { CampaignService } from '../../../services/campaign.service';

@Component({
  selector: 'app-campaign-objectives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-objectives.component.html',
  styleUrl: './campaign-objectives.component.css'
})
export class CampaignObjectivesComponent implements OnInit, OnChanges {
  @Input() campaignData!: CampaignData;
  @Output() dataChanged = new EventEmitter<void>();

  showCreateModal = false;
  editingObjectiveId: string | null = null;
  newObjectiveForm = {
    title: '',
    description: '',
    priority: 'major' as 'critical' | 'major' | 'minor',
    notes: ''
  };

  objectivesByStatus = {
    active: [] as CampaignObjective[],
    paused: [] as CampaignObjective[],
    completed: [] as CampaignObjective[],
    failed: [] as CampaignObjective[]
  };

  constructor(private campaignService: CampaignService) {}

  ngOnInit(): void {
    this.loadObjectives();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData'] && !changes['campaignData'].firstChange) {
      this.loadObjectives();
    }
  }

  loadObjectives(): void {
    const objectives = this.campaignService.getObjectivesByCampaign(this.campaignData.campaign.id);

    this.objectivesByStatus = {
      active: objectives.filter(o => o.status === 'active').sort((a, b) => b.priority.localeCompare(a.priority)),
      paused: objectives.filter(o => o.status === 'paused'),
      completed: objectives.filter(o => o.status === 'completed'),
      failed: objectives.filter(o => o.status === 'failed')
    };
  }

  openCreateModal(): void {
    this.editingObjectiveId = null;
    this.resetForm();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.editingObjectiveId = null;
    this.resetForm();
  }

  createObjective(): void {
    if (!this.newObjectiveForm.title.trim()) {
      alert('Objective title is required');
      return;
    }

    this.campaignService.createObjective(this.campaignData.campaign.id, {
      title: this.newObjectiveForm.title,
      description: this.newObjectiveForm.description,
      priority: this.newObjectiveForm.priority,
      notes: this.newObjectiveForm.notes
    });

    this.closeCreateModal();
    this.loadObjectives();
    this.dataChanged.emit();
  }

  updateObjective(objectiveId: string): void {
    this.campaignService.updateObjective(this.campaignData.campaign.id, objectiveId, {
      title: this.newObjectiveForm.title,
      description: this.newObjectiveForm.description,
      priority: this.newObjectiveForm.priority,
      notes: this.newObjectiveForm.notes
    });

    this.closeCreateModal();
    this.loadObjectives();
    this.dataChanged.emit();
  }

  editObjective(objective: CampaignObjective): void {
    this.editingObjectiveId = objective.id;
    this.newObjectiveForm = {
      title: objective.title,
      description: objective.description,
      priority: objective.priority,
      notes: objective.notes || ''
    };
    this.showCreateModal = true;
  }

  deleteObjective(objectiveId: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Delete this objective? This cannot be undone.')) {
      this.campaignService.deleteObjective(this.campaignData.campaign.id, objectiveId);
      this.loadObjectives();
      this.dataChanged.emit();
    }
  }

  completeObjective(objective: CampaignObjective, event: Event): void {
    event.stopPropagation();
    this.campaignService.updateObjective(this.campaignData.campaign.id, objective.id, {
      status: 'completed',
      progress: 100
    });
    this.loadObjectives();
    this.dataChanged.emit();
  }

  updateProgress(objective: CampaignObjective, newProgress: number): void {
    const clamped = Math.max(0, Math.min(100, newProgress));
    this.campaignService.updateObjective(this.campaignData.campaign.id, objective.id, {
      progress: clamped
    });
    this.loadObjectives();
  }

  incrementProgress(objective: CampaignObjective, event: Event): void {
    event.stopPropagation();
    this.updateProgress(objective, objective.progress + 10);
  }

  decrementProgress(objective: CampaignObjective, event: Event): void {
    event.stopPropagation();
    this.updateProgress(objective, objective.progress - 10);
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'major': return 'priority-major';
      case 'minor': return 'priority-minor';
      default: return '';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'completed': return 'status-completed';
      case 'failed': return 'status-failed';
      default: return '';
    }
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  private resetForm(): void {
    this.newObjectiveForm = {
      title: '',
      description: '',
      priority: 'major',
      notes: ''
    };
  }
}
