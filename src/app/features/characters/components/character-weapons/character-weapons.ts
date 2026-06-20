import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weapon, WeaponDefinition, CharacterStats, Resources } from '@characters/models/character.model';

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
  @Input() weaponSkills!: string[];
  @Input() gameSystem!: string;
  @Input() currencyLabel: string = 'L';
  @Input() stats?: CharacterStats;
  @Input() resources?: Resources;
  @Output() addWeapon = new EventEmitter<void>();
  @Output() removeWeapon = new EventEmitter<number>();
  @Output() weaponChange = new EventEmitter<number>();

  get heading(): string {
    return 'Weapons';
  }

  onAddWeapon(): void { this.addWeapon.emit(); }
  onRemoveWeapon(index: number): void { this.removeWeapon.emit(index); }
  onWeaponChange(index: number): void { this.weaponChange.emit(index); }

  private totalWealth(): number {
    if (!this.resources) return Infinity;
    if (this.gameSystem === 'kal-arath') return this.resources.silver ?? 0;
    return (this.resources.wheels ?? 0) * 20 + (this.resources.lunars ?? 0) + (this.resources.clacks ?? 0) / 10;
  }

  canMeetStats(def: WeaponDefinition): boolean {
    if (!this.stats) return true;
    return this.stats.STR >= def.minSTR && this.stats.DEX >= def.minDEX;
  }

  canAfford(def: WeaponDefinition): boolean {
    if (def.cost === 0) return true;
    return this.totalWealth() >= def.cost;
  }

  isWeaponDisabled(def: WeaponDefinition): boolean {
    return !this.canMeetStats(def) || !this.canAfford(def);
  }

  getWeaponOptionLabel(def: WeaponDefinition): string {
    const statPart = (def.minSTR > 0 || def.minDEX > 0)
      ? ` (STR ${def.minSTR}, DEX ${def.minDEX})`
      : '';
    const costPart = def.cost > 0 ? ` — ${def.cost}${this.currencyLabel}` : '';
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
    if (!this.canAfford(def)) reasons.push(`costs ${def.cost}${this.currencyLabel} (insufficient funds)`);
    return reasons.length > 0 ? reasons.join(', ') : null;
  }

  getMissileDef(weapon: Weapon): WeaponDefinition | null {
    const def = this.weaponList.find(w => w.name === weapon.name);
    return def?.isMissile ? def : null;
  }

  getSkillsForWeapon(weapon: Weapon): string[] | null {
    const def = this.weaponList.find(w => w.name === weapon.name);
    if (!def?.defaultSkill) return null;
    if (this.gameSystem === 'dragonbane') return this.weaponSkills;
    if (this.gameSystem === 'runequest') return this.combatSkills;
    return null;
  }
}
