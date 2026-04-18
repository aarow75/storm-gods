import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Resources } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-resources',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-resources.html',
  styleUrl: './character-resources.css',
})
export class CharacterResources {
  @Input() resources!: Resources;

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.resources');
  }

  getResourceKeys(): { key: keyof Resources; label: string }[] {
    return [
      { key: 'lunars', label: 'Lunars' },
      { key: 'wheels', label: 'Wheels' },
      { key: 'clacks', label: 'Clacks' },
      { key: 'reputation', label: 'Reputation' },
      { key: 'ransom', label: 'Ransom' }
    ];
  }
}
