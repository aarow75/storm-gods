import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HitLocations, ArmorLocations } from '@characters/models/character.model';

@Component({
  standalone: true,
  selector: 'app-character-hit-locations',
  imports: [CommonModule, FormsModule],
  templateUrl: './character-hit-locations.html',
  styleUrl: './character-hit-locations.css',
})
export class CharacterHitLocations {
  @Input() hitLocations!: HitLocations;
  @Input() armor?: ArmorLocations;
  @Output() calculate = new EventEmitter<void>();

  get heading(): string {
    return 'Hit Locations';
  }

  getHitLocationKeys(): string[] {
    return ['Right Leg', 'Left Leg', 'Abdomen', 'Chest', 'Right Arm', 'Left Arm', 'Head'];
  }

  calculateHitPoints(): void {
    this.calculate.emit();
  }
}
