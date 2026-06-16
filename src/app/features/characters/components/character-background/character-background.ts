import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterBackground as CharacterBackgroundModel } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  selector: 'app-character-background',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-background.html',
  styleUrl: './character-background.css',
})
export class CharacterBackground {
  @Input() background!: CharacterBackgroundModel;
  @Input() cults: string[] = [];
  @Input() occupations: string[] = [];
  @Input() homelands: string[] = [];
  @Input() isFieldInvalid!: (field: string) => boolean;
  @Input() isFieldRandomized!: (field: string) => boolean;

  @Output() cultChange = new EventEmitter<void>();

  genderOptions = [
    'Male',
    'Female',
    'Non-binary',
    'Genderfluid',
    'Agender',
    'Other'
  ];

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Background';
  }

  get cultLabel(): string {
    return this.gameSystemService.getCultLabel();
  }

  get occupationLabel(): string {
    return this.gameSystemService.getOccupationLabel();
  }

  get homelandLabel(): string {
    return this.gameSystemService.getHomelandLabel();
  }

  get selectCultLabel(): string {
    return this.gameSystemService.getSelectCultLabel();
  }

  get selectOccupationLabel(): string {
    return this.gameSystemService.getSelectOccupationLabel();
  }

  get selectHomelandLabel(): string {
    return this.gameSystemService.getSelectHomelandLabel();
  }
}
