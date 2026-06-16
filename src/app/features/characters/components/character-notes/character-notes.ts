import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  get heading(): string {
    return 'Notes';
  }

  onNotesChange(value: string): void {
    this.notesChange.emit(value);
  }
}
