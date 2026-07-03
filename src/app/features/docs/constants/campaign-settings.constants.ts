export interface CampaignBook {
  title: string;
  year: number;
}

export interface CampaignSetting {
  id: string;
  title: string;
  description: string;
  markdownFile: string;
  books?: CampaignBook[];
}

export const CAMPAIGN_SETTINGS: CampaignSetting[] = [
  {
    id: 'campaign-setting-ideas',
    title: 'Campaign Setting Ideas',
    description: 'A reference list of public-domain and contemporary fiction settings suitable for RPG campaigns, with source material, authors, and publication years.',
    markdownFile: 'Campaign-Setting-Ideas.md',
  },
  {
    id: 'pellucidar',
    title: 'Pellucidar',
    description: 'A hollow-earth prehistoric world lit by an eternal inner sun. Intelligent telepathic pterosaurs enslave humanity; a surface-world engineer fights to unite the tribes. Eight campaign arcs, full location guide, and prehistoric bestiary.',
    markdownFile: 'Pellucidar-Setting.md',
    books: [
      { title: 'At the Earth\'s Core', year: 1914 },
      { title: 'Pellucidar', year: 1915 },
      { title: 'Tanar of Pellucidar', year: 1929 },
      { title: 'Tarzan at the Earth\'s Core', year: 1930 },
      { title: 'Back to the Stone Age', year: 1937 },
      { title: 'Land of Terror', year: 1944 },
      { title: 'Savage Pellucidar', year: 1963 },
    ],
  },
  {
    id: 'karameikos',
    title: 'The Grand Duchy of Karameikos',
    description: 'A hard-won frontier duchy on the Sea of Dread, where Thyatian colonists and indigenous Traladarans share uneasy ground. Ancient ruins, humanoid mountain tribes, slave-trading crime syndicates, and a Duke who is building something real on someone else\'s land. Classic wilderness and dungeon adventure with political depth.',
    markdownFile: 'Karameikos-Setting.md',
    books: [
      { title: 'GAZ1: The Grand Duchy of Karameikos', year: 1987 },
      { title: 'B2: The Keep on the Borderlands', year: 1980 },
      { title: 'B10: Night\'s Dark Terror', year: 1986 },
      { title: 'B1: In Search of the Unknown', year: 1979 },
    ],
  },
  {
    id: 'nod',
    title: 'The Land of Nod',
    description: 'A hexcrawl sword-and-sorcery world spanning 36+ magazine issues: declining empires, competing city-states, ancient ruins, and a literal Hell reachable by high-level characters. Draws from Phoenician, Roman, Asian, African, and colonial North American mythologies.',
    markdownFile: 'NOD-Setting.md',
    books: [
      { title: 'NOD 1–3: The Wyvern Coast', year: 2010 },
      { title: 'NOD 4–7: Venatia', year: 2010 },
      { title: 'NOD 8–10: Mu-Pan', year: 2011 },
      { title: 'NOD 11–15: Hell', year: 2012 },
      { title: 'NOD 16–18: Kush & Pwenet', year: 2012 },
      { title: 'NOD 19–21: The Virgin Woode', year: 2013 },
      { title: 'NOD 22–24: Ende', year: 2014 },
      { title: 'NOD 25–27: Klarkash Mountains & Ulflandia', year: 2015 },
      { title: 'NOD 28–29: Trollheims', year: 2016 },
      { title: 'NOD 31–32: Nomo & Kisthenes', year: 2017 },
      { title: 'NOD 33–35: Carnelian Coast, Hyrcania & Golden Coast', year: 2018 },
      { title: 'NOD 36: Yore', year: 2019 },
    ],
  },
  {
    id: 'barsoom',
    title: 'Barsoom (John Carter of Mars)',
    description: 'A dying red planet of ancient civilizations, 10-legged beasts, and noble sword-wielding warriors. A Virginia soldier transplanted to Mars fights for the Princess of Helium, against false gods, and across the Dead Sea Bottoms. Eight campaign arcs, full location guide, and Martian bestiary.',
    markdownFile: 'Barsoom-Setting.md',
    books: [
      { title: 'A Princess of Mars', year: 1912 },
      { title: 'The Gods of Mars', year: 1913 },
      { title: 'The Warlord of Mars', year: 1914 },
      { title: 'Thuvia, Maid of Mars', year: 1916 },
      { title: 'The Chessmen of Mars', year: 1922 },
      { title: 'The Master Mind of Mars', year: 1927 },
      { title: 'A Fighting Man of Mars', year: 1930 },
      { title: 'Swords of Mars', year: 1936 },
      { title: 'Synthetic Men of Mars', year: 1940 },
      { title: 'Llana of Gathol', year: 1941 },
      { title: 'John Carter of Mars', year: 1964 },
    ],
  },
];
