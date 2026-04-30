import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslationService } from '../../services/translation.service';

interface RulesDocument {
  filename: string;
  name: string;
}

@Component({
  selector: 'app-docs',
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './docs.component.html',
  styleUrl: './docs.component.css'
})
export class DocsComponent implements OnInit {
  rulesDocuments: RulesDocument[] = [];
  isExpandedRules = true;

  constructor(public translationService: TranslationService) {}

  ngOnInit() {
    this.loadRulesDocuments();
  }

  private loadRulesDocuments() {
    // Use hardcoded list of documents
    // In the future, this could scan a directory or fetch from an API
    this.rulesDocuments = [
      { filename: 'I-introduction', name: 'I. Introduction' },
      { filename: 'II-character-creation', name: 'II. Character Creation' },
      { filename: 'III-mechanics-and-melee', name: 'III. Mechanics and Melee' },
      { filename: 'IV-combat-skills', name: 'IV. Combat Skills' }
    ];
  }

  toggleRulesMenu() {
    this.isExpandedRules = !this.isExpandedRules;
  }
}
