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
  runequest: [],
  dragonbane: []
};

const ADVENTURE_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [],
  dragonbane: []
}


const RULES_DOCUMENTS: Record<GameSystem, RulesDocument[]> = {
  runequest: [],
  dragonbane: []
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
