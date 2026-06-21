import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArmorLocations } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { ArmorTypeDefinition } from '@shared/rules/game-system-rules.interface';

@Component({
  standalone: true,
  selector: 'app-character-armor',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-armor.html',
  styleUrl: './character-armor.css',
})
export class CharacterArmor {
  @Input() armor!: ArmorLocations;
  @Input() armorType?: string;
  @Output() applyToAll = new EventEmitter<void>();
  @Output() armorTypeChange = new EventEmitter<string>();

  constructor(public gameSystemService: GameSystemService) {}

  get armorTypes(): ArmorTypeDefinition[] {
    return this.gameSystemService.getRules().getArmorTypes();
  }

  get heading(): string {
    return 'Armor';
  }

  get isRuneQuest(): boolean {
    return this.gameSystemService.getRules().usesHitLocations();
  }

  get isOsric(): boolean {
    return this.gameSystemService.gameSystem() === 'osric';
  }

  get isDragonbane(): boolean {
    return this.gameSystemService.gameSystem() === 'dragonbane';
  }

  get currentArmorRating(): number {
    const def = this.armorTypes.find(a => a.name === this.armorType);
    return def?.points ?? 0;
  }

  get armorHint(): string {
    if (this.gameSystemService.gameSystem() === 'kal-arath') {
      return 'Armor reduces all incoming damage (Light: −1, Medium: −2, Heavy: −3). A shield adds −1 and can be sacrificed to reduce a single attack to 0 damage.';
    }
    return 'In Dragonbane, armor is a single value that applies to your whole body.';
  }

  getArmorLocationKeys(): string[] {
    return ['Right Leg', 'Left Leg', 'Abdomen', 'Chest', 'Right Arm', 'Left Arm', 'Head'];
  }

  // For Dragonbane, use the Chest value as the single armor rating
  get singleArmorRating(): number {
    return this.armor['Chest'] || 0;
  }

  set singleArmorRating(value: number) {
    this.armor['Chest'] = value;
    this.armor['Abdomen'] = value;
    this.armor['Right Arm'] = value;
    this.armor['Left Arm'] = value;
    this.armor['Right Leg'] = value;
    this.armor['Left Leg'] = value;
    this.armor['Head'] = value;
  }

  applyArmorToAll(): void {
    this.applyToAll.emit();
  }
}
