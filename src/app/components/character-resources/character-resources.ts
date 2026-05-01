import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resources } from '../../models/character.model';

@Component({
  standalone: true,
  selector: 'app-character-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-resources.html',
  styleUrl: './character-resources.css',
})
export class CharacterResources {
  @Input() resources!: Resources;

  get heading(): string {
    return 'Resources';
  }

  getResourceKeys(): { key: keyof Resources; label: string }[] {
    return [
      { key: 'wheels', label: 'Wheels (2 Gold)' },
      { key: 'lunars', label: 'Lunars (Silver)' },
      { key: 'clacks', label: 'Clacks (Copper)' },
      { key: 'reputation', label: 'Reputation' },
      { key: 'ransom', label: 'Ransom' }
    ];
  }
}
