import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CultStatus } from '@characters/models/character.model';

@Component({
  standalone: true,
  selector: 'app-character-cult-status',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-cult-status.html',
  styleUrl: './character-cult-status.css',
})
export class CharacterCultStatus {
  @Input() cultStatus!: CultStatus;
  @Input() cultRanks!: string[];

  get heading(): string {
    return 'Cult Status';
  }
}
