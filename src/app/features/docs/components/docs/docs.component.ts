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
    { filename: 'Dragonbane-vs-RuneQuest-Comparison.md', name: 'Dragonbane vs RuneQuest', icon: '⚖️' },
    { filename: 'Kal-Arath-vs-RuneQuest-Comparison.md', name: 'Kal-Arath vs RuneQuest', icon: '⚖️' },
    { filename: 'OSRIC-vs-RuneQuest-Comparison.md', name: 'OSRIC vs RuneQuest', icon: '⚖️' },
    { filename: 'Mothership-vs-RuneQuest-Comparison.md', name: 'Mothership vs RuneQuest', icon: '⚖️' },
  ],
  dragonbane: [
    { filename: 'Dragonbane-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
    { filename: 'Dragonbane-vs-RuneQuest-Comparison.md', name: 'Dragonbane vs RuneQuest', icon: '⚖️' },
    { filename: 'Kal-Arath-vs-Dragonbane-Comparison.md', name: 'Kal-Arath vs Dragonbane', icon: '⚖️' },
    { filename: 'OSRIC-vs-Dragonbane-Comparison.md', name: 'OSRIC vs Dragonbane', icon: '⚖️' },
  ],
  'kal-arath': [
    { filename: 'Kal-Arath-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
    { filename: 'Kal-Arath-vs-RuneQuest-Comparison.md', name: 'Kal-Arath vs RuneQuest', icon: '⚖️' },
    { filename: 'Kal-Arath-vs-Dragonbane-Comparison.md', name: 'Kal-Arath vs Dragonbane', icon: '⚖️' },
    { filename: 'Kal-Arath-vs-OSRIC-Comparison.md', name: 'Kal-Arath vs OSRIC', icon: '⚖️' },
  ],
  osric: [
    { filename: 'OSRIC-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
    { filename: 'OSRIC-vs-RuneQuest-Comparison.md', name: 'OSRIC vs RuneQuest', icon: '⚖️' },
    { filename: 'OSRIC-vs-Dragonbane-Comparison.md', name: 'OSRIC vs Dragonbane', icon: '⚖️' },
    { filename: 'Kal-Arath-vs-OSRIC-Comparison.md', name: 'Kal-Arath vs OSRIC', icon: '⚖️' },
  ],
  mothership: [
    { filename: 'Mothership-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
    { filename: 'Mothership-vs-RuneQuest-Comparison.md', name: 'Mothership vs RuneQuest', icon: '⚖️' },
  ],
  brp: [
    { filename: 'Basic-Role-Playing-Mechanics-Reference.md', name: 'Mechanics Reference', icon: '⚙️' },
  ],
};

// Spell/weapon/equipment reference pages describing the items offered in the
// app's dropdowns. Filenames must match REFERENCE_DOCS in
// @shared/constants/reference-docs.constants.ts (used by in-app reference links).
const REFERENCE_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [
    { filename: 'RuneQuest-Spells.md', name: 'Spells', icon: '🪄', tocMaxLevel: 2 },
    { filename: 'RuneQuest-Weapons.md', name: 'Weapons & Armor', icon: '⚔️' },
    { filename: 'RuneQuest-Equipment.md', name: 'Equipment', icon: '🎒' },
  ],
  dragonbane: [
    { filename: 'Dragonbane-Spells.md', name: 'Spells', icon: '🪄', tocMaxLevel: 2 },
    { filename: 'Dragonbane-Weapons.md', name: 'Weapons & Armor', icon: '⚔️' },
    { filename: 'Dragonbane-Equipment.md', name: 'Equipment', icon: '🎒' },
  ],
  'kal-arath': [
    { filename: 'Kal-Arath-Spells.md', name: 'Spells', icon: '🪄', tocMaxLevel: 2 },
    { filename: 'Kal-Arath-Weapons.md', name: 'Weapons & Armor', icon: '⚔️' },
    { filename: 'Kal-Arath-Equipment.md', name: 'Equipment', icon: '🎒' },
  ],
  osric: [
    { filename: 'OSRIC-Spells.md', name: 'Spells', icon: '🪄', tocMaxLevel: 2 },
    { filename: 'OSRIC-Weapons.md', name: 'Weapons & Armor', icon: '⚔️' },
    { filename: 'OSRIC-Equipment.md', name: 'Equipment', icon: '🎒' },
  ],
  mothership: [
    { filename: 'Mothership-Weapons.md', name: 'Weapons & Armor', icon: '⚔️' },
    { filename: 'Mothership-Equipment.md', name: 'Equipment', icon: '🎒' },
  ],
  brp: [],
};

const ADVENTURE_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [],
  dragonbane: [],
  'kal-arath': [],
  osric: [],
  mothership: [],
  brp: [],
}


const RULES_DOCUMENTS: Record<GameSystem, RulesDocument[]> = {
  runequest: [],
  dragonbane: [],
  'kal-arath': [],
  osric: [],
  mothership: [],
  brp: [],
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
  referenceDocuments = computed(() => REFERENCE_DOCUMENTS[this.gameSystemService.gameSystem()]);
  isExpandedRules = true;
  isExpandedCustom = true;
  isExpandedAdventures = true;
  isExpandedReference = true;

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

  toggleReferenceMenu() {
    this.isExpandedReference = !this.isExpandedReference;
  }
}
