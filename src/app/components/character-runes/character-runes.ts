import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Runes } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-runes',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-runes.html',
  styleUrl: './character-runes.css',
})
export class CharacterRunes {
  @Input() runes!: Runes;
  @Input() getOpposedRuneValue!: (rune: string, type: 'elemental' | 'power') => number;
  @Output() runeChange = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.runes');
  }

  getRuneKeys(type: 'elemental' | 'power' | 'form'): string[] {
    if (!this.runes) return [];
    return Object.keys(this.runes[type]);
  }

  onRuneChange(): void {
    this.runeChange.emit();
  }
}
