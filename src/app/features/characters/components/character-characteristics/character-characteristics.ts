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

  get dexLabel(): string {
    return this.gameSystemService.getRules().getStatDefinitions().find(s => s.key === 'DEX')?.label ?? 'DEX (Dexterity)';
  }

  get powLabel(): string {
    return this.gameSystemService.getRules().getStatDefinitions().find(s => s.key === 'POW')?.label ?? 'POW (Power)';
  }

  get showSiz(): boolean {
    return this.gameSystemService.getRules().getStatDefinitions().find(s => s.key === 'SIZ')?.visible ?? true;
  }
}
