import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Campaign } from '@campaigns/models/campaign.model';
import { CampaignService } from '@campaigns/services/campaign.service';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  selector: 'app-campaign-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './campaign-planner.component.html',
  styleUrl: './campaign-planner.component.css'
})
export class CampaignPlannerComponent implements OnInit {
  campaigns: Campaign[] = [];
  showCreateModal = false;
  newCampaignForm = {
    name: '',
    primarySetting: '',
    description: '',
    startDate: new Date().toISOString().split('T')[0]
  };

  constructor(
    private campaignService: CampaignService,
    public gameSystemService: GameSystemService
  ) {}

  ngOnInit(): void {
    this.loadCampaigns();
    this.campaignService.campaignsUpdated$.subscribe(() => {
      this.loadCampaigns();
    });
  }

  loadCampaigns(): void {
    this.campaigns = this.campaignService.getCampaigns();
  }

  openCreateModal(): void {
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
    this.resetForm();
  }

  createCampaign(): void {
    if (!this.newCampaignForm.name.trim()) {
      alert('Campaign name is required');
      return;
    }

    this.campaignService.createCampaign({
      name: this.newCampaignForm.name,
      primarySetting: this.newCampaignForm.primarySetting,
      description: this.newCampaignForm.description,
      startDate: this.newCampaignForm.startDate ? new Date(this.newCampaignForm.startDate).toISOString() : undefined
    });

    this.closeCreateModal();
  }

  deleteCampaign(id: string, event: Event): void {
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this campaign? This cannot be undone.')) {
      this.campaignService.deleteCampaign(id);
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'active': return 'status-active';
      case 'paused': return 'status-paused';
      case 'completed': return 'status-completed';
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

  getCharacterCount(campaign: Campaign): number {
    return campaign.characterIds.length;
  }

  private resetForm(): void {
    this.newCampaignForm = {
      name: '',
      primarySetting: '',
      description: '',
      startDate: new Date().toISOString().split('T')[0]
    };
  }
}
