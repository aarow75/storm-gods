import { Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { GameSystem } from '@shared/models/game-system.model';
import { GameSystemRules } from '@shared/rules/game-system-rules.interface';
import { getRulesForSystem } from '@shared/rules/game-system-rules.factory';

export type { GameSystem };

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
  private static readonly SYSTEM_PATTERN = /^\/(runequest|dragonbane|kal-arath|osric)(?:\/|$)/;

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

  private kalArath: GameSystemData = {
    // Demonic pacts from the Kal-Arath magic system
    cults: [
      'Blood',
      'Destruction',
      'Corruption',
      'Illumination',
      'Shadow',
      'Domination',
      'None'
    ],
    // Character backgrounds/archetypes
    occupations: [
      'Warrior',
      'Rogue',
      'Mystic',
      'Explorer',
      'Pit Fighter',
      'Nomad',
      'Merchant',
      'Hermit',
      'Shaman',
      'Scavenger',
      'Other'
    ],
    // Origins in the Kal-Arath setting
    homelands: [
      'Steppe Nomad',
      'City Dweller',
      'Tribal Outcast',
      'Black Legion Deserter',
      'Monastic Order',
      'Slave/Freed Slave',
      'Wandering Mercenary',
      'Unknown'
    ]
  };

  private osric: GameSystemData = {
    // In OSRIC, "cult" maps to alignment (the 9-position law/chaos + good/evil matrix)
    cults: [
      'Lawful Good',
      'Neutral Good',
      'Chaotic Good',
      'Lawful Neutral',
      'True Neutral',
      'Chaotic Neutral',
      'Lawful Evil',
      'Neutral Evil',
      'Chaotic Evil',
    ],
    // Character classes from the OSRIC rulebook
    occupations: [
      'Assassin',
      'Cleric',
      'Druid',
      'Fighter',
      'Illusionist',
      'Magic User',
      'Paladin',
      'Ranger',
      'Thief',
    ],
    // Playable races from the OSRIC rulebook
    homelands: [
      'Human',
      'Dwarf',
      'Elf',
      'Gnome',
      'Half-Elf',
      'Half-Orc',
      'Halfling',
    ],
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
    if (stored === 'dragonbane' || stored === 'kal-arath' || stored === 'osric') return stored;
    return 'runequest';
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
    const match = this.router.url.match(/^\/(runequest|dragonbane|kal-arath|osric)(.*)$/);
    const tail = match?.[2];
    const target = tail && tail !== '/' ? tail : '/characters';
    this.router.navigateByUrl(`/${system}${target}`);
  }

  getCults(): string[] {
    if (this.gameSystem() === 'kal-arath') return this.kalArath.cults;
    if (this.gameSystem() === 'osric') return this.osric.cults;
    return this.gameSystem() === 'runequest' ? this.runequest.cults : this.dragonbane.cults;
  }

  getOccupations(): string[] {
    if (this.gameSystem() === 'kal-arath') return this.kalArath.occupations;
    if (this.gameSystem() === 'osric') return this.osric.occupations;
    return this.gameSystem() === 'runequest' ? this.runequest.occupations : this.dragonbane.occupations;
  }

  getHomelands(): string[] {
    if (this.gameSystem() === 'kal-arath') return this.kalArath.homelands;
    if (this.gameSystem() === 'osric') return this.osric.homelands;
    return this.gameSystem() === 'runequest' ? this.runequest.homelands : this.dragonbane.homelands;
  }

  getSystemName(): string {
    if (this.gameSystem() === 'kal-arath') return 'Kal-Arath';
    if (this.gameSystem() === 'osric') return 'OSRIC';
    return this.gameSystem() === 'runequest' ? 'RuneQuest' : 'Dragonbane';
  }

  getHomelandLabel(): string {
    if (this.gameSystem() === 'kal-arath') return 'Origin';
    if (this.gameSystem() === 'osric') return 'Race';
    return this.gameSystem() === 'runequest' ? 'Homeland' : 'Kin (Race)';
  }

  getOccupationLabel(): string {
    if (this.gameSystem() === 'kal-arath') return 'Background';
    if (this.gameSystem() === 'osric') return 'Class';
    return this.gameSystem() === 'runequest' ? 'Occupation' : 'Profession';
  }

  getCultLabel(): string {
    if (this.gameSystem() === 'kal-arath') return 'Demonic Pact';
    if (this.gameSystem() === 'osric') return 'Alignment';
    return this.gameSystem() === 'runequest' ? 'Cult/Religion' : 'Belief';
  }

  getSelectHomelandLabel(): string {
    if (this.gameSystem() === 'kal-arath') return 'Select Origin';
    if (this.gameSystem() === 'osric') return 'Select Race';
    return this.gameSystem() === 'runequest' ? 'Select Homeland' : 'Select Kin';
  }

  getSelectOccupationLabel(): string {
    if (this.gameSystem() === 'kal-arath') return 'Select Background';
    if (this.gameSystem() === 'osric') return 'Select Class';
    return this.gameSystem() === 'runequest' ? 'Select Occupation' : 'Select Profession';
  }

  getSelectCultLabel(): string {
    if (this.gameSystem() === 'kal-arath') return 'Select Demonic Pact';
    if (this.gameSystem() === 'osric') return 'Select Alignment';
    return this.gameSystem() === 'runequest' ? 'Select Cult' : 'Select Belief';
  }

  getRules(): GameSystemRules {
    return getRulesForSystem(this.gameSystem());
  }
}
