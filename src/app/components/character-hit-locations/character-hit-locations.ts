import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HitLocations } from '../../models/character.model';
import { TranslationService } from '../../services/translation.service';

@Component({
  standalone: true,
  selector: 'app-character-hit-locations',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-hit-locations.html',
  styleUrl: './character-hit-locations.css',
})
export class CharacterHitLocations {
  @Input() hitLocations!: HitLocations;
  @Output() calculate = new EventEmitter<void>();

  constructor(public translationService: TranslationService) {}

  get heading(): string | undefined {
    return this.translationService.translate('section.hitLocations');
  }

  getHitLocationKeys(): string[] {
    return ['Right Leg', 'Left Leg', 'Abdomen', 'Chest', 'Right Arm', 'Left Arm', 'Head'];
  }

  calculateHitPoints(): void {
    this.calculate.emit();
  }
}
