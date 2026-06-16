import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Character } from '@characters/models/character.model';
import { CharacterService } from '@characters/services/character.service';
import { CharacterUpdateService } from '@characters/services/character-update.service';
import { GameSystemService } from '@shared/services/game-system.service';

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
    // Store the ID in the character form via a service or navigate with state
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
    return system === 'dragonbane' ? 'Dragonbane' : 'RuneQuest';
  }
}
