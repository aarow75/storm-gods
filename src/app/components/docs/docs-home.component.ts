import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSystemService } from '../../services/game-system.service';

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
    p {
      color: var(--text-muted);
      margin: 0 0 var(--spacing-5xl);
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
  `]
})
export class DocsHomeComponent {
  constructor(public gameSystem: GameSystemService) {}
}
