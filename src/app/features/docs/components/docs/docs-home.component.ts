import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSystemService } from '@shared/services/game-system.service';
import { CAMPAIGN_SETTINGS, CampaignSetting } from '@docs/constants/campaign-settings.constants';

@Component({
  selector: 'app-docs-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="docs-home">
      <h2>Reference</h2>
      <p>Browse game resources for {{ gameSystem.getSystemName() }}.</p>
      <div class="docs-home-links">
        <a [routerLink]="gameSystem.link('docs', 'publications')" class="docs-home-card">
          <span class="docs-home-icon">&#x1F4DA;</span>
          <span>Publications</span>
        </a>
        <a [routerLink]="gameSystem.link('docs', 'gm-screen')" class="docs-home-card">
          <span class="docs-home-icon">&#x1F6A8;</span>
          <span>GM Screen</span>
        </a>
      </div>

      @if (settings.length > 0) {
        <h3>Campaign Settings</h3>
        <p class="section-note">Playable with any rules system</p>
        <div class="settings-list">
          @for (setting of settings; track setting.id) {
            <a [routerLink]="gameSystem.link('docs', 'page')" [queryParams]="{ file: setting.markdownFile }" class="setting-card">
              <span class="setting-title">{{ setting.title }}</span>
              <span class="setting-description">{{ setting.description }}</span>
              @if (setting.books && setting.books.length > 0) {
                <ul class="setting-books">
                  @for (book of setting.books; track book.title) {
                    <li>{{ book.title }} <span class="book-year">({{ book.year }})</span></li>
                  }
                </ul>
              }
            </a>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .docs-home {
      padding: var(--spacing-4xl);
    }
    h2 {
      font-size: var(--font-size-2xl);
      margin: 0 0 var(--spacing-lg);
    }
    h3 {
      font-size: var(--font-size-xl);
      margin: var(--spacing-6xl) 0 var(--spacing-xs);
    }
    p {
      color: var(--text-muted);
      margin: 0 0 var(--spacing-5xl);
    }
    .section-note {
      margin: 0 0 var(--spacing-3xl);
    }
    .docs-home-links {
      display: flex;
      gap: var(--spacing-4xl);
      flex-wrap: wrap;
    }
    .docs-home-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-5xl) var(--spacing-6xl);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      text-decoration: none;
      color: var(--text-color);
      transition: background-color 0.2s, color 0.2s, border-color 0.2s;
    }
    .docs-home-card:hover {
      background-color: var(--accent-hover);
      color: var(--accent-color);
      border-color: var(--accent-color);
    }
    .docs-home-icon {
      font-size: var(--font-size-2xl);
    }
    .settings-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-2xl);
    }
    .setting-card {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      padding: var(--spacing-3xl);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius-lg);
      text-decoration: none;
      color: var(--text-color);
      transition: background-color 0.2s, border-color 0.2s;
      max-width: 600px;
    }
    .setting-card:hover {
      background-color: var(--accent-hover);
      border-color: var(--accent-color);
    }
    .setting-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--accent-color);
    }
    .setting-description {
      font-size: var(--font-size-base);
      color: var(--text-muted);
      line-height: 1.5;
    }
    .setting-books {
      margin: var(--spacing-lg) 0 0 var(--spacing-3xl);
      padding: 0;
      list-style: disc;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    .setting-books li {
      font-size: var(--font-size-sm);
      color: var(--text-muted);
    }
    .book-year {
      opacity: 0.65;
    }
  `]
})
export class DocsHomeComponent {
  readonly settings: CampaignSetting[] = CAMPAIGN_SETTINGS;
  constructor(public gameSystem: GameSystemService) {}
}
