import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-conditions',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-conditions.html',
  styleUrl: './character-conditions.css',
})
export class CharacterConditions {
  @Input() conditions: string[] = [];
  @Output() conditionsChange = new EventEmitter<string[]>();

  newCondition = '';
  commonConditions = ['diseased', 'poisoned', 'cursed', 'plagued', 'wounded'];

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.conditions');
  }

  addCondition(): void {
    const condition = this.newCondition.trim().toLowerCase();
    if (condition && !this.conditions.includes(condition)) {
      this.conditions = [...this.conditions, condition];
      this.conditionsChange.emit(this.conditions);
      this.newCondition = '';
    }
  }

  addCommonCondition(condition: string): void {
    if (!this.conditions.includes(condition)) {
      this.conditions = [...this.conditions, condition];
      this.conditionsChange.emit(this.conditions);
    }
  }

  removeCondition(condition: string): void {
    this.conditions = this.conditions.filter(c => c !== condition);
    this.conditionsChange.emit(this.conditions);
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addCondition();
    }
  }
}
