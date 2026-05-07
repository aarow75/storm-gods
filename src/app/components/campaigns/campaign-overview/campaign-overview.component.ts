import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CampaignData } from '../../../models/campaign.model';
import { CampaignService } from '../../../services/campaign.service';

@Component({
  selector: 'app-campaign-overview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './campaign-overview.component.html',
  styleUrl: './campaign-overview.component.css'
})
export class CampaignOverviewComponent {
  @Input() campaignData!: CampaignData;
  @Output() dataChanged = new EventEmitter<void>();

  isEditMode = false;
  editForm = {
    name: '',
    primarySetting: '',
    description: '',
    startDate: '',
    endDate: '',
    status: 'active' as 'active' | 'paused' | 'completed'
  };

  constructor(private campaignService: CampaignService) {}

  toggleEditMode(): void {
    if (!this.isEditMode) {
      this.editForm = {
        name: this.campaignData.campaign.name,
        primarySetting: this.campaignData.campaign.primarySetting,
        description: this.campaignData.campaign.description || '',
        startDate: this.campaignData.campaign.startDate.split('T')[0],
        endDate: this.campaignData.campaign.endDate ? this.campaignData.campaign.endDate.split('T')[0] : '',
        status: this.campaignData.campaign.status
      };
    }
    this.isEditMode = !this.isEditMode;
  }

  saveCampaign(): void {
    if (!this.editForm.name.trim()) {
      alert('Campaign name is required');
      return;
    }

    const updates = {
      name: this.editForm.name,
      primarySetting: this.editForm.primarySetting,
      description: this.editForm.description,
      startDate: this.editForm.startDate ? new Date(this.editForm.startDate).toISOString() : this.campaignData.campaign.startDate,
      endDate: this.editForm.endDate ? new Date(this.editForm.endDate).toISOString() : undefined,
      status: this.editForm.status
    };

    this.campaignService.updateCampaign(this.campaignData.campaign.id, updates);
    this.isEditMode = false;
    this.dataChanged.emit();
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }

  getActiveSessions(): number {
    return this.campaignData.sessionLogs.length;
  }

  getActiveObjectives(): number {
    return this.campaignData.objectives.filter(o => o.status === 'active').length;
  }

  getTotalObjectives(): number {
    return this.campaignData.objectives.length;
  }
}
