export interface DragonbanePublication {
  title: string;
  publishedYear: number;
  description?: string;
  publisher?: string;
  purchased?: boolean;
}

export const DRAGONBANE_PUBLICATIONS: DragonbanePublication[] = [
  // Core Books
  {
    title: 'Dragonbane Rulebook',
    publishedYear: 2023,
    description: 'Core rulebook with D20-based rules, character creation, skills, combat, and magic. Includes the introductory adventure "The Castle of the Robber Knight"',
    publisher: 'Free League Publishing',
    purchased: true,
  },
  {
    title: 'Dragonbane Core Set',
    publishedYear: 2023,
    description: 'Complete boxed set including rulebook, 11 adventures book (Secret of the Dragon Emperor campaign), solo play booklet, full-color map, dice, standees, character sheets, and cards',
    publisher: 'Free League Publishing',
    purchased: true,
  },

  // Bestiary & Creatures
  {
    title: 'Dragonbane Bestiary',
    publishedYear: 2024,
    description: '63 creatures with text and illustration, plus 9 new playable kin. Available in standard and premium Collector\'s Edition',
    publisher: 'Free League Publishing',
    purchased: true,
  },

  // Adventures & Campaigns
  {
    title: 'Path of Glory',
    publishedYear: 2024,
    description: 'Campaign expansion for Dragonbane',
    publisher: 'Free League Publishing',
  },

  // Dragonbane: Trudvang (Upcoming - Kickstarter 2026)
  {
    title: 'Dragonbane: Trudvang - World Book',
    publishedYear: 2026,
    description: 'Deep dive into Trudvang\'s history, peoples, and regions from Stormlands to Westmark, richly illustrated',
    publisher: 'Free League Publishing',
  },
  {
    title: 'Dragonbane: Trudvang - Book of Heroes',
    publishedYear: 2026,
    description: 'New Trudvang professions, skills, heroic abilities, and magic including vitner weavers and dimwalkers',
    publisher: 'Free League Publishing',
  },
  {
    title: 'Dragonbane: Trudvang - Jorgi\'s Bestiary',
    publishedYear: 2026,
    description: 'Monster manual for Trudvang including braskelwurm, draugr, hrimtursir, and yggdras',
    publisher: 'Free League Publishing',
  },
  {
    title: 'Dragonbane: Trudvang - The Black Sun',
    publishedYear: 2026,
    description: 'Legendary four-part epic campaign, revised and published in English for the first time',
    publisher: 'Free League Publishing',
  },
];
