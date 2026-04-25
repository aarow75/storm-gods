import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Shield, ShieldDefinition } from '../../models/character.model';

@Component({
  selector: 'app-character-shields',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './character-shields.html',
  styleUrl: './character-shields.css'
})
export class CharacterShields {
  @Input() shields!: Shield[];
  @Input() shieldList!: ShieldDefinition[];
  @Output() addShield = new EventEmitter<void>();
  @Output() removeShield = new EventEmitter<number>();
  @Output() shieldChange = new EventEmitter<number>();

  getShieldDefinition(shieldName: string): ShieldDefinition | undefined {
    return this.shieldList.find(s => s.name === shieldName);
  }
}
