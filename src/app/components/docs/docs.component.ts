import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GameSystemService, GameSystem } from '../../services/game-system.service';

interface RulesDocument {
  filename: string;
  name: string;
}

interface CustomDocument {
  filename: string;
  name: string;
  icon?: string;
}

// Add entries here to show additional markdown docs in the sidebar.
// Place the .md files in public/docs/ and use their path as `filename`.
// Example: { filename: 'house-rules.md', name: 'House Rules', icon: '🏠' }
const CUSTOM_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [
    {
      filename: 'BASIC ROLE-PLAYING.md',
      name: 'Basic Roleplaying'
    },
  ],
  dragonbane: [
    {
      filename: 'dragonbane/dragonbane-srd.md',
      name: 'Dragonbane Quickstart Rules'
    },
    {
      filename: 'dragonbane/dragonbane-faq.md',
      name: 'Dragonbane FAQ'
    }

  ]
};

const ADVENTURE_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [
    {
      filename: 'runequest/adventures/00-Gamemasters-Screen-Pack-Adventures.md',
      name: 'CHA4029 Gamemaster\'s Screen Pack: Adventures'
    }
  ],
  dragonbane: []
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
  customDocuments = computed(() => CUSTOM_DOCUMENTS[this.gameSystemService.gameSystem()]);
  adventureDocuments = computed(() => ADVENTURE_DOCUMENTS[this.gameSystemService.gameSystem()]);
  isExpandedRules = true;
  isExpandedCustom = true;
  isExpandedAdventures = true;

  constructor(
    public gameSystemService: GameSystemService
  ) {}

  toggleRulesMenu() {
    this.isExpandedRules = !this.isExpandedRules;
  }

  toggleCustomMenu() {
    this.isExpandedCustom = !this.isExpandedCustom;
  }

  toggleAdventuresMenu() {
    this.isExpandedAdventures = !this.isExpandedAdventures;
  }
}
