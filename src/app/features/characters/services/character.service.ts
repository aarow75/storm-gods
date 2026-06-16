import { Injectable } from '@angular/core';
import {
  Character, DEFAULT_HIT_LOCATIONS, DEFAULT_BACKGROUND, DEFAULT_DERIVED_STATS,
  DEFAULT_ARMOR, DEFAULT_RUNES, DEFAULT_MAGIC, DEFAULT_RESOURCES,
  DEFAULT_CULT_STATUS,
  calculateHitLocations, calculateDerivedStats
} from '@characters/models/character.model';
import { CHARACTER_COLORS } from '@characters/constants/character-colors.constants';
import { EQUIPMENT_DEFAULTS, MAGIC_DEFAULTS } from '@shared/constants/equipment.constants';
import { GameSystemService } from '@shared/services/game-system.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private readonly STORAGE_KEY = 'runequest-characters';//TODO: make this key dynamic based on game system to allow multiple systems in the future

  constructor(private gameSystemService: GameSystemService) {}

  getCharacters(): Character[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];

    const characters: any[] = JSON.parse(data);
    return characters.map(char => this.migrateCharacter(char));
  }

  getCharacter(id: string): Character | undefined {
    const characters = this.getCharacters();
    return characters.find(c => c.id === id);
  }

  private migrateCharacter(char: any): Character {
    // Ensure background exists
    if (!char.background) {
      char.background = { ...DEFAULT_BACKGROUND };
    }

    // Ensure derivedStats exist
    if (!char.derivedStats) {
      char.derivedStats = char.stats
        ? calculateDerivedStats(char.stats, char.equipment || [], char.weapons || [], char.shields || [])
        : { ...DEFAULT_DERIVED_STATS };
    }

    // Migrate maxHitPoints if missing
    if (char.derivedStats && char.derivedStats.maxHitPoints === undefined) {
      char.derivedStats.maxHitPoints = char.derivedStats.totalHitPoints;
    }

    // Migrate encumbrance fields if missing
    if (char.derivedStats && char.derivedStats.maxEncumbrance === undefined) {
      char.derivedStats.maxEncumbrance = char.stats?.STR || 10;
    }
    if (char.derivedStats && char.derivedStats.totalEncumbrance === undefined) {
      char.derivedStats.totalEncumbrance = 0;
    }
    if (char.derivedStats && char.derivedStats.encumbranceDefensePenalty === undefined) {
      char.derivedStats.encumbranceDefensePenalty = 0;
    }

    // Ensure hitLocations exist
    if (!char.hitLocations) {
      char.hitLocations = char.stats
        ? calculateHitLocations(char.stats.CON || 10, char.stats.SIZ || 10)
        : { ...DEFAULT_HIT_LOCATIONS };
    }

    // Ensure armor exists
    if (!char.armor) {
      char.armor = { ...DEFAULT_ARMOR };
    }

    // Ensure weapons array exists
    if (!char.weapons) {
      char.weapons = [];
    }

    // Ensure shields array exists
    if (!char.shields) {
      char.shields = [];
    }

    // Ensure runes exist
    if (!char.runes) {
      char.runes = JSON.parse(JSON.stringify(DEFAULT_RUNES));
    }

    // Ensure passions array exists
    if (!char.passions) {
      char.passions = [];
    }

    // Ensure magic exists
    if (!char.magic) {
      char.magic = { ...DEFAULT_MAGIC, spiritMagic: [], runeMagic: [], sorcery: [] };
    }

    // Ensure resources exist
    if (!char.resources) {
      char.resources = { ...DEFAULT_RESOURCES };
    }

    // Ensure equipment array exists and migrate from legacy string[] format
    if (!char.equipment) {
      char.equipment = [];
    } else {
      char.equipment = char.equipment.map((item: any) =>
        typeof item === 'string'
          ? {
              name: item,
              quantity: EQUIPMENT_DEFAULTS.QUANTITY,
              cost: EQUIPMENT_DEFAULTS.COST,
              hitPoints: EQUIPMENT_DEFAULTS.HIT_POINTS,
              encumbrance: EQUIPMENT_DEFAULTS.ENCUMBRANCE
            }
          : item
      );
    }

    // Ensure notes exist
    if (!char.notes) {
      char.notes = '';
    }

    // Ensure cult status exists
    if (!char.cultStatus) {
      char.cultStatus = { ...DEFAULT_CULT_STATUS };
      // Auto-populate cult name from background if available
      if (char.background?.cult) {
        char.cultStatus.cultName = char.background.cult;
      }
    }

    // Migrate old rune magic spells to new format
    if (char.magic?.runeMagic && char.magic.runeMagic.length > 0) {
      char.magic.runeMagic = char.magic.runeMagic.map((spell: any) => {
        // Check if it's old format (has 'points' instead of 'runePointCost')
        if (spell.points !== undefined && spell.runePointCost === undefined) {
          return {
            name: spell.name,
            runePointCost: spell.points,
            associatedRune: MAGIC_DEFAULTS.DEFAULT_RUNE,
            reusable: MAGIC_DEFAULTS.DEFAULT_REUSABLE
          };
        }
        return spell;
      });
    }

    // Assign a color if missing (for existing characters)
    if (!char.color) {
      const allChars = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
      const index = allChars.findIndex((c: any) => c.id === char.id);
      char.color = CHARACTER_COLORS[index % CHARACTER_COLORS.length].value;
    }

    // Assign a gameSystem if missing (for existing characters created before this feature)
    // Default to runequest for legacy characters since that was the original system
    if (!char.gameSystem) {
      char.gameSystem = 'runequest';
    }

    return char as Character;
  }

  addCharacter(character: Character): void {
    const characters = this.getCharacters();
    character.id = this.generateId();

    // Assign a color based on the current count
    if (!character.color) {
      character.color = this.getNextColor(characters.length);
    }

    // Set the game system to the current system
    character.gameSystem = this.gameSystemService.gameSystem();

    characters.push(character);
    this.saveCharacters(characters);
  }

  private getNextColor(characterCount: number): string {
    return CHARACTER_COLORS[characterCount % CHARACTER_COLORS.length].value;
  }

  updateCharacter(character: Character): void {
    const characters = this.getCharacters();
    const index = characters.findIndex(c => c.id === character.id);
    if (index !== -1) {
      characters[index] = character;
      this.saveCharacters(characters);
    }
  }

  deleteCharacter(id: string): void {
    const characters = this.getCharacters();
    const filtered = characters.filter(c => c.id !== id);
    this.saveCharacters(filtered);
  }

  importCharacters(incoming: any[]): { imported: number; skipped: number } {
    const existing = this.getCharacters();
    const existingIds = new Set(existing.map(c => c.id));
    const toAdd = incoming
      .filter(c => !existingIds.has(c.id))
      .map(c => this.migrateCharacter(c));
    this.saveCharacters([...existing, ...toAdd]);
    return { imported: toAdd.length, skipped: incoming.length - toAdd.length };
  }

  private saveCharacters(characters: Character[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }
}
