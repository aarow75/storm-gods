import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RUNEQUEST_PUBLICATIONS } from '@docs/constants/runequest-publications.constants';
import { DRAGONBANE_PUBLICATIONS } from '@docs/constants/dragonbane-publications.constants';
import { OSRIC_PUBLICATIONS } from '@docs/constants/osric-publications.constants';
import { MOTHERSHIP_PUBLICATIONS } from '@docs/constants/mothership-publications.constants';
import { BRP_PUBLICATIONS } from '@docs/constants/brp-publications.constants';
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

  private get systemType() { return this.gameSystemService.getRules().getMagicSystemType(); }

  get publications() {
    if (this.systemType === 'runequest') return RUNEQUEST_PUBLICATIONS;
    if (this.systemType === 'dragonbane') return DRAGONBANE_PUBLICATIONS;
    if (this.systemType === 'osric') return OSRIC_PUBLICATIONS;
    if (this.systemType === 'mothership') return MOTHERSHIP_PUBLICATIONS;
    if (this.systemType === 'brp') return BRP_PUBLICATIONS;
    return [];
  }

  get isDragonbane() { return this.systemType === 'dragonbane'; }
  get isKalArath() { return this.systemType === 'kal-arath'; }
  get isRunequest() { return this.systemType === 'runequest'; }
  get isOsric() { return this.systemType === 'osric'; }
  get isMothership() { return this.systemType === 'mothership'; }
  get isBrp() { return this.systemType === 'brp'; }

  get brpCoreRules() {
    return BRP_PUBLICATIONS.filter(p => p.category === 'rules');
  }

  get brpGames() {
    return BRP_PUBLICATIONS.filter(p => p.category === 'game');
  }

  get brpSupplements() {
    return BRP_PUBLICATIONS.filter(p => p.category === 'supplement');
  }

  get mothershipCoreRules() {
    return MOTHERSHIP_PUBLICATIONS.filter(p => p.category === 'rules');
  }

  get mothershipAdventures() {
    return MOTHERSHIP_PUBLICATIONS.filter(p => p.category === 'adventure');
  }

  get mothershipSupplements() {
    return MOTHERSHIP_PUBLICATIONS.filter(p => p.category === 'supplement');
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
