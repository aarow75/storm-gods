import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weapon, WeaponDefinition, CharacterStats, Resources } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-weapons',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-weapons.html',
  styleUrl: './character-weapons.css',
})
export class CharacterWeapons {
  @Input() weapons!: Weapon[];
  @Input() weaponList!: WeaponDefinition[];
  @Input() combatSkills!: string[];
  @Input() stats?: CharacterStats;
  @Input() resources?: Resources;
  @Output() addWeapon = new EventEmitter<void>();
  @Output() removeWeapon = new EventEmitter<number>();
  @Output() weaponChange = new EventEmitter<number>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.weapons');
  }

  onAddWeapon(): void { this.addWeapon.emit(); }
  onRemoveWeapon(index: number): void { this.removeWeapon.emit(index); }
  onWeaponChange(index: number): void { this.weaponChange.emit(index); }

  private totalLunars(): number {
    if (!this.resources) return Infinity;
    // 1 Wheel = 20 Lunars, 1 Clack = 0.1 Lunars
    return this.resources.wheels * 20 + this.resources.lunars + this.resources.clacks / 10;
  }

  canMeetStats(def: WeaponDefinition): boolean {
    if (!this.stats) return true;
    return this.stats.STR >= def.minSTR && this.stats.DEX >= def.minDEX;
  }

  canAfford(def: WeaponDefinition): boolean {
    if (def.cost === 0) return true;
    return this.totalLunars() >= def.cost;
  }

  isWeaponDisabled(def: WeaponDefinition): boolean {
    return !this.canMeetStats(def) || !this.canAfford(def);
  }

  getWeaponOptionLabel(def: WeaponDefinition): string {
    const statPart = (def.minSTR > 0 || def.minDEX > 0)
      ? ` (STR ${def.minSTR}, DEX ${def.minDEX})`
      : '';
    const costPart = def.cost > 0 ? ` — ${def.cost}L` : '';
    return `${def.name}${statPart}${costPart}`;
  }

  getWeaponWarning(weapon: Weapon): string | null {
    const def = this.weaponList.find(w => w.name === weapon.name);
    if (!def) return null;
    const reasons: string[] = [];
    if (this.stats) {
      if (this.stats.STR < def.minSTR) reasons.push(`STR ${this.stats.STR} < ${def.minSTR} required`);
      if (this.stats.DEX < def.minDEX) reasons.push(`DEX ${this.stats.DEX} < ${def.minDEX} required`);
    }
    if (!this.canAfford(def)) reasons.push(`costs ${def.cost}L (insufficient funds)`);
    return reasons.length > 0 ? reasons.join(', ') : null;
  }

  getMissileDef(weapon: Weapon): WeaponDefinition | null {
    const def = this.weaponList.find(w => w.name === weapon.name);
    return def?.isMissile ? def : null;
  }
}
