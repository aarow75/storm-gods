import { Monster } from '../models/monster.model';

export const MONSTERS: Monster[] = [
  // RUNEQUEST MONSTERS
  {
    id: 'broo',
    name: 'Broo',
    gameSystem: 'runequest',
    category: 'chaos',
    description: 'A chaotic humanoid beast with demonic features. Broos are servants of chaos and carry disease. They are cunning warriors and often serve as mercenaries or raiders.',
    stats: { STR: 12, CON: 12, SIZ: 13, DEX: 10, INT: 8, POW: 12, CHA: 5 },
    hitPoints: 13,
    armor: 1,
    armorDescription: 'hide',
    movement: 8,
    attacks: [
      { name: 'Spear', damage: '1d6+2', skill: 45 },
      { name: 'Headbutt', damage: '1d4+2', skill: 35 }
    ],
    specialAbilities: ['Disease carrier', 'Chaos taint', 'Dark vision']
  },
  {
    id: 'dark_troll',
    name: 'Dark Troll (Uz)',
    gameSystem: 'runequest',
    category: 'humanoid',
    description: 'A large, subterranean humanoid covered in warty, blue-black skin. Dark trolls are incredibly tough and dangerous in combat, serving as powerful warriors and leaders of Uz tribes.',
    stats: { STR: 17, CON: 15, SIZ: 18, DEX: 12, INT: 10, POW: 11, CHA: 8 },
    hitPoints: 17,
    armor: 2,
    armorDescription: 'thick skin + armor',
    movement: 8,
    attacks: [
      { name: 'Maul (2-handed)', damage: '2d6+2', skill: 55 },
      { name: 'Bite', damage: '1d6+2', skill: 45 },
      { name: 'Club', damage: '1d8+2', skill: 50 }
    ],
    specialAbilities: ['Darksense', 'Night vision', 'Regenerate (1 HP per round)', 'Troll stench']
  },
  {
    id: 'griffin',
    name: 'Griffin',
    gameSystem: 'runequest',
    category: 'beast',
    description: 'A majestic flying creature with the body of a lion and the head and wings of an eagle. Griffins are apex predators and incredibly dangerous in aerial combat.',
    stats: { STR: 25, CON: 16, SIZ: 30, DEX: 14, INT: 6, POW: 14, CHA: 10 },
    hitPoints: 23,
    armor: 4,
    armorDescription: 'feathered hide',
    movement: 12,
    attacks: [
      { name: 'Claw (front left)', damage: '1d8+5', skill: 50 },
      { name: 'Claw (front right)', damage: '1d8+5', skill: 50 },
      { name: 'Bite', damage: '2d6+5', skill: 45 },
      { name: 'Talons (rear)', damage: '1d6+5', skill: 55 }
    ],
    specialAbilities: ['Flight (18m)', 'Keen vision', 'Deadly dive attack'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'scorpion_man',
    name: 'Scorpion Man (Baggi)',
    gameSystem: 'runequest',
    category: 'humanoid',
    description: 'A hybrid creature with a humanoid upper body and a scorpion\'s lower body complete with a venomous tail. Scorpion men are skilled warriors and deadly combatants.',
    stats: { STR: 16, CON: 16, SIZ: 22, DEX: 10, INT: 8, POW: 12, CHA: 6 },
    hitPoints: 19,
    armor: 4,
    armorDescription: 'chitin',
    movement: 10,
    attacks: [
      { name: 'Sting (tail)', damage: '1d6+2 + venom', skill: 50 },
      { name: 'Claws (x2)', damage: '1d4+2', skill: 60 },
      { name: 'Bite', damage: '1d3+2', skill: 40 }
    ],
    specialAbilities: ['Venomous sting (1d3 poison damage)', 'Multi-limb attacks', 'Armored body'],
    hitLocationTemplateId: 'scorpion_man'
  },
  {
    id: 'centaur',
    name: 'Centaur',
    gameSystem: 'runequest',
    category: 'humanoid',
    description: 'A noble warrior with the upper body of a human and the lower body of a horse. Centaurs are skilled archers and spear fighters, known for their honor and wisdom.',
    stats: { STR: 18, CON: 16, SIZ: 24, DEX: 14, INT: 11, POW: 12, CHA: 12 },
    hitPoints: 20,
    armor: 2,
    armorDescription: 'leather armor',
    movement: 14,
    attacks: [
      { name: 'Shortbow', damage: '1d6+2', skill: 65 },
      { name: 'Spear', damage: '1d8+3', skill: 60 },
      { name: 'Kick (rear legs)', damage: '1d6+3', skill: 45 }
    ],
    specialAbilities: ['Mounted combat superiority', 'Exceptional movement', 'Multi-attack capability'],
    hitLocationTemplateId: 'centaur'
  },
  {
    id: 'baboon',
    name: 'Baboon',
    gameSystem: 'runequest',
    category: 'beast',
    description: 'A large, strong primate found in the grasslands. Baboons are intelligent, social creatures that hunt in packs and can be quite dangerous when provoked.',
    stats: { STR: 10, CON: 12, SIZ: 10, DEX: 14, INT: 8, POW: 11, CHA: 7 },
    hitPoints: 11,
    armor: 1,
    armorDescription: 'hide',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d6', skill: 45 },
      { name: 'Fist', damage: '1d4', skill: 40 },
      { name: 'Claw', damage: '1d3', skill: 35 }
    ],
    specialAbilities: ['Pack tactics', 'Climbing', 'Tribal intelligence'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'giant_spider',
    name: 'Giant Spider',
    gameSystem: 'runequest',
    category: 'beast',
    description: 'An enormous arachnid the size of a horse. Giant spiders spin webs of incredible strength and possess venom potent enough to incapacitate larger creatures.',
    stats: { STR: 10, CON: 12, SIZ: 12, DEX: 16, INT: 4, POW: 9, CHA: 3 },
    hitPoints: 12,
    armor: 2,
    armorDescription: 'chitin',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d6 + venom', skill: 55 },
      { name: 'Web entangle', damage: 'Special', skill: 45 }
    ],
    specialAbilities: ['Venomous bite (1d3 poison)', 'Web creation', 'Climbing', 'Darkvision'],
    hitLocationTemplateId: 'giant_spider'
  },
  {
    id: 'mostali_dwarf',
    name: 'Mostali Dwarf',
    gameSystem: 'runequest',
    category: 'humanoid',
    description: 'An artificially created dwarf warrior from an ancient underground civilization. Mostali are tough, mechanically gifted, and excellent craftspeople with an affinity for stone and metal magic.',
    stats: { STR: 14, CON: 18, SIZ: 10, DEX: 12, INT: 16, POW: 12, CHA: 8 },
    hitPoints: 14,
    armor: 5,
    armorDescription: 'plate mail',
    movement: 8,
    attacks: [
      { name: 'Crossbow', damage: '1d8+1', skill: 70 },
      { name: 'Warhammer', damage: '2d4+1', skill: 65 },
      { name: 'Dagger', damage: '1d4+1', skill: 50 }
    ],
    specialAbilities: ['Stoneworking mastery', 'Mechanical knowledge', 'Magical affinity']
  },
  {
    id: 'hsunchen',
    name: 'Hsunchen (Wolf Brother)',
    gameSystem: 'runequest',
    category: 'humanoid',
    description: 'A primal shapeshifter bound to the wolf spirit. Hsunchen are fierce warriors who can transform into wolves to gain tactical advantages in combat.',
    stats: { STR: 14, CON: 14, SIZ: 12, DEX: 16, INT: 10, POW: 13, CHA: 10 },
    hitPoints: 13,
    armor: 1,
    armorDescription: 'leather',
    movement: 10,
    attacks: [
      { name: 'Spear', damage: '1d6+1', skill: 60 },
      { name: 'Bite (wolf form)', damage: '1d6+1', skill: 70 },
      { name: 'Claw (wolf form)', damage: '1d4+1', skill: 65 }
    ],
    specialAbilities: ['Shapeshifting (wolf)', 'Enhanced smell/hearing', 'Pack bonding']
  },
  {
    id: 'runequest_skeleton',
    name: 'Skeleton (Runequest)',
    gameSystem: 'runequest',
    category: 'undead',
    description: 'A skeletal warrior animated by dark magic. Skeletons are mindless servants, though some may retain combat skills from their past lives.',
    stats: { STR: 10, CON: 0, SIZ: 13, DEX: 10, INT: 3, POW: 6, CHA: 0 },
    hitPoints: 6,
    armor: 0,
    armorDescription: 'none',
    movement: 8,
    attacks: [
      { name: 'Sword', damage: '1d6', skill: 35 },
      { name: 'Spear', damage: '1d6+1', skill: 30 }
    ],
    specialAbilities: ['Undead', 'Immune to disease/poison', 'Half damage from piercing weapons']
  },
  {
    id: 'erinys',
    name: 'Erinys (Demon)',
    gameSystem: 'runequest',
    category: 'chaos',
    description: 'A demonic servant of chaos with wings and infernal power. Erinys are cunning spellcasters and combat specialists with inherent magical abilities.',
    stats: { STR: 15, CON: 14, SIZ: 11, DEX: 16, INT: 14, POW: 16, CHA: 13 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'demonic hide',
    movement: 8,
    attacks: [
      { name: 'Claw (x2)', damage: '1d6+1', skill: 55 },
      { name: 'Bite', damage: '1d4+1', skill: 45 },
      { name: 'Magic missile', damage: 'd6+1', skill: 60 }
    ],
    specialAbilities: ['Detect magic', 'Resist spells (50%)', 'Fly', 'Chaos affinity']
  },

  // DRAGONBANE MONSTERS
  {
    id: 'goblin',
    name: 'Goblin',
    gameSystem: 'dragonbane',
    category: 'humanoid',
    description: 'A small, mischievous humanoid known for cunning and cruelty. Goblins are weak individually but often hunt in packs, using ambush tactics and simple weapons.',
    stats: { STR: 8, CON: 10, SIZ: 8, DEX: 14, INT: 8, POW: 8, CHA: 6 },
    hitPoints: 8,
    armor: 1,
    armorDescription: 'leather scraps',
    movement: 10,
    attacks: [
      { name: 'Short sword', damage: '1d4', skill: 40 },
      { name: 'Thrown rock', damage: '1d3', skill: 35 }
    ],
    specialAbilities: ['Pack tactics', 'Ambush', 'Darkvision']
  },
  {
    id: 'skeleton_warrior',
    name: 'Skeleton Warrior',
    gameSystem: 'dragonbane',
    category: 'undead',
    description: 'An undead warrior bound by dark magic to fight for an evil master. Skeleton warriors are disciplined and retain combat training from their mortal lives.',
    stats: { STR: 10, CON: 0, SIZ: 12, DEX: 10, INT: 0, POW: 6, CHA: 0 },
    hitPoints: 6,
    armor: 1,
    armorDescription: 'corroded armor scraps',
    movement: 8,
    attacks: [
      { name: 'Rusty sword', damage: '1d6', skill: 35 },
      { name: 'Broken shield bash', damage: '1d4', skill: 20 }
    ],
    specialAbilities: ['Undead immunity', 'No pain threshold', 'Immune to mind effects']
  },
  {
    id: 'zombie',
    name: 'Zombie',
    gameSystem: 'dragonbane',
    category: 'undead',
    description: 'A decaying corpse animated by dark magic. Zombies are slow but relentless, disease-ridden, and capable of spreading infection through their bites.',
    stats: { STR: 12, CON: 14, SIZ: 14, DEX: 6, INT: 0, POW: 4, CHA: 0 },
    hitPoints: 14,
    armor: 0,
    armorDescription: 'rotting flesh',
    movement: 6,
    attacks: [
      { name: 'Claw', damage: '1d4+1 + disease', skill: 40 },
      { name: 'Bite', damage: '1d6 + disease', skill: 35 }
    ],
    specialAbilities: ['Disease carrier', 'Slow but relentless', 'Immune to pain']
  },
  {
    id: 'orc_warrior',
    name: 'Orc Warrior',
    gameSystem: 'dragonbane',
    category: 'humanoid',
    description: 'A fierce warrior of the orc people, known for strength and ferocity in battle. Orc warriors are skilled with heavy weapons and often work as mercenaries or raiders.',
    stats: { STR: 16, CON: 14, SIZ: 14, DEX: 12, INT: 8, POW: 9, CHA: 7 },
    hitPoints: 14,
    armor: 3,
    armorDescription: 'chainmail',
    movement: 10,
    attacks: [
      { name: 'Battle axe', damage: '1d10+1', skill: 55 },
      { name: 'Shortbow', damage: '1d6', skill: 45 },
      { name: 'Hand axe', damage: '1d6+1', skill: 50 }
    ],
    specialAbilities: ['Cleave attack', 'Intimidating shout', 'Exceptional strength']
  },
  {
    id: 'giant_wolf',
    name: 'Giant Wolf',
    gameSystem: 'dragonbane',
    category: 'beast',
    description: 'An enormous predatory wolf, three times the size of a normal wolf. Giant wolves are apex predators found in wild lands and often serve as mounts for mounted warriors.',
    stats: { STR: 16, CON: 14, SIZ: 18, DEX: 14, INT: 4, POW: 8, CHA: 5 },
    hitPoints: 16,
    armor: 1,
    armorDescription: 'thick fur',
    movement: 14,
    attacks: [
      { name: 'Bite', damage: '1d8+2', skill: 60 },
      { name: 'Claw', damage: '1d6+2', skill: 45 },
      { name: 'Tackle', damage: '1d6+1', skill: 40 }
    ],
    specialAbilities: ['Pack hunting', 'Exceptional speed', 'Keen smell', 'Darkvision']
  },
  {
    id: 'minotaur',
    name: 'Minotaur',
    gameSystem: 'dragonbane',
    category: 'humanoid',
    description: 'A fearsome creature with the body of a man and the head of a bull. Minotaurs are incredibly strong and dangerous, often guarding dark places or serving as arena fighters.',
    stats: { STR: 22, CON: 18, SIZ: 22, DEX: 10, INT: 6, POW: 10, CHA: 5 },
    hitPoints: 20,
    armor: 2,
    armorDescription: 'thick hide',
    movement: 10,
    attacks: [
      { name: 'Great axe', damage: '2d6+3', skill: 60 },
      { name: 'Gore (horns)', damage: '1d8+3', skill: 50 },
      { name: 'Trample', damage: '1d10+3', skill: 45 }
    ],
    specialAbilities: ['Charge attack', 'Labyrinth navigation', 'Rage mode']
  },
  {
    id: 'ghost',
    name: 'Ghost',
    gameSystem: 'dragonbane',
    category: 'spirit',
    description: 'The restless spirit of a deceased person, bound to the mortal world by unfinished business or dark magic. Ghosts are incorporeal and immune to physical weapons.',
    stats: { STR: 0, CON: 0, SIZ: 12, DEX: 12, INT: 10, POW: 16, CHA: 8 },
    hitPoints: 8,
    armor: 0,
    armorDescription: 'incorporeal',
    movement: 10,
    attacks: [
      { name: 'Drain life', damage: 'special', skill: 50 },
      { name: 'Terrifying howl', damage: 'fear', skill: 45 }
    ],
    specialAbilities: ['Incorporeal (immune to physical)', 'Phase through walls', 'Cold aura', 'Life drain']
  },
  {
    id: 'dire_bear',
    name: 'Dire Bear',
    gameSystem: 'dragonbane',
    category: 'beast',
    description: 'A colossal predatory bear, twice the size of a normal bear with exceptional strength and ferocity. Dire bears are nearly unstoppable in combat.',
    stats: { STR: 28, CON: 22, SIZ: 28, DEX: 10, INT: 4, POW: 9, CHA: 5 },
    hitPoints: 25,
    armor: 3,
    armorDescription: 'thick fur + hide',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '2d6+4', skill: 60 },
      { name: 'Claw (left)', damage: '1d10+4', skill: 55 },
      { name: 'Claw (right)', damage: '1d10+4', skill: 55 },
      { name: 'Hug/Crush', damage: '2d6+3', skill: 45 }
    ],
    specialAbilities: ['Exceptional strength', 'Thick hide', 'Terrifying roar', 'Hibernation immunity']
  },
  {
    id: 'young_dragon',
    name: 'Young Dragon',
    gameSystem: 'dragonbane',
    category: 'dragon',
    description: 'A juvenile dragon of immense power. Though smaller than an adult dragon, a young dragon is still a legendary threat with fire breath, magical abilities, and flight.',
    stats: { STR: 24, CON: 20, SIZ: 26, DEX: 12, INT: 14, POW: 18, CHA: 12 },
    hitPoints: 23,
    armor: 8,
    armorDescription: 'adamantine scales',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '2d6+4', skill: 65 },
      { name: 'Claw (x2)', damage: '1d10+4', skill: 60 },
      { name: 'Fire breath', damage: '2d6', skill: 70 },
      { name: 'Tail sweep', damage: '1d10+4', skill: 50 }
    ],
    specialAbilities: ['Flight (16m)', 'Fire breath', 'Fire immunity', 'Magic resistance', 'Legendary power']
  },
  {
    id: 'hobgoblin_chief',
    name: 'Hobgoblin Chief',
    gameSystem: 'dragonbane',
    category: 'humanoid',
    description: 'A powerful leader of the hobgoblin tribes, distinguished by combat prowess and tactical intelligence. Hobgoblin chiefs often lead raids and command respect through sheer martial skill.',
    stats: { STR: 14, CON: 14, SIZ: 14, DEX: 12, INT: 11, POW: 10, CHA: 10 },
    hitPoints: 14,
    armor: 4,
    armorDescription: 'heavy leather + shield',
    movement: 10,
    attacks: [
      { name: 'Longsword', damage: '1d8+1', skill: 60 },
      { name: 'Shortbow', damage: '1d6', skill: 50 },
      { name: 'Shield bash', damage: '1d4', skill: 45 }
    ],
    specialAbilities: ['Tactical command', 'Leadership', 'Intimidation']
  },

  // BOTH SYSTEMS
  {
    id: 'giant_rat',
    name: 'Giant Rat',
    gameSystem: 'both',
    category: 'beast',
    description: 'An enormous rat, the size of a large dog. Giant rats are found in dungeons and sewers, hunting in packs and capable of inflicting nasty wounds with their teeth and claws.',
    stats: { STR: 5, CON: 8, SIZ: 4, DEX: 14, INT: 3, POW: 7, CHA: 3 },
    hitPoints: 6,
    armor: 0,
    armorDescription: 'none',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d4', skill: 35 },
      { name: 'Claw', damage: '1d3', skill: 30 }
    ],
    specialAbilities: ['Pack hunting', 'Disease carrier', 'Excellent sense of smell']
  },
  {
    id: 'vampire',
    name: 'Vampire',
    gameSystem: 'both',
    category: 'undead',
    description: 'An undead creature that feeds on the life force of the living. Vampires are intelligent, powerful spellcasters with exceptional combat abilities and supernatural powers.',
    stats: { STR: 18, CON: 0, SIZ: 13, DEX: 16, INT: 16, POW: 18, CHA: 15 },
    hitPoints: 13,
    armor: 0,
    armorDescription: 'undead invulnerability',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d6 + life drain', skill: 65 },
      { name: 'Claw (x2)', damage: '1d6+2', skill: 60 },
      { name: 'Magic missile', damage: '1d6+2', skill: 70 }
    ],
    specialAbilities: ['Life drain', 'Undead', 'Shapeshifting', 'Charm ability', 'Regeneration', 'Sunlight vulnerability']
  },

  // WILDERNESS CREATURES - BEASTS
  {
    id: 'bear',
    name: 'Bear',
    gameSystem: 'both',
    category: 'beast',
    rarity: 'common',
    terrain: ['forest', 'mountains', 'hills'],
    description: 'A large carnivorous mammal found in forests and mountains. Bears are powerful predators with exceptional strength, sharp claws, and keen senses.',
    stats: { STR: 20, CON: 18, SIZ: 20, DEX: 10, INT: 4, POW: 10, CHA: 5 },
    hitPoints: 19,
    armor: 2,
    armorDescription: 'thick fur and hide',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d8+3', skill: 50 },
      { name: 'Claw (left)', damage: '1d8+3', skill: 55 },
      { name: 'Claw (right)', damage: '1d8+3', skill: 55 },
      { name: 'Hug/Crush', damage: '2d6+2', skill: 40 }
    ],
    specialAbilities: ['Exceptional strength', 'Keen smell', 'Territorial', 'Hibernation']
  },
  {
    id: 'dire_wolf',
    name: 'Dire Wolf',
    gameSystem: 'both',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['forest', 'plains', 'tundra'],
    description: 'An enormous predatory wolf, twice the size of a normal wolf with enhanced strength and ferocity. Dire wolves often hunt in packs and are a serious threat to travelers.',
    stats: { STR: 18, CON: 16, SIZ: 20, DEX: 14, INT: 5, POW: 9, CHA: 6 },
    hitPoints: 18,
    armor: 1,
    armorDescription: 'thick fur',
    movement: 14,
    attacks: [
      { name: 'Bite', damage: '1d10+2', skill: 60 },
      { name: 'Claw', damage: '1d6+2', skill: 50 },
      { name: 'Tackle', damage: '1d6+1', skill: 45 }
    ],
    specialAbilities: ['Pack hunting', 'Exceptional speed', 'Keen smell', 'Darkvision', 'Howl (intimidation)']
  },
  {
    id: 'lion',
    name: 'Lion',
    gameSystem: 'both',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['plains', 'savanna', 'desert'],
    description: 'A massive feline predator with tawny fur and, for males, an impressive mane. Lions are apex predators of open grasslands, hunting with cunning and group tactics.',
    stats: { STR: 22, CON: 18, SIZ: 22, DEX: 14, INT: 5, POW: 10, CHA: 8 },
    hitPoints: 20,
    armor: 1,
    armorDescription: 'thick fur',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d10+3', skill: 60 },
      { name: 'Claw (left)', damage: '1d8+3', skill: 55 },
      { name: 'Claw (right)', damage: '1d8+3', skill: 55 },
      { name: 'Tackle', damage: '1d8+2', skill: 50 }
    ],
    specialAbilities: ['Pride hunting', 'Exceptional strength', 'Keen senses', 'Territorial roar']
  },
  {
    id: 'rock_lizard',
    name: 'Rock Lizard',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['mountains', 'hills', 'desert'],
    description: 'A large lizard with stone-like hide that camouflages it perfectly against rocky terrain. Rock lizards are carnivorous ambush predators with powerful jaws.',
    stats: { STR: 16, CON: 16, SIZ: 14, DEX: 10, INT: 2, POW: 8, CHA: 3 },
    hitPoints: 15,
    armor: 4,
    armorDescription: 'rocky hide',
    movement: 8,
    attacks: [
      { name: 'Bite', damage: '1d8+2', skill: 55 },
      { name: 'Claw', damage: '1d6+2', skill: 45 },
      { name: 'Tail whip', damage: '1d6+1', skill: 40 }
    ],
    specialAbilities: ['Camouflage (rocky terrain)', 'Ambush predator', 'Stone affinity']
  },
  {
    id: 'rubble_runner',
    name: 'Rubble Runner',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'common',
    terrain: ['mountains', 'ruins', 'hills'],
    description: 'A fast, lizard-like creature that scurries across rubble and broken terrain. Rubble runners are omnivorous scavengers that occasionally hunt in packs.',
    stats: { STR: 8, CON: 10, SIZ: 6, DEX: 16, INT: 3, POW: 7, CHA: 4 },
    hitPoints: 8,
    armor: 1,
    armorDescription: 'tough hide',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d4+1', skill: 40 },
      { name: 'Claw', damage: '1d3+1', skill: 35 }
    ],
    specialAbilities: ['Fast movement', 'Climbing', 'Scavenging instinct', 'Pack coordination']
  },
  {
    id: 'dragonewt',
    name: 'Dragonewt',
    gameSystem: 'runequest',
    category: 'humanoid',
    rarity: 'uncommon',
    terrain: ['mountains', 'caves', 'desert'],
    description: 'A draconic humanoid standing upright, covered in scales and possessing a reptilian tail. Dragonewts are organized in castes and possess inherent magical abilities tied to draconic power.',
    stats: { STR: 15, CON: 14, SIZ: 14, DEX: 13, INT: 12, POW: 14, CHA: 11 },
    hitPoints: 14,
    armor: 3,
    armorDescription: 'draconic scales',
    movement: 10,
    attacks: [
      { name: 'Claw', damage: '1d6+2', skill: 50 },
      { name: 'Bite', damage: '1d4+2', skill: 45 },
      { name: 'Tail strike', damage: '1d6+1', skill: 40 },
      { name: 'Breath weapon', damage: '1d6', skill: 55 }
    ],
    specialAbilities: ['Draconic scales', 'Breath weapon (fire/cold)', 'Magical affinity', 'Tail combat']
  },
  {
    id: 'horse',
    name: 'Horse',
    gameSystem: 'both',
    category: 'mount',
    rarity: 'common',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A domesticated equine used for transportation, agriculture, and combat. Horses are strong, fast, and responsive to training, making them invaluable companions.',
    stats: { STR: 18, CON: 16, SIZ: 18, DEX: 12, INT: 6, POW: 9, CHA: 7 },
    hitPoints: 17,
    armor: 0,
    armorDescription: 'none (can wear barding)',
    movement: 14,
    attacks: [
      { name: 'Bite', damage: '1d4', skill: 30 },
      { name: 'Kick (rear)', damage: '1d6', skill: 45 },
      { name: 'Trample', damage: '1d8', skill: 40 }
    ],
    specialAbilities: ['Fast movement', 'Keen senses', 'Bond with rider', 'Endurance']
  },
  {
    id: 'war_horse',
    name: 'War Horse',
    gameSystem: 'both',
    category: 'mount',
    rarity: 'uncommon',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A heavily trained and conditioned horse bred for battle. War horses are larger, more aggressive, and better armored than common horses.',
    stats: { STR: 20, CON: 18, SIZ: 20, DEX: 12, INT: 6, POW: 10, CHA: 8 },
    hitPoints: 19,
    armor: 3,
    armorDescription: 'heavy barding and leather',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d6', skill: 35 },
      { name: 'Kick (rear)', damage: '1d8', skill: 50 },
      { name: 'Trample', damage: '1d10', skill: 45 }
    ],
    specialAbilities: ['Combat training', 'Armored', 'Exceptional strength', 'Brave in battle']
  },
  {
    id: 'dinosaur_allosaurus',
    name: 'Allosaurus',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'rare',
    terrain: ['jungle', 'lost_valley', 'ancient_ruins'],
    description: 'A massive carnivorous dinosaur with powerful hind legs, small arms with claws, and razor-sharp teeth. Allosaurs are apex predators that hunt large prey.',
    stats: { STR: 24, CON: 18, SIZ: 26, DEX: 12, INT: 2, POW: 9, CHA: 4 },
    hitPoints: 22,
    armor: 2,
    armorDescription: 'thick hide',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '2d8+4', skill: 60 },
      { name: 'Claw (left)', damage: '1d10+4', skill: 55 },
      { name: 'Claw (right)', damage: '1d10+4', skill: 55 },
      { name: 'Tail sweep', damage: '1d10+3', skill: 50 }
    ],
    specialAbilities: ['Exceptional strength', 'Pack hunting', 'Keen sight', 'Terrifying roar']
  },
  {
    id: 'dinosaur_triceratops',
    name: 'Triceratops',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'rare',
    terrain: ['jungle', 'lost_valley', 'grasslands'],
    description: 'A large herbivorous dinosaur with three massive horns and a bony frill protecting its neck. Despite being herbivorous, triceratops are territorial and extremely dangerous.',
    stats: { STR: 26, CON: 20, SIZ: 28, DEX: 10, INT: 2, POW: 8, CHA: 5 },
    hitPoints: 24,
    armor: 3,
    armorDescription: 'thick hide and bone frill',
    movement: 10,
    attacks: [
      { name: 'Gore (horns)', damage: '2d8+4', skill: 55 },
      { name: 'Trample', damage: '1d12+4', skill: 50 },
      { name: 'Frill bash', damage: '1d10+4', skill: 45 }
    ],
    specialAbilities: ['Exceptional strength', 'Charge attack', 'Territorial defense', 'Armored body']
  },
  {
    id: 'dinosaur_stegosaurus',
    name: 'Stegosaurus',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'rare',
    terrain: ['jungle', 'lost_valley', 'grasslands'],
    description: 'A large herbivorous dinosaur with a row of large bony plates along its back and a spiked tail. Despite being herbivorous, stegosaurs are dangerous when threatened.',
    stats: { STR: 24, CON: 18, SIZ: 24, DEX: 8, INT: 2, POW: 7, CHA: 4 },
    hitPoints: 21,
    armor: 4,
    armorDescription: 'thick hide and bone plates',
    movement: 8,
    attacks: [
      { name: 'Tail spike strike', damage: '2d6+4', skill: 50 },
      { name: 'Trample', damage: '1d10+4', skill: 45 },
      { name: 'Headbutt', damage: '1d8+4', skill: 40 }
    ],
    specialAbilities: ['Armored back', 'Dangerous tail', 'Slow but powerful', 'Herbivore instinct']
  },
  {
    id: 'dinosaur_velociraptor',
    name: 'Velociraptor',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['jungle', 'lost_valley', 'forest'],
    description: 'A small but deadly predatory dinosaur with sharp teeth, powerful hind legs, and curved claws. Velociraptors hunt in coordinated packs with cunning tactics.',
    stats: { STR: 12, CON: 12, SIZ: 10, DEX: 16, INT: 5, POW: 8, CHA: 5 },
    hitPoints: 11,
    armor: 1,
    armorDescription: 'tough hide',
    movement: 13,
    attacks: [
      { name: 'Bite', damage: '1d6+1', skill: 55 },
      { name: 'Claw kick', damage: '1d8+1', skill: 60 },
      { name: 'Claw (left)', damage: '1d6+1', skill: 50 }
    ],
    specialAbilities: ['Pack hunting', 'Fast movement', 'Keen intelligence', 'Coordinated tactics']
  },
  {
    id: 'dinosaur_brachiosaurus',
    name: 'Brachiosaurus',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'rare',
    terrain: ['jungle', 'lost_valley'],
    description: 'An enormous long-necked herbivorous dinosaur. Though peaceful, a brachiosaurus can cause tremendous damage through sheer size and mass if provoked.',
    stats: { STR: 30, CON: 22, SIZ: 32, DEX: 6, INT: 2, POW: 7, CHA: 6 },
    hitPoints: 27,
    armor: 2,
    armorDescription: 'thick hide',
    movement: 8,
    attacks: [
      { name: 'Trample', damage: '2d10+5', skill: 45 },
      { name: 'Tail whip', damage: '2d8+5', skill: 40 },
      { name: 'Headbutt', damage: '1d10+5', skill: 35 }
    ],
    specialAbilities: ['Exceptional size', 'Crushing power', 'Long reach', 'Herbivore temperament']
  },

  // WILDERNESS NPCs
  {
    id: 'nomad_tribesman',
    name: 'Nomadic Tribesman',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'common',
    terrain: ['plains', 'grasslands', 'desert', 'mountains'],
    description: 'A member of a nomadic tribe adapted to harsh wilderness living. Nomads are skilled hunters, horsemen, and warriors with deep knowledge of the lands they traverse.',
    stats: { STR: 14, CON: 14, SIZ: 13, DEX: 13, INT: 10, POW: 11, CHA: 10 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'leather armor',
    movement: 10,
    attacks: [
      { name: 'Shortbow', damage: '1d6+1', skill: 60 },
      { name: 'Spear or Javelin', damage: '1d6+1', skill: 55 },
      { name: 'Club or Mace', damage: '1d6+1', skill: 50 }
    ],
    specialAbilities: ['Horsemanship', 'Tracking', 'Desert/plains navigation', 'Group tactics']
  },
  {
    id: 'wandering_priest',
    name: 'Wandering Priest',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'temples', 'forests'],
    description: 'A holy person devoted to a deity, traveling the roads to spread faith, perform ceremonies, and help the faithful. Wandering priests possess magical abilities and moral authority.',
    stats: { STR: 12, CON: 13, SIZ: 12, DEX: 11, INT: 14, POW: 15, CHA: 13 },
    hitPoints: 12,
    armor: 1,
    armorDescription: 'robes (minimal protection)',
    movement: 10,
    attacks: [
      { name: 'Staff', damage: '1d6', skill: 40 },
      { name: 'Holy smite (magic)', damage: '1d6+2', skill: 50 },
      { name: 'Fists', damage: '1d3', skill: 25 }
    ],
    specialAbilities: ['Divine magic', 'Healing', 'Holy protection', 'Moral authority', 'Knowledge of theology']
  },
  {
    id: 'merchant_caravan_leader',
    name: 'Merchant (Caravan Leader)',
    gameSystem: 'both',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'plains'],
    description: 'A seasoned trader who leads merchant caravans across dangerous roads. Caravan leaders are shrewd negotiators, skilled in trade and combat to protect their goods.',
    stats: { STR: 13, CON: 13, SIZ: 13, DEX: 12, INT: 14, POW: 11, CHA: 14 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'leather armor',
    movement: 10,
    attacks: [
      { name: 'Sword', damage: '1d8', skill: 50 },
      { name: 'Dagger', damage: '1d4+1', skill: 45 },
      { name: 'Whip', damage: '1d4', skill: 40 }
    ],
    specialAbilities: ['Negotiation', 'Trade expertise', 'Caravan command', 'Bodyguard experience', 'Merchant knowledge']
  },
  {
    id: 'bandit_outlaw',
    name: 'Bandit/Outlaw',
    gameSystem: 'both',
    category: 'npc',
    rarity: 'common',
    terrain: ['roads', 'forests', 'mountains', 'ruins'],
    description: 'A desperate criminal making a living by preying on travelers and settlements. Bandits are cunning, quick to violence, and often organized in groups.',
    stats: { STR: 14, CON: 12, SIZ: 12, DEX: 13, INT: 9, POW: 10, CHA: 9 },
    hitPoints: 12,
    armor: 2,
    armorDescription: 'worn leather armor',
    movement: 10,
    attacks: [
      { name: 'Sword', damage: '1d8', skill: 50 },
      { name: 'Shortbow', damage: '1d6', skill: 45 },
      { name: 'Dagger', damage: '1d4+1', skill: 40 }
    ],
    specialAbilities: ['Ambush tactics', 'Teamwork', 'Quick thinking', 'Survival skills']
  },
  {
    id: 'hermit_scholar',
    name: 'Hermit/Scholar',
    gameSystem: 'both',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'caves', 'settlements'],
    description: 'A solitary individual who has retreated from society to pursue knowledge, faith, or asceticism. Hermits are often sources of ancient wisdom but can be unpredictable.',
    stats: { STR: 10, CON: 12, SIZ: 11, DEX: 10, INT: 16, POW: 14, CHA: 11 },
    hitPoints: 11,
    armor: 0,
    armorDescription: 'none',
    movement: 9,
    attacks: [
      { name: 'Staff', damage: '1d6', skill: 35 },
      { name: 'Magic missile', damage: '1d4+1', skill: 45 },
      { name: 'Fists', damage: '1d3', skill: 20 }
    ],
    specialAbilities: ['Magic knowledge', 'Scholarly wisdom', 'Meditation', 'Ancient lore']
  },
  {
    id: 'ranger_bounty_hunter',
    name: 'Ranger/Bounty Hunter',
    gameSystem: 'both',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'plains', 'wilderness'],
    description: 'A skilled tracker and hunter who pursues prey through wilderness or settles disputes through combat. Rangers are excellent scouts with survival expertise.',
    stats: { STR: 15, CON: 15, SIZ: 13, DEX: 15, INT: 12, POW: 12, CHA: 11 },
    hitPoints: 14,
    armor: 2,
    armorDescription: 'leather armor',
    movement: 11,
    attacks: [
      { name: 'Bow', damage: '1d8+1', skill: 65 },
      { name: 'Sword', damage: '1d8', skill: 55 },
      { name: 'Dagger', damage: '1d4+1', skill: 50 }
    ],
    specialAbilities: ['Tracking', 'Wilderness survival', 'Keen senses', 'Stealth', 'Animal handling']
  },
  {
    id: 'noble_traveler',
    name: 'Noble/Traveler',
    gameSystem: 'both',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'estates'],
    description: 'A person of noble birth traveling for adventure, politics, or exile. Nobles command respect through lineage and wealth, often employing bodyguards.',
    stats: { STR: 13, CON: 13, SIZ: 13, DEX: 12, INT: 14, POW: 12, CHA: 15 },
    hitPoints: 13,
    armor: 3,
    armorDescription: 'fine armor',
    movement: 10,
    attacks: [
      { name: 'Sword', damage: '1d8+1', skill: 55 },
      { name: 'Bow', damage: '1d6+1', skill: 45 },
      { name: 'Dagger', damage: '1d4+1', skill: 40 }
    ],
    specialAbilities: ['Leadership', 'Etiquette', 'Influence', 'Political knowledge', 'Wealth']
  },
  {
    id: 'militia_guard',
    name: 'Militia/Town Guard',
    gameSystem: 'both',
    category: 'npc',
    rarity: 'common',
    terrain: ['settlements', 'roads', 'towns'],
    description: 'A local militia member or town guard responsible for maintaining order and protecting citizens. Guards have basic training and often work in groups.',
    stats: { STR: 14, CON: 13, SIZ: 13, DEX: 11, INT: 10, POW: 10, CHA: 10 },
    hitPoints: 13,
    armor: 3,
    armorDescription: 'town guard armor',
    movement: 10,
    attacks: [
      { name: 'Sword', damage: '1d8', skill: 50 },
      { name: 'Shield bash', damage: '1d4', skill: 40 },
      { name: 'Spear', damage: '1d6+1', skill: 45 }
    ],
    specialAbilities: ['Patrol knowledge', 'Law enforcement', 'Group coordination', 'Local connections']
  }
];
