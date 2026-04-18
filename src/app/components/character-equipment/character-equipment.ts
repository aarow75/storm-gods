import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-equipment',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-equipment.html',
  styleUrl: './character-equipment.css',
})
export class CharacterEquipment {
  @Input() equipment!: string[];
  @Output() addEquipment = new EventEmitter<void>();
  @Output() removeEquipment = new EventEmitter<number>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.equipment');
  }

  onAddEquipment(): void {
    this.addEquipment.emit();
  }

  onRemoveEquipment(index: number): void {
    this.removeEquipment.emit(index);
  }
}
