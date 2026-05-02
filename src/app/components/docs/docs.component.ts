import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GameSystemService, GameSystem } from '../../services/game-system.service';

interface RulesDocument {
  filename: string;
  name: string;
}

const RULES_DOCUMENTS: Record<GameSystem, RulesDocument[]> = {
  runequest: [
    { filename: 'I-introduction', name: 'I. Introduction' },
    { filename: 'II-character-creation', name: 'II. Character Creation' },
    { filename: 'III-mechanics-and-melee', name: 'III. Mechanics and Melee' },
    { filename: 'IV-combat-skills', name: 'IV. Combat Skills' },
    { filename: 'V-basic-magic', name: 'V. Basic Magic' },
    { filename: 'VI-other-skills', name: 'VI. Other Skills' },
    { filename: 'VII-rune-magic', name: 'VII. Rune Magic' },
    { filename: 'VIII-monsters', name: 'VIII. Monsters' },
    { filename: 'IX-treasure', name: 'IX. Treasure Hoards' },
    { filename: 'X-appendices', name: 'X. Appendices' }
  ],
  dragonbane: [
    { filename: 'I-introduction', name: 'I. Introduction' },
    { filename: 'II-your-player-character', name: 'II. Your Player Character' },
    { filename: 'III-skills', name: 'III. Skills' },
    { filename: 'IV-combat-and-damage', name: 'IV. Combat and Damage' },
    { filename: 'V-magic', name: 'V. Magic' },
    { filename: 'VI-gear', name: 'VI. Gear' },
    { filename: 'VII-bestiary', name: 'VII. Bestiary' },
    { filename: 'VIII-adventures', name: 'VIII. Adventures' }
  ]
};

@Component({
  selector: 'app-docs',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent {
  rulesDocuments = computed(() => RULES_DOCUMENTS[this.gameSystemService.gameSystem()]);
  isExpandedRules = true;

  constructor(
    public gameSystemService: GameSystemService
  ) {}

  toggleRulesMenu() {
    this.isExpandedRules = !this.isExpandedRules;
  }
}
