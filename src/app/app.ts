import { Component, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DiceRollerComponent } from './components/dice-roller/dice-roller.component';
import { TranslationService } from './services/translation.service';
import { GameSystemService } from './services/game-system.service';
import { UIStateService } from './services/ui-state.service';
import { ShowIfTranslationDirective } from './directives/show-if-translation.directive';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DiceRollerComponent, ShowIfTranslationDirective],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(
    public translationService: TranslationService,
    public gameSystemService: GameSystemService,
    public uiStateService: UIStateService,
    private titleService: Title
  ) {
    // Update document title whenever game system or language changes
    effect(() => {
      this.updateTitle();
    });
  }

  ngOnInit(): void {
    this.updateTitle();
  }

  private updateTitle(): void {
    const systemName = this.gameSystemService.getSystemName();
    const appTitle = this.translationService.get('app.title', 'Character Generator');
    this.titleService.setTitle(`${systemName} ${appTitle}`);
  }

  switchLanguage(locale: 'en' | 'sv'): void {
    this.translationService.setLocale(locale);
    this.updateTitle();
  }

  toggleGameSystem(): void {
    this.gameSystemService.toggleGameSystem();
    this.updateTitle();
  }

  increaseFontSize(): void {
    this.uiStateService.increaseFontSize();
  }

  decreaseFontSize(): void {
    this.uiStateService.decreaseFontSize();
  }

  resetFontSize(): void {
    this.uiStateService.resetFontSize();
  }
}
