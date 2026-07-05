import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameSystemService } from '@shared/services/game-system.service';
import { REFERENCE_DOCS, ReferenceDocKind } from '@shared/constants/reference-docs.constants';

const DEFAULT_LABELS: Record<ReferenceDocKind, string> = {
  spells: 'Spells',
  weapons: 'Weapons',
  equipment: 'Equipment',
};

// Small link to the active system's reference doc page (spells/weapons/
// equipment). Renders nothing when the system has no page of that kind.
@Component({
  standalone: true,
  selector: 'app-doc-ref-link',
  imports: [RouterLink],
  template: `
    @if (file()) {
      <a
        class="doc-ref-link"
        [routerLink]="gameSystemService.link('docs', 'page')"
        [queryParams]="{ file: file() }"
        [fragment]="fragment"
        [title]="'Open ' + displayLabel + ' reference'"
      >📖 {{ displayLabel }}</a>
    }
  `,
  styles: `
    .doc-ref-link {
      display: inline-block;
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      text-decoration: none;
      padding: var(--spacing-xs) var(--spacing-md);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius-md);
      white-space: nowrap;
    }
    .doc-ref-link:hover {
      color: var(--color-text-primary);
      border-color: var(--color-primary-blue);
    }
  `,
})
export class DocRefLinkComponent {
  @Input({ required: true }) kind!: ReferenceDocKind;
  @Input() fragment?: string;
  @Input() label?: string;

  constructor(public gameSystemService: GameSystemService) {}

  file(): string | undefined {
    return REFERENCE_DOCS[this.gameSystemService.gameSystem()][this.kind];
  }

  get displayLabel(): string {
    return this.label ?? DEFAULT_LABELS[this.kind];
  }
}
