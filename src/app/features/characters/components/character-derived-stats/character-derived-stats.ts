import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DerivedStats, CharacterStats } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

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

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Derived Statistics';
  }

  get isRuneQuest(): boolean {
    return this.gameSystemService.getRules().usesHitLocations();
  }

  get strikeRankBreakdown(): string {
    if (!this.stats) return '';
    const siz = this.stats.SIZ;
    const dex = this.stats.DEX;
    const sizMod = this.getSizeModifier(siz);
    const dexMod = this.getDexterityModifier(dex);
    const total = this.derivedStats.strikeRank;
    return `SIZ ${siz}→${sizMod} + DEX ${dex}→${dexMod} = ${total}`;
  }

  private getSizeModifier(siz: number): number {
    if (siz >= 22) return 0;
    if (siz >= 15) return 1;
    if (siz >= 7) return 2;
    return 3;
  }

  private getDexterityModifier(dex: number): number {
    if (dex >= 19) return 0;
    if (dex >= 16) return 1;
    if (dex >= 13) return 2;
    if (dex >= 9) return 3;
    if (dex >= 6) return 4;
    return 5;
  }
}
