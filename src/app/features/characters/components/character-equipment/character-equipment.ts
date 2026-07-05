import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentItem, EquipmentDefinition, Resources } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { DocRefLinkComponent } from '@shared/components/doc-ref-link/doc-ref-link.component';

@Component({
  standalone: true,
  selector: 'app-character-equipment',
  imports: [CommonModule, FormsModule, DocRefLinkComponent],
  templateUrl: './character-equipment.html',
  styleUrl: './character-equipment.css',
})
export class CharacterEquipment {
  @Input() equipment!: EquipmentItem[];
  @Input() maxEncumbrance = 0;
  @Input() resources: Resources | undefined;
  @Output() addEquipment = new EventEmitter<EquipmentItem>();
  @Output() removeEquipment = new EventEmitter<number>();
  @Output() deductCost = new EventEmitter<number>();

  selectedItemName = '';
  selectedQuantity = 1;

  constructor(public gameSystemService: GameSystemService) {}

  get equipmentList(): EquipmentDefinition[] {
    return this.gameSystemService.getEquipmentList();
  }

  get categories(): string[] {
    return [...new Set(this.equipmentList.map(item => item.category))];
  }

  get heading(): string {
    return 'Equipment';
  }

  get isDragonbane(): boolean {
    return this.gameSystemService.getRules().getMagicSystemType() === 'dragonbane';
  }

  get currencyLabel(): string {
    return this.gameSystemService.getCurrencyLabel();
  }

  get durabilityLabel(): string {
    return this.isDragonbane ? 'Supply' : 'Durability';
  }

  get currentBalance(): number {
    if (!this.resources) return Infinity;
    const key = this.gameSystemService.getPrimaryCurrencyKey();
    return (this.resources as unknown as Record<string, number>)[key as string] ?? 0;
  }

  canAfford(item: EquipmentDefinition): boolean {
    return item.cost * this.selectedQuantity <= this.currentBalance;
  }

  get selectedItemDef(): EquipmentDefinition | undefined {
    return this.equipmentList.find(item => item.name === this.selectedItemName);
  }

  get canAffordSelected(): boolean {
    return this.selectedItemDef ? this.canAfford(this.selectedItemDef) : true;
  }

  getItemsByCategory(category: string): EquipmentDefinition[] {
    return this.equipmentList.filter(item => item.category === category);
  }

  getDurabilityDisplay(item: EquipmentItem): string {
    if (this.isDragonbane) {
      const def = this.equipmentList.find(d => d.name === item.name);
      return def?.supply ?? '—';
    }
    return item.hitPoints > 0 ? String(item.hitPoints) : '—';
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

    const totalPrice = def.cost * this.selectedQuantity;

    this.addEquipment.emit({
      name: def.name,
      quantity: this.selectedQuantity,
      cost: def.cost,
      hitPoints: def.hitPoints,
      encumbrance: def.encumbrance,
    });

    if (totalPrice > 0) {
      this.deductCost.emit(totalPrice);
    }

    this.selectedItemName = '';
    this.selectedQuantity = 1;
  }

  onRemoveEquipment(index: number): void {
    this.removeEquipment.emit(index);
  }
}
