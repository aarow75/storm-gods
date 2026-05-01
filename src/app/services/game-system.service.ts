import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
  private static readonly SYSTEM_PATTERN = /^\/(runequest|dragonbane)(?:\/|$)/;

  gameSystem = signal<GameSystem>(this.loadLastUsed());

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

  constructor(private router: Router) {
    this.updateFromUrl(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateFromUrl(event.urlAfterRedirects);
      });
  }

  private loadLastUsed(): GameSystem {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored === 'dragonbane' ? 'dragonbane' : 'runequest';
  }

  private updateFromUrl(url: string): void {
    const match = url.match(GameSystemService.SYSTEM_PATTERN);
    if (!match) return;
    const sys = match[1] as GameSystem;
    if (sys !== this.gameSystem()) {
      this.gameSystem.set(sys);
    }
    localStorage.setItem(this.STORAGE_KEY, sys);
  }

  /** Build a routerLink array prefixed with the current game system. */
  link(...segments: (string | number)[]): (string | number)[] {
    return ['/', this.gameSystem(), ...segments];
  }

  /** Navigate to the equivalent page under the other game system. */
  switchSystem(system: GameSystem): void {
    if (system === this.gameSystem()) return;
    const match = this.router.url.match(/^\/(runequest|dragonbane)(.*)$/);
    const tail = match?.[2];
    const target = tail && tail !== '/' ? tail : '/characters';
    this.router.navigateByUrl(`/${system}${target}`);
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
