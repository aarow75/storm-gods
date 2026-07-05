import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DerivedStats, CharacterStats, getSizeModifier, getDexterityModifier } from '@characters/models/character.model';
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
  @Input() occupation?: string;
  @Input() level?: number;
  @Output() calculate = new EventEmitter<void>();
  @Output() hpRolled = new EventEmitter<number>();

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Derived Statistics';
  }

  private get rules() { return this.gameSystemService.getRules(); }

  get isRuneQuest(): boolean { return this.rules.usesHitLocations(); }
  get isOsric(): boolean { return this.rules.getMagicSystemType() === 'osric'; }
  get usesStrikeRank(): boolean { return this.rules.usesStrikeRank(); }
  get initiativeLabel(): string { return this.rules.getInitiativeLabel(); }

  get showMagicPoints(): boolean { return this.rules.showsMagicPoints(); }
  get magicPointsLabel(): string { return this.rules.getMagicPointsLabel(); }
  get showDamageBonus(): boolean { return this.rules.showsDamageBonus(); }
  get damageBonusLabel(): string { return this.rules.getDamageBonusLabel(); }
  get showHealingRate(): boolean { return this.rules.showsHealingRate(); }
  get healingRateLabel(): string { return this.rules.getHealingRateLabel(); }
  get showMovementRate(): boolean { return this.rules.showsMovementRate(); }

  // Dice earned by a given level: usually one per level up to maxHdLevel, but some
  // classes roll extra dice at level 1 (OSRIC Ranger rolls 2).
  private osricDiceCount(hd: { maxHdLevel: number; firstLevelDice?: number }): number {
    const bonusFirstLevelDice = (hd.firstLevelDice ?? 1) - 1;
    return Math.min(this.level!, hd.maxHdLevel) + bonusFirstLevelDice;
  }

  get osricHpFormula(): string {
    if (!this.occupation || !this.level) return '';
    const rules = this.gameSystemService.getRules();
    const hd = rules.getClassHitDie?.(this.occupation);
    if (!hd) return '';
    const con = this.stats?.CON ?? 10;
    const conMod = rules.getConHpModifier?.(con, this.occupation) ?? 0;
    const diceCount = this.osricDiceCount(hd);
    const extraLevels = Math.max(0, this.level - hd.maxHdLevel);
    const parts: string[] = [`${diceCount}d${hd.sides}`];
    if (conMod !== 0) parts.push(`${conMod >= 0 ? '+' : ''}${conMod * diceCount} (CON)`);
    if (extraLevels > 0) parts.push(`+${extraLevels * hd.bonusPerLevel} (lvl ${hd.maxHdLevel + 1}+)`);
    return parts.join(' ');
  }

  rollOsricHp(): void {
    if (!this.occupation || !this.level) return;
    const rules = this.gameSystemService.getRules();
    const hd = rules.getClassHitDie?.(this.occupation);
    if (!hd) return;
    const con = this.stats?.CON ?? 10;
    const conMod = rules.getConHpModifier?.(con, this.occupation) ?? 0;
    const diceCount = this.osricDiceCount(hd);
    const extraLevels = Math.max(0, this.level - hd.maxHdLevel);
    let total = 0;
    for (let i = 0; i < diceCount; i++) {
      const roll = Math.floor(Math.random() * hd.sides) + 1;
      total += Math.max(1, roll + conMod);
    }
    total += extraLevels * hd.bonusPerLevel;
    this.hpRolled.emit(Math.max(1, total));
  }

  get missileAttackBonusText(): string {
    const bonus = this.derivedStats.missileAttackBonus ?? 0;
    return bonus >= 0 ? `+${bonus}` : `${bonus}`;
  }

  get encumbrancePenaltyText(): string {
    return this.rules.getEncumbrancePenaltyText(this.derivedStats);
  }

  get strikeRankBreakdown(): string {
    if (!this.stats) return '';
    const dex = this.stats.DEX;
    const total = this.derivedStats.strikeRank;
    // BRP orders combat by pure DEX; rank = 20 − DEX so lower acts first
    if (this.gameSystemService.gameSystem() === 'brp') {
      return `20 − DEX ${dex} = ${total} (lower acts first)`;
    }
    const siz = this.stats.SIZ;
    const sizMod = getSizeModifier(siz);
    const dexMod = getDexterityModifier(dex);
    return `SIZ ${siz}→${sizMod} + DEX ${dex}→${dexMod} = ${total}`;
  }
}
