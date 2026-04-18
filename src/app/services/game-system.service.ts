import { Injectable, signal } from '@angular/core';

export type GameSystem = 'runequest' | 'dragonbane';

export interface GameSystemData {
  cults: string[];
  occupations: string[];
  homelands: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GameSystemService {
  private readonly STORAGE_KEY = 'gameSystem';

  // Signal for reactive game system
  gameSystem = signal<GameSystem>(this.loadGameSystem());

  private runequest: GameSystemData = {
    cults: [
      'Orlanth',
      'Ernalda',
      'Seven Mothers',
      'Yelm',
      'Humakt',
      'Chalana Arroy',
      'Issaries',
      'Lhankor Mhy',
      'Storm Bull',
      'Babeester Gor',
      'Daka Fal',
      'Waha',
      'Yelmalio',
      'Kyger Litor',
      'Zorak Zoran',
      'Asrelia',
      'Other'
    ],
    occupations: [
      'Warrior',
      'Farmer',
      'Hunter',
      'Herder',
      'Merchant',
      'Crafter',
      'Fisher',
      'Noble',
      'Priest',
      'Shaman',
      'Thief',
      'Entertainer',
      'Scribe',
      'Healer'
    ],
    homelands: [
      'Sartar',
      'Esrolia',
      'Prax',
      'Lunar Tarsh',
      'Grazelands',
      'Old Tarsh',
      'Dragon Pass',
      'Sun County',
      'Dagori Inkarth',
      'Other'
    ]
  };

  private dragonbane: GameSystemData = {
    // In Dragonbane, "cults" become more generic affiliations/beliefs
    cults: [
      'The Old Gods',
      'The One',
      'Elemental Worship',
      'Ancestor Veneration',
      'Nature Spirits',
      'No Religion',
      'Other'
    ],
    // Dragonbane professions
    occupations: [
      'Fighter',
      'Hunter',
      'Knight',
      'Mariner',
      'Minstrel',
      'Merchant',
      'Peddler',
      'Rider',
      'Rogue',
      'Scholar',
      'Thief',
      'Artisan',
      'Mage',
      'Priest'
    ],
    // Dragonbane uses "Kin" (race) instead of homeland
    homelands: [
      'Human',
      'Halfling',
      'Dwarf',
      'Elf',
      'Mallard',
      'Wolfkin'
    ]
  };

  constructor() {
    // Load from localStorage on init
    this.gameSystem.set(this.loadGameSystem());
  }

  private loadGameSystem(): GameSystem {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return (stored === 'dragonbane' ? 'dragonbane' : 'runequest') as GameSystem;
  }

  setGameSystem(system: GameSystem): void {
    this.gameSystem.set(system);
    localStorage.setItem(this.STORAGE_KEY, system);
  }

  toggleGameSystem(): void {
    const current = this.gameSystem();
    const newSystem = current === 'runequest' ? 'dragonbane' : 'runequest';
    this.setGameSystem(newSystem);
  }

  getCults(): string[] {
    return this.gameSystem() === 'runequest' ? this.runequest.cults : this.dragonbane.cults;
  }

  getOccupations(): string[] {
    return this.gameSystem() === 'runequest' ? this.runequest.occupations : this.dragonbane.occupations;
  }

  getHomelands(): string[] {
    return this.gameSystem() === 'runequest' ? this.runequest.homelands : this.dragonbane.homelands;
  }

  getSystemName(): string {
    return this.gameSystem() === 'runequest' ? 'RuneQuest' : 'Dragonbane';
  }

  // Helper to get appropriate label translations based on system
  getHomelandLabel(): string {
    return this.gameSystem() === 'runequest' ? 'background.homeland' : 'background.kin';
  }

  getOccupationLabel(): string {
    return this.gameSystem() === 'runequest' ? 'background.occupation' : 'background.profession';
  }

  getCultLabel(): string {
    return this.gameSystem() === 'runequest' ? 'background.cult' : 'background.belief';
  }
}
