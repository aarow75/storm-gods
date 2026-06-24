import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterStats } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  selector: 'app-character-characteristics',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-characteristics.html',
  styleUrl: './character-characteristics.css',
})
export class CharacterCharacteristics {
  @Input() stats!: CharacterStats;
  @Input() isFieldInvalid!: (field: string) => boolean;
  @Input() isFieldRandomized!: (field: string) => boolean;

  @Output() rollAll = new EventEmitter<void>();
  @Output() rollStat = new EventEmitter<keyof CharacterStats>();

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Characteristics';
  }

  private statDef(key: string) {
    return this.gameSystemService.getRules().getStatDefinitions().find(s => s.key === key);
  }

  get strLabel(): string { return this.statDef('STR')?.label ?? 'STR (Strength)'; }
  get conLabel(): string { return this.statDef('CON')?.label ?? 'CON (Constitution)'; }
  get dexLabel(): string { return this.statDef('DEX')?.label ?? 'DEX (Dexterity)'; }
  get intLabel(): string { return this.statDef('INT')?.label ?? 'INT (Intelligence)'; }
  get powLabel(): string { return this.statDef('POW')?.label ?? 'POW (Power)'; }
  get chaLabel(): string { return this.statDef('CHA')?.label ?? 'CHA (Charisma)'; }

  get showSiz(): boolean { return this.statDef('SIZ')?.visible ?? true; }
  get showPow(): boolean { return this.statDef('POW')?.visible ?? true; }

  get statMin(): number { return this.gameSystemService.getRules().getStatRange().min; }
  get statMax(): number { return this.gameSystemService.getRules().getStatRange().max; }

  get showRollButtons(): boolean {
    return this.gameSystemService.getRules().canRollStats();
  }

  get rollButtonLabel(): string {
    return 'Roll All 3D6';
  }
}
