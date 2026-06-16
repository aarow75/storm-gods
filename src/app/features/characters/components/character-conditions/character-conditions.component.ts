import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameSystemService } from '@shared/services/game-system.service';

const RUNEQUEST_CONDITIONS = [
  { name: 'Prone', effect: 'Melee attackers +20%, ranged attackers -20%' },
  { name: 'Blinded', effect: '-50% to all skills except close combat' },
  { name: 'Poisoned', effect: 'Varies by poison; often damage/round or -skill modifier' },
  { name: 'Stunned', effect: 'Cannot act; roll CON to recover' },
  { name: 'Fatigued', effect: '-5% per fatigue level; can only cast 1 spell/round' },
  { name: 'Confused', effect: 'Cannot take effective actions; react randomly' }
];

const DRAGONBANE_CONDITIONS = [
  { name: 'Wounded', effect: 'Reduced movement and combat effectiveness' },
  { name: 'Stunned', effect: 'Cannot act this round' },
  { name: 'Exhausted', effect: 'Reduced all physical actions' },
];

@Component({
  selector: 'app-character-conditions',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-conditions.component.html',
  styleUrl: './character-conditions.component.css'
})
export class CharacterConditionsComponent {
  @Input() conditions: string[] = [];
  @Output() conditionsChange = new EventEmitter<string[]>();

  availableConditions: { name: string; effect: string }[] = [];

  constructor(public gameSystemService: GameSystemService) {
    this.updateAvailableConditions();
  }

  ngOnInit(): void {
    this.updateAvailableConditions();
  }

  ngOnChanges(): void {
    this.updateAvailableConditions();
  }

  private updateAvailableConditions(): void {
    this.availableConditions = this.gameSystemService.gameSystem() === 'runequest'
      ? RUNEQUEST_CONDITIONS
      : DRAGONBANE_CONDITIONS;
  }

  toggleCondition(conditionName: string): void {
    const index = this.conditions.indexOf(conditionName);
    if (index > -1) {
      this.conditions.splice(index, 1);
    } else {
      this.conditions.push(conditionName);
    }
    this.conditionsChange.emit([...this.conditions]);
  }

  isActive(conditionName: string): boolean {
    return this.conditions.includes(conditionName);
  }

  getConditionEffect(conditionName: string): string {
    const condition = this.availableConditions.find(c => c.name === conditionName);
    return condition?.effect || '';
  }
}
