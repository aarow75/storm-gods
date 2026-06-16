import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameSystemService } from '@shared/services/game-system.service';

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
    this.availableConditions = this.gameSystemService.getRules().getConditions();
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
