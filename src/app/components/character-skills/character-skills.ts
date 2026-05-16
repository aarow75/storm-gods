import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterSkills as CharacterSkillsModel } from '../../models/character.model';
import { GameSystemService } from '../../services/game-system.service';

@Component({
  selector: 'app-character-skills',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-skills.html',
  styleUrl: './character-skills.css',
})
export class CharacterSkills {
  @Input() skills!: CharacterSkillsModel;
  @Input() skillCategories: any = {};
  @Input() dbSkillCategories: any = {};
  @Input() getCategoryKeys!: () => string[];
  @Input() getSkillKeys!: (category: string) => string[];
  @Input() getDbCategoryKeys!: () => string[];
  @Input() getDbSkillKeys!: (category: string) => string[];

  @Output() applyBonuses = new EventEmitter<void>();

  gameSystem = inject(GameSystemService).getSystemName();

  get heading(): string {
    return 'Skills';
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
