import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystem, GameSystemService } from '../../services/game-system.service';
import { UIStateService } from '../../services/ui-state.service';
import { WildernessMapService } from '../../services/wilderness-map.service';
import { CharacterService } from '../../services/character.service';
import { CombatLogService } from '../../services/combat-log.service';
import { CustomMonsterService } from '../../services/custom-monster.service';

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
    public uiStateService: UIStateService,
    private wildernessMapService: WildernessMapService,
    private characterService: CharacterService,
    private combatLogService: CombatLogService,
    private customMonsterService: CustomMonsterService
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

  exportTerrainData(): void {
    const state = this.wildernessMapService.getState();
    this.download('terrain-data', {
      exportedAt: new Date().toISOString(),
      customMaps: state.customMaps,
      terrainMaps: state.terrainMaps,
      tiles: state.tiles,
    });
  }

  exportCharacters(): void {
    this.download('characters', {
      exportedAt: new Date().toISOString(),
      characters: this.characterService.getCharacters(),
    });
  }

  exportCombatLog(): void {
    this.download('combat-log', {
      exportedAt: new Date().toISOString(),
      entries: this.combatLogService.getEntries(),
    });
  }

  exportCustomMonsters(): void {
    this.download('custom-monsters', {
      exportedAt: new Date().toISOString(),
      monsters: this.customMonsterService.getMonsters(),
    });
  }

  private download(filename: string, data: object): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}
