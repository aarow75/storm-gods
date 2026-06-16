import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArmorLocations, ARMOR_TYPES } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

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

  armorTypes = ARMOR_TYPES;

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Armor';
  }

  get isRuneQuest(): boolean {
    return this.gameSystemService.gameSystem() === 'runequest';
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
