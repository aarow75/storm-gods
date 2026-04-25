import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Character } from '../../models/character.model';
import { CharacterService } from '../../services/character.service';
import { CharacterUpdateService } from '../../services/character-update.service';
import { TranslationService } from '../../services/translation.service';
import { GameSystemService } from '../../services/game-system.service';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [CommonModule],
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
    public translationService: TranslationService,
    private gameSystemService: GameSystemService
  ) {}

  get heading(): string | undefined {
    return this.translationService.translate('characterList.title');
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
    this.router.navigate(['/create'], { queryParams: { id: id } });
  }

  deleteCharacter(id: string): void {
    const confirmMessage = this.translationService.get('characterList.deleteConfirm', 'Are you sure you want to delete this character?');
    if (confirm(confirmMessage)) {
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
