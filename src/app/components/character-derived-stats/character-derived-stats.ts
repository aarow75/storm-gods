import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DerivedStats, CharacterStats } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';
import { GameSystemService } from '../../services/game-system.service';

@Component({
  selector: 'app-character-derived-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-derived-stats.html',
  styleUrl: './character-derived-stats.css',
})
export class CharacterDerivedStats {
  @Input() derivedStats!: DerivedStats;
  @Input() stats?: CharacterStats;
  @Output() calculate = new EventEmitter<void>();

  constructor(
    public translationService: TranslationService,
    public gameSystemService: GameSystemService
  ) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.derivedStats');
  }

  get isRuneQuest(): boolean {
    return this.gameSystemService.gameSystem() === 'runequest';
  }

  // Strike Rank breakdown for RuneQuest
  get strikeRankBreakdown(): string {
    if (!this.stats) return '';
    const dex = this.stats.DEX;
    const int = this.stats.INT;
    const total = this.derivedStats.strikeRank;
    return `(DEX ${dex} + INT ${int}) / 2 = ${total}`;
  }
}
