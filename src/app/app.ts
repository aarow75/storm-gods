import { Component, OnInit, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { DiceRollerComponent } from './components/dice-roller/dice-roller.component';
import { GameSystemService } from './services/game-system.service';
import { UIStateService } from './services/ui-state.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, DiceRollerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  diceModalOpen = signal(false);

  constructor(
    public gameSystemService: GameSystemService,
    public uiStateService: UIStateService,
    private titleService: Title
  ) {
    effect(() => {
      this.updateTitle();
    });
  }

  ngOnInit(): void {
    this.updateTitle();
  }

  toggleDiceModal(): void {
    this.diceModalOpen.update(open => !open);
  }

  closeDiceModal(): void {
    this.diceModalOpen.set(false);
  }

  private updateTitle(): void {
    const systemName = this.gameSystemService.getSystemName();
    this.titleService.setTitle(`${systemName}`);
  }
}
