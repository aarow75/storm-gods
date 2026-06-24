import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weapon, WeaponDefinition, CharacterStats, Resources } from '@characters/models/character.model';
import { getRulesForSystem } from '@shared/rules/game-system-rules.factory';
import { GameSystem } from '@shared/models/game-system.model';

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
  @Input() gameSystem!: GameSystem;
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
    return getRulesForSystem(this.gameSystem).getPrimaryWealthAmount(this.resources);
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
    const rules = getRulesForSystem(this.gameSystem);
    if (rules.weaponSkillIsFixed()) return null;
    if (rules.weaponHasSelectableSkill()) return this.combatSkills;
    return null;
  }

  getFixedSkill(weapon: Weapon): string | null {
    if (!getRulesForSystem(this.gameSystem).weaponSkillIsFixed()) return null;
    return this.weaponList.find(w => w.name === weapon.name)?.defaultSkill ?? null;
  }
}
