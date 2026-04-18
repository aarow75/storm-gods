import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-notes',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-notes.html',
  styleUrl: './character-notes.css',
})
export class CharacterNotes {
  @Input() notes!: string;
  @Output() notesChange = new EventEmitter<string>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.notes');
  }

  onNotesChange(value: string): void {
    this.notesChange.emit(value);
  }
}
