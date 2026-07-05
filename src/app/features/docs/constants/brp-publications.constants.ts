export type BrpPublicationCategory = 'rules' | 'game' | 'supplement';

export interface BrpPublication {
  title: string;
  publishedYear: number;
  category: BrpPublicationCategory;
  description?: string;
  publisher?: string;
}

export const BRP_PUBLICATIONS: BrpPublication[] = [

  // ── Core Rules ──────────────────────────────────────────────────────────────
  {
    title: 'Basic Role-Playing: An Introductory Guide',
    publishedYear: 1980,
    category: 'rules',
    description: 'The original 16-page booklet by Greg Stafford and Lynn Willis that distilled the RuneQuest percentile system into a universal core: seven characteristics, D100 roll-under skills, and hit points equal to CON. Bundled with the RuneQuest 2nd edition boxed set and Worlds of Wonder.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Basic Roleplaying (the "Big Gold Book")',
    publishedYear: 2008,
    category: 'rules',
    description: 'The comprehensive one-volume edition consolidating a quarter-century of BRP mechanics from RuneQuest, Call of Cthulhu, Stormbringer, and Superworld into a single universal toolkit.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Basic Roleplaying: Universal Game Engine',
    publishedYear: 2023,
    category: 'rules',
    description: 'The current edition of BRP, released under a royalty-free open license (ORC). A complete genre-neutral D100 system for building campaigns in any setting.',
    publisher: 'Chaosium Inc.',
  },

  // ── Games Powered by BRP ────────────────────────────────────────────────────
  {
    title: 'RuneQuest (2nd Edition)',
    publishedYear: 1980,
    category: 'game',
    description: 'The fantasy game the BRP booklet was extracted from, set in Greg Stafford\'s world of Glorantha. Hit locations, strike ranks, and cult-based magic extend the BRP core.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Call of Cthulhu',
    publishedYear: 1981,
    category: 'game',
    description: 'Sandy Petersen\'s horror game of Lovecraftian investigation — the most enduring BRP game, adding the Sanity mechanic to the percentile core.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Stormbringer',
    publishedYear: 1981,
    category: 'game',
    description: 'Swords and sorcery in Michael Moorcock\'s Young Kingdoms, with demon summoning and the doomed world of Elric built on BRP mechanics.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Worlds of Wonder',
    publishedYear: 1982,
    category: 'game',
    description: 'A boxed set pairing the Basic Role-Playing booklet with three genre expansions: Magic World (fantasy), Superworld (superheroes), and Future World (science fiction).',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Superworld',
    publishedYear: 1983,
    category: 'game',
    description: 'The superhero expansion from Worlds of Wonder grown into a full boxed game, powered by BRP with an energy-based power system.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Ringworld',
    publishedYear: 1984,
    category: 'game',
    description: 'Hard science fiction on Larry Niven\'s Ringworld, adapting BRP for high-technology adventure.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'ElfQuest',
    publishedYear: 1984,
    category: 'game',
    description: 'Adventure in the world of Wendy and Richard Pini\'s ElfQuest comics, using the BRP percentile engine.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Hawkmoon',
    publishedYear: 1986,
    category: 'game',
    description: 'Moorcock\'s Tragic Millennium Europe — science-fantasy adventure built on the Stormbringer flavor of BRP.',
    publisher: 'Chaosium Inc.',
  },
  {
    title: 'Magic World',
    publishedYear: 2013,
    category: 'game',
    description: 'A standalone fantasy game reviving the Worlds of Wonder and Elric! rules as a complete BRP fantasy toolkit.',
    publisher: 'Chaosium Inc.',
  },
];
