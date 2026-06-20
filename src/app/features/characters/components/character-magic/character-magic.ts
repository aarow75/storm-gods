import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Magic, Spell, RuneSpell, DragonbaneSpell } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { KA_PACT_SPELLS, KA_DOOMS } from '@shared/rules/kal-arath-rules';

const DB_DISCIPLINES = ['Animism', 'Elementalism', 'General Magic', 'Mentalism'] as const;

@Component({
  standalone: true,
  selector: 'app-character-magic',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-magic.html',
  styleUrl: './character-magic.css',
})
export class CharacterMagic {
  @Input() magic!: Magic;
  @Input() pact: string = '';
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
  @Output() addDragonbaneSpell = new EventEmitter<string>();
  @Output() removeDragonbaneSpell = new EventEmitter<number>();

  constructor(public gameSystemService: GameSystemService) {}

  get isKalArath(): boolean {
    return this.gameSystemService.gameSystem() === 'kal-arath';
  }

  get isDragonbane(): boolean {
    return this.gameSystemService.gameSystem() === 'dragonbane';
  }

  get heading(): string {
    return 'Magic';
  }

  get kaDooms(): string[] {
    return KA_DOOMS;
  }

  get kalArathSpells(): { name: string; tier: number }[] {
    return KA_PACT_SPELLS[this.pact] ?? [];
  }

  get dbDisciplines(): readonly string[] {
    return DB_DISCIPLINES;
  }

  dbSpellsForDiscipline(discipline: string): DragonbaneSpell[] {
    return (this.magic.dragonbaneSpells ?? []).filter(s => s.discipline === discipline);
  }

  dbSpellIndex(discipline: string, localIndex: number): number {
    let count = 0;
    const spells = this.magic.dragonbaneSpells ?? [];
    for (let i = 0; i < spells.length; i++) {
      if (spells[i].discipline === discipline) {
        if (count === localIndex) return i;
        count++;
      }
    }
    return -1;
  }

  isKaSpellKnown(name: string): boolean {
    return this.magic.sorcery.some(s => s.name === name);
  }

  toggleKaSpell(spell: { name: string; tier: number }): void {
    const idx = this.magic.sorcery.findIndex(s => s.name === spell.name);
    if (idx >= 0) {
      this.magic.sorcery.splice(idx, 1);
    } else {
      this.magic.sorcery.push({ name: spell.name, points: spell.tier });
    }
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

  onAddDragonbaneSpell(discipline: string): void {
    this.addDragonbaneSpell.emit(discipline);
  }

  onRemoveDragonbaneSpell(globalIndex: number): void {
    this.removeDragonbaneSpell.emit(globalIndex);
  }
}
