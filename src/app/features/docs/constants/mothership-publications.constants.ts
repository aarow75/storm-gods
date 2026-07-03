export type MothershipPublicationCategory = 'rules' | 'supplement' | 'adventure';

export interface MothershipPublication {
  title: string;
  publishedYear: number;
  category: MothershipPublicationCategory;
  description?: string;
  publisher?: string;
}

export const MOTHERSHIP_PUBLICATIONS: MothershipPublication[] = [

  // ── Core Rules ──────────────────────────────────────────────────────────────
  {
    title: "Player's Survival Guide",
    publishedYear: 2018,
    category: 'rules',
    description: 'The core rulebook for Mothership 1e. 44 pages packed with rules for character creation, skill checks, combat, stress & panic, space travel, and ship design. The zine-format survival guide every crew member needs before heading into deep space.',
    publisher: 'Tuesday Knight Games',
  },
  {
    title: "Warden's Operations Manual",
    publishedYear: 2022,
    category: 'rules',
    description: "The Warden's companion volume. Covers running the game, creating encounters, sandbox procedures, alien design, ship creation, and all the tables a Warden needs during play. Part of the Mothership 1e boxed set.",
    publisher: 'Tuesday Knight Games',
  },
  {
    title: 'Shipbreaker\'s Toolkit',
    publishedYear: 2022,
    category: 'rules',
    description: 'Ship creation and combat reference for Wardens. Includes expanded ship modules, ship-to-ship combat procedures, and the full critical hit table. Companion volume to the 1e boxed set.',
    publisher: 'Tuesday Knight Games',
  },

  // ── Official Adventures ─────────────────────────────────────────────────────
  {
    title: 'Dead Planet',
    publishedYear: 2018,
    category: 'adventure',
    description: 'The iconic first Mothership adventure. A derelict ship orbits a dead planet. What happened to the crew? A haunted, atmospheric horror module for 3–5 players.',
    publisher: 'Tuesday Knight Games',
  },
  {
    title: 'A Pound of Flesh',
    publishedYear: 2019,
    category: 'adventure',
    description: 'A sandbox adventure set aboard Prospero\'s Dream, a massive colony ship drifting through deep space. Features a detailed location-based sandbox, factions, and dozens of hooks for multiple sessions.',
    publisher: 'Tuesday Knight Games',
  },
  {
    title: 'Gradient Descent',
    publishedYear: 2021,
    category: 'adventure',
    description: 'A dungeon-crawl through a massive android manufacturing facility controlled by a rogue AI. One of the largest Mothership adventures, with rich faction play and emergent storytelling.',
    publisher: 'Tuesday Knight Games',
  },
  {
    title: 'Another Bug Hunt',
    publishedYear: 2022,
    category: 'adventure',
    description: 'A military action adventure. Drop onto a planet overrun by aggressive alien fauna, rescue survivors, and extract before things go catastrophically wrong.',
    publisher: 'Tuesday Knight Games',
  },

  // ── Third-Party Supplements ─────────────────────────────────────────────────
  {
    title: 'Hideo\'s Guide to Monster Hunting',
    publishedYear: 2020,
    category: 'supplement',
    description: 'Extensive bestiary of alien creatures with hunting mechanics, loot tables, and encounter advice. Useful for any Warden wanting richly detailed alien fauna.',
    publisher: 'Exeunt Press',
  },
  {
    title: 'Ypsilon 14: Down in the Deep',
    publishedYear: 2020,
    category: 'adventure',
    description: 'An underwater horror scenario set in a flooded research facility. Features unique submersible mechanics and body-horror elements.',
    publisher: 'Tuesday Knight Games',
  },
];
