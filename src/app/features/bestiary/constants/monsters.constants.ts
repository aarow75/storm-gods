import { Monster } from '@bestiary/models/monster.model';

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

  // PER-SYSTEM CREATURES

  // --- GIANT RAT ---
  {
    id: 'giant_rat_rq',
    name: 'Giant Rat',
    gameSystem: 'runequest',
    category: 'beast',
    description: 'A rodent the size of a large dog, common in the ruins and sewers of Gloranthan cities. They spread disease and attack in packs.',
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
    id: 'giant_rat_db',
    name: 'Giant Rat',
    gameSystem: 'dragonbane',
    category: 'beast',
    description: 'An oversized rodent found in dungeon cellars and ruined keeps. Faster and wilier than a normal rat, it hunts in packs and bites with a diseased maw.',
    stats: { STR: 4, CON: 7, SIZ: 4, DEX: 15, INT: 3, POW: 6, CHA: 2 },
    hitPoints: 5,
    armor: 0,
    armorDescription: 'none',
    movement: 11,
    attacks: [
      { name: 'Bite', damage: '1d4', skill: 40 },
      { name: 'Claw', damage: '1d3', skill: 30 }
    ],
    specialAbilities: ['Pack hunting', 'Disease carrier', 'Excellent sense of smell']
  },
  {
    id: 'giant_rat_osric',
    name: 'Giant Rat',
    gameSystem: 'osric',
    category: 'beast',
    description: 'A dungeon staple: a rat the size of a large cat. They swarm in numbers, spread disease, and are found in nearly every dungeon level.',
    stats: { STR: 4, CON: 8, SIZ: 4, DEX: 13, INT: 2, POW: 6, CHA: 2 },
    hitPoints: 4,
    armor: 0,
    armorDescription: 'none',
    movement: 9,
    attacks: [
      { name: 'Bite', damage: '1d3', skill: 30 }
    ],
    specialAbilities: ['Pack hunting', 'Disease carrier (save or contract rat fever)', 'Swarm bonus (+5% per 5 additional rats)']
  },

  // --- VAMPIRE ---
  {
    id: 'vampire_rq',
    name: 'Vampire',
    gameSystem: 'runequest',
    category: 'undead',
    description: 'A Gloranthan undead fueled by stolen POW. Vampires are powerful sorcerors who accumulate magic points to sustain their immortal form and devastate enemies with rune magic.',
    stats: { STR: 18, CON: 0, SIZ: 13, DEX: 16, INT: 16, POW: 22, CHA: 15 },
    hitPoints: 14,
    armor: 0,
    armorDescription: 'undead invulnerability',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d6 + POW drain', skill: 65 },
      { name: 'Claw (x2)', damage: '1d6+2', skill: 60 },
      { name: 'Sorcery', damage: '1d6+2 per spell level', skill: 70 }
    ],
    specialAbilities: ['POW drain (1d3 per bite — permanent loss)', 'Undead (no CON, immune to natural healing)', 'Shapeshifting (bat, wolf, mist)', 'Rune magic', 'Sunlight vulnerability (1d6/round)', 'Silver/iron weapons required']
  },
  {
    id: 'vampire_db',
    name: 'Vampire',
    gameSystem: 'dragonbane',
    category: 'undead',
    description: 'A predatory undead that combines unearthly speed with dominating charisma. DragonBane vampires are seducers and hunters, blending among mortals before striking.',
    stats: { STR: 16, CON: 0, SIZ: 12, DEX: 20, INT: 14, POW: 16, CHA: 18 },
    hitPoints: 12,
    armor: 0,
    armorDescription: 'undead (immune to non-magical weapons)',
    movement: 14,
    attacks: [
      { name: 'Bite', damage: '1d6 + life drain', skill: 70 },
      { name: 'Claw (x2)', damage: '1d6+1', skill: 65 }
    ],
    specialAbilities: ['Life drain (heals vampire equal to damage dealt)', 'Charm (WIL vs WIL or charmed)', 'Undead immunities', 'Shapeshifting (bat, wolf)', 'Sunlight vulnerability (1d8/round)', 'Stake through heart (instant kill if immobilized)']
  },
  {
    id: 'vampire_osric',
    name: 'Vampire',
    gameSystem: 'osric',
    category: 'undead',
    description: 'A classic 8+3 HD undead of immense power. OSRIC vampires drain two levels per hit, regenerate rapidly, and can only be permanently destroyed by sunlight or beheading.',
    stats: { STR: 20, CON: 0, SIZ: 13, DEX: 14, INT: 16, POW: 18, CHA: 13 },
    hitPoints: 38,
    armor: 0,
    armorDescription: 'requires +1 or better weapon to hit',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d6 + 2 level drain', skill: 70 },
      { name: 'Claw (x2)', damage: '1d6+5', skill: 65 }
    ],
    specialAbilities: ['Level drain (2 permanent levels per hit)', 'Regenerate (3 HP/round unless fire or holy damage)', 'Charm person (INT vs POW or dominated)', 'Gaseous form', 'Summon wolves/bats', 'Sunlight (2d6/round, destroyed on 0 HP)', 'Stake + beheading to permanently destroy']
  },

  // --- BEAR ---
  {
    id: 'bear_rq',
    name: 'Bear',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'common',
    terrain: ['forest', 'mountains', 'hills'],
    description: 'A large omnivorous predator common to Gloranthan forests and mountains. Bears are powerful fighters with exceptional strength and a crushing hug attack.',
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
    specialAbilities: ['Crushing hug (if both claws hit, grapple and crush for 2d6+2 extra)', 'Keen smell', 'Territorial', 'Hibernate'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'bear_db',
    name: 'Bear',
    gameSystem: 'dragonbane',
    category: 'beast',
    rarity: 'common',
    terrain: ['forest', 'mountains', 'hills'],
    description: 'A powerful forest predator found throughout the DragonBane wilderness. Slightly leaner than its Gloranthan counterpart but equally dangerous up close.',
    stats: { STR: 18, CON: 16, SIZ: 18, DEX: 10, INT: 4, POW: 9, CHA: 5 },
    hitPoints: 17,
    armor: 2,
    armorDescription: 'thick fur',
    movement: 10,
    attacks: [
      { name: 'Bite', damage: '1d8+2', skill: 50 },
      { name: 'Claw (left)', damage: '1d8+2', skill: 55 },
      { name: 'Claw (right)', damage: '1d8+2', skill: 55 },
      { name: 'Hug/Crush', damage: '2d6', skill: 40 }
    ],
    specialAbilities: ['Crushing hug (if both claws hit, grapple for 2d6 extra per round)', 'Keen smell', 'Territorial'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'bear_osric',
    name: 'Bear (Brown)',
    gameSystem: 'osric',
    category: 'beast',
    rarity: 'common',
    terrain: ['forest', 'mountains', 'hills'],
    description: 'The brown bear of the OSRIC wilderness: 5+5 HD with a devastating bear hug. Among the most dangerous natural predators a low-level party will face.',
    stats: { STR: 19, CON: 16, SIZ: 20, DEX: 13, INT: 3, POW: 9, CHA: 5 },
    hitPoints: 22,
    armor: 2,
    armorDescription: 'thick hide',
    movement: 12,
    attacks: [
      { name: 'Claw (x2)', damage: '1d6+4', skill: 55 },
      { name: 'Bite', damage: '1d8+4', skill: 50 }
    ],
    specialAbilities: ['Bear hug (if both claws hit: auto-squeeze 2d8+4/round until escape or death)', 'Tracking by scent', 'Smash objects (doors, chests)'],
    hitLocationTemplateId: 'quadruped'
  },

  // --- DIRE WOLF ---
  {
    id: 'dire_wolf_rq',
    name: 'Dire Wolf',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['forest', 'plains', 'tundra'],
    description: 'A massive predatory wolf twice the size of a normal wolf, common in Gloranthan wilderness. Often serves chaos-aligned tribes as a mount or war beast.',
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
    specialAbilities: ['Pack hunting', 'Exceptional speed', 'Keen smell', 'Howl (terror — POW vs POW or flee)'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'dire_wolf_db',
    name: 'Dire Wolf',
    gameSystem: 'dragonbane',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['forest', 'plains', 'tundra'],
    description: 'A fearsome oversized wolf with iron-hard teeth. DragonBane dire wolves are faster and more cunning, often working alongside goblinoids as hunting partners.',
    stats: { STR: 16, CON: 14, SIZ: 18, DEX: 16, INT: 5, POW: 9, CHA: 6 },
    hitPoints: 16,
    armor: 1,
    armorDescription: 'thick fur',
    movement: 15,
    attacks: [
      { name: 'Bite', damage: '1d10+1', skill: 65 },
      { name: 'Tackle', damage: '1d6', skill: 55 }
    ],
    specialAbilities: ['Pack hunting (+10% per additional wolf)', 'Knock prone on tackle (STR vs STR)', 'Keen smell'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'dire_wolf_osric',
    name: 'Dire Wolf',
    gameSystem: 'osric',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['forest', 'plains', 'tundra'],
    description: 'A 4+4 HD predator used as a mount by goblins and orcs. Tougher than any natural wolf and instilled with pack cunning.',
    stats: { STR: 17, CON: 14, SIZ: 20, DEX: 15, INT: 5, POW: 8, CHA: 5 },
    hitPoints: 22,
    armor: 1,
    armorDescription: 'thick hide',
    movement: 15,
    attacks: [
      { name: 'Bite', damage: '2d4+2', skill: 65 },
      { name: 'Knock Down', damage: '1d4', skill: 55 }
    ],
    specialAbilities: ['Knock prone on bite (STR vs STR or fall)', 'Pack hunting', 'Tracking by scent', 'Goblin/orc mount'],
    hitLocationTemplateId: 'quadruped'
  },

  // --- LION ---
  {
    id: 'lion_rq',
    name: 'Lion',
    gameSystem: 'runequest',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['plains', 'savanna', 'desert'],
    description: 'An apex feline predator found on the Praxian plains and other open grasslands. Prides of lions are highly territorial and skilled at coordinated takedowns.',
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
    specialAbilities: ['Pride hunting', 'Exceptional strength', 'Keen senses', 'Territorial roar (POW vs POW or flee)'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'lion_db',
    name: 'Lion',
    gameSystem: 'dragonbane',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['plains', 'savanna', 'desert'],
    description: 'A great tawny predator of open plains. More agile than its Gloranthan counterpart — the DragonBane lion relies on explosive speed and precise strikes.',
    stats: { STR: 20, CON: 16, SIZ: 20, DEX: 16, INT: 5, POW: 9, CHA: 7 },
    hitPoints: 18,
    armor: 1,
    armorDescription: 'thick fur',
    movement: 14,
    attacks: [
      { name: 'Bite', damage: '1d10+2', skill: 60 },
      { name: 'Claw (left)', damage: '1d8+2', skill: 60 },
      { name: 'Claw (right)', damage: '1d8+2', skill: 60 },
      { name: 'Pounce', damage: '1d8+2', skill: 55 }
    ],
    specialAbilities: ['Pride hunting', 'Pounce (charging: knock prone on hit)', 'Keen senses'],
    hitLocationTemplateId: 'quadruped'
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
  // --- HORSE ---
  {
    id: 'horse_rq',
    name: 'Horse',
    gameSystem: 'runequest',
    category: 'mount',
    rarity: 'common',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A domesticated horse, crucial in Glorantha for transportation and cavalry. Gloranthan horses are strong and trained from birth for warfare across Dragon Pass.',
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
    specialAbilities: ['Fast movement', 'Keen senses', 'Bond with rider', 'Endurance'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'horse_db',
    name: 'Horse',
    gameSystem: 'dragonbane',
    category: 'mount',
    rarity: 'common',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A sturdy riding horse common throughout the DragonBane world. Slightly lighter than a Gloranthan warhorse breed but nimble on rough terrain.',
    stats: { STR: 16, CON: 15, SIZ: 17, DEX: 13, INT: 6, POW: 9, CHA: 7 },
    hitPoints: 16,
    armor: 0,
    armorDescription: 'none',
    movement: 13,
    attacks: [
      { name: 'Bite', damage: '1d4', skill: 25 },
      { name: 'Kick (rear)', damage: '1d6', skill: 40 },
      { name: 'Trample', damage: '1d8', skill: 35 }
    ],
    specialAbilities: ['Fast movement', 'Keen senses', 'Endurance'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'horse_osric',
    name: 'Horse (Light)',
    gameSystem: 'osric',
    category: 'mount',
    rarity: 'common',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'The standard light riding horse of the OSRIC world. Faster than a warhorse, it is the mount of choice for scouts, merchants, and adventurers.',
    stats: { STR: 16, CON: 14, SIZ: 18, DEX: 13, INT: 5, POW: 8, CHA: 6 },
    hitPoints: 15,
    armor: 0,
    armorDescription: 'none',
    movement: 16,
    attacks: [
      { name: 'Kick (front hooves)', damage: '1d4', skill: 30 }
    ],
    specialAbilities: ['Fast movement (charge bonus)', 'Endurance', 'Spook-prone (morale check vs fire or monsters)'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'horse_kal_arath',
    name: 'Horse',
    gameSystem: 'kal-arath',
    category: 'mount',
    rarity: 'common',
    terrain: ['plains', 'roads', 'steppe'],
    description: 'Horses are scarce in Kal-Arath — those not seized by the Black Legion are hoarded by nomads and city lords. War-trained mounts are conditioned to remain calm in the presence of demonic entities.',
    stats: { STR: 18, CON: 16, SIZ: 18, DEX: 12, INT: 5, POW: 9, CHA: 6 },
    hitPoints: 17,
    armor: 0,
    armorDescription: 'none',
    movement: 14,
    attacks: [
      { name: 'Bite', damage: '1d4', skill: 30 },
      { name: 'Kick (rear)', damage: '1d6', skill: 40 },
      { name: 'Trample', damage: '1d8', skill: 35 }
    ],
    specialAbilities: ['Fast movement', 'Darkness-broken (does not spook from demonic entities)', 'Endurance'],
    hitLocationTemplateId: 'quadruped'
  },

  // --- WAR HORSE ---
  {
    id: 'war_horse_rq',
    name: 'War Horse',
    gameSystem: 'runequest',
    category: 'mount',
    rarity: 'uncommon',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A heavily trained and armored Gloranthan destrier. Larger and far more aggressive than a riding horse, bred to charge into shield walls and trample foes.',
    stats: { STR: 20, CON: 18, SIZ: 20, DEX: 12, INT: 6, POW: 10, CHA: 8 },
    hitPoints: 19,
    armor: 3,
    armorDescription: 'heavy barding',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d6', skill: 35 },
      { name: 'Kick (rear)', damage: '1d8', skill: 50 },
      { name: 'Trample', damage: '1d10', skill: 45 }
    ],
    specialAbilities: ['Combat training (never bolts in battle)', 'Armored (barding)', 'Exceptional strength', 'Brave in battle'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'war_horse_db',
    name: 'War Horse',
    gameSystem: 'dragonbane',
    category: 'mount',
    rarity: 'uncommon',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A battle-trained destrier in the DragonBane world. Slightly lighter than a Gloranthan war horse but quicker and easier to maneuver in forests and rough terrain.',
    stats: { STR: 19, CON: 17, SIZ: 19, DEX: 13, INT: 6, POW: 10, CHA: 7 },
    hitPoints: 18,
    armor: 2,
    armorDescription: 'partial barding',
    movement: 13,
    attacks: [
      { name: 'Bite', damage: '1d6', skill: 30 },
      { name: 'Kick (rear)', damage: '1d8', skill: 50 },
      { name: 'Trample', damage: '1d10', skill: 40 }
    ],
    specialAbilities: ['Combat training', 'Armored', 'Brave in battle'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'war_horse_osric',
    name: 'War Horse (Heavy)',
    gameSystem: 'osric',
    category: 'mount',
    rarity: 'uncommon',
    terrain: ['plains', 'grasslands', 'roads'],
    description: 'A massive OSRIC destrier capable of carrying a fully armored knight. With 5 HD and powerful hoof attacks, it is a weapon in its own right on the battlefield.',
    stats: { STR: 22, CON: 18, SIZ: 22, DEX: 11, INT: 5, POW: 9, CHA: 7 },
    hitPoints: 25,
    armor: 3,
    armorDescription: 'plate barding',
    movement: 12,
    attacks: [
      { name: 'Hoof (x2)', damage: '1d8+4', skill: 55 },
      { name: 'Bite', damage: '1d6', skill: 35 }
    ],
    specialAbilities: ['Lance charge (double damage on first charge with mounted lancer)', 'Combat training', 'Plate barding'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'war_horse_kal_arath',
    name: 'Legion Destrier',
    gameSystem: 'kal-arath',
    category: 'mount',
    rarity: 'uncommon',
    terrain: ['plains', 'roads', 'ruined fortifications'],
    description: 'The Black Legion breeds its destriers for endurance and aggression. Demonic conditioning leaves them fearless but faintly corrupted — their eyes glow faintly amber in darkness.',
    stats: { STR: 20, CON: 18, SIZ: 20, DEX: 12, INT: 5, POW: 9, CHA: 5 },
    hitPoints: 19,
    armor: 3,
    armorDescription: 'black iron barding',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d6+2', skill: 40 },
      { name: 'Kick (rear)', damage: '1d8+2', skill: 50 },
      { name: 'Trample', damage: '1d10+2', skill: 45 }
    ],
    specialAbilities: ['Combat training', 'Demonic resilience (immune to fear and morale checks)', 'Black iron barding'],
    hitLocationTemplateId: 'quadruped'
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
  // --- NPCS ---
  {
    id: 'merchant_rq',
    name: 'Merchant (Caravan Leader)',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'plains'],
    description: 'A Gloranthan caravan master navigating dangerous roads between cities. High INT and CHA reflect business acumen and cult contacts within Issaries worship.',
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
    specialAbilities: ['Negotiation', 'Trade expertise', 'Cult connections (Issaries)', 'Bodyguard command']
  },
  {
    id: 'merchant_db',
    name: 'Merchant (Caravan Leader)',
    gameSystem: 'dragonbane',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'plains'],
    description: 'A seasoned trader in the DragonBane world navigating monster-haunted roads to deliver goods. Relies on hired guards and sharp negotiation skills to survive.',
    stats: { STR: 12, CON: 12, SIZ: 12, DEX: 12, INT: 15, POW: 10, CHA: 14 },
    hitPoints: 12,
    armor: 1,
    armorDescription: 'padded jacket',
    movement: 10,
    attacks: [
      { name: 'Short Sword', damage: '1d6', skill: 40 },
      { name: 'Dagger', damage: '1d4+1', skill: 40 }
    ],
    specialAbilities: ['Negotiation', 'Trade expertise', 'Bribery', 'Merchant guild contacts']
  },
  {
    id: 'bandit_rq',
    name: 'Bandit/Outlaw',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'common',
    terrain: ['roads', 'forests', 'mountains', 'ruins'],
    description: 'A desperate outlaw preying on travelers in Glorantha — often a failed warrior or exile from a clan who resorts to raiding to survive.',
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
    specialAbilities: ['Ambush tactics', 'Teamwork', 'Survival skills']
  },
  {
    id: 'bandit_db',
    name: 'Bandit/Outlaw',
    gameSystem: 'dragonbane',
    category: 'npc',
    rarity: 'common',
    terrain: ['roads', 'forests', 'mountains', 'ruins'],
    description: 'A brigand lurking along DragonBane\'s dangerous roads. Often light on armor but fast and ruthless, relying on surprise and numbers to overwhelm targets.',
    stats: { STR: 13, CON: 12, SIZ: 12, DEX: 14, INT: 9, POW: 9, CHA: 8 },
    hitPoints: 12,
    armor: 1,
    armorDescription: 'light leather',
    movement: 11,
    attacks: [
      { name: 'Short Sword', damage: '1d6+1', skill: 50 },
      { name: 'Short Bow', damage: '1d6', skill: 45 },
      { name: 'Dagger', damage: '1d4+1', skill: 40 }
    ],
    specialAbilities: ['Ambush tactics', 'Dirty fighting', 'Quick escape']
  },
  {
    id: 'bandit_osric',
    name: 'Bandit/Outlaw',
    gameSystem: 'osric',
    category: 'npc',
    rarity: 'common',
    terrain: ['roads', 'forests', 'mountains', 'ruins'],
    description: 'A 1st–2nd level Fighter or Thief class outlaw. A classic random encounter on OSRIC roads — dangerous in numbers to low-level parties.',
    stats: { STR: 13, CON: 11, SIZ: 12, DEX: 12, INT: 9, POW: 9, CHA: 8 },
    hitPoints: 8,
    armor: 2,
    armorDescription: 'leather armor + shield',
    movement: 9,
    attacks: [
      { name: 'Short Sword', damage: '1d6+1', skill: 45 },
      { name: 'Short Bow', damage: '1d6', skill: 40 },
      { name: 'Dagger', damage: '1d4', skill: 35 }
    ],
    specialAbilities: ['Backstab (thief variant: ×2 damage from surprise)', 'Numbers advantage', 'Morale check when leader falls']
  },
  {
    id: 'hermit_rq',
    name: 'Hermit/Scholar',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'caves', 'settlements'],
    description: 'A Gloranthan scholar or reclusive priest who has retreated to study ancient lore. High POW reflects years of shamanic or magical practice far from civilization.',
    stats: { STR: 10, CON: 12, SIZ: 11, DEX: 10, INT: 16, POW: 14, CHA: 11 },
    hitPoints: 11,
    armor: 0,
    armorDescription: 'none',
    movement: 9,
    attacks: [
      { name: 'Staff', damage: '1d6', skill: 35 },
      { name: 'Spirit magic', damage: '1d4+1', skill: 55 },
      { name: 'Fists', damage: '1d3', skill: 20 }
    ],
    specialAbilities: ['Spirit magic access', 'Rune lore', 'Ancient knowledge', 'Meditation']
  },
  {
    id: 'hermit_db',
    name: 'Hermit/Scholar',
    gameSystem: 'dragonbane',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'caves', 'settlements'],
    description: 'A solitary DragonBane sage or hedge wizard living outside civilization. Possesses forbidden knowledge and can teach spells to worthy adventurers.',
    stats: { STR: 9, CON: 11, SIZ: 10, DEX: 10, INT: 17, POW: 13, CHA: 11 },
    hitPoints: 10,
    armor: 0,
    armorDescription: 'none',
    movement: 9,
    attacks: [
      { name: 'Staff', damage: '1d6', skill: 30 },
      { name: 'Cantrip', damage: '1d4', skill: 50 }
    ],
    specialAbilities: ['Spell knowledge (1d4 spells)', 'Lore: Monsters', 'Lore: History', 'Suspicious of outsiders']
  },
  {
    id: 'ranger_rq',
    name: 'Ranger/Bounty Hunter',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'plains', 'wilderness'],
    description: 'A skilled Gloranthan tracker hired to pursue fugitives or guide caravans through dangerous wilderness. High DEX and CON reflect years of outdoor survival.',
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
    id: 'ranger_db',
    name: 'Ranger/Bounty Hunter',
    gameSystem: 'dragonbane',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'plains', 'wilderness'],
    description: 'A DragonBane wilderness expert and tracker — often hired to escort travelers or hunt monsters. Fast and accurate with a bow, dangerous in ambush.',
    stats: { STR: 14, CON: 14, SIZ: 12, DEX: 16, INT: 12, POW: 11, CHA: 11 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'leather armor',
    movement: 12,
    attacks: [
      { name: 'Shortbow', damage: '1d8', skill: 65 },
      { name: 'Short Sword', damage: '1d6+1', skill: 55 },
      { name: 'Hunting Knife', damage: '1d4+1', skill: 50 }
    ],
    specialAbilities: ['Tracking', 'Wilderness survival', 'Keen senses', 'Ambush', 'Monster knowledge']
  },
  {
    id: 'ranger_osric',
    name: 'Ranger',
    gameSystem: 'osric',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['forests', 'mountains', 'plains', 'wilderness'],
    description: 'An OSRIC Ranger NPC at 3rd–5th level: a hardened wilderness fighter with tracking, stealth, and knowledge of monstrous creatures. More durable than a simple bandit due to multiple class HD.',
    stats: { STR: 14, CON: 14, SIZ: 13, DEX: 14, INT: 12, POW: 11, CHA: 10 },
    hitPoints: 20,
    armor: 3,
    armorDescription: 'chain mail',
    movement: 9,
    attacks: [
      { name: 'Longbow', damage: '1d8+1', skill: 65 },
      { name: 'Longsword', damage: '1d8+2', skill: 60 },
      { name: 'Hand Axe', damage: '1d6+2', skill: 50 }
    ],
    specialAbilities: ['Tracking (90% in wilderness)', 'Surprise (1–3 on d6 in wilderness)', 'Two-weapon fighting', 'Favored enemy (humanoids)', 'Druid/MU spells at high levels']
  },
  {
    id: 'noble_rq',
    name: 'Noble/Traveler',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'estates'],
    description: 'A Gloranthan noble traveling between clan steadings or city-states. Commands respect through cult status and clan lineage, typically with armed retainers.',
    stats: { STR: 13, CON: 13, SIZ: 13, DEX: 12, INT: 14, POW: 12, CHA: 15 },
    hitPoints: 13,
    armor: 3,
    armorDescription: 'fine bronze armor',
    movement: 10,
    attacks: [
      { name: 'Bronze Sword', damage: '1d8+1', skill: 55 },
      { name: 'Shortbow', damage: '1d6+1', skill: 45 },
      { name: 'Dagger', damage: '1d4+1', skill: 40 }
    ],
    specialAbilities: ['Leadership', 'Cult status', 'Political influence', 'Wealth', 'Bodyguard retinue']
  },
  {
    id: 'noble_db',
    name: 'Noble/Traveler',
    gameSystem: 'dragonbane',
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['roads', 'settlements', 'estates'],
    description: 'A DragonBane noble or wealthy merchant-lord on the road. Travels with a small retinue of guards and carries letters of passage from local lords.',
    stats: { STR: 12, CON: 12, SIZ: 12, DEX: 12, INT: 14, POW: 11, CHA: 15 },
    hitPoints: 12,
    armor: 3,
    armorDescription: 'fine ringmail',
    movement: 10,
    attacks: [
      { name: 'Sword', damage: '1d8', skill: 50 },
      { name: 'Dagger', damage: '1d4+1', skill: 35 }
    ],
    specialAbilities: ['Leadership', 'Political connections', 'Wealthy', 'Bodyguard command']
  },
  {
    id: 'militia_guard_rq',
    name: 'Militia/Town Guard',
    gameSystem: 'runequest',
    category: 'npc',
    rarity: 'common',
    terrain: ['settlements', 'roads', 'towns'],
    description: 'A Gloranthan city or stead guard enforcing local law. Typically serves a minor cult and wears bronze scale armor appropriate to their city-state.',
    stats: { STR: 14, CON: 13, SIZ: 13, DEX: 11, INT: 10, POW: 10, CHA: 10 },
    hitPoints: 13,
    armor: 3,
    armorDescription: 'bronze scale + shield',
    movement: 10,
    attacks: [
      { name: 'Spear', damage: '1d8+1', skill: 55 },
      { name: 'Sword', damage: '1d8', skill: 50 },
      { name: 'Shield bash', damage: '1d4', skill: 40 }
    ],
    specialAbilities: ['Patrol knowledge', 'Law enforcement', 'Group coordination', 'Cult backing']
  },
  {
    id: 'militia_guard_db',
    name: 'Militia/Town Guard',
    gameSystem: 'dragonbane',
    category: 'npc',
    rarity: 'common',
    terrain: ['settlements', 'roads', 'towns'],
    description: 'A DragonBane town watchman keeping order in frontier settlements. Less disciplined than a standing army but willing to use force when pressed.',
    stats: { STR: 13, CON: 12, SIZ: 12, DEX: 11, INT: 10, POW: 9, CHA: 9 },
    hitPoints: 12,
    armor: 3,
    armorDescription: 'chainmail + shield',
    movement: 10,
    attacks: [
      { name: 'Spear', damage: '1d8', skill: 50 },
      { name: 'Short Sword', damage: '1d6', skill: 45 },
      { name: 'Shield Bash', damage: '1d4', skill: 35 }
    ],
    specialAbilities: ['Patrol knowledge', 'Group coordination', 'Town contacts']
  },
  {
    id: 'militia_guard_osric',
    name: 'Town Guard',
    gameSystem: 'osric',
    category: 'npc',
    rarity: 'common',
    terrain: ['settlements', 'roads', 'towns'],
    description: 'A 0-level or 1st-level Fighter serving as city watch. Follows orders from the local lord or guild; reinforcements arrive quickly if an alarm is sounded.',
    stats: { STR: 13, CON: 12, SIZ: 12, DEX: 11, INT: 9, POW: 9, CHA: 9 },
    hitPoints: 8,
    armor: 3,
    armorDescription: 'chain mail + shield',
    movement: 9,
    attacks: [
      { name: 'Spear', damage: '1d6', skill: 45 },
      { name: 'Short Sword', damage: '1d6', skill: 40 }
    ],
    specialAbilities: ['Patrol routes', 'Sound alarm', 'Reinforcements (2d4 arrive in 1d6 rounds)', 'Group morale']
  },

  // KAL-ARATH MONSTERS
  {
    id: 'shadow_stalker',
    name: 'Shadow Stalker',
    gameSystem: 'kal-arath',
    category: 'chaos',
    rarity: 'uncommon',
    terrain: ['ruins', 'underground', 'void-touched lands'],
    description: 'A predator that slips between shadows and attacks from the darkness. Shadow Stalkers are drawn to areas of demonic corruption and hunt by sensing fear.',
    stats: { STR: 14, CON: 12, SIZ: 11, DEX: 18, INT: 7, POW: 14, CHA: 3 },
    hitPoints: 12,
    armor: 0,
    armorDescription: 'none (shadow form)',
    movement: 14,
    attacks: [
      { name: 'Shadow Claw', damage: '1d6+2', skill: 65 },
      { name: 'Fear Bite', damage: '1d4+POW drain', skill: 50 }
    ],
    specialAbilities: ['Blend with shadows (invisible in darkness)', 'Fear aura (POW vs POW or -10% to all skills)', 'Phase step (ignore difficult terrain)']
  },
  {
    id: 'blood_fiend',
    name: 'Blood Fiend',
    gameSystem: 'kal-arath',
    category: 'chaos',
    rarity: 'uncommon',
    terrain: ['battlefields', 'ritual sites', 'ruins'],
    description: 'A demon of pure carnage that feeds on blood and suffering. Blood Fiends are conjured by followers of the Blood pact and grow stronger with each kill.',
    stats: { STR: 20, CON: 16, SIZ: 16, DEX: 11, INT: 6, POW: 15, CHA: 2 },
    hitPoints: 16,
    armor: 3,
    armorDescription: 'demonic hide',
    movement: 10,
    attacks: [
      { name: 'Gore (horns)', damage: '1d8+4', skill: 55 },
      { name: 'Rend (claws)', damage: '1d6+4', skill: 60 },
      { name: 'Blood Spray', damage: '1d4 to all adjacent', skill: 45 }
    ],
    specialAbilities: ['Blood rage (gains +5 STR when wounded)', 'Regenerate 2 HP/round while in combat', 'Immune to fear'],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'ash_wraith',
    name: 'Ash Wraith',
    gameSystem: 'kal-arath',
    category: 'undead',
    rarity: 'uncommon',
    terrain: ['ruins', 'ash wastes', 'corrupted temples'],
    description: 'The burned remnant of a soul destroyed by demonic fire. Ash Wraiths drift through ruined places, seeking to extinguish the living out of hollow hatred.',
    stats: { STR: 8, CON: 14, SIZ: 10, DEX: 13, INT: 9, POW: 16, CHA: 1 },
    hitPoints: 14,
    armor: 0,
    armorDescription: 'incorporeal (half damage from physical)',
    movement: 12,
    attacks: [
      { name: 'Ash Touch', damage: '1d6 + CON drain', skill: 55 },
      { name: 'Smothering Ash', damage: '1d4 suffocation', skill: 45 }
    ],
    specialAbilities: ['Incorporeal (immune to normal weapons, half damage from magic)', 'CON drain (1 point per hit, restored on rest)', 'Immune to fire']
  },
  {
    id: 'risen_fallen',
    name: 'Risen Fallen',
    gameSystem: 'kal-arath',
    category: 'undead',
    rarity: 'common',
    terrain: ['battlefields', 'roads', 'ruins', 'black legion territory'],
    description: 'Soldiers slain in service to the Black Legion and reanimated by demonic will. Risen Fallen retain their fighting instincts but not their minds.',
    stats: { STR: 15, CON: 14, SIZ: 13, DEX: 9, INT: 3, POW: 8, CHA: 1 },
    hitPoints: 14,
    armor: 4,
    armorDescription: 'corroded black iron armor',
    movement: 8,
    attacks: [
      { name: 'Rusted Blade', damage: '1d8+2', skill: 45 },
      { name: 'Shield Bash', damage: '1d4+2', skill: 35 }
    ],
    specialAbilities: ['Undead (immune to fear, poison, disease)', 'Relentless (never routs)', 'Pack tactics (+10% skill when 3+ adjacent allies)']
  },
  {
    id: 'black_legion_soldier',
    name: 'Black Legion Soldier',
    gameSystem: 'kal-arath',
    category: 'humanoid',
    rarity: 'common',
    terrain: ['roads', 'fortifications', 'ruins', 'conquered settlements'],
    description: 'A hardened soldier of the Black Legion, bound by demonic pact. They fight with discipline and ruthlessness, augmented by corrupt power.',
    stats: { STR: 16, CON: 15, SIZ: 14, DEX: 12, INT: 10, POW: 11, CHA: 7 },
    hitPoints: 15,
    armor: 5,
    armorDescription: 'black iron plate',
    movement: 9,
    attacks: [
      { name: 'Warblade', damage: '1d8+3', skill: 55 },
      { name: 'Crossbow', damage: '2d4+1', skill: 40 },
      { name: 'Gauntlet', damage: '1d4+3', skill: 45 }
    ],
    specialAbilities: ['Demonic pact (resistant to mind control)', 'Legion discipline (never routs while officer present)', 'Intimidate']
  },
  {
    id: 'pit_crawler',
    name: 'Pit Crawler',
    gameSystem: 'kal-arath',
    category: 'beast',
    rarity: 'common',
    terrain: ['underground', 'pit arenas', 'void-touched lands'],
    description: 'A many-limbed predator bred in the demonic fighting pits of Kal-Arath. Pit Crawlers are used as execution beasts and arena spectacles.',
    stats: { STR: 18, CON: 15, SIZ: 20, DEX: 10, INT: 4, POW: 9, CHA: 2 },
    hitPoints: 18,
    armor: 3,
    armorDescription: 'chitinous shell',
    movement: 11,
    attacks: [
      { name: 'Mandible Crush', damage: '2d6+4', skill: 60 },
      { name: 'Claw Swipe', damage: '1d8+4', skill: 55 },
      { name: 'Spine Burst', damage: '1d4 to all adjacent', skill: 40 }
    ],
    specialAbilities: ['Multi-limb grapple', 'Armored carapace (immune to piercing weapons)', 'Wall-climb'],
    hitLocationTemplateId: 'insect'
  },
  {
    id: 'soul_drinker',
    name: 'Soul Drinker',
    gameSystem: 'kal-arath',
    category: 'spirit',
    rarity: 'rare',
    terrain: ['ritual sites', 'corrupted temples', 'void-touched lands'],
    description: 'A spirit entity that consumes the life essence of the living to sustain itself. Soul Drinkers are called forth by mystics of the Illumination pact.',
    stats: { STR: 6, CON: 10, SIZ: 8, DEX: 15, INT: 14, POW: 20, CHA: 5 },
    hitPoints: 10,
    armor: 0,
    armorDescription: 'none (spirit form)',
    movement: 16,
    attacks: [
      { name: 'Soul Drain', damage: '1d6 POW drain', skill: 70 },
      { name: 'Wail of the Lost', damage: 'stun (POW vs POW)', skill: 55 }
    ],
    specialAbilities: ['Spirit form (only harmed by magic and POW attacks)', 'POW drain (permanent until restored by ritual)', 'Invisible unless attacking']
  },
  {
    id: 'void_hound',
    name: 'Void Hound',
    gameSystem: 'kal-arath',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['void-touched lands', 'ruins', 'corrupted forests'],
    description: 'A predator hound twisted by exposure to the void between worlds. Void Hounds hunt in packs and can track prey across impossible distances.',
    stats: { STR: 15, CON: 14, SIZ: 13, DEX: 16, INT: 5, POW: 12, CHA: 3 },
    hitPoints: 14,
    armor: 1,
    armorDescription: 'corrupted fur',
    movement: 15,
    attacks: [
      { name: 'Void Bite', damage: '1d8+2', skill: 65 },
      { name: 'Blink Lunge', damage: '1d6+2', skill: 70 }
    ],
    specialAbilities: ['Blink (short teleport once per round)', 'Pack hunter (+15% per additional void hound)', 'Void scent (tracks across any terrain)'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'corrupted_knight',
    name: 'Corrupted Knight',
    gameSystem: 'kal-arath',
    category: 'humanoid',
    rarity: 'rare',
    terrain: ['ruins', 'fortifications', 'corrupted keeps'],
    description: 'A once-honorable warrior who accepted a demonic pact and was consumed by it. Corrupted Knights retain their martial skill but serve chaos absolutely.',
    stats: { STR: 19, CON: 17, SIZ: 16, DEX: 13, INT: 12, POW: 14, CHA: 6 },
    hitPoints: 17,
    armor: 7,
    armorDescription: 'demonic plate (self-repairing)',
    movement: 9,
    attacks: [
      { name: 'Chaos Greatsword', damage: '2d8+5', skill: 70 },
      { name: 'Corrupted Shield Bash', damage: '1d6+5', skill: 55 },
      { name: 'Demonic Roar', damage: 'fear (POW vs POW)', skill: 60 }
    ],
    specialAbilities: ['Demonic armor (self-repairs 1 AP/round)', 'Fear aura', 'Immune to fatigue', 'Chaos boon (random beneficial mutation)']
  },
  {
    id: 'bone_colossus',
    name: 'Bone Colossus',
    gameSystem: 'kal-arath',
    category: 'undead',
    rarity: 'legendary',
    terrain: ['ruins', 'ancient battlefields', 'cursed citadels'],
    description: 'A towering construct assembled from the bones of hundreds of warriors, animated by a fragment of demonic will. Bone Colossi serve as siege weapons and guardians of dark places.',
    stats: { STR: 28, CON: 20, SIZ: 35, DEX: 6, INT: 4, POW: 18, CHA: 1 },
    hitPoints: 28,
    armor: 5,
    armorDescription: 'bone and sinew (regenerates)',
    movement: 8,
    attacks: [
      { name: 'Bone Slam', damage: '3d8+8', skill: 50 },
      { name: 'Rib Volley', damage: '1d6 to 1d4 targets', skill: 45 },
      { name: 'Trample', damage: '2d10+8', skill: 40 }
    ],
    specialAbilities: ['Massive (immune to knockback)', 'Reassemble (reforms from pieces if not completely destroyed)', 'Bone splinter aura (1d3 to adjacent on hit)']
  },

  // OSRIC MONSTERS
  {
    id: 'osric_goblin',
    name: 'Goblin',
    gameSystem: 'osric',
    category: 'humanoid',
    rarity: 'common',
    terrain: ['underground', 'ruins', 'forests', 'mountains'],
    description: 'Small, malicious humanoids that dwell in caves and ruins. Goblins are cowardly alone but dangerous in swarms, and delight in ambushes and traps.',
    stats: { STR: 8, CON: 9, SIZ: 7, DEX: 13, INT: 9, POW: 8, CHA: 5 },
    hitPoints: 5,
    armor: 1,
    armorDescription: 'leather scraps',
    movement: 9,
    attacks: [
      { name: 'Short Sword', damage: '1d6', skill: 35 },
      { name: 'Short Bow', damage: '1d6', skill: 30 }
    ],
    specialAbilities: ['Darkvision 60ft', 'Hatred of elves and gnomes', 'Ambush (surprise on 4-in-6 in dim light)']
  },
  {
    id: 'osric_orc',
    name: 'Orc Warrior',
    gameSystem: 'osric',
    category: 'humanoid',
    rarity: 'common',
    terrain: ['underground', 'ruins', 'hills', 'forests'],
    description: 'Brutish and warlike humanoids that live to fight. Orcs organize into aggressive warbands and raid settlements for food, slaves, and sport.',
    stats: { STR: 16, CON: 14, SIZ: 15, DEX: 10, INT: 9, POW: 9, CHA: 5 },
    hitPoints: 8,
    armor: 3,
    armorDescription: 'hide armor + shield',
    movement: 9,
    attacks: [
      { name: 'Battle Axe', damage: '1d8+2', skill: 45 },
      { name: 'Javelin', damage: '1d6+2', skill: 35 },
      { name: 'Bite', damage: '1d4+2', skill: 30 }
    ],
    specialAbilities: ['Light sensitivity (-1 to hit in bright light)', 'Battle fury (+2 to hit when half HP or less)']
  },
  {
    id: 'osric_kobold',
    name: 'Kobold',
    gameSystem: 'osric',
    category: 'humanoid',
    rarity: 'common',
    terrain: ['underground', 'forests', 'swamps'],
    description: 'Tiny reptilian humanoids known for their cunning traps and tunnel warrens. Kobolds worship dragons and see themselves as their humble servants.',
    stats: { STR: 7, CON: 8, SIZ: 6, DEX: 14, INT: 9, POW: 8, CHA: 6 },
    hitPoints: 4,
    armor: 1,
    armorDescription: 'natural scales',
    movement: 9,
    attacks: [
      { name: 'Spear', damage: '1d6-1', skill: 30 },
      { name: 'Sling', damage: '1d4', skill: 35 }
    ],
    specialAbilities: ['Darkvision 60ft', 'Trapmaking expertise', 'Pack tactics (+5% per kobold ally)', 'Light sensitivity']
  },
  {
    id: 'osric_bugbear',
    name: 'Bugbear',
    gameSystem: 'osric',
    category: 'humanoid',
    rarity: 'uncommon',
    terrain: ['underground', 'ruins', 'forests'],
    description: 'Large, stealthy goblinoids that move with surprising silence for their size. Bugbears are natural ambush predators who lead goblin tribes through terror.',
    stats: { STR: 17, CON: 15, SIZ: 18, DEX: 14, INT: 10, POW: 10, CHA: 6 },
    hitPoints: 14,
    armor: 3,
    armorDescription: 'hide armor',
    movement: 9,
    attacks: [
      { name: 'Morning Star', damage: '2d4+3', skill: 50 },
      { name: 'Javelin', damage: '1d6+3', skill: 40 },
      { name: 'Bear Hug (grapple)', damage: '2d4+3', skill: 45 }
    ],
    specialAbilities: ['Surprise (surprise on 3-in-6)', 'Darkvision 60ft', 'Intimidating presence']
  },
  {
    id: 'osric_ogre',
    name: 'Ogre',
    gameSystem: 'osric',
    category: 'humanoid',
    rarity: 'uncommon',
    terrain: ['hills', 'mountains', 'ruins', 'caves'],
    description: 'A large, dim-witted brute that bullies smaller creatures and hoards treasure. Ogres are powerful fighters who rely on raw strength and thick hides.',
    stats: { STR: 22, CON: 18, SIZ: 28, DEX: 8, INT: 6, POW: 9, CHA: 5 },
    hitPoints: 22,
    armor: 4,
    armorDescription: 'tough hide + scraps of armor',
    movement: 9,
    attacks: [
      { name: 'Great Club', damage: '1d10+6', skill: 55 },
      { name: 'Rock Throw', damage: '1d8+6', skill: 35 },
      { name: 'Fist Slam', damage: '1d8+6', skill: 50 }
    ],
    specialAbilities: ['Giant strength', 'Throw boulders (30ft range)', 'Low intelligence (can be deceived)']
  },
  {
    id: 'osric_troll',
    name: 'Troll',
    gameSystem: 'osric',
    category: 'humanoid',
    rarity: 'uncommon',
    terrain: ['swamps', 'ruins', 'forests', 'caves'],
    description: 'A gangly, rubbery-skinned predator with extraordinary regenerative powers. Trolls fear fire and acid but are otherwise nearly impossible to kill permanently.',
    stats: { STR: 20, CON: 20, SIZ: 22, DEX: 13, INT: 5, POW: 10, CHA: 3 },
    hitPoints: 20,
    armor: 4,
    armorDescription: 'rubbery hide',
    movement: 12,
    attacks: [
      { name: 'Claw (x2)', damage: '1d6+4', skill: 55 },
      { name: 'Bite', damage: '1d8+4', skill: 50 }
    ],
    specialAbilities: ['Regeneration (3 HP/round unless fire/acid damage taken)', 'Vulnerable to fire and acid (no regen, takes double damage)', 'Rend (extra 1d6 if both claws hit)']
  },
  {
    id: 'osric_ghoul',
    name: 'Ghoul',
    gameSystem: 'osric',
    category: 'undead',
    rarity: 'uncommon',
    terrain: ['graveyards', 'ruins', 'underground', 'crypts'],
    description: 'A foul undead that feeds on corpses and living flesh. Ghouls are known for their paralyzing touch, which leaves victims helpless before the pack descends.',
    stats: { STR: 15, CON: 14, SIZ: 13, DEX: 15, INT: 7, POW: 12, CHA: 2 },
    hitPoints: 14,
    armor: 0,
    armorDescription: 'none',
    movement: 9,
    attacks: [
      { name: 'Claw (x2)', damage: '1d3+1', skill: 55 },
      { name: 'Bite', damage: '1d6+1', skill: 50 }
    ],
    specialAbilities: ['Paralysis (claws and bite — STR vs STR or paralyzed 1d6+2 rounds)', 'Undead immunities', 'Darkvision 60ft', 'Elves immune to paralysis']
  },
  {
    id: 'osric_wraith',
    name: 'Wraith',
    gameSystem: 'osric',
    category: 'undead',
    rarity: 'rare',
    terrain: ['ruins', 'graveyards', 'underground', 'haunted places'],
    description: 'A malevolent undead spirit that drains the life force from the living. Wraiths are the remnants of evil beings who refused to pass on after death.',
    stats: { STR: 10, CON: 16, SIZ: 9, DEX: 16, INT: 13, POW: 18, CHA: 4 },
    hitPoints: 16,
    armor: 0,
    armorDescription: 'none (incorporeal)',
    movement: 14,
    attacks: [
      { name: 'Energy Drain Touch', damage: '1d6 + level drain', skill: 65 }
    ],
    specialAbilities: ['Incorporeal (only silver or +1 or better weapons)', 'Level drain (permanent CON loss until restored by magic)', 'Daylight weakness (-4 to all rolls in direct sunlight)']
  },
  {
    id: 'osric_lich',
    name: 'Lich',
    gameSystem: 'osric',
    category: 'undead',
    rarity: 'legendary',
    terrain: ['dungeons', 'ruins', 'towers', 'crypts'],
    description: 'A powerful wizard who achieved undeath through dark ritual. A lich retains all its spellcasting abilities and is nearly impossible to destroy so long as its phylactery survives.',
    stats: { STR: 12, CON: 18, SIZ: 12, DEX: 12, INT: 20, POW: 22, CHA: 8 },
    hitPoints: 18,
    armor: 0,
    armorDescription: 'none (magical resistance)',
    movement: 9,
    attacks: [
      { name: 'Touch of Death', damage: '1d10 + paralysis', skill: 70 },
      { name: 'Spellcasting', damage: 'by spell', skill: 90 }
    ],
    specialAbilities: ['Undead immunities', 'Paralysis touch (POW vs POW or paralyzed)', 'Spellcasting (high level magic user spells)', 'Magic resistance (50%)', 'Phylactery (returns unless phylactery destroyed)', 'Fear aura']
  },
  {
    id: 'osric_cave_bear',
    name: 'Cave Bear',
    gameSystem: 'osric',
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['mountains', 'caves', 'forests'],
    description: 'A massive bear adapted to cave life. Cave bears are among the most feared natural predators and are sometimes used as guardians by dungeon-dwelling humanoids.',
    stats: { STR: 25, CON: 20, SIZ: 30, DEX: 10, INT: 3, POW: 10, CHA: 6 },
    hitPoints: 25,
    armor: 3,
    armorDescription: 'thick fur and hide',
    movement: 12,
    attacks: [
      { name: 'Claw (x2)', damage: '1d8+8', skill: 60 },
      { name: 'Bite', damage: '2d6+8', skill: 50 }
    ],
    specialAbilities: ['Hug (if both claws hit, bear hugs for 2d8+8 additional damage)', 'Smash (can shatter wooden doors and chests)', 'Tracking by scent'],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'osric_giant_spider',
    name: 'Giant Spider',
    gameSystem: 'osric',
    category: 'beast',
    rarity: 'common',
    terrain: ['underground', 'forests', 'ruins', 'caves'],
    description: 'A large predatory spider that spins thick webs to capture prey. Several varieties exist; most are venomous and capable of paralyzing or killing their victims.',
    stats: { STR: 16, CON: 14, SIZ: 18, DEX: 14, INT: 2, POW: 9, CHA: 2 },
    hitPoints: 14,
    armor: 2,
    armorDescription: 'chitin carapace',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d6+2 + venom', skill: 55 },
      { name: 'Web (ranged)', damage: 'entangle (STR vs STR to break)', skill: 60 }
    ],
    specialAbilities: ['Web (restrains, STR 17 to break free)', 'Venom (paralysis or death — CON vs POW)', 'Wall-climb', 'Darkvision'],
    hitLocationTemplateId: 'insect'
  },
  {
    id: 'osric_young_red_dragon',
    name: 'Young Red Dragon',
    gameSystem: 'osric',
    category: 'dragon',
    rarity: 'legendary',
    terrain: ['mountains', 'volcanoes', 'dungeons'],
    description: 'Even a young red dragon is an apex predator and one of the most dangerous creatures adventurers can face. Greedy, arrogant, and intelligent, red dragons hoard wealth and destroy those who challenge them.',
    stats: { STR: 28, CON: 22, SIZ: 36, DEX: 10, INT: 16, POW: 18, CHA: 12 },
    hitPoints: 30,
    armor: 8,
    armorDescription: 'red dragon scales',
    movement: 14,
    attacks: [
      { name: 'Claw (x2)', damage: '1d8+8', skill: 65 },
      { name: 'Bite', damage: '3d6+8', skill: 60 },
      { name: 'Breath Weapon (fire cone)', damage: '8d8 fire (DEX to halve)', skill: 80 },
      { name: 'Tail Sweep', damage: '2d6+8', skill: 55 }
    ],
    specialAbilities: ['Fire breath (cone 60ft, 3 times per day)', 'Fire immunity', 'Flight', 'Magic resistance (35%)', 'Frightful presence (CON vs POW or flee)', 'Spell-like abilities'],
    hitLocationTemplateId: 'quadruped'
  },

  // ─── Pellucidar Setting (all systems) ───────────────────────────────────────

  // Beasts
  {
    id: 'tarag_rq',
    name: 'Tarag (Saber-tooth Cat)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['pellucidar-plains', 'jungle', 'caves', 'hills'],
    description: 'The apex predator of Pellucidar\'s open plains. The tarag is a massive saber-toothed cat whose elongated canines can pierce hide and bone alike. Lone hunters that stake out vast territories, they are feared by Gilak and Sagoth alike.',
    stats: { STR: 22, CON: 16, SIZ: 18, DEX: 16, INT: 4, POW: 8, CHA: 4 },
    hitPoints: 17,
    armor: 1,
    armorDescription: 'thick hide',
    movement: 14,
    attacks: [
      { name: 'Bite (saber lunge)', damage: '1d10+2', skill: 70 },
      { name: 'Claw (left)', damage: '1d8+2', skill: 65 },
      { name: 'Claw (right)', damage: '1d8+2', skill: 65 }
    ],
    specialAbilities: [
      'Saber lunge (successful bite adds +1d6 ripping damage from the elongated canines)',
      'Sprint charge (first attack each combat from concealment at +20% skill)',
      'Territorial (will pursue fleeing prey relentlessly)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'jalok_rq',
    name: 'Jalok (Hyena-dog)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'common',
    terrain: ['pellucidar-plains', 'hills', 'jungle'],
    description: 'A large, spotted hyena-like predator that hunts in packs across the Lidi Plains. Individually unremarkable, a jalok pack is a serious threat even to armed parties. They harry targets to exhaustion before closing in.',
    stats: { STR: 12, CON: 12, SIZ: 10, DEX: 14, INT: 4, POW: 6, CHA: 3 },
    hitPoints: 11,
    armor: 0,
    armorDescription: 'short fur',
    movement: 12,
    attacks: [
      { name: 'Bite', damage: '1d6+1', skill: 55 },
      { name: 'Claw', damage: '1d4', skill: 45 }
    ],
    specialAbilities: [
      'Pack tactics (+10% attack skill when 3 or more jaloks are present)',
      'Relentless pursuit (ignores fatigue penalties when chasing prey)',
      'Bone-crusher jaw (can worry a grappled target for 1d4 damage each round)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'tandor_rq',
    name: 'Tandor (Mammoth)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'common',
    terrain: ['pellucidar-plains', 'tundra', 'hills'],
    description: 'The mighty tandor is a shaggy mammoth that roams in great herds across Pellucidar\'s open lands. Usually placid, a startled or enraged tandor is among the most lethal creatures a traveller can face. Gilak tribes revere and hunt them for food, hide, and ivory.',
    stats: { STR: 35, CON: 22, SIZ: 35, DEX: 6, INT: 4, POW: 8, CHA: 5 },
    hitPoints: 29,
    armor: 3,
    armorDescription: 'thick hide and matted fur',
    movement: 12,
    attacks: [
      { name: 'Gore (tusks)', damage: '2d8+6', skill: 50 },
      { name: 'Trample', damage: '3d8+6', skill: 40 }
    ],
    specialAbilities: [
      'Trample (knocked-prone targets are trampled for automatic damage each round)',
      'Herd morale (allied tandors within 30m grant +10 CON for morale checks)',
      'Unstoppable charge (once a tandor charges, it cannot voluntarily halt for 3 rounds)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'ryth_rq',
    name: 'Ryth (Giant Cave Bear)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['caves', 'mountains', 'forest', 'pellucidar-caves'],
    description: 'Larger and more aggressive than any surface bear, the ryth is the dominant predator of Pellucidar\'s cave systems. The Gilaks tell stories of ryths that claimed entire cave complexes, driving out every other creature. Their hug attack can crush armored bone.',
    stats: { STR: 30, CON: 24, SIZ: 28, DEX: 8, INT: 4, POW: 10, CHA: 4 },
    hitPoints: 26,
    armor: 3,
    armorDescription: 'thick fur and heavy hide',
    movement: 11,
    attacks: [
      { name: 'Bite', damage: '2d6+4', skill: 55 },
      { name: 'Claw (left)', damage: '1d10+4', skill: 60 },
      { name: 'Claw (right)', damage: '1d10+4', skill: 60 },
      { name: 'Crushing hug', damage: '2d8+4', skill: 45 }
    ],
    specialAbilities: [
      'Crushing hug (if both claws hit the same target, grapple and crush for 2d8+4 each round)',
      'Keen smell (can track by scent, never surprised by approaching creatures)',
      'Cave dweller (no movement penalty in darkness or tight spaces)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'lidi_rq',
    name: 'Lidi (Sauropod)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'common',
    terrain: ['pellucidar-plains', 'jungle', 'swamp'],
    description: 'The great lidi are immense long-necked sauropods that graze the Lidi Plains in vast herds. Docile unless threatened, a startled lidi herd becomes an unstoppable stampede. Gilaks and Mezops sometimes ride domesticated lidi as mounts. Weapons smaller than a spear barely scratch them.',
    stats: { STR: 40, CON: 30, SIZ: 50, DEX: 4, INT: 2, POW: 5, CHA: 2 },
    hitPoints: 40,
    armor: 4,
    armorDescription: 'enormously thick hide',
    movement: 10,
    attacks: [
      { name: 'Tail sweep', damage: '3d8+8', skill: 40 },
      { name: 'Trample', damage: '5d8+8', skill: 30 },
      { name: 'Neck strike', damage: '2d8+8', skill: 35 }
    ],
    specialAbilities: [
      'Impervious hide (weapons dealing less than 1d6 base damage do not penetrate)',
      'Herd stampede (panicked lidi herd: all creatures in path take trample damage, DEX×3 to dodge)',
      'Domesticable (patient Gilaks can tame lidi as mounts or beasts of burden)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'thipdar_rq',
    name: 'Thipdar (Giant Pterodactyl)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'common',
    terrain: ['pellucidar-plains', 'pellucidar-coast', 'mountains', 'highlands'],
    description: 'Enormous leathery-winged reptiles that soar on thermal currents high above Pellucidar\'s eternal sun. Thipdars are opportunistic hunters that prefer to swoop and snatch prey, carrying it aloft to be dropped on rocks below. The Mahars are themselves an evolved, intelligent form of thipdar.',
    stats: { STR: 18, CON: 14, SIZ: 20, DEX: 14, INT: 4, POW: 8, CHA: 3 },
    hitPoints: 17,
    armor: 1,
    armorDescription: 'leathery hide',
    movement: 6,
    attacks: [
      { name: 'Beak', damage: '1d8+2', skill: 65 },
      { name: 'Claw (left)', damage: '1d6+2', skill: 55 },
      { name: 'Claw (right)', damage: '1d6+2', skill: 55 },
      { name: 'Snatch (grapple)', damage: 'special', skill: 50 }
    ],
    specialAbilities: [
      'Flight (movement 18 in the air; swooping dive gives +20% attack on first pass)',
      'Snatch (STR vs STR contest; success carries prey aloft at flying speed)',
      'Keen eyesight (spot creatures from extreme altitude; never surprised outdoors)'
    ],
    hitLocationTemplateId: 'humanoid'
  },

  // Humanoids & Intelligent Creatures
  {
    id: 'sagoth_rq',
    name: 'Sagoth (Gorilla-man)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'humanoid',
    rarity: 'common',
    terrain: ['pellucidar-plains', 'jungle', 'pellucidar-caves', 'mahar-territory'],
    description: 'The military caste of Mahar civilization. Sagoths are massive gorilla-like humanoids bred or enslaved to guard the Mahars\' cities and enforce their will over human slaves. They communicate in grunts and a crude language, but follow Mahar telepathic commands with unswerving loyalty.',
    stats: { STR: 22, CON: 18, SIZ: 20, DEX: 12, INT: 7, POW: 8, CHA: 5 },
    hitPoints: 19,
    armor: 1,
    armorDescription: 'thick hide',
    movement: 12,
    attacks: [
      { name: 'Club', damage: '2d6+4', skill: 60 },
      { name: 'Spear', damage: '1d8+4', skill: 55 },
      { name: 'Bite', damage: '1d6+4', skill: 50 }
    ],
    specialAbilities: [
      'Mahar bond (sagoths within 30m of a Mahar fight at +20% skill and ignore fear effects)',
      'Gorilla strength (automatically wins unarmed STR contests unless opponent has STR 25+)',
      'Intimidating presence (opponents must pass a POW×3 check or lose 1d6 from their next skill roll)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'mahar_rq',
    name: 'Mahar',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'chaos',
    rarity: 'rare',
    terrain: ['mahar-territory', 'pellucidar-caves'],
    description: 'The Mahars are the dominant intelligence of Pellucidar — eyeless, telepathic pterosaurs of great cunning and ancient power. They cannot vocalize language but communicate mind-to-mind with perfect clarity. Their civilization predates humanity in Pellucidar by ages. They view humans as livestock and occasionally worship them as sacrificial offerings.',
    stats: { STR: 16, CON: 16, SIZ: 18, DEX: 16, INT: 17, POW: 18, CHA: 12 },
    hitPoints: 17,
    armor: 2,
    armorDescription: 'tough scales',
    movement: 4,
    attacks: [
      { name: 'Beak', damage: '1d8+2', skill: 70 },
      { name: 'Claw (left)', damage: '1d6+2', skill: 65 },
      { name: 'Claw (right)', damage: '1d6+2', skill: 65 },
      { name: 'Telepathic command', damage: 'POW vs POW (special)', skill: 85 }
    ],
    specialAbilities: [
      'Telepathy (communicates silently up to 60m; can read surface thoughts of any creature in range)',
      'Mind command (telepathic command: success forces one human-sized creature to obey a simple order)',
      'Eyeless senses (perceives heat signatures and sound perfectly; immune to blindness and illusions)',
      'Flight (movement 16 in air; rarely lands except to feed or perform rituals)',
      'Sagoth authority (sagoths always obey a Mahar\'s telepathic commands without hesitation)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'horib_rq',
    name: 'Horib (Snake-man)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'chaos',
    rarity: 'uncommon',
    terrain: ['jungle', 'swamp', 'pellucidar-caves'],
    description: 'Reptilian humanoids with scaled hides and forked tongues, the Horibs are isolationist predators who regard all warm-blooded creatures as prey. Their venom can paralyze a man in seconds. They prefer to ambush from above or from water, striking without warning.',
    stats: { STR: 14, CON: 14, SIZ: 14, DEX: 18, INT: 10, POW: 12, CHA: 4 },
    hitPoints: 14,
    armor: 3,
    armorDescription: 'overlapping scales',
    movement: 12,
    attacks: [
      { name: 'Bite (venomous)', damage: '1d6+venom', skill: 65 },
      { name: 'Spear', damage: '1d8+1', skill: 60 },
      { name: 'Tail whip', damage: '1d4', skill: 55 }
    ],
    specialAbilities: [
      'Paralytic venom (CON vs POW each round after bite; failure means paralysis for 1d6 hours)',
      'Ambush predator (+30% attack skill when striking from concealment)',
      'Wall-climbing (can traverse vertical rock and tree surfaces at full movement)'
    ],
    hitLocationTemplateId: 'humanoid'
  },

  // NPCs
  {
    id: 'gilak_warrior_rq',
    name: 'Gilak Warrior',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'common',
    terrain: ['pellucidar-plains', 'hills', 'jungle', 'pellucidar-caves'],
    description: 'A Gilak is a primitive human of Pellucidar — Cro-Magnon in build, fierce and resourceful, armed with weapons of stone, bone, and flint. Gilak warriors defend their tribes against both beast and Sagoth slave-raider. Each tribe speaks a mutually unintelligible dialect.',
    stats: { STR: 14, CON: 13, SIZ: 12, DEX: 14, INT: 10, POW: 11, CHA: 10 },
    hitPoints: 13,
    armor: 1,
    armorDescription: 'hide armor',
    movement: 10,
    attacks: [
      { name: 'Stone spear', damage: '1d8+1', skill: 55 },
      { name: 'Flint knife', damage: '1d4+1', skill: 50 },
      { name: 'Thrown rock', damage: '1d4', skill: 45 }
    ],
    specialAbilities: [
      'Survival instinct (advantage on all rolls to find food, water, and shelter)',
      'Tribal bonds (fights to the death to protect tribe members)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'mezop_archer_rq',
    name: 'Mezop Archer',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['pellucidar-coast', 'jungle', 'pellucidar-plains'],
    description: 'The Mezops are island-dwelling warriors who sail the Sojar Az with skill. Renowned for their archery, they serve as trusted allies of David Innes and the Federated Kingdoms. Their bone bows are powerful at range and their loyalty once earned is absolute.',
    stats: { STR: 13, CON: 13, SIZ: 12, DEX: 16, INT: 11, POW: 11, CHA: 12 },
    hitPoints: 13,
    armor: 0,
    armorDescription: 'none (unencumbered)',
    movement: 10,
    attacks: [
      { name: 'Bone bow', damage: '1d8', skill: 75 },
      { name: 'Knife', damage: '1d4+1', skill: 55 },
      { name: 'Club', damage: '1d6+1', skill: 50 }
    ],
    specialAbilities: [
      'Expert archer (may fire twice per round at -20% on the second shot)',
      'Seafaring (skilled canoe and sailing navigation on inland seas)',
      'Steadfast ally (once won over via Ja\'s recommendation or direct aid, morale never breaks)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'sagoth_captain_rq',
    name: 'Sagoth Slave Handler (Captain)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['mahar-territory', 'pellucidar-caves', 'pellucidar-plains'],
    description: 'Senior Sagoths who oversee slave columns and guard Mahar prison pens. They wear crude bone armor over their already-thick hides, and know how to organize other Sagoths into effective fighting formations. Killing a Captain causes a morale check among nearby Sagoths.',
    stats: { STR: 24, CON: 20, SIZ: 22, DEX: 11, INT: 9, POW: 9, CHA: 7 },
    hitPoints: 21,
    armor: 2,
    armorDescription: 'thick hide + bone plate',
    movement: 11,
    attacks: [
      { name: 'Great club', damage: '2d8+5', skill: 70 },
      { name: 'Whip', damage: '1d4+1 (entangle)', skill: 65 }
    ],
    specialAbilities: [
      'Tactical command (sagoths within 30m fight at +10% while captain lives)',
      'Whip entangle (on a special success the target is entangled and falls prone)',
      'Veteran hide (treats armor as 3 against first hit of any combat)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'gilak_chieftain_rq',
    name: 'Gilak Chieftain',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['pellucidar-plains', 'hills', 'jungle'],
    description: 'The strongest, wisest, or most charismatic Gilak of a tribe earns the title of chieftain through deeds rather than birthright. A chieftain wears bone armor and wields a polished stone axe as a symbol of office. They are the primary targets for David Innes\'s diplomatic efforts to build the Federated Kingdoms.',
    stats: { STR: 16, CON: 15, SIZ: 13, DEX: 15, INT: 13, POW: 13, CHA: 15 },
    hitPoints: 14,
    armor: 2,
    armorDescription: 'bone-reinforced hide armor',
    movement: 10,
    attacks: [
      { name: 'Stone axe', damage: '1d8+2', skill: 70 },
      { name: 'Spear', damage: '1d8+2', skill: 65 },
      { name: 'Flint knife', damage: '1d4+2', skill: 55 }
    ],
    specialAbilities: [
      'War cry (once per combat, all allied Gilaks gain +15% to attacks for one round)',
      'Negotiation (may treat hostile Gilak groups as neutral with a CHA×3 roll)',
      'Tactical cunning (INT 13; can direct flanking maneuvers that grant +20% to one ally\'s attack)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'david_innes_rq',
    name: 'David Innes (The Emperor)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'legendary',
    terrain: ['pellucidar-plains', 'pellucidar-coast', 'mahar-territory', 'pellucidar-caves'],
    description: 'A mining engineer from Connecticut who descended to Pellucidar via the Iron Mole burrowing machine. David Innes became the first Emperor of the Federated Kingdoms of Pellucidar through courage, ingenuity, and an inability to accept defeat. He carries surface-world weapons and knowledge that give him an enormous tactical advantage. His legendary flaw is a perpetual inability to navigate without stars.',
    stats: { STR: 16, CON: 15, SIZ: 13, DEX: 15, INT: 17, POW: 14, CHA: 16 },
    hitPoints: 14,
    armor: 3,
    armorDescription: 'mixed Gilak and improvised armor',
    movement: 10,
    attacks: [
      { name: 'Rifle', damage: '2d8+2', skill: 80 },
      { name: 'Pistol', damage: '1d8+2', skill: 75 },
      { name: 'Knife', damage: '1d6+2', skill: 65 }
    ],
    specialAbilities: [
      'Surface-world knowledge (can improvise gunpowder weapons, basic medicine, and mechanical devices)',
      'Inspiring leadership (all allies within 30m may reroll one failed skill check per combat)',
      'Unbreakable will (may spend 1 POW to pass any morale check automatically)',
      'Direction-blind in Pellucidar (cannot navigate by instinct; always needs landmarks or a guide)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'dian_beautiful_rq',
    name: 'Dian the Beautiful',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'legendary',
    terrain: ['pellucidar-plains', 'pellucidar-coast', 'mahar-territory'],
    description: 'Princess of Amoz and wife of David Innes. Dian is the embodiment of Pellucidarian womanhood — fierce, proud, and utterly without weakness in her own mind. She refuses rescue attempts she considers beneath her dignity but fights savagely when cornered. Her noble lineage gives her political leverage among the coastal Gilak tribes.',
    stats: { STR: 11, CON: 12, SIZ: 10, DEX: 16, INT: 14, POW: 15, CHA: 18 },
    hitPoints: 11,
    armor: 0,
    armorDescription: 'none',
    movement: 10,
    attacks: [
      { name: 'Dagger', damage: '1d4+1', skill: 55 },
      { name: 'Bone bow', damage: '1d8', skill: 60 }
    ],
    specialAbilities: [
      'Force of personality (CHA 18; hostile humanoids must pass POW×3 to attack her directly)',
      'Noble lineage of Amoz (coastal tribes treat her as royalty; +30% to all diplomatic rolls)',
      'Fierce independence (cannot be compelled to accept aid she views as condescending — even from David Innes)'
    ],
    hitLocationTemplateId: 'humanoid'
  },

  // ─── Barsoom Setting (all systems) ───────────────────────────────────────────

  // Beasts
  {
    id: 'banth_barsoom',
    name: 'Banth (10-legged Lion)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['barsoom-dead-sea', 'barsoom-city', 'valley-dor'],
    description: 'The apex predator of Barsoom\'s open wastes — a hairless, lion-like beast with ten powerful legs and a maw capable of crushing bone. Banths are kept in the arena pits of Martian cities and roam the Dead Sea Bottoms in loose packs. Their resonating roar is a specific terror: something in its frequency undermines the resolve of prey.',
    stats: { STR: 24, CON: 18, SIZ: 22, DEX: 16, INT: 4, POW: 10, CHA: 4 },
    hitPoints: 20,
    armor: 1,
    armorDescription: 'thick hide',
    movement: 16,
    attacks: [
      { name: 'Bite', damage: '1d10+3', skill: 70 },
      { name: 'Claw (left)', damage: '1d8+3', skill: 65 },
      { name: 'Claw (right)', damage: '1d8+3', skill: 65 }
    ],
    specialAbilities: [
      'Ten-leg burst (can sprint at movement 22 for one round before needing a round to recover)',
      'Terrifying roar (once per combat; all enemies within 20m must pass POW×3 or suffer -10% to all rolls for the next round)',
      'Night hunter (no penalties in darkness; hunts primarily when moons are low)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'thoat_barsoom',
    name: 'Thoat (8-legged Riding Beast)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'mount',
    rarity: 'common',
    terrain: ['barsoom-dead-sea', 'barsoom-city', 'barsoom-aerial'],
    description: 'The primary riding animal of Barsoom — a large, 8-legged creature with a wide, flat body and a relatively small head. Green Martian thoats stand 10 feet at the shoulder; red Martian thoats are smaller and lighter. Thoats respond to telepathic commands from trained riders and are tireless over enormous distances across the Dead Sea Bottoms.',
    stats: { STR: 20, CON: 16, SIZ: 22, DEX: 14, INT: 4, POW: 8, CHA: 5 },
    hitPoints: 19,
    armor: 1,
    armorDescription: 'tough hide',
    movement: 20,
    attacks: [
      { name: 'Trample', damage: '2d6+4', skill: 40 },
      { name: 'Bite', damage: '1d6+4', skill: 45 }
    ],
    specialAbilities: [
      'Eight-legged stability (never stumbles; immune to terrain movement penalties on open ground)',
      'Telepathic bond (responds to the mental commands of a trained rider without reins; untrained riders must use STR to control)',
      'Endurance (can travel at full movement for 24 hours before requiring rest)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'calot_barsoom',
    name: 'Calot (10-legged Martian Dog)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'common',
    terrain: ['barsoom-dead-sea', 'barsoom-city'],
    description: 'Calots are the loyal dogs of Barsoom — ten-legged, roughly frog-like in body shape, with enormous mouths and small eyes. They bond deeply and permanently to a single person and will sacrifice themselves without hesitation for their bonded owner. Woola, John Carter\'s calot, is the most famous example. A calot\'s affection, once won, is absolute.',
    stats: { STR: 14, CON: 14, SIZ: 14, DEX: 18, INT: 6, POW: 10, CHA: 8 },
    hitPoints: 14,
    armor: 0,
    armorDescription: 'thin hide',
    movement: 18,
    attacks: [
      { name: 'Bite', damage: '1d8+1', skill: 65 },
      { name: 'Tackle and pin', damage: 'grapple', skill: 55 }
    ],
    specialAbilities: [
      'Unbreakable bond (a bonded calot will never leave its owner willingly; dies before abandoning them)',
      'Ten-leg sprint (movement 22 for one round when pursuing a fleeing target)',
      'Pin (on a successful tackle, the target is grappled; calot automatically bites for 1d8+1 each round while pinning)'
    ],
    hitLocationTemplateId: 'quadruped'
  },
  {
    id: 'white_ape_barsoom',
    name: 'White Ape of Barsoom',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'uncommon',
    terrain: ['barsoom-city', 'barsoom-dead-sea'],
    description: 'Towering white-furred apes fifteen feet tall, with four arms arranged in two pairs at shoulder and waist. White apes are used as arena beasts and guard animals, and also roam the ruins of dead cities in small territorial bands. Their four arms allow simultaneous attacks that can overwhelm an armored defender within seconds.',
    stats: { STR: 28, CON: 20, SIZ: 26, DEX: 12, INT: 5, POW: 8, CHA: 3 },
    hitPoints: 23,
    armor: 1,
    armorDescription: 'thick fur and hide',
    movement: 12,
    attacks: [
      { name: 'Upper arm (left)', damage: '1d8+5', skill: 65 },
      { name: 'Upper arm (right)', damage: '1d8+5', skill: 65 },
      { name: 'Lower arm (left)', damage: '1d6+5', skill: 60 },
      { name: 'Lower arm (right)', damage: '1d6+5', skill: 60 },
      { name: 'Bite/tusk', damage: '1d6+5', skill: 55 }
    ],
    specialAbilities: [
      'Four arms (may attack with up to 4 limbs per round; each attack after the first is at -10% cumulative)',
      'Wall-climber (can scale vertical stone and metal surfaces at half movement)',
      'Territorial fury (when defending its lair or arena, gains +10% to all attacks)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'plant_man_barsoom',
    name: 'Plant Man (Valley Dor)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'chaos',
    rarity: 'uncommon',
    terrain: ['valley-dor'],
    description: 'The nightmarish inhabitants of the Valley Dor — creatures neither fully animal nor fully vegetable. Plant men stand seven feet tall with smooth pallid bodies and sucker-tipped tentacle arms used to drain blood from prey. They exist to feed the sacred valley, preying on the pilgrims who travel the River Iss believing they journey to paradise.',
    stats: { STR: 18, CON: 16, SIZ: 16, DEX: 10, INT: 3, POW: 8, CHA: 1 },
    hitPoints: 16,
    armor: 2,
    armorDescription: 'fibrous vegetable hide',
    movement: 8,
    attacks: [
      { name: 'Tentacle (left)', damage: '1d6+2', skill: 55 },
      { name: 'Tentacle (right)', damage: '1d6+2', skill: 55 },
      { name: 'Blood drain (grappled)', damage: '1d4 per round', skill: 50 }
    ],
    specialAbilities: [
      'Blood drain (if tentacle grapple succeeds, automatically drains 1d4 HP/round; the drained blood nourishes the plant man)',
      'Vegetable constitution (immune to poison, disease, and fatigue; does not need to breathe)',
      'Coordinated swarm (two or more plant men attacking the same target gain +10% to grapple attempts)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'apt_barsoom',
    name: 'Apt (4-armed Arctic Beast)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'beast',
    rarity: 'rare',
    terrain: ['mountains', 'tundra'],
    description: 'The great white hunting beast of Barsoom\'s polar regions — a massive predator whose thick albino fur renders it nearly invisible against snow and ice. The apt has four powerful arms ending in raking claws and a lion-like head with great curved tusks. It is the apex predator of the Okar domain and feared even by Yellow Martian warriors.',
    stats: { STR: 26, CON: 20, SIZ: 24, DEX: 10, INT: 3, POW: 8, CHA: 2 },
    hitPoints: 22,
    armor: 3,
    armorDescription: 'thick albino fur and hide',
    movement: 14,
    attacks: [
      { name: 'Upper claw (left)', damage: '1d8+4', skill: 60 },
      { name: 'Upper claw (right)', damage: '1d8+4', skill: 60 },
      { name: 'Lower claw (left)', damage: '1d8+4', skill: 55 },
      { name: 'Lower claw (right)', damage: '1d8+4', skill: 55 },
      { name: 'Bite (tusks)', damage: '1d10+4', skill: 55 }
    ],
    specialAbilities: [
      'Arctic camouflage (in snow or ice terrain, +40% to any ambush or surprise attack)',
      'Four arms (may attack with up to 4 claws per round; each after the first at -10% cumulative)',
      'Smash (can break through wooden barriers and stone walls up to 1 foot thick)'
    ],
    hitLocationTemplateId: 'humanoid'
  },

  // Humanoids & Intelligent Creatures
  {
    id: 'thark_warrior_barsoom',
    name: 'Green Martian (Thark) Warrior',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'humanoid',
    rarity: 'common',
    terrain: ['barsoom-dead-sea', 'barsoom-city', 'barsoom-aerial'],
    description: 'The Green Martians are the nomadic warrior hordes of Barsoom — fifteen feet tall, four-armed, tusked, and raised without love. Drilled in warfare from birth, they respect courage above all else and nothing else. The Tharks are the most prominent horde, and Tars Tarkas their greatest Jeddak.',
    stats: { STR: 26, CON: 20, SIZ: 28, DEX: 14, INT: 10, POW: 10, CHA: 6 },
    hitPoints: 24,
    armor: 2,
    armorDescription: 'partial metal harness over natural toughness',
    movement: 14,
    attacks: [
      { name: 'Radium rifle', damage: '3d6', skill: 60 },
      { name: 'Long sword (upper)', damage: '1d8+5', skill: 65 },
      { name: 'Long sword (lower)', damage: '1d8+5', skill: 60 },
      { name: 'Pistol (lower)', damage: '1d6+5', skill: 55 }
    ],
    specialAbilities: [
      'Four arms (can fire rifle while wielding two swords and a pistol simultaneously; no penalty for holding multiple weapons)',
      'Limited telepathy (can sense the emotional state of creatures within 30m; cannot read specific thoughts)',
      'Hardened upbringing (immune to fear effects; morale never breaks while Jeddak is alive and visible)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'red_martian_soldier_barsoom',
    name: 'Red Martian Soldier',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'common',
    terrain: ['barsoom-city', 'barsoom-aerial', 'barsoom-dead-sea'],
    description: 'The red Martians are the dominant human civilization of Barsoom — copper-skinned, adapted over millennia to their planet\'s lower gravity. A trained soldier is extraordinarily agile: they leap distances and recover from falls that would kill a surface-worlder. Standard rank-and-file of all city-state armies.',
    stats: { STR: 13, CON: 13, SIZ: 12, DEX: 18, INT: 12, POW: 12, CHA: 13 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'Barsoomian metal harness and partial plate',
    movement: 14,
    attacks: [
      { name: 'Radium pistol', damage: '1d8+2', skill: 70 },
      { name: 'Long sword', damage: '1d8+2', skill: 70 },
      { name: 'Dagger', damage: '1d4+2', skill: 60 }
    ],
    specialAbilities: [
      'Low-gravity acrobatics (+20% to all dodge actions and any roll involving leaping or falling)',
      'Trained swordsman (may parry once per round with long sword without using an action)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'first_born_pirate_barsoom',
    name: 'First Born (Black Martian) Pirate',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'humanoid',
    rarity: 'uncommon',
    terrain: ['valley-dor', 'barsoom-aerial'],
    description: 'The First Born — black-skinned, athletic, supremely arrogant — believe themselves the original race of Barsoom. Operating from the hidden underground sea of Omean beneath the Valley Dor, they prey on pilgrim ships from the River Iss. To uninitiated red Martians, they are gods. In truth they are the most dangerous pirates on the planet.',
    stats: { STR: 16, CON: 15, SIZ: 14, DEX: 17, INT: 12, POW: 13, CHA: 13 },
    hitPoints: 15,
    armor: 3,
    armorDescription: 'finest Barsoomian metal armor',
    movement: 14,
    attacks: [
      { name: 'Long sword', damage: '1d8+2', skill: 75 },
      { name: 'Radium pistol', damage: '1d8+2', skill: 70 },
      { name: 'Dagger', damage: '1d4+2', skill: 65 }
    ],
    specialAbilities: [
      'Naval boarding (+15% to all attack rolls during ship or vessel boarding actions)',
      'Elite swordsmanship (+10% when outnumbering a single target 2:1 or more)',
      'Supreme confidence (immune to intimidation from anyone they consider lesser — which is everyone)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'thern_barsoom',
    name: 'Thern (White Martian False Priest)',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'chaos',
    rarity: 'uncommon',
    terrain: ['valley-dor', 'barsoom-city'],
    description: 'White-skinned, golden-wigged priests who maintain the Valley Dor\'s sacred illusion. They convince all red Martians that the River Iss leads to paradise; in reality it leads to the plant men, the First Born, and death. Therns use psychological manipulation, cult authority, and genuine psychic ability to sustain their civilization-scale deception.',
    stats: { STR: 14, CON: 13, SIZ: 13, DEX: 15, INT: 16, POW: 15, CHA: 17 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'white robes over concealed metal harness',
    movement: 12,
    attacks: [
      { name: 'Long sword', damage: '1d8+2', skill: 65 },
      { name: 'Radium pistol', damage: '1d8+2', skill: 60 },
      { name: 'Telepathic suggestion', damage: 'POW vs POW (special)', skill: 75 }
    ],
    specialAbilities: [
      'Cult authority (pilgrims and uninitiated red Martians obey Thern commands automatically; the deception is total)',
      'Telepathic suggestion (POW vs POW contest; success causes target to believe one false statement for 1d6 hours)',
      'Escape reflex (+30% to any disengage action when personally threatened)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'zodangan_soldier_barsoom',
    name: 'Zodangan Soldier',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'common',
    terrain: ['barsoom-city', 'barsoom-aerial', 'barsoom-dead-sea'],
    description: 'Zodanga — Helium\'s great rival, a city that moves across the Barsoomian wastes on enormous metal legs — fields professional, disciplined, and considerably more ruthless soldiers than most city-states. Zodangan forces fight in tight formations and respect strength above sentiment.',
    stats: { STR: 14, CON: 13, SIZ: 13, DEX: 16, INT: 11, POW: 11, CHA: 11 },
    hitPoints: 13,
    armor: 2,
    armorDescription: 'Zodangan standard harness and plate',
    movement: 14,
    attacks: [
      { name: 'Radium pistol', damage: '1d8+2', skill: 65 },
      { name: 'Long sword', damage: '1d8+2', skill: 65 }
    ],
    specialAbilities: [
      'Formation discipline (+10% to attack rolls when fighting in a coordinated squad of 5 or more)',
      'Ruthless orders (Zodangan soldiers never offer quarter unless specifically ordered to)'
    ],
    hitLocationTemplateId: 'humanoid'
  },

  // NPCs
  {
    id: 'john_carter_barsoom',
    name: 'John Carter, Warlord of Mars',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'legendary',
    terrain: ['barsoom-dead-sea', 'barsoom-city', 'valley-dor', 'barsoom-aerial'],
    description: 'A Virginia gentleman and former Confederate officer transported to Barsoom through means he never fully understood. Earth physiology on Mars translates into superhuman strength, speed, and agility. He is also the finest swordsman on two worlds. His defining qualities are an unbreakable personal code of honor, an inability to leave someone helpless, and the will to survive circumstances that should be fatal.',
    stats: { STR: 20, CON: 18, SIZ: 14, DEX: 20, INT: 16, POW: 16, CHA: 17 },
    hitPoints: 16,
    armor: 2,
    armorDescription: 'Barsoomian metal harness',
    movement: 18,
    attacks: [
      { name: 'Long sword', damage: '1d8+3', skill: 90 },
      { name: 'Radium pistol', damage: '1d8+3', skill: 80 },
      { name: 'Grapple/unarmed', damage: '1d6+3', skill: 85 }
    ],
    specialAbilities: [
      'Earth physiology (Martian gravity amplifies STR, DEX, and movement; stats already reflect this advantage)',
      'Legendary swordsman (scores a critical hit when skill roll succeeds by 30 or more points)',
      'Unbreakable will (once per combat, may reroll any death or incapacitation check)',
      'Code of honor (cannot willingly leave a helpless person in danger — story constraint, not mechanical weakness)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'dejah_thoris_barsoom',
    name: 'Dejah Thoris, Princess of Helium',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'legendary',
    terrain: ['barsoom-city', 'valley-dor'],
    description: 'Princess of Helium and the most celebrated figure on Barsoom. Dejah Thoris is not passive: she understands politics, commands loyalty, possesses scientific expertise, and will fight to the death when cornered. She has been captured repeatedly and escaped or survived every time through her own resourcefulness. Her capture incites the first Barsoom novel; she is nobody\'s helpless prize.',
    stats: { STR: 10, CON: 12, SIZ: 10, DEX: 16, INT: 18, POW: 16, CHA: 20 },
    hitPoints: 11,
    armor: 0,
    armorDescription: 'none',
    movement: 12,
    attacks: [
      { name: 'Dagger', damage: '1d4+1', skill: 55 }
    ],
    specialAbilities: [
      'Brilliant scientist (can identify and operate any Barsoomian device; improvise technical solutions under pressure)',
      'Royal authority of Helium (every loyal Heliumite will die for her; her word is law in Helium)',
      'Force of personality (CHA 20; hostile humanoids must pass POW×3 to directly harm her in non-combat contexts)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'tars_tarkas_barsoom',
    name: 'Tars Tarkas, Jeddak of Thark',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'legendary',
    terrain: ['barsoom-dead-sea', 'barsoom-city'],
    description: 'The greatest warrior of the Thark horde and its elected Jeddak — the only Green Martian to have survived long enough, and won enough respect, to rule. Tars Tarkas is unusual among his people in being capable of friendship. His bond with John Carter is the core relationship of the first Barsoom trilogy. In battle he is without peer among the Green Martians.',
    stats: { STR: 28, CON: 22, SIZ: 30, DEX: 16, INT: 14, POW: 14, CHA: 12 },
    hitPoints: 26,
    armor: 3,
    armorDescription: 'Thark chieftain\'s heavy metal harness and war trophies',
    movement: 16,
    attacks: [
      { name: 'Long sword (upper pair)', damage: '2d8+6', skill: 85 },
      { name: 'Radium rifle', damage: '3d6', skill: 70 },
      { name: 'Pistol (lower pair)', damage: '1d6+6', skill: 75 }
    ],
    specialAbilities: [
      'Jeddak\'s authority (all Tharks within sight fight at +15% while Tars Tarkas stands)',
      'Legendary warrior (scores critical hits when skill roll succeeds by 20 or more points)',
      'Friendship bond (gains +20% to all rolls when John Carter is present and in mortal danger)',
      'Four arms (can simultaneously use rifle and pistols while wielding swords; no multi-weapon penalty)'
    ],
    hitLocationTemplateId: 'humanoid'
  },
  {
    id: 'kantos_kan_barsoom',
    name: 'Kantos Kan, Heliumite Officer',
    gameSystem: 'runequest',
    gameSystems: ['runequest', 'dragonbane', 'kal-arath', 'osric'],
    category: 'npc',
    rarity: 'uncommon',
    terrain: ['barsoom-city', 'barsoom-aerial'],
    description: 'A senior officer of Helium\'s navy and one of John Carter\'s earliest and most reliable red Martian allies. Kantos Kan is a gifted aerial flier pilot, a skilled swordsman, and a man of absolute loyalty who has survived encounters that would have killed most soldiers. He serves as the practical military liaison between John Carter and Heliumite forces.',
    stats: { STR: 15, CON: 14, SIZ: 13, DEX: 17, INT: 14, POW: 13, CHA: 15 },
    hitPoints: 14,
    armor: 2,
    armorDescription: 'officer\'s Heliumite harness and plate',
    movement: 14,
    attacks: [
      { name: 'Long sword', damage: '1d8+2', skill: 75 },
      { name: 'Radium pistol', damage: '1d8+2', skill: 70 }
    ],
    specialAbilities: [
      'Expert aerial navigator (can pilot any Barsoomian flier at full capability; improvise repairs under fire)',
      'Tactical coordination (can organize up to 20 soldiers into an effective unit with one minute of preparation)',
      'Loyal to the last (will never abandon John Carter or Dejah Thoris regardless of odds)'
    ],
    hitLocationTemplateId: 'humanoid'
  }
];
