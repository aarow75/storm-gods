import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RUNEQUEST_PUBLICATIONS } from '../../constants/runequest-publications.constants';
import { DRAGONBANE_PUBLICATIONS } from '../../constants/dragonbane-publications.constants';
import { GameSystemService } from '../../services/game-system.service';

@Component({
  standalone: true,
  selector: 'app-publications',
  imports: [CommonModule, RouterLink],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
})
export class PublicationsComponent {
  constructor(public gameSystemService: GameSystemService) {}

  get publications() {
    return this.gameSystemService.gameSystem() === 'runequest'
      ? RUNEQUEST_PUBLICATIONS
      : DRAGONBANE_PUBLICATIONS;
  }

  get rq2Publications() {
    return RUNEQUEST_PUBLICATIONS.filter((p) => parseInt(p.chaosiumNumber.slice(5), 10) <= 23);
  }

  get modernPublications() {
    return RUNEQUEST_PUBLICATIONS.filter((p) => parseInt(p.chaosiumNumber.slice(5), 10) >= 25);
  }

  get coreBooks() {
    return DRAGONBANE_PUBLICATIONS.filter((p) => ['Rulebook', 'Core Set', 'Quickstart Rules', 'The RPG', 'Treasure Chests'].some(t => p.title.includes(t)));
  }

  get bestiaries() {
    return DRAGONBANE_PUBLICATIONS.filter((p) => ['Bestiary', 'Monsters'].some(t => p.title.includes(t)));
  }

  get settings() {
    return DRAGONBANE_PUBLICATIONS.filter((p) => ['Drakonor', 'Kingdom', 'North'].some(t => p.title.includes(t)));
  }

  get trudvangBooks() {
    return DRAGONBANE_PUBLICATIONS.filter((p) => p.title.includes('Trudvang'));
  }

  get adventures() {
    return DRAGONBANE_PUBLICATIONS.filter((p) => !this.coreBooks.includes(p) && !this.bestiaries.includes(p) && !this.settings.includes(p) && !this.trudvangBooks.includes(p));
  }

  get isRunequest() {
    return this.gameSystemService.gameSystem() === 'runequest';
  }
}
