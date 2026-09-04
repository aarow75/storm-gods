import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CampaignData } from '@campaigns/models/campaign.model';
import { CampaignScenario } from '@campaigns/models/scenario.model';
import { CampaignService } from '@campaigns/services/campaign.service';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { CustomMap } from '@maps/models/wilderness-map.model';
import { MAP_BACKGROUNDS } from '@maps/constants/map-backgrounds.constants';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  selector: 'app-campaign-scenarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './campaign-scenarios.component.html',
  styleUrl: './campaign-scenarios.component.css'
})
export class CampaignScenariosComponent implements OnInit, OnChanges {
  @Input() campaignData!: CampaignData;
  @Output() dataChanged = new EventEmitter<void>();

  scenarios: CampaignScenario[] = [];
  availableSourceMaps: CustomMap[] = [];

  showCreateModal = false;
  newScenarioForm: { name: string; sourceMapId: string } = { name: '', sourceMapId: '' };

  constructor(
    private campaignService: CampaignService,
    private wildernessMapService: WildernessMapService,
    private router: Router,
    public gameSystemService: GameSystemService
  ) {}

  ngOnInit(): void {
    this.loadScenarios();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['campaignData'] && !changes['campaignData'].firstChange) {
      this.loadScenarios();
    }
  }

  loadScenarios(): void {
    this.scenarios = this.campaignService.getScenariosByCampaign(this.campaignData.campaign.id);
    this.loadAvailableSourceMaps();
  }

  private loadAvailableSourceMaps(): void {
    const state = this.wildernessMapService.getState();
    // A source map can be either a user-created custom map, or one of the built-in
    // background maps (e.g. "Dragon Pass") - the image itself is a valid map even
    // without a painted terrain overlay, so all backgrounds are listed unconditionally.
    const backgroundMaps: CustomMap[] = MAP_BACKGROUNDS.map((bg) => ({
      id: bg.id,
      label: bg.label,
      width: bg.width,
      height: bg.height,
      scale: bg.scale ?? 6,
      scaleUnit: bg.scaleUnit ?? 'miles',
      backgroundImage: bg.id,
    }));
    this.availableSourceMaps = [...state.customMaps, ...backgroundMaps];
  }

  openCreateModal(): void {
    this.newScenarioForm = { name: '', sourceMapId: '' };
    // Re-read the wilderness map state now, in case terrain was painted after this
    // tab was first loaded (the dropdown would otherwise show stale/empty options).
    this.loadAvailableSourceMaps();
    this.showCreateModal = true;
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  createScenario(): void {
    if (!this.newScenarioForm.name.trim()) {
      alert('Scenario name is required');
      return;
    }

    this.campaignService.createScenario(
      this.campaignData.campaign.id,
      { name: this.newScenarioForm.name, type: 'hex-crawl' },
      this.newScenarioForm.sourceMapId || undefined
    );

    this.closeCreateModal();
    this.loadScenarios();
    this.dataChanged.emit();
  }

  openScenario(scenario: CampaignScenario): void {
    this.router.navigate(
      this.gameSystemService.link('campaigns', this.campaignData.campaign.id, 'scenarios', scenario.id)
    );
  }

  deleteScenario(scenario: CampaignScenario, event: Event): void {
    event.stopPropagation();
    if (confirm(`Delete scenario "${scenario.name}"? This cannot be undone.`)) {
      this.campaignService.deleteScenario(this.campaignData.campaign.id, scenario.id);
      this.loadScenarios();
      this.dataChanged.emit();
    }
  }

  getStatusLabel(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getTypeLabel(type: string): string {
    return type === 'hex-crawl' ? 'Hex Crawl' : type;
  }
}
