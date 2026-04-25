import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DiceService } from '../../services/dice.service';
import { TranslationService } from '../../services/translation.service';

interface RollResult {
  type: string;
  result: number;
  breakdown?: string;
  timestamp: Date;
}

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.css'
})
export class DiceRollerComponent {
  rollHistory: RollResult[] = [];
  currentResult: number | null = null;
  currentType: string = '';
  currentBreakdown: string = '';

  // Custom roll inputs
  numDice: number = 1;
  diceType: number = 20;
  modifier: number = 0;
  boonBaneMode: 'none' | 'boon' | 'bane' = 'none';

  constructor(
    private diceService: DiceService,
    public translationService: TranslationService
  ) {}

  get heading(): string | undefined {
    return this.translationService.translate('diceRoller.title');
  }

  rollD4(): void {
    const result = this.diceService.rollD4();
    this.addRoll('d4', result);
  }

  rollD6(): void {
    const result = this.diceService.rollD6();
    this.addRoll('d6', result);
  }

  rollD8(): void {
    const result = this.diceService.rollD8();
    this.addRoll('d8', result);
  }

  rollD10(): void {
    const result = this.diceService.rollD10();
    this.addRoll('d10', result);
  }

  rollD12(): void {
    const result = this.diceService.rollD12();
    this.addRoll('d12', result);
  }

  rollD20(): void {
    const result = this.diceService.rollD20();
    this.addRoll('d20', result);
  }

  roll3D6(): void {
    const result = this.diceService.roll3D6();
    this.addRoll('3d6', result);
  }

  rollPercentile(): void {
    const result = this.diceService.rollPercentile();
    this.addRoll('d100', result);
  }

  rollCustom(): void {
    if (this.boonBaneMode === 'boon') {
      this.rollCustomWithBoon();
      return;
    }
    if (this.boonBaneMode === 'bane') {
      this.rollCustomWithBane();
      return;
    }

    let notation = `${this.numDice}d${this.diceType}`;
    if (this.modifier !== 0) {
      notation += this.modifier > 0 ? `+${this.modifier}` : `${this.modifier}`;
    }

    const rollResult = this.diceService.rollDiceNotation(notation);
    this.addRoll(notation, rollResult.total, rollResult.breakdown);
  }

  rollD20WithBoon(): void {
    const result = this.diceService.rollWithBoon(1, 20);
    this.addRoll('d20 [Boon]', result.total, result.breakdown);
  }

  rollD20WithBane(): void {
    const result = this.diceService.rollWithBane(1, 20);
    this.addRoll('d20 [Bane]', result.total, result.breakdown);
  }

  private rollCustomWithBoon(): void {
    const result = this.diceService.rollWithBoon(this.numDice, this.diceType);
    let breakdown = result.breakdown;
    if (this.modifier !== 0) {
      const sign = this.modifier > 0 ? '+' : '';
      const total = result.total + this.modifier;
      breakdown += ` ${sign}${this.modifier} = ${total}`;
      this.addRoll(`${this.numDice}d${this.diceType} [Boon]`, total, breakdown);
    } else {
      this.addRoll(`${this.numDice}d${this.diceType} [Boon]`, result.total, breakdown);
    }
  }

  private rollCustomWithBane(): void {
    const result = this.diceService.rollWithBane(this.numDice, this.diceType);
    let breakdown = result.breakdown;
    if (this.modifier !== 0) {
      const sign = this.modifier > 0 ? '+' : '';
      const total = result.total + this.modifier;
      breakdown += ` ${sign}${this.modifier} = ${total}`;
      this.addRoll(`${this.numDice}d${this.diceType} [Bane]`, total, breakdown);
    } else {
      this.addRoll(`${this.numDice}d${this.diceType} [Bane]`, result.total, breakdown);
    }
  }

  private addRoll(type: string, result: number, breakdown?: string): void {
    this.currentResult = result;
    this.currentType = type;
    this.currentBreakdown = breakdown || '';
    this.rollHistory.unshift({
      type,
      result,
      breakdown,
      timestamp: new Date()
    });
    if (this.rollHistory.length > 10) {
      this.rollHistory.pop();
    }
  }

  clearHistory(): void {
    this.rollHistory = [];
    this.currentResult = null;
    this.currentType = '';
    this.currentBreakdown = '';
  }
}
