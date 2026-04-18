import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Weapon, WeaponDefinition } from '../../models/character.model';
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
  @Output() addWeapon = new EventEmitter<void>();
  @Output() removeWeapon = new EventEmitter<number>();
  @Output() weaponChange = new EventEmitter<number>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.weapons');
  }

  onAddWeapon(): void {
    this.addWeapon.emit();
  }

  onRemoveWeapon(index: number): void {
    this.removeWeapon.emit(index);
  }

  onWeaponChange(index: number): void {
    this.weaponChange.emit(index);
  }
}
