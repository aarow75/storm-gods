import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystem, GameSystemService } from '@shared/services/game-system.service';
import { UIStateService } from '@shared/services/ui-state.service';
import { WildernessMapService } from '@maps/services/wilderness-map.service';
import { CharacterService } from '@characters/services/character.service';
import { CombatLogService } from '@combat/services/combat-log.service';
import { CustomMonsterService } from '@bestiary/services/custom-monster.service';
import { ExportService } from '@shared/services/export.service';
import { TerrainMapExport } from '@maps/models/wilderness-map.model';

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
    private customMonsterService: CustomMonsterService,
    private exportService: ExportService
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
    this.exportService.download('terrain-data', {
      exportType: 'terrain-maps',
      version: 2,
      exportedAt: new Date().toISOString(),
      customMaps: state.customMaps,
      terrainMaps: state.terrainMaps,
      tokenMaps: state.tokenMaps,
    });
  }

  async importTerrainData(event: Event): Promise<void> {
    const data = await this.readJsonFile(event);
    if (!data) return;
    let result: { imported: number; skipped: number };
    if (data.terrainMaps || data.customMaps || data.tokenMaps) {
      result = this.wildernessMapService.importStateData(data);
    } else if (Array.isArray(data.maps)) {
      result = this.wildernessMapService.importMaps(data.maps);
    } else {
      result = { imported: 0, skipped: 0 };
    }
    alert(`Imported ${result.imported} map(s). ${result.skipped} skipped (already exist).`);
  }

  exportCharacters(): void {
    this.exportService.download('characters', {
      exportedAt: new Date().toISOString(),
      characters: this.characterService.getCharacters(),
    });
  }

  exportCombatLog(): void {
    this.exportService.download('combat-log', {
      exportedAt: new Date().toISOString(),
      entries: this.combatLogService.getEntries(),
    });
  }

  exportCustomMonsters(): void {
    this.exportService.download('custom-monsters', {
      exportedAt: new Date().toISOString(),
      monsters: this.customMonsterService.getMonsters(),
    });
  }

  async importCharacters(event: Event): Promise<void> {
    const data = await this.readJsonFile(event);
    if (!data?.characters) { alert('Invalid characters file.'); return; }
    const result = this.characterService.importCharacters(data.characters);
    alert(`Imported ${result.imported} character(s). ${result.skipped} skipped (already exist).`);
  }

  async importMonsters(event: Event): Promise<void> {
    const data = await this.readJsonFile(event);
    if (!data?.monsters) { alert('Invalid monsters file.'); return; }
    const result = this.customMonsterService.importMonsters(data.monsters);
    alert(`Imported ${result.imported} monster(s). ${result.skipped} skipped (already exist).`);
  }

  private readJsonFile(event: Event): Promise<any> {
    return new Promise((resolve) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = () => resolve(JSON.parse(reader.result as string));
      reader.readAsText(file);
      (event.target as HTMLInputElement).value = '';
    });
  }
}
