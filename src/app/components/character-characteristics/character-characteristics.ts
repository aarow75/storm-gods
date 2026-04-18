import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterStats } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';
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

  constructor(
    public translationService: TranslationService,
    public gameSystemService: GameSystemService
  ) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.characteristics');
  }

  get dexLabel(): string {
    return this.gameSystemService.gameSystem() === 'runequest'
      ? this.translationService.get('char.dex', 'DEX (Dexterity)')
      : this.translationService.get('char.agl', 'AGL (Agility)');
  }

  get powLabel(): string {
    return this.gameSystemService.gameSystem() === 'runequest'
      ? this.translationService.get('char.pow', 'POW (Power)')
      : this.translationService.get('char.wil', 'WIL (Willpower)');
  }

  get showSiz(): boolean {
    return this.gameSystemService.gameSystem() === 'runequest';
  }
}
