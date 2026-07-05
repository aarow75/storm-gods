import { GameSystem } from '@shared/models/game-system.model';

export type ReferenceDocKind = 'spells' | 'weapons' | 'equipment';

export type ReferenceDocFiles = Partial<Record<ReferenceDocKind, string>>;

// Markdown reference pages in public/docs/ describing the items offered in
// the app's dropdowns. A missing key means the system has no such page
// (e.g. Mothership has no spells) and links to it are hidden.
export const REFERENCE_DOCS: Record<GameSystem, ReferenceDocFiles> = {
  runequest: {
    spells: 'RuneQuest-Spells.md',
    weapons: 'RuneQuest-Weapons.md',
    equipment: 'RuneQuest-Equipment.md',
  },
  dragonbane: {
    spells: 'Dragonbane-Spells.md',
    weapons: 'Dragonbane-Weapons.md',
    equipment: 'Dragonbane-Equipment.md',
  },
  'kal-arath': {
    spells: 'Kal-Arath-Spells.md',
    weapons: 'Kal-Arath-Weapons.md',
    equipment: 'Kal-Arath-Equipment.md',
  },
  osric: {
    spells: 'OSRIC-Spells.md',
    weapons: 'OSRIC-Weapons.md',
    equipment: 'OSRIC-Equipment.md',
  },
  mothership: {
    weapons: 'Mothership-Weapons.md',
    equipment: 'Mothership-Equipment.md',
  },
  brp: {},
};
