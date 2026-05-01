import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterStats } from '../../models/character.model';
import { GameSystemService } from '../../services/game-system.service';

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
    return this.gameSystemService.gameSystem() === 'runequest'
      ? 'DEX (Dexterity)'
      : 'AGL (Agility)';
  }

  get powLabel(): string {
    return this.gameSystemService.gameSystem() === 'runequest'
      ? 'POW (Power)'
      : 'WIL (Willpower)';
  }

  get showSiz(): boolean {
    return this.gameSystemService.gameSystem() === 'runequest';
  }
}
