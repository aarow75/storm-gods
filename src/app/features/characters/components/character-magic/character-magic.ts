import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Magic, Spell, RuneSpell, DragonbaneSpell, CharacterStats } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { KA_PACT_SPELLS, KA_DOOMS } from '@shared/rules/kal-arath-rules';
import { getOsricAvailableSpells, getOsricSpellAcquisition } from '@shared/rules/osric-rules';
import { DB_SPELLS_BY_DISCIPLINE } from '@shared/rules/dragonbane-rules';

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
  @Input() occupation: string = '';
  @Input() level: number = 1;
  @Input() stats: CharacterStats = { STR: 10, CON: 10, SIZ: 0, DEX: 10, INT: 10, POW: 10, CHA: 10 };
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

  get magicSystemType(): string {
    return this.gameSystemService.getRules().getMagicSystemType();
  }

  get isKalArath(): boolean { return this.magicSystemType === 'kal-arath'; }
  get isDragonbane(): boolean { return this.magicSystemType === 'dragonbane'; }
  get isOsric(): boolean { return this.magicSystemType === 'osric'; }

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

  dbSpellListForDiscipline(discipline: string): string[] {
    return DB_SPELLS_BY_DISCIPLINE[discipline] ?? [];
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

  get osricAvailableSpells(): { name: string; spellLevel: number }[] {
    return getOsricAvailableSpells(this.occupation, this.level);
  }

  get osricSpellLevels(): number[] {
    const levels = new Set(this.osricAvailableSpells.map(s => s.spellLevel));
    return Array.from(levels).sort((a, b) => a - b);
  }

  osricSpellsForLevel(spellLevel: number): string[] {
    return this.osricAvailableSpells
      .filter(s => s.spellLevel === spellLevel)
      .map(s => s.name);
  }

  onOsricSpellSelect(index: number, name: string): void {
    const found = this.osricAvailableSpells.find(s => s.name === name);
    this.magic.sorcery[index].name = name;
    if (found) this.magic.sorcery[index].points = found.spellLevel;
  }

  isCustomOsricSpell(name: string): boolean {
    return name !== '' && !this.osricAvailableSpells.some(s => s.name === name);
  }

  onAddSpell(type: 'spiritMagic' | 'sorcery'): void {
    this.addSpell.emit(type);
  }

  onRemoveSpell(type: 'spiritMagic' | 'sorcery', index: number): void {
    this.removeSpell.emit({type, index});
  }

  get osricSpellAcquisition(): { chance: number; maxPerLevel: number } {
    return getOsricSpellAcquisition(this.stats.INT);
  }

  osricSpellCountByLevel(spellLevel: number): number {
    return this.magic.sorcery.filter(s => s.points === spellLevel).length;
  }

  osricSpellAcquisitionHint(): string {
    const { chance, maxPerLevel } = this.osricSpellAcquisition;
    return `INT ${this.stats.INT}: ${chance}% chance to understand spells, max ${maxPerLevel} spells per spell level`;
  }

  osricSpellLevelExceeded(spellLevel: number): boolean {
    const count = this.osricSpellCountByLevel(spellLevel);
    return count > this.osricSpellAcquisition.maxPerLevel;
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
