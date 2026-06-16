import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentItem, EquipmentDefinition, EQUIPMENT_LIST } from '@characters/models/character.model';

@Component({
  standalone: true,
  selector: 'app-character-equipment',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-equipment.html',
  styleUrl: './character-equipment.css',
})
export class CharacterEquipment {
  @Input() equipment!: EquipmentItem[];
  @Input() maxEncumbrance = 0;
  @Output() addEquipment = new EventEmitter<EquipmentItem>();
  @Output() removeEquipment = new EventEmitter<number>();

  selectedItemName = '';
  selectedQuantity = 1;

  readonly equipmentList = EQUIPMENT_LIST;
  readonly categories: string[];

  constructor() {
    this.categories = [...new Set(EQUIPMENT_LIST.map(item => item.category))];
  }

  get heading(): string {
    return 'Equipment';
  }

  getItemsByCategory(category: string): EquipmentDefinition[] {
    return this.equipmentList.filter(item => item.category === category);
  }

  get totalEncumbrance(): number {
    return this.equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
  }

  get totalCost(): number {
    return this.equipment.reduce((sum, item) => sum + item.cost * item.quantity, 0);
  }

  get overEncumbrance(): number {
    return Math.max(0, this.totalEncumbrance - this.maxEncumbrance);
  }

  onAddEquipment(): void {
    if (!this.selectedItemName) return;
    const def = this.equipmentList.find(item => item.name === this.selectedItemName);
    if (!def) return;

    this.addEquipment.emit({
      name: def.name,
      quantity: this.selectedQuantity,
      cost: def.cost,
      hitPoints: def.hitPoints,
      encumbrance: def.encumbrance
    });

    this.selectedItemName = '';
    this.selectedQuantity = 1;
  }

  onRemoveEquipment(index: number): void {
    this.removeEquipment.emit(index);
  }
}
