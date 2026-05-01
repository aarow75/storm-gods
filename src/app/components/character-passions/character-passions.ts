import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Passion } from '../../models/character.model';

@Component({
  standalone: true,
  selector: 'app-character-passions',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-passions.html',
  styleUrl: './character-passions.css',
})
export class CharacterPassions {
  @Input() passions!: Passion[];
  @Input() commonPassions!: string[];
  @Input() isCustomPassion!: (name: string) => boolean;
  @Input() getPassionDropdownValue!: (passion: Passion) => string;
  @Output() addPassion = new EventEmitter<void>();
  @Output() removePassion = new EventEmitter<number>();

  get heading(): string {
    return 'Passions';
  }

  onAddPassion(): void {
    this.addPassion.emit();
  }

  onRemovePassion(index: number): void {
    this.removePassion.emit(index);
  }
}
