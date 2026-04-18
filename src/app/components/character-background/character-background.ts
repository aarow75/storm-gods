import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterBackground as CharacterBackgroundModel } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';
import { GameSystemService } from '../../services/game-system.service';

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

  constructor(
    public translationService: TranslationService,
    public gameSystemService: GameSystemService
  ) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.background');
  }

  get cultLabel(): string {
    return this.translationService.get(this.gameSystemService.getCultLabel(), 'Cult/Religion');
  }

  get occupationLabel(): string {
    return this.translationService.get(this.gameSystemService.getOccupationLabel(), 'Occupation');
  }

  get homelandLabel(): string {
    return this.translationService.get(this.gameSystemService.getHomelandLabel(), 'Homeland');
  }

  get selectCultLabel(): string {
    const key = this.gameSystemService.gameSystem() === 'runequest' ? 'background.selectCult' : 'background.selectBelief';
    return this.translationService.get(key, 'Select Cult');
  }

  get selectOccupationLabel(): string {
    const key = this.gameSystemService.gameSystem() === 'runequest' ? 'background.selectOccupation' : 'background.selectProfession';
    return this.translationService.get(key, 'Select Occupation');
  }

  get selectHomelandLabel(): string {
    const key = this.gameSystemService.gameSystem() === 'runequest' ? 'background.selectHomeland' : 'background.selectKin';
    return this.translationService.get(key, 'Select Homeland');
  }
}
