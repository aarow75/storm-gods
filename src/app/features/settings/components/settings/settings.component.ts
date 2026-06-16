import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystem, GameSystemService } from '@shared/services/game-system.service';
import { UIStateService } from '@shared/services/ui-state.service';
import { ExportService } from '@shared/services/export.service';
import { DataPort, DataPortService } from '@shared/services/data-port.service';

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
    public dataPortService: DataPortService,
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

  exportFromPort(port: DataPort): void {
    this.exportService.download(port.dataPortKey, port.exportData() as object);
  }

  importFromPort(port: DataPort): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const data = await this.readJsonFile(e as Event);
      if (data == null || !port.importData) return;
      alert(port.importData(data));
    };
    input.click();
  }

  private readJsonFile(event: Event): Promise<unknown> {
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
