import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DiceRollerComponent } from './components/dice-roller/dice-roller.component';
import { TranslationService } from './services/translation.service';
import { GameSystemService } from './services/game-system.service';
import { UIStateService } from './services/ui-state.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DiceRollerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  showDiceRoller = signal(true);

  constructor(
    public translationService: TranslationService,
    public gameSystemService: GameSystemService,
    public uiStateService: UIStateService,
    private titleService: Title,
    private router: Router
  ) {
    // Update document title whenever game system or language changes
    effect(() => {
      this.updateTitle();
    });
  }

  ngOnInit(): void {
    this.updateTitle();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.updateDiceRollerVisibility(event.urlAfterRedirects);
      });
    // Check initial route
    this.updateDiceRollerVisibility(this.router.url);
  }

  private updateDiceRollerVisibility(url: string): void {
    const hideDiceRollerRoutes = ['/characters', '/settings', '/bestiary', '/rules', '/combat-map'];
    this.showDiceRoller.set(!hideDiceRollerRoutes.some(route => url.startsWith(route)));
  }

  private updateTitle(): void {
    const systemName = this.gameSystemService.getSystemName();
    const appTitle = this.translationService.get('app.title', 'Character Generator');
    this.titleService.setTitle(`${systemName} ${appTitle}`);
  }
}
