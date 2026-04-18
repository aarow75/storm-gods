import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterSkills as CharacterSkillsModel } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-character-skills',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-skills.html',
  styleUrl: './character-skills.css',
})
export class CharacterSkills {
  @Input() skills!: CharacterSkillsModel;
  @Input() skillCategories: any = {};
  @Input() getCategoryKeys!: () => string[];
  @Input() getSkillKeys!: (category: string) => string[];

  @Output() applyBonuses = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.skills');
  }

  /**
   * Converts a percentage skill value to a d20 equivalent
   * Formula: percentage / 5 = d20 target
   * e.g., 5% = 1, 25% = 5, 50% = 10, 100% = 20
   */
  percentageToD20(percentage: number): number {
    return Math.round(percentage / 5);
  }
}
