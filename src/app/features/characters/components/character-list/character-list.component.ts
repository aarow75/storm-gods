import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Character, CharacterStats } from '@characters/models/character.model';
import { CharacterService } from '@characters/services/character.service';
import { CharacterUpdateService } from '@characters/services/character-update.service';
import { GameSystemService } from '@shared/services/game-system.service';
import { getRulesForSystem } from '@shared/rules/game-system-rules.factory';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.css'
})
export class CharacterListComponent implements OnInit, OnDestroy {
  characters: Character[] = [];
  private characterUpdateSubscription?: Subscription;

  constructor(
    private characterService: CharacterService,
    private characterUpdateService: CharacterUpdateService,
    private router: Router,
    public gameSystemService: GameSystemService
  ) {}

  get heading(): string {
    return 'Characters';
  }

  ngOnInit(): void {
    this.loadCharacters();

    // Subscribe to character updates from combat tracker
    this.characterUpdateSubscription = this.characterUpdateService.characterUpdated$.subscribe(() => {
      this.loadCharacters();
    });
  }

  ngOnDestroy(): void {
    if (this.characterUpdateSubscription) {
      this.characterUpdateSubscription.unsubscribe();
    }
  }

  loadCharacters(): void {
    this.characters = this.characterService.getCharacters();
  }

  onEdit(id: string): void {
    this.router.navigate(this.gameSystemService.link('create'), { queryParams: { id: id } });
  }

  deleteCharacter(id: string): void {
    if (confirm('Are you sure you want to delete this character?')) {
      this.characterService.deleteCharacter(id);
      this.loadCharacters();
    }
  }

  getCurrentHP(character: Character): number {
    return character.derivedStats.totalHitPoints;
  }

  getMaxHP(character: Character): number {
    return character.derivedStats.maxHitPoints || character.derivedStats.totalHitPoints;
  }

  getGameSystemName(system: string): string {
    if (system === 'dragonbane') return 'Dragonbane';
    if (system === 'kal-arath') return 'Kal-Arath';
    return 'RuneQuest';
  }

  getVisibleStats(character: Character): { label: string; value: number }[] {
    const rules = getRulesForSystem(character.gameSystem ?? 'runequest');
    return rules.getStatDefinitions()
      .filter(def => def.visible)
      .map(def => ({
        label: def.label.split(' ')[0],
        value: character.stats[def.key as keyof CharacterStats] ?? 0,
      }));
  }

  characterUsesHitLocations(character: Character): boolean {
    return getRulesForSystem(character.gameSystem ?? 'runequest').usesHitLocations();
  }

  showStrikeRank(character: Character): boolean {
    return character.gameSystem !== 'dragonbane' && character.gameSystem !== 'kal-arath';
  }

  showMagicPoints(character: Character): boolean {
    return character.gameSystem !== 'kal-arath';
  }

  showDamageBonus(character: Character): boolean {
    return character.gameSystem !== 'kal-arath';
  }

  showMovement(character: Character): boolean {
    return character.gameSystem !== 'dragonbane' && character.gameSystem !== 'kal-arath';
  }

  showArmorRating(character: Character): boolean {
    return !this.characterUsesHitLocations(character);
  }

  healingRateLabel(character: Character): string {
    return character.gameSystem === 'kal-arath' ? 'Post-Battle Healing' : 'Healing Rate';
  }

  getSingleArmorRating(character: Character): number {
    return character.armor['Chest'] || 0;
  }
}
