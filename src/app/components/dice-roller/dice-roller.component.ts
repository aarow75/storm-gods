import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiceService } from '../../services/dice.service';
import { TranslationService } from '../../services/translation.service';

interface RollResult {
  type: string;
  result: number;
  timestamp: Date;
}

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dice-roller.component.html',
  styleUrl: './dice-roller.component.css'
})
export class DiceRollerComponent {
  rollHistory: RollResult[] = [];
  currentResult: number | null = null;
  currentType: string = '';

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

  private addRoll(type: string, result: number): void {
    this.currentResult = result;
    this.currentType = type;
    this.rollHistory.unshift({
      type,
      result,
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
  }
}
