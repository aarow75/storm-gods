import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Magic, Spell, RuneSpell } from '../../models/character.model';

@Component({
  standalone: true,
  selector: 'app-character-magic',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-magic.html',
  styleUrl: './character-magic.css',
})
export class CharacterMagic {
  @Input() magic!: Magic;
  @Input() spiritMagicSpells!: string[];
  @Input() sorcerySpells!: string[];
  @Input() getAvailableRuneSpells!: () => RuneSpell[];
  @Input() isCustomSpell!: (name: string, type: 'spirit' | 'sorcery') => boolean;
  @Input() getSpiritSpellDropdownValue!: (spell: Spell) => string;
  @Input() getSorcerySpellDropdownValue!: (spell: Spell) => string;
  @Input() isCustomRuneSpell!: (spell: RuneSpell) => boolean;
  @Input() getRuneSpellDropdownValue!: (spell: RuneSpell) => string;
  @Output() addSpell = new EventEmitter<'spiritMagic' | 'sorcery'>();
  @Output() removeSpell = new EventEmitter<{type: 'spiritMagic' | 'sorcery', index: number}>();
  @Output() addRuneSpell = new EventEmitter<void>();
  @Output() removeRuneSpell = new EventEmitter<number>();

  get heading(): string {
    return 'Magic';
  }

  onAddSpell(type: 'spiritMagic' | 'sorcery'): void {
    this.addSpell.emit(type);
  }

  onRemoveSpell(type: 'spiritMagic' | 'sorcery', index: number): void {
    this.removeSpell.emit({type, index});
  }

  onAddRuneSpell(): void {
    this.addRuneSpell.emit();
  }

  onRemoveRuneSpell(index: number): void {
    this.removeRuneSpell.emit(index);
  }

  onRuneSpellChange(index: number, spellName: string): void {
    const availableSpells = this.getAvailableRuneSpells();
    const selectedSpell = availableSpells.find(s => s.name === spellName);
    if (selectedSpell) {
      this.magic.runeMagic[index] = { ...selectedSpell };
    }
  }
}
