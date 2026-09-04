import { Injectable } from '@angular/core';
import {
  Character, DEFAULT_HIT_LOCATIONS, DEFAULT_BACKGROUND, DEFAULT_DERIVED_STATS,
  DEFAULT_ARMOR, DEFAULT_RUNES, DEFAULT_MAGIC, DEFAULT_RESOURCES,
  DEFAULT_CULT_STATUS
} from '@characters/models/character.model';
import { getRulesForSystem } from '@shared/rules/game-system-rules.factory';
import { CHARACTER_COLORS } from '@characters/constants/character-colors.constants';
import { EQUIPMENT_DEFAULTS, MAGIC_DEFAULTS } from '@shared/constants/equipment.constants';
import { GameSystemService } from '@shared/services/game-system.service';
import { DataPort } from '@shared/services/data-port.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService implements DataPort {
  private readonly STORAGE_KEY = 'characters';

  readonly dataPortLabel = 'Characters';
  readonly dataPortKey = 'characters';

  constructor(private gameSystemService: GameSystemService) {
    this.migrateKey('runequest-characters', this.STORAGE_KEY);
  }

  private migrateKey(oldKey: string, newKey: string): void {
    if (!localStorage.getItem(newKey)) {
      const old = localStorage.getItem(oldKey);
      if (old) {
        localStorage.setItem(newKey, old);
        localStorage.removeItem(oldKey);
      }
    }
  }

  exportData(): unknown {
    return {
      exportedAt: new Date().toISOString(),
      characters: this.getAllCharacters(),
    };
  }

  importData(rawData: unknown): string {
    const data = rawData as any;
    if (!data?.characters) return 'Invalid characters file.';
    const result = this.importCharacters(data.characters);
    return `Imported ${result.imported} character(s). ${result.skipped} skipped (already exist).`;
  }

  private getAllCharacters(): Character[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    const characters: any[] = JSON.parse(data);
    return characters.map(char => this.migrateCharacter(char));
  }

  getCharacters(): Character[] {
    const system = this.gameSystemService.gameSystem();
    return this.getAllCharacters().filter(c => (c.gameSystem ?? 'runequest') === system);
  }

  getCharacter(id: string): Character | undefined {
    return this.getAllCharacters().find(c => c.id === id);
  }

  private migrateCharacter(char: any): Character {
    // Ensure background exists
    if (!char.background) {
      char.background = { ...DEFAULT_BACKGROUND };
    }

    // Migrate legacy RQ shield names to the RQ2 Small/Medium/Large shields
    const legacyShieldNames: Record<string, string> = {
      'Target Shield': 'Small Shield',
      'Heater Shield': 'Medium Shield',
      'Kite Shield': 'Large Shield',
      'Tower Shield': 'Large Shield',
    };
    for (const shield of char.shields ?? []) {
      if (legacyShieldNames[shield.name]) {
        shield.name = legacyShieldNames[shield.name];
      }
    }

    // Ensure derivedStats exist
    if (!char.derivedStats) {
      const rules = getRulesForSystem(char.gameSystem || 'runequest');
      char.derivedStats = char.stats
        ? rules.calculateDerivedStats(char.stats, char.equipment || [], char.weapons || [], char.shields || [], undefined, char.armorType)
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

    // Migrate current magic points (spendable pool) if missing — starts at max
    if (char.derivedStats && char.derivedStats.currentMagicPoints === undefined) {
      char.derivedStats.currentMagicPoints = char.derivedStats.magicPoints ?? 0;
    }

    // Ensure hitLocations exist
    if (!char.hitLocations) {
      const rules = getRulesForSystem(char.gameSystem || 'runequest');
      char.hitLocations = (char.stats && rules.usesHitLocations())
        ? rules.calculateHitLocations(char.stats) ?? { ...DEFAULT_HIT_LOCATIONS }
        : {};
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
    if (char.magic.doom === undefined) char.magic.doom = '';
    if (!char.magic.dragonbaneSpells) char.magic.dragonbaneSpells = [];
    if (char.magic.currentRunePoints === undefined) {
      char.magic.currentRunePoints = char.magic.runePoints ?? 0;
    }

    // Ensure resources exist
    if (!char.resources) {
      char.resources = { ...DEFAULT_RESOURCES };
    }
    // Ensure Kal-Arath resource fields exist
    if (char.resources.silver === undefined)     char.resources.silver = 0;
    if (char.resources.fatePoints === undefined) char.resources.fatePoints = 1;
    if (char.resources.level === undefined)      char.resources.level = 1;
    if (char.resources.xp === undefined)         char.resources.xp = 0;
    // Ensure Dragonbane resource fields exist
    if (char.resources.copper === undefined)           char.resources.copper = 0;
    if (char.resources.gold === undefined)             char.resources.gold = 0;
    if (char.resources.advancementMarks === undefined) char.resources.advancementMarks = 0;

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

    // Ensure acquiredAbilities exists (OSRIC race/class abilities)
    if (!char.acquiredAbilities) {
      char.acquiredAbilities = [];
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
    const all = this.getAllCharacters();
    character.id = this.generateId();

    // Assign a color based on the count within the current system
    if (!character.color) {
      const systemCount = this.getCharacters().length;
      character.color = this.getNextColor(systemCount);
    }

    // Set the game system to the current system
    character.gameSystem = this.gameSystemService.gameSystem();

    all.push(character);
    this.saveCharacters(all);
  }

  private getNextColor(characterCount: number): string {
    return CHARACTER_COLORS[characterCount % CHARACTER_COLORS.length].value;
  }

  updateCharacter(character: Character): void {
    const all = this.getAllCharacters();
    const index = all.findIndex(c => c.id === character.id);
    if (index !== -1) {
      all[index] = character;
      this.saveCharacters(all);
    }
  }

  deleteCharacter(id: string): void {
    const all = this.getAllCharacters();
    this.saveCharacters(all.filter(c => c.id !== id));
  }

  importCharacters(incoming: any[]): { imported: number; skipped: number } {
    const existing = this.getAllCharacters();
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
