import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystem, GameSystemService } from '../../services/game-system.service';
import { UIStateService } from '../../services/ui-state.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  constructor(
    public gameSystemService: GameSystemService,
    public uiStateService: UIStateService
  ) {}

  switchSystem(system: GameSystem): void {
    this.gameSystemService.switchSystem(system);
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
