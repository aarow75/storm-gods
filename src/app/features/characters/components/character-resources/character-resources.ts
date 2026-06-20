import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resources } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  standalone: true,
  selector: 'app-character-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-resources.html',
  styleUrl: './character-resources.css',
})
export class CharacterResources {
  @Input() resources!: Resources;

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Resources';
  }

  getResourceKeys(): { key: keyof Resources; label: string; hint?: string }[] {
    const system = this.gameSystemService.gameSystem();
    if (system === 'kal-arath') {
      return [
        { key: 'silver',     label: 'Silver' },
        { key: 'fatePoints', label: 'Fate Points' },
        { key: 'level',      label: 'Level' },
        { key: 'xp',         label: 'XP' },
      ];
    }
    if (system === 'dragonbane') {
      return [
        { key: 'copper',           label: 'Copper',            hint: '10 copper = 1 silver' },
        { key: 'silver',           label: 'Silver',            hint: '10 silver = 1 gold' },
        { key: 'gold',             label: 'Gold' },
        { key: 'advancementMarks', label: 'Advancement Marks', hint: 'Roll D20 vs. skill to improve' },
      ];
    }
    return [
      { key: 'wheels',     label: 'Wheels (2 Gold)' },
      { key: 'lunars',     label: 'Lunars (Silver)' },
      { key: 'clacks',     label: 'Clacks (Copper)' },
      { key: 'reputation', label: 'Reputation' },
      { key: 'ransom',     label: 'Ransom' },
    ];
  }
}
