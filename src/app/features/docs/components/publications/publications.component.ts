import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RUNEQUEST_PUBLICATIONS } from '@docs/constants/runequest-publications.constants';
import { DRAGONBANE_PUBLICATIONS } from '@docs/constants/dragonbane-publications.constants';
import { OSRIC_PUBLICATIONS } from '@docs/constants/osric-publications.constants';
import { GameSystemService } from '@shared/services/game-system.service';

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
    if (this.gameSystemService.gameSystem() === 'runequest') {
      return RUNEQUEST_PUBLICATIONS;
    } else if (this.gameSystemService.gameSystem() === 'dragonbane') {
      return DRAGONBANE_PUBLICATIONS;
    } else if (this.gameSystemService.gameSystem() === 'osric') {
      return OSRIC_PUBLICATIONS;
    } else {
      return [];
    }
  }

  get isDragonbane() {
    return this.gameSystemService.gameSystem() === 'dragonbane';
  }

  get isKalArath() {
    return this.gameSystemService.gameSystem() === 'kal-arath';
  }

  get isRunequest() {
    return this.gameSystemService.gameSystem() === 'runequest';
  }

  get isOsric() {
    return this.gameSystemService.gameSystem() === 'osric';
  }

  get osricCoreRules() {
    return OSRIC_PUBLICATIONS.filter(p => p.category === 'rules');
  }

  get osricSupplements() {
    return OSRIC_PUBLICATIONS.filter(p => p.category === 'supplement' && !p.isTsr);
  }

  get osricTsrSupplements() {
    return OSRIC_PUBLICATIONS.filter(p => p.category === 'supplement' && p.isTsr);
  }

  get osricAdventures() {
    return OSRIC_PUBLICATIONS.filter(p => p.category === 'adventure' && !p.isTsr);
  }

  get osricTsrAdventures() {
    return OSRIC_PUBLICATIONS.filter(p => p.category === 'adventure' && p.isTsr);
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
}
