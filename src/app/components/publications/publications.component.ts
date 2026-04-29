import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RUNEQUEST_PUBLICATIONS } from '../../constants/runequest-publications.constants';

@Component({
  standalone: true,
  selector: 'app-publications',
  imports: [CommonModule, RouterLink],
  templateUrl: './publications.component.html',
  styleUrl: './publications.component.css',
})
export class PublicationsComponent {
  publications = RUNEQUEST_PUBLICATIONS;

  get rq2Publications() {
    return this.publications.filter((p) => parseInt(p.chaosiumNumber.slice(5), 10) <= 23);
  }

  get modernPublications() {
    return this.publications.filter((p) => parseInt(p.chaosiumNumber.slice(5), 10) >= 25);
  }
}
