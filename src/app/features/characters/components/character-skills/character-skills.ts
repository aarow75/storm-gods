import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterSkills as CharacterSkillsModel } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

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
}
