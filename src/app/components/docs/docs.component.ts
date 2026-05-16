import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { GameSystemService, GameSystem } from '../../services/game-system.service';

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
    {
      filename: 'BASIC ROLE-PLAYING.md',
      name: 'Basic Roleplaying'
    },
    // { filename: 'RuneQuest-Classic', name: 'RQ2 Rulebook', tocMaxLevel: 2 }
  ],
  dragonbane: [
    // {
    //   filename: 'dragonbane/rules/Core-Rulebook.md',
    //   name: 'Dragonbane Core Rulebook',
    //   tocMaxLevel: 2
    // },
    {
      filename: 'dragonbane/dragonbane-srd.md',
      name: 'Dragonbane Quickstart Rules',
      tocMaxLevel: 2
    },
    {
      filename: 'dragonbane/dragonbane-faq.md',
      name: 'Dragonbane FAQ',
      tocMaxLevel: 2
    }

  ]
};

const ADVENTURE_DOCUMENTS: Record<GameSystem, CustomDocument[]> = {
  runequest: [
    { filename: 'runequest/adventures/01-Introduction.md', name: 'Introduction' },
    { filename: 'runequest/adventures/02-Colymar-Tribe.md', name: 'The Colymar Tribe', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/03-Clearwine-Fort.md', name: 'Clearwine Fort', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/04-Other-Places.md', name: 'Other Places of Interest', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/05-Apple-Lane.md', name: 'Apple Lane', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/06-Rumors.md', name: 'Rumors' },
    { filename: 'runequest/adventures/07-Defending-Apple-Lane.md', name: 'Defending Apple Lane', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/08-Cattle-Raid.md', name: 'Cattle Raid', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/09-The-Dragon-of-Thunder-Hills.md', name: 'The Dragon of Thunder Hills', tocMaxLevel: 2 },
    { filename: 'runequest/adventures/10-Appendix-1-Adventure-Seeds.md', name: 'Appendix 1: Adventure Seeds' },
    { filename: 'runequest/adventures/11-Appendix-2-Metals-and-Crystals.md', name: 'Appendix 2: Metals and Crystals' },
  ],
  dragonbane: []
}


const RULES_DOCUMENTS: Record<GameSystem, RulesDocument[]> = {
  runequest: [
    { filename: 'I-introduction', name: 'I. Introduction' },
    { filename: 'II-character-creation', name: 'II. Character Creation', tocMaxLevel: 2 },
    { filename: 'III-mechanics-and-melee', name: 'III. Mechanics and Melee', tocMaxLevel: 2 },
    { filename: 'IV-combat-skills', name: 'IV. Combat Skills', tocMaxLevel: 2 },
    { filename: 'V-basic-magic', name: 'V. Basic Magic', tocMaxLevel: 2 },
    { filename: 'VI-other-skills', name: 'VI. Other Skills', tocMaxLevel: 2 },
    { filename: 'VII-rune-magic', name: 'VII. Rune Magic', tocMaxLevel: 2 },
    { filename: 'VIII-monsters', name: 'VIII. Monsters', tocMaxLevel: 2 },
    { filename: 'IX-treasure', name: 'IX. Treasure Hoards', tocMaxLevel: 2 },
    { filename: 'X-appendices', name: 'X. Appendices', tocMaxLevel: 2 }
  ],
  dragonbane: [
    { filename: 'Preface', name: 'Preface' },
    { filename: 'Chapter-01-In-the-Oldest-Times', name: 'Chapter 1 – In the Oldest Times', tocMaxLevel: 2 },
    { filename: 'Chapter-02-Your-Player-Character', name: 'Chapter 2 – Your Player Character', tocMaxLevel: 2 },
    { filename: 'Chapter-03-Skills', name: 'Chapter 3 – Skills', tocMaxLevel: 2 },
    { filename: 'Chapter-04-Combat-and-Damage', name: 'Chapter 4 – Combat & Damage', tocMaxLevel: 2 },
    { filename: 'Chapter-05-Magic', name: 'Chapter 5 – Magic', tocMaxLevel: 2 },
    { filename: 'Chapter-06-Gear', name: 'Chapter 6 – Gear', tocMaxLevel: 2 },
    { filename: 'Chapter-07-Bestiary', name: 'Chapter 7 – Bestiary', tocMaxLevel: 2 },
    { filename: 'Chapter-08-Adventures', name: 'Chapter 8 – Adventures', tocMaxLevel: 2 }
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
