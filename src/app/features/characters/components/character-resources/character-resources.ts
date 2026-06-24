import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resources } from '@characters/models/character.model';
import { GameSystemService } from '@shared/services/game-system.service';

@Component({
  standalone: true,
  selector: 'app-character-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-resources.html',
  styleUrl: './character-resources.css',
})
export class CharacterResources {
  @Input() resources!: Resources;

  constructor(public gameSystemService: GameSystemService) {}

  get heading(): string {
    return 'Resources';
  }

  getResourceKeys(): { key: keyof Resources; label: string; hint?: string }[] {
    return this.gameSystemService.getRules().getResourceFields();
  }
}
