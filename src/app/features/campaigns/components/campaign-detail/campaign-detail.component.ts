import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CampaignData } from '@campaigns/models/campaign.model';
import { CampaignService } from '@campaigns/services/campaign.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { CampaignOverviewComponent } from '../campaign-overview/campaign-overview.component';
import { CampaignCharactersComponent } from '../campaign-characters/campaign-characters.component';
import { CampaignSessionsComponent } from '../campaign-sessions/campaign-sessions.component';
import { CampaignObjectivesComponent } from '../campaign-objectives/campaign-objectives.component';
import { CampaignAnalyticsComponent } from '../campaign-analytics/campaign-analytics.component';

type TabType = 'overview' | 'characters' | 'sessions' | 'objectives' | 'analytics';

@Component({
  selector: 'app-campaign-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CampaignOverviewComponent,
    CampaignCharactersComponent,
    CampaignSessionsComponent,
    CampaignObjectivesComponent,
    CampaignAnalyticsComponent
  ],
  templateUrl: './campaign-detail.component.html',
  styleUrl: './campaign-detail.component.css'
})
export class CampaignDetailComponent implements OnInit, OnDestroy {
  campaignData: CampaignData | null = null;
  campaignId: string | null = null;
  activeTab: TabType = 'overview';
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    public gameSystemService: GameSystemService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.campaignId = params.get('campaignId');
        if (this.campaignId) {
          this.loadCampaignData();
        } else {
          this.router.navigate([this.gameSystemService.link('campaigns')]);
        }
      });

    this.campaignService.campaignsUpdated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.campaignId) {
          this.loadCampaignData();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCampaignData(): void {
    if (!this.campaignId) return;

    const data = this.campaignService.getCampaignData(this.campaignId);
    if (data) {
      this.campaignData = data;
    } else {
      this.router.navigate([this.gameSystemService.link('campaigns')]);
    }
  }

  selectTab(tab: TabType): void {
    this.activeTab = tab;
  }

  onDataChanged(): void {
    this.loadCampaignData();
  }

  goBack(): void {
    this.router.navigate([this.gameSystemService.link('campaigns')]);
  }
}
