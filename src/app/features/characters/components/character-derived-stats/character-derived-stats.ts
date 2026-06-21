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
  @Input() occupation?: string;
  @Input() level?: number;
  @Output() calculate = new EventEmitter<void>();
  @Output() hpRolled = new EventEmitter<number>();

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Derived Statistics';
  }

  get isRuneQuest(): boolean {
    return this.gameSystemService.getRules().usesHitLocations();
  }

  get isKalArath(): boolean {
    return this.gameSystemService.gameSystem() === 'kal-arath';
  }

  get isOsric(): boolean {
    return this.gameSystemService.gameSystem() === 'osric';
  }

  get isDragonbane(): boolean {
    return this.gameSystemService.gameSystem() === 'dragonbane';
  }

  get showMagicPoints(): boolean {
    return !this.isKalArath && !this.isOsric;
  }

  get magicPointsLabel(): string {
    return this.isDragonbane ? 'WP' : 'Magic Points';
  }

  get showDamageBonus(): boolean {
    return !this.isKalArath;
  }

  get damageBonusLabel(): string {
    return this.isOsric ? 'STR Bonus' : 'Damage Bonus';
  }

  get showHealingRate(): boolean {
    return !this.isDragonbane;
  }

  get healingRateLabel(): string {
    if (this.isKalArath) return 'Post-Battle Healing';
    if (this.isOsric) return 'Healing (HP/day)';
    return 'Healing Rate';
  }

  get showMovementRate(): boolean {
    return this.isRuneQuest || this.isDragonbane;
  }

  get osricHpFormula(): string {
    if (!this.occupation || !this.level) return '';
    const rules = this.gameSystemService.getRules();
    const hd = rules.getClassHitDie?.(this.occupation);
    if (!hd) return '';
    const con = this.stats?.CON ?? 10;
    const conMod = rules.getConHpModifier?.(con) ?? 0;
    const diceCount = Math.min(this.level, hd.maxHdLevel);
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
    const conMod = rules.getConHpModifier?.(con) ?? 0;
    const diceCount = Math.min(this.level, hd.maxHdLevel);
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
    if (this.isKalArath) return 'All physical rolls at disadvantage';
    if (this.isOsric) return `Movement reduced; over ${this.derivedStats.maxEncumbrance} lbs = immobile`;
    if (this.isDragonbane) return 'Bane on all physical rolls';
    return `-${this.derivedStats.encumbranceDefensePenalty}% Dodge`;
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
