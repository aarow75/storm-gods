export interface RuneQuestPublication {
  chaosiumNumber: string;
  title: string;
  publishedYear: number;
  description?: string;
}

export const RUNEQUEST_PUBLICATIONS: RuneQuestPublication[] = [
  // RuneQuest 2 Core Books (1978-1982)
  {
    chaosiumNumber: 'CHA4001',
    title: 'RuneQuest 2 Rulebook',
    publishedYear: 1979,
    description: 'Core rulebook for RuneQuest 2nd Edition',
  },
  {
    chaosiumNumber: 'CHA4001-X',
    title: 'RuneQuest 2 Boxed Set',
    publishedYear: 1980,
  },
  {
    chaosiumNumber: 'CHA4001-H',
    title: 'RuneQuest 2 Hardcover',
    publishedYear: 1982,
  },

  // RuneQuest 2 Supplements (1978-1983)
  {
    chaosiumNumber: 'CHA4002',
    title: 'Balastor\'s Barracks',
    publishedYear: 1978,
    description: 'Solo adventure scenario',
  },
  {
    chaosiumNumber: 'CHA4003',
    title: 'Trolls and Trollkin',
    publishedYear: 1978,
    description: 'Supplement featuring troll player characters',
  },
  {
    chaosiumNumber: 'CHA4004',
    title: 'Creatures of Chaos 1',
    publishedYear: 1978,
    description: 'Bestiary of chaotic creatures',
  },
  {
    chaosiumNumber: 'CHA4005',
    title: 'Apple Lane',
    publishedYear: 1978,
    description: 'Introductory adventure module',
  },
  {
    chaosiumNumber: 'CHA4006',
    title: 'Militia & Mercenaries',
    publishedYear: 1979,
    description: 'Character types and military rules supplement',
  },
  {
    chaosiumNumber: 'CHA4007',
    title: 'Snake Pipe Hollow',
    publishedYear: 1979,
    description: 'Adventure module',
  },
  {
    chaosiumNumber: 'CHA4008',
    title: 'Cults of Prax',
    publishedYear: 1979,
    description: 'Cult supplement for Praxian religions',
  },
  {
    chaosiumNumber: 'CHA4009',
    title: 'Foes',
    publishedYear: 1980,
    description: 'Expanded monster and enemy reference',
  },
  {
    chaosiumNumber: 'CHA4010',
    title: 'The Gateway Bestiary',
    publishedYear: 1980,
    description: 'Creatures and monsters for the Gateway',
  },
  {
    chaosiumNumber: 'CHA4011',
    title: 'Plunder',
    publishedYear: 1980,
    description: 'Treasure and equipment supplement',
  },
  {
    chaosiumNumber: 'CHA4012',
    title: 'Runemasters',
    publishedYear: 1980,
    description: 'Magic system supplement',
  },
  {
    chaosiumNumber: 'CHA4013',
    title: 'Griffin Mountain',
    publishedYear: 1981,
    description: 'Campaign setting and adventure module',
  },
  {
    chaosiumNumber: 'CHA4014',
    title: 'Cults of Terror',
    publishedYear: 1981,
    description: 'Cults supplement featuring chaos and evil cults',
  },
  {
    chaosiumNumber: 'CHA4015-X',
    title: 'Borderlands',
    publishedYear: 1982,
    description: 'Boxed campaign setting',
  },
  {
    chaosiumNumber: 'CHA4016-X',
    title: 'Troll Pak',
    publishedYear: 1982,
    description: 'Boxed troll supplement',
  },
  {
    chaosiumNumber: 'CHA4017',
    title: 'SoloQuest',
    publishedYear: 1982,
    description: 'Solo adventure',
  },
  {
    chaosiumNumber: 'CHA4018-X',
    title: 'Questworld',
    publishedYear: 1982,
    description: 'Boxed adventure supplement',
  },
  {
    chaosiumNumber: 'CHA4019',
    title: 'SoloQuest 2: Scorpion Hall',
    publishedYear: 1982,
    description: 'Solo adventure sequel',
  },
  {
    chaosiumNumber: 'CHA4020',
    title: 'SoloQuest 3: The Snow King\'s Bride',
    publishedYear: 1982,
    description: 'Third solo adventure',
  },
  {
    chaosiumNumber: 'CHA4021-X',
    title: 'Pavis: Threshold to Danger',
    publishedYear: 1983,
    description: 'Boxed city setting for Pavis',
  },
  {
    chaosiumNumber: 'CHA4022-X',
    title: 'Big Rubble: The Deadly City',
    publishedYear: 1983,
    description: 'Boxed supplement for Big Rubble ruins',
  },
  {
    chaosiumNumber: 'CHA4023',
    title: 'RuneQuest Companion',
    publishedYear: 1983,
    description: 'Rules expansion and clarifications',
  },

  // Modern RuneQuest: Roleplaying in Glorantha (2014-Present)
  {
    chaosiumNumber: 'CHA4025',
    title: 'Guide to Glorantha',
    publishedYear: 2014,
    description: 'Comprehensive guide to the world of Glorantha',
  },
  {
    chaosiumNumber: 'CHA4027',
    title: 'RuneQuest: Roleplaying in Glorantha Quickstart',
    publishedYear: 2017,
    description: 'Quick-start rules for new players',
  },
  {
    chaosiumNumber: 'CHA4028',
    title: 'RuneQuest – Roleplaying in Glorantha',
    publishedYear: 2018,
    description: 'Core rulebook',
  },
  {
    chaosiumNumber: 'CHA4029',
    title: 'Gamemaster Screen Pack',
    publishedYear: 2019,
  },
  {
    chaosiumNumber: 'CHA4030',
    title: 'The Coming Storm',
    publishedYear: 2016,
  },
  {
    chaosiumNumber: 'CHA4031',
    title: 'The Eleven Lights',
    publishedYear: 2017,
  },
  {
    chaosiumNumber: 'CHA4032',
    title: 'RuneQuest Glorantha Bestiary',
    publishedYear: 2019,
    description: 'Creatures and monsters of Glorantha',
  },
  {
    chaosiumNumber: 'CHA4033',
    title: 'The Glorantha Sourcebook',
    publishedYear: 2018,
    description: 'Lore and background of Glorantha',
  },
  {
    chaosiumNumber: 'CHA4034',
    title: 'The Red Book of Magic',
    publishedYear: 2020,
    description: 'Magic systems and spell reference',
  },
  {
    chaosiumNumber: 'CHA4035',
    title: 'RuneQuest Starter Set',
    publishedYear: 2021,
    description: 'Beginner-friendly starter set',
  },
  {
    chaosiumNumber: 'CHA4036',
    title: 'RuneQuest Weapons and Equipment',
    publishedYear: 2021,
    description: 'Comprehensive equipment guide',
  },
  {
    chaosiumNumber: 'CHA4037',
    title: 'Lands of RuneQuest: Dragon Pass',
    publishedYear: 2024,
    description: 'Regional guide to Dragon Pass',
  },
  {
    chaosiumNumber: 'CHA4038',
    title: 'The Pegasus Plateau & Other Stories',
    publishedYear: 2020,
    description: 'Adventure scenarios',
  },
  {
    chaosiumNumber: 'CHA4039',
    title: 'The Smoking Ruin and other Stories',
    publishedYear: 2019,
    description: 'Adventure scenarios',
  },
  {
    chaosiumNumber: 'CHA4041',
    title: 'Cults of RuneQuest: Mythology',
    publishedYear: 2023,
    description: 'Overview of major cults and religions',
  },
  {
    chaosiumNumber: 'CHA4042',
    title: 'Cults of RuneQuest: The Prosopaedia',
    publishedYear: 2023,
    description: 'Divine and demi-divine beings',
  },
  {
    chaosiumNumber: 'CHA4043',
    title: 'Cults of RuneQuest: The Lightbringers',
    publishedYear: 2023,
    description: 'Light-aligned cults and deities',
  },
  {
    chaosiumNumber: 'CHA4044',
    title: 'Cults of RuneQuest: The Earth Goddesses',
    publishedYear: 2023,
    description: 'Earth-aligned and fertility cults',
  },
  {
    chaosiumNumber: 'CHA4045',
    title: 'Cults of RuneQuest: The Lunar Way',
    publishedYear: 2024,
    description: 'Lunar Empire religions and cults',
  },
  {
    chaosiumNumber: 'CHA4046',
    title: 'The Glorantha Sourcebook (Revised)',
    publishedYear: 2024,
  },
  {
    chaosiumNumber: 'CHA4047',
    title: 'Cults of RuneQuest: The Gods of Fire and Sky',
    publishedYear: 2025,
    description: 'Fire and sky deities',
  },
  {
    chaosiumNumber: 'CHA4051',
    title: 'RuneQuest: Adventure Tokens',
    publishedYear: 2025,
    description: 'Token set for miniature play',
  },
  {
    chaosiumNumber: 'CHA4053',
    title: 'RuneQuest: Elder Race Adventurers',
    publishedYear: 2025,
    description: 'Non-human character options',
  },
  {
    chaosiumNumber: 'CHA4055',
    title: 'The Hunt for the Storm Calf',
    publishedYear: 2025,
    description: 'Adventure scenario',
  },
  {
    chaosiumNumber: 'CHA4056',
    title: 'Stealing the Eye',
    publishedYear: 2026,
    description: 'Adventure scenario',
  },
  {
    chaosiumNumber: 'CHA4060',
    title: 'A Darkness at Runegate',
    publishedYear: 2026,
    description: 'Adventure scenario',
  },
];
