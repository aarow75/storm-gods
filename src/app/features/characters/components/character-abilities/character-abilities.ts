import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameSystemService } from '@shared/services/game-system.service';
import { AbilityDefinition } from '@shared/rules/game-system-rules.interface';
import { OsricRules } from '@shared/rules/osric-rules';

@Component({
  selector: 'app-character-abilities',
  imports: [CommonModule],
  templateUrl: './character-abilities.html',
  styleUrl: './character-abilities.css',
})
export class CharacterAbilities implements OnChanges {
  @Input() occupation = '';
  @Input() homeland = '';
  @Input() acquiredAbilities: string[] = [];
  @Output() acquiredAbilitiesChange = new EventEmitter<string[]>();

  raceAbilities: AbilityDefinition[] = [];
  classAbilities: AbilityDefinition[] = [];

  constructor(private gameSystemService: GameSystemService) {}

  ngOnChanges(): void {
    const rules = this.gameSystemService.getRules() as OsricRules;
    this.raceAbilities = rules.getRaceAbilities?.(this.homeland) ?? [];
    this.classAbilities = rules.getClassAbilities?.(this.occupation) ?? [];
  }

  isAcquired(name: string): boolean {
    return this.acquiredAbilities.includes(name);
  }

  toggle(name: string): void {
    const updated = this.isAcquired(name)
      ? this.acquiredAbilities.filter(a => a !== name)
      : [...this.acquiredAbilities, name];
    this.acquiredAbilitiesChange.emit(updated);
  }
}
