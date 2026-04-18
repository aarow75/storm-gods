import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FamilyHistory } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-character-family-history',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-family-history.html',
  styleUrl: './character-family-history.css',
})
export class CharacterFamilyHistory {
  @Input() familyHistory!: FamilyHistory;

  @Output() addEvent = new EventEmitter<void>();
  @Output() removeEvent = new EventEmitter<number>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.familyHistory');
  }
}
