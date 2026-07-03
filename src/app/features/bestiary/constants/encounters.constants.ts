export interface EncounterEntry {
  roll: string;
  creature: string;
  count: string;
  difficulty: 'trivial' | 'easy' | 'moderate' | 'challenging' | 'deadly';
}

export interface EncounterTable {
  terrain: string;
  description: string;
  entries: EncounterEntry[];
}

export const ENCOUNTER_TABLES: EncounterTable[] = [
  {
    terrain: 'forest',
    description: 'Dense woodland with thick trees, undergrowth, and hidden clearings. Home to predators, bandits, and supernatural creatures.',
    entries: [
      {
        roll: '1-3',
        creature: 'Giant Spider',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '4-5',
        creature: 'Dire Wolf',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '6-7',
        creature: 'Bear',
        count: '1',
        difficulty: 'challenging'
      },
      {
        roll: '8-9',
        creature: 'Bandit/Outlaw',
        count: '2d4',
        difficulty: 'moderate'
      },
      {
        roll: '10-11',
        creature: 'Ranger/Bounty Hunter',
        count: '1d2',
        difficulty: 'challenging'
      },
      {
        roll: '12-13',
        creature: 'Wandering Priest',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '14-15',
        creature: 'Hermit/Scholar',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '16-17',
        creature: 'Hsunchen (Wolf Brother)',
        count: '1d2',
        difficulty: 'challenging'
      },
      {
        roll: '18-19',
        creature: 'Nothing (just sounds)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Centaur',
        count: '1d3',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'mountains',
    description: 'High peaks, rocky terrain, caves, and thin air. Dwell ancient creatures and isolated peoples.',
    entries: [
      {
        roll: '1-3',
        creature: 'Rock Lizard',
        count: '1d2',
        difficulty: 'moderate'
      },
      {
        roll: '4-5',
        creature: 'Bear',
        count: '1',
        difficulty: 'challenging'
      },
      {
        roll: '6-7',
        creature: 'Dragonewt',
        count: '1d3',
        difficulty: 'challenging'
      },
      {
        roll: '8-9',
        creature: 'Rubble Runner',
        count: '2d6',
        difficulty: 'easy'
      },
      {
        roll: '10-11',
        creature: 'Nomadic Tribesman',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '12-13',
        creature: 'Mostali Dwarf',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '14-15',
        creature: 'Hermit/Scholar',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '16-17',
        creature: 'Bandit/Outlaw',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '18-19',
        creature: 'Eagle or Mountain Animal',
        count: '1d2',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Young Dragon or Dire Dragon',
        count: '1',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'plains',
    description: 'Open grasslands with few trees. Swift travel but little shelter. Nomads, traders, and predators roam freely.',
    entries: [
      {
        roll: '1-3',
        creature: 'Horse (wild or domestic)',
        count: '1d6',
        difficulty: 'easy'
      },
      {
        roll: '4-5',
        creature: 'Dire Wolf',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '6-7',
        creature: 'Lion',
        count: '1d2',
        difficulty: 'deadly'
      },
      {
        roll: '8-9',
        creature: 'Nomadic Tribesman',
        count: '2d4',
        difficulty: 'moderate'
      },
      {
        roll: '10-11',
        creature: 'Merchant (Caravan Leader)',
        count: '1d4 guards + 1 leader',
        difficulty: 'easy'
      },
      {
        roll: '12-13',
        creature: 'Centaur',
        count: '1d3',
        difficulty: 'challenging'
      },
      {
        roll: '14-15',
        creature: 'Baboon',
        count: '2d6',
        difficulty: 'moderate'
      },
      {
        roll: '16-17',
        creature: 'War Horse (mounted)',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '18-19',
        creature: 'Nothing (clear skies)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Griffin',
        count: '1',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'desert',
    description: 'Harsh, arid wasteland with extreme temperatures. Danger from heat, bandits, and adapted predators.',
    entries: [
      {
        roll: '1-2',
        creature: 'Scorpion (giant)',
        count: '1d2',
        difficulty: 'moderate'
      },
      {
        roll: '3-4',
        creature: 'Rock Lizard',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '5-6',
        creature: 'Lion',
        count: '1',
        difficulty: 'deadly'
      },
      {
        roll: '7-8',
        creature: 'Nomadic Tribesman',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '9-10',
        creature: 'Bandit/Outlaw',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '11-12',
        creature: 'Merchant (Caravan Leader)',
        count: '1d6 guards + 1 leader',
        difficulty: 'easy'
      },
      {
        roll: '13-14',
        creature: 'Dragonewt',
        count: '1d4',
        difficulty: 'challenging'
      },
      {
        roll: '15-16',
        creature: 'Hermit/Scholar',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '17-19',
        creature: 'Nothing (just sand)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Adult Dragon',
        count: '1',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'roads',
    description: 'Established trade routes and paths connecting settlements. Mix of travelers, merchants, and danger.',
    entries: [
      {
        roll: '1-2',
        creature: 'Merchant (Caravan Leader)',
        count: '1d4 guards + 1 leader',
        difficulty: 'easy'
      },
      {
        roll: '3-4',
        creature: 'Militia/Town Guard',
        count: '1d6',
        difficulty: 'easy'
      },
      {
        roll: '5-6',
        creature: 'Wandering Priest',
        count: '1d2',
        difficulty: 'easy'
      },
      {
        roll: '7-8',
        creature: 'Noble/Traveler',
        count: '1d2 with 1d4 guards',
        difficulty: 'moderate'
      },
      {
        roll: '9-10',
        creature: 'Bandit/Outlaw',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '11-12',
        creature: 'Ranger/Bounty Hunter',
        count: '1d2',
        difficulty: 'moderate'
      },
      {
        roll: '13-14',
        creature: 'Hermit/Scholar',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '15-16',
        creature: 'Horse (travel)',
        count: '1d4',
        difficulty: 'trivial'
      },
      {
        roll: '17-19',
        creature: 'Nothing (empty road)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Broo or Chaos Creature',
        count: '1d3',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'jungle',
    description: 'Thick tropical vegetation with ruins of ancient civilizations. Home to dinosaurs, giant creatures, and exotic dangers.',
    entries: [
      {
        roll: '1-2',
        creature: 'Giant Spider',
        count: '1d2',
        difficulty: 'moderate'
      },
      {
        roll: '3-4',
        creature: 'Velociraptor',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '5-6',
        creature: 'Allosaurus',
        count: '1',
        difficulty: 'deadly'
      },
      {
        roll: '7-8',
        creature: 'Triceratops',
        count: '1d2',
        difficulty: 'deadly'
      },
      {
        roll: '9-10',
        creature: 'Stegosaurus',
        count: '1',
        difficulty: 'deadly'
      },
      {
        roll: '11-12',
        creature: 'Nomadic Tribesman (native)',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '13-14',
        creature: 'Baboon (giant)',
        count: '2d6',
        difficulty: 'challenging'
      },
      {
        roll: '15-16',
        creature: 'Broo or Chaos Creature',
        count: '1d4',
        difficulty: 'challenging'
      },
      {
        roll: '17-19',
        creature: 'Exotic Animal (non-hostile)',
        count: '1d4',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Brachiosaurus',
        count: '1d2',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'caves',
    description: 'Underground caverns with darkness, strange creatures, and hidden dangers. Caves connect to the deep world.',
    entries: [
      {
        roll: '1-2',
        creature: 'Giant Rat',
        count: '2d4',
        difficulty: 'easy'
      },
      {
        roll: '3-4',
        creature: 'Giant Spider',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '5-6',
        creature: 'Dark Troll (Uz)',
        count: '1d2',
        difficulty: 'deadly'
      },
      {
        roll: '7-8',
        creature: 'Mostali Dwarf',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '9-10',
        creature: 'Skeleton (undead)',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '11-12',
        creature: 'Dragonewt',
        count: '1d3',
        difficulty: 'challenging'
      },
      {
        roll: '13-14',
        creature: 'Hermit/Scholar',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '15-16',
        creature: 'Vampire or Undead Leader',
        count: '1',
        difficulty: 'deadly'
      },
      {
        roll: '17-19',
        creature: 'Nothing (empty cavern)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Ancient Dragon',
        count: '1',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'ruins',
    description: 'Remnants of ancient civilization. Treasure and danger lie buried beneath stones. Often home to undead and magical creatures.',
    entries: [
      {
        roll: '1-2',
        creature: 'Giant Rat',
        count: '2d4',
        difficulty: 'easy'
      },
      {
        roll: '3-4',
        creature: 'Skeleton (undead)',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '5-6',
        creature: 'Zombie',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '7-8',
        creature: 'Rubble Runner',
        count: '2d6',
        difficulty: 'easy'
      },
      {
        roll: '9-10',
        creature: 'Broo',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '11-12',
        creature: 'Erinys (Demon)',
        count: '1',
        difficulty: 'deadly'
      },
      {
        roll: '13-14',
        creature: 'Hermit/Scholar (studying ruins)',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '15-16',
        creature: 'Bandit/Outlaw (treasure hunting)',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '17-19',
        creature: 'Nothing (silent ruins)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Powerful Undead Lord',
        count: '1',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'tundra',
    description: 'Frozen wasteland with extreme cold and sparse vegetation. Home to hardy peoples and powerful predators adapted to ice.',
    entries: [
      {
        roll: '1-3',
        creature: 'Dire Wolf',
        count: '1d4',
        difficulty: 'moderate'
      },
      {
        roll: '4-5',
        creature: 'Bear (winter white)',
        count: '1',
        difficulty: 'challenging'
      },
      {
        roll: '6-7',
        creature: 'Nomadic Tribesman (cold-adapted)',
        count: '1d6',
        difficulty: 'moderate'
      },
      {
        roll: '8-9',
        creature: 'Hsunchen (Wolf Brother)',
        count: '1d3',
        difficulty: 'challenging'
      },
      {
        roll: '10-11',
        creature: 'Horse (winter breed)',
        count: '1d4',
        difficulty: 'easy'
      },
      {
        roll: '12-13',
        creature: 'Hermit/Scholar (ice wizard)',
        count: '1',
        difficulty: 'challenging'
      },
      {
        roll: '14-15',
        creature: 'Ghost (restless spirit)',
        count: '1',
        difficulty: 'deadly'
      },
      {
        roll: '16-17',
        creature: 'Ranger/Bounty Hunter',
        count: '1',
        difficulty: 'challenging'
      },
      {
        roll: '18-19',
        creature: 'Nothing (whiteout)',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Ice Dragon',
        count: '1',
        difficulty: 'deadly'
      }
    ]
  },
  {
    terrain: 'settlements',
    description: 'Towns, villages, and fortified settlements. Merchants, guards, and local politics dominate. Relatively safe from wilderness threats.',
    entries: [
      {
        roll: '1-3',
        creature: 'Militia/Town Guard',
        count: '1d6',
        difficulty: 'easy'
      },
      {
        roll: '4-5',
        creature: 'Merchant (local)',
        count: '1d3',
        difficulty: 'trivial'
      },
      {
        roll: '6-7',
        creature: 'Wandering Priest',
        count: '1',
        difficulty: 'trivial'
      },
      {
        roll: '8-9',
        creature: 'Hermit/Scholar',
        count: '1',
        difficulty: 'easy'
      },
      {
        roll: '10-11',
        creature: 'Noble/Traveler',
        count: '1 with guards',
        difficulty: 'easy'
      },
      {
        roll: '12-13',
        creature: 'Ranger/Bounty Hunter',
        count: '1',
        difficulty: 'moderate'
      },
      {
        roll: '14-15',
        creature: 'Bandit/Outlaw (wanted)',
        count: '1d3',
        difficulty: 'moderate'
      },
      {
        roll: '16-17',
        creature: 'Traveling Entertainer',
        count: '1d3',
        difficulty: 'trivial'
      },
      {
        roll: '18-19',
        creature: 'Nothing unusual',
        count: '-',
        difficulty: 'trivial'
      },
      {
        roll: '20',
        creature: 'Broo Invasion or Undead Curse',
        count: '1d6+',
        difficulty: 'deadly'
      }
    ]
  },

  // ─── Pellucidar Setting Encounter Tables ─────────────────────────────────────

  {
    terrain: 'pellucidar-plains',
    description: 'The vast Lidi Grasslands of Pellucidar — endless open savanna lit by the eternal inner sun, where enormous herds of sauropods and mammoths roam alongside apex predators.',
    entries: [
      { roll: '1-3',   creature: 'Jalok pack',                          count: '2d6',        difficulty: 'moderate' },
      { roll: '4-5',   creature: 'Tarag',                               count: '1',          difficulty: 'challenging' },
      { roll: '6-7',   creature: 'Lidi herd (startled, stampede risk)', count: '1d4',        difficulty: 'deadly' },
      { roll: '8-9',   creature: 'Gilak war party',                     count: '2d4',        difficulty: 'moderate' },
      { roll: '10-11', creature: 'Tandor herd',                         count: '1d3',        difficulty: 'deadly' },
      { roll: '12-13', creature: 'Thipdar (circling overhead)',         count: '1d2',        difficulty: 'moderate' },
      { roll: '14-15', creature: 'Mezop traders',                       count: '1d4',        difficulty: 'easy' },
      { roll: '16-17', creature: 'Sagoth slave-raider patrol',          count: '1d4+2',      difficulty: 'challenging' },
      { roll: '18-19', creature: 'Distant thunder of hooves (no contact)', count: '-',       difficulty: 'trivial' },
      { roll: '20',    creature: 'Mahar with Sagoth escort',            count: '1 + 2d4',   difficulty: 'deadly' }
    ]
  },
  {
    terrain: 'pellucidar-coast',
    description: 'The shores of the Sojar Az (Terrible Sea) and the Korsar Az — warm, primeval coastline where Mezop canoes, sea reptiles, and coastal Gilak tribes compete for rich fishing grounds.',
    entries: [
      { roll: '1-3',   creature: 'Jalok (beach scavengers)',            count: '1d4',        difficulty: 'easy' },
      { roll: '4-5',   creature: 'Thipdar (coastal hunter)',            count: '1d3',        difficulty: 'moderate' },
      { roll: '6-7',   creature: 'Mezop fishing party',                 count: '2d4',        difficulty: 'easy' },
      { roll: '8-9',   creature: 'Gilak coastal tribe (hostile)',       count: '2d6',        difficulty: 'challenging' },
      { roll: '10-11', creature: 'Korsar raiding boat (approaching)',   count: '1d6+4',      difficulty: 'challenging' },
      { roll: '12-13', creature: 'Sea reptile (giant, submerged)',      count: '1',          difficulty: 'deadly' },
      { roll: '14-15', creature: 'Tandor herd at watering beach',       count: '1d4',        difficulty: 'moderate' },
      { roll: '16-17', creature: 'Sagoth patrol from a Mahar outpost',  count: '1d6',        difficulty: 'challenging' },
      { roll: '18-19', creature: 'Storm rolling in off the Sojar Az',   count: '-',          difficulty: 'trivial' },
      { roll: '20',    creature: 'Mahar ritual site on an island',      count: '1d2 + 2d6', difficulty: 'deadly' }
    ]
  },
  {
    terrain: 'mahar-territory',
    description: 'The lands surrounding the great Mahar city of Phutra and its satellite outposts — well-patrolled by Sagoth guards, threaded by slave columns, and dotted with the ancient stone constructions of an alien civilization.',
    entries: [
      { roll: '1-3',   creature: 'Sagoth patrol',                       count: '2d4',        difficulty: 'moderate' },
      { roll: '4-5',   creature: 'Slave column (Gilak captives)',        count: '2d6 + 1d4', difficulty: 'challenging' },
      { roll: '6-7',   creature: 'Sagoth Slave Handler (Captain)',       count: '1 + 1d6',   difficulty: 'challenging' },
      { roll: '8-9',   creature: 'Escaped Gilak slaves (desperate)',     count: '1d4',        difficulty: 'easy' },
      { roll: '10-11', creature: 'Thipdar (Mahar messenger, aerial)',    count: '1',          difficulty: 'moderate' },
      { roll: '12-13', creature: 'Mahar (alone, scouting)',             count: '1',          difficulty: 'deadly' },
      { roll: '14-15', creature: 'Ancient stone trap (unmanned snare)', count: '-',          difficulty: 'moderate' },
      { roll: '16-17', creature: 'Ryth guarding a Mahar food cache',    count: '1',          difficulty: 'challenging' },
      { roll: '18-19', creature: 'Abandoned Mahar outpost (stripped clean)', count: '-',     difficulty: 'trivial' },
      { roll: '20',    creature: 'Mahar high council escort (2 Mahars + Sagoth honor guard)', count: '2 + 2d8', difficulty: 'deadly' }
    ]
  },
  {
    terrain: 'pellucidar-caves',
    description: 'The subterranean tunnels and caverns below Pellucidar — including the approaches to Phutra\'s buried empire. An airless, lightless underworld of dripping stone and ancient secrets where the ryth and horib rule.',
    entries: [
      { roll: '1-3',   creature: 'Ryth (cave bear)',                    count: '1',          difficulty: 'challenging' },
      { roll: '4-5',   creature: 'Horib ambush (from ceiling)',         count: '1d4',        difficulty: 'challenging' },
      { roll: '6-7',   creature: 'Jalok pack (hunting)',                count: '2d4',        difficulty: 'moderate' },
      { roll: '8-9',   creature: 'Sagoth underground patrol',           count: '1d6',        difficulty: 'moderate' },
      { roll: '10-11', creature: 'Gilak cave-dweller tribe',            count: '2d6',        difficulty: 'moderate' },
      { roll: '12-13', creature: 'Mahar feeding chamber (occupied)',    count: '1d2',        difficulty: 'deadly' },
      { roll: '14-15', creature: 'Giant cave beetles (harmless swarm)', count: '-',          difficulty: 'trivial' },
      { roll: '16-17', creature: 'Sagoth Captain with prisoner',        count: '1 + 1d4',   difficulty: 'challenging' },
      { roll: '18-19', creature: 'Collapsed tunnel (route blocked)',     count: '-',          difficulty: 'trivial' },
      { roll: '20',    creature: 'Mahar ritual chamber (mid-ceremony)', count: '1d3 + 2d6', difficulty: 'deadly' }
    ]
  },

  // ─── Barsoom Setting Encounter Tables ────────────────────────────────────────

  {
    terrain: 'barsoom-dead-sea',
    description: 'The Dead Sea Bottoms of Barsoom — vast dried ocean basins stretching between the city-states, littered with the ruins of ancient civilizations and roamed by Green Martian hordes, feral banths, and other predators.',
    entries: [
      { roll: '1-3',   creature: 'Banth (hunting)',                         count: '1d3',       difficulty: 'challenging' },
      { roll: '4-5',   creature: 'Wild thoat herd (startled)',              count: '2d4',       difficulty: 'moderate' },
      { roll: '6-7',   creature: 'Thark scouting party',                   count: '1d4+2',     difficulty: 'challenging' },
      { roll: '8-9',   creature: 'Warhoon raiding party (hostile)',         count: '2d6',       difficulty: 'deadly' },
      { roll: '10-11', creature: 'Ancient sea-bottom ruins (unmapped)',     count: '-',         difficulty: 'trivial' },
      { roll: '12-13', creature: 'Red Martian exile (alone, desperate)',    count: '1',         difficulty: 'easy' },
      { roll: '14-15', creature: 'Feral calot pack',                       count: '2d4',       difficulty: 'moderate' },
      { roll: '16-17', creature: 'Zodangan patrol (mounted on thoats)',     count: '1d4+2',     difficulty: 'challenging' },
      { roll: '18-19', creature: 'Dust storm rolling in (no creature)',     count: '-',         difficulty: 'trivial' },
      { roll: '20',    creature: 'Green Martian horde with Jeddak',         count: '2d10 + 1',  difficulty: 'deadly' }
    ]
  },
  {
    terrain: 'barsoom-city',
    description: 'The streets, gates, arena precincts, and immediate perimeter of a Barsoomian city-state — a labyrinth of towers, aerial docks, slave markets, and political intrigue where any faction can appear without warning.',
    entries: [
      { roll: '1-3',   creature: 'Zodangan patrol',                        count: '1d4+2',     difficulty: 'moderate' },
      { roll: '4-5',   creature: 'Red Martian civilians (witnesses)',       count: '2d6',       difficulty: 'easy' },
      { roll: '6-7',   creature: 'Thern spy (undercover)',                  count: '1',         difficulty: 'challenging' },
      { roll: '8-9',   creature: 'Assassin (hired)',                        count: '1d2',       difficulty: 'deadly' },
      { roll: '10-11', creature: 'Banth (escaped from arena pits)',         count: '1',         difficulty: 'deadly' },
      { roll: '12-13', creature: 'White Ape (escaped from arena)',          count: '1',         difficulty: 'deadly' },
      { roll: '14-15', creature: 'Heliumite officer patrol',               count: '1d4',       difficulty: 'easy' },
      { roll: '16-17', creature: 'First Born spy (disguised as pilgrim)',   count: '1',         difficulty: 'challenging' },
      { roll: '18-19', creature: 'Calot (abandoned, frightened)',           count: '1',         difficulty: 'easy' },
      { roll: '20',    creature: 'Zodangan assassination squad',            count: '1d4+4',     difficulty: 'deadly' }
    ]
  },
  {
    terrain: 'valley-dor',
    description: 'The Valley Dor at the end of the River Iss — Barsoom\'s holy land, revealed to be a trap. Pilgrims arrive believing in paradise; they find plant men, white apes, and the predatory First Born. Escaping the valley is considered impossible by all of Barsoomian civilization.',
    entries: [
      { roll: '1-3',   creature: 'Plant Men (hunting in the grove)',        count: '1d4',       difficulty: 'challenging' },
      { roll: '4-5',   creature: 'White Apes (loose in the valley)',        count: '1d2',       difficulty: 'deadly' },
      { roll: '6-7',   creature: 'Red Martian pilgrims (newly arrived)',    count: '2d6',       difficulty: 'easy' },
      { roll: '8-9',   creature: 'First Born raiding party',               count: '2d4',       difficulty: 'challenging' },
      { roll: '10-11', creature: 'Thern guards at a holy site',             count: '1d4+2',     difficulty: 'challenging' },
      { roll: '12-13', creature: 'Banth (valley-dweller)',                  count: '1',         difficulty: 'deadly' },
      { roll: '14-15', creature: 'Desperate pilgrims (trying to flee)',     count: '2d4',       difficulty: 'easy' },
      { roll: '16-17', creature: 'First Born galley on the River Iss',      count: '1d6+4',     difficulty: 'deadly' },
      { roll: '18-19', creature: 'Abandoned Thern ritual site',             count: '-',         difficulty: 'trivial' },
      { roll: '20',    creature: 'Thern council with First Born honor guard', count: '1d3 + 2d6', difficulty: 'deadly' }
    ]
  },
  {
    terrain: 'barsoom-aerial',
    description: 'Above Barsoom — encounters in the air aboard fliers or in the approach corridors of aerial docks. The Barsoomian sky is crossed by warships, scout vessels, and lone patrol craft from every faction.',
    entries: [
      { roll: '1-3',   creature: 'Zodangan patrol flier (scout)',           count: '1d4+4',     difficulty: 'moderate' },
      { roll: '4-5',   creature: 'Sky pirate vessel',                       count: '2d4',       difficulty: 'challenging' },
      { roll: '6-7',   creature: 'Damaged Heliumite flier (survivors)',     count: '1d4',       difficulty: 'easy' },
      { roll: '8-9',   creature: 'First Born battle cruiser on raid',       count: '2d6+4',     difficulty: 'deadly' },
      { roll: '10-11', creature: 'Atmospheric storm cell (no creature)',    count: '-',         difficulty: 'trivial' },
      { roll: '12-13', creature: 'Captured Thark war-flier',               count: '1d6',       difficulty: 'challenging' },
      { roll: '14-15', creature: 'Thern aerial yacht (diplomatic mission)', count: '1d3 + 1d4', difficulty: 'challenging' },
      { roll: '16-17', creature: 'Red Martian merchant convoy',             count: '2d4',       difficulty: 'easy' },
      { roll: '18-19', creature: 'Drifting wreckage (no survivors)',        count: '-',         difficulty: 'trivial' },
      { roll: '20',    creature: 'Zodangan war fleet (multiple vessels)',   count: '1d4 fliers', difficulty: 'deadly' }
    ]
  }
];
