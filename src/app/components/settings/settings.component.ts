import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
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

  toggle2d6Plus6(): void {
    this.uiStateService.toggle2d6Plus6();
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

  private async download(filename: string, data: object): Promise<void> {
    const dateStr = new Date().toISOString().slice(0, 10);
    const fullFilename = `${filename}-${dateStr}.json`;
    const jsonStr = JSON.stringify(data, null, 2);

    if (Capacitor.isNativePlatform()) {
      try {
        const result = await Filesystem.writeFile({
          path: fullFilename,
          data: jsonStr,
          directory: Directory.Cache,
          encoding: Encoding.UTF8,
        });
        await Share.share({
          title: fullFilename,
          url: result.uri,
          dialogTitle: 'Save or share exported data',
        });
      } catch (err) {
        console.error('Export failed:', err);
        alert('Export failed. Please try again.');
      }
    } else {
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fullFilename;
      a.click();
      URL.revokeObjectURL(url);
    }
  }
}
