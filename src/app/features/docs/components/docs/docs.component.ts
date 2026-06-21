import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GameSystemService, GameSystem } from '@shared/services/game-system.service';

interface RulesDocument {
  filename: string;
  name: string;
  tocMaxLevel?: number;
}

interface CustomDocument {
  filename: string;
  name: string;
  icon?: string;
  tocMaxLevel?: number;
}

// Add entries here to show additional markdown docs in the sidebar.
// Place the .md files in public/docs/ and use their path as `filename`.
// Example: { filename: 'house-rules.md', name: 'House Rules', icon: '🏠' }
const CUSTOM_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [
    { filename: 'RuneQuest-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
    { filename: 'Dragonbane-vs-RuneQuest-Comparison.md', name: 'Dragonbane vs RuneQuest', icon: '⚖️' }
  ],
  dragonbane: [
    { filename: 'Dragonbane-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
    { filename: 'Dragonbane-vs-RuneQuest-Comparison.md', name: 'Dragonbane vs RuneQuest', icon: '⚖️' }
  ],
  'kal-arath': [
    { filename: 'Kal-Arath-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' }
  ],
  osric: [
    { filename: 'OSRIC-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' }
  ]
};

const ADVENTURE_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [],
  dragonbane: [],
  'kal-arath': [],
  osric: []
}


const RULES_DOCUMENTS: Record<GameSystem, RulesDocument[]> = {
  runequest: [],
  dragonbane: [],
  'kal-arath': [],
  osric: []
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
