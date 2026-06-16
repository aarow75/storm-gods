import { Injectable, inject } from '@angular/core';
import { Character } from '@characters/models/character.model';
import { CharacterService } from '@characters/services/character.service';

/** Narrow read-only facade over CharacterService for cross-feature consumers that don't need write access. */
@Injectable({ providedIn: 'root' })
export class CharacterReadService {
  private readonly characterService = inject(CharacterService);

  getAll(): Character[] {
    return this.characterService.getCharacters();
  }

  getById(id: string): Character | undefined {
    return this.characterService.getCharacters().find(c => c.id === id);
  }

  /** Alias matching CharacterService.getCharacter() for drop-in template compatibility. */
  getCharacter(id: string): Character | undefined {
    return this.getById(id);
  }
}
