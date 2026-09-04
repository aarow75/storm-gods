import { CharacterStats } from '@shared/models/character-stats.model';
import { FANTASY_NAMES } from '@characters/constants/fantasy-names.constants';
import { WeaponDefinition, ShieldDefinition, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, WEAPON_SKILLS, Resources } from '@characters/models/character.model';
import { DB_SKILLS, DB_MAGIC_SKILLS, DB_SKILL_BY_ATTR, DB_SKILL_CATEGORIES } from '@characters/constants/skill-categories.constants';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses, ToHitMechanic,
  ArmorModel, InitiativeMechanic
} from './game-system-rules.interface';
import {
  SpellEffect, CastCheck, CastableSpell, SpellCasterInfo,
  buildSpellEffectIndex, normalizeSpellName
} from './spell-effects.model';

// Six conditions from the rulebook, each tied to an attribute. Suffering a condition
// imposes a bane on rolls using that attribute. All 6 = cannot push rolls.
const CONDITIONS: ConditionDefinition[] = [
  { name: 'Exhausted',      effect: 'Bane on AGL rolls' },
  { name: 'Sickly',         effect: 'Bane on CON rolls' },
  { name: 'Dazed',          effect: 'Bane on INT rolls' },
  { name: 'Angry',          effect: 'Bane on CHA rolls' },
  { name: 'Scared',         effect: 'Bane on WIL rolls' },
  { name: 'Grievous Wound', effect: 'Bane on STR rolls' },
];

// Dragonbane uses STR, CON, AGL (mapped to DEX field), INT, WIL (mapped to POW field), CHA.
// SIZ is hidden — not a Dragonbane attribute.
const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',    visible: true  },
  { key: 'CON', label: 'CON (Constitution)', visible: true  },
  { key: 'SIZ', label: 'SIZ (Size)',         visible: false },
  { key: 'DEX', label: 'AGL (Agility)',      visible: true  },
  { key: 'INT', label: 'INT (Intelligence)', visible: true  },
  { key: 'POW', label: 'WIL (Willpower)',    visible: true  },
  { key: 'CHA', label: 'CHA (Charisma)',     visible: true  },
];

// Armor types from the core rulebook with correct AR values.
// Helmets (+1 or +2 AR) are additive on top of body armor but not modeled here yet.
const ARMOR_TYPES: ArmorTypeDefinition[] = [
  { name: 'None',            points: 0 },
  { name: 'Leather',         points: 1 },
  { name: 'Studded Leather', points: 2 },
  { name: 'Chain Mail',      points: 3 },
  { name: 'Plate Armor',     points: 4 },
  { name: 'Full Plate',      points: 6 },
];

// Full melee weapon list from the Dragonbane core rulebook with correct damage dice.
// minSTR reflects the STR requirement listed in the rulebook.
const WEAPON_LIST: WeaponDefinition[] = [
  // 1H melee — reach
  { name: 'Knife',            damage: '1d6',  defaultSkill: 'Knives (AGL)',  strikeRank: 0, encumbrance: 0, hitPoints: 6,  minSTR: 0,  minDEX: 0, cost: 5,   isMissile: false, canParry: true },
  { name: 'Short Sword',      damage: '1d6',  defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0,  minDEX: 0, cost: 30,  isMissile: false, canParry: true },
  { name: 'Sword',            damage: '1d8',  defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 12, minSTR: 0,  minDEX: 0, cost: 50,  isMissile: false, canParry: true },
  { name: 'Scimitar',         damage: '1d8',  defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 12, minSTR: 0,  minDEX: 0, cost: 60,  isMissile: false, canParry: true },
  { name: 'Falchion',         damage: '1d8',  defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 12, minSTR: 0,  minDEX: 0, cost: 45,  isMissile: false, canParry: true },
  { name: 'Handaxe',          damage: '1d8',  defaultSkill: 'Axes (STR)',    strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 20,  isMissile: false, canParry: true },
  { name: 'Club',             damage: '1d6',  defaultSkill: 'Hammers (STR)', strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 1,   isMissile: false, canParry: true },
  { name: 'Mace',             damage: '1d8',  defaultSkill: 'Hammers (STR)', strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0,  minDEX: 0, cost: 40,  isMissile: false, canParry: true },
  { name: 'Flail',            damage: '1d8',  defaultSkill: 'Hammers (STR)', strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 30,  isMissile: false, canParry: false },
  { name: 'Spear',            damage: '1d8',  defaultSkill: 'Spears (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0,  minDEX: 0, cost: 10,  isMissile: false, canParry: true },
  { name: 'Staff',            damage: '1d6',  defaultSkill: 'Staves (AGL)',  strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 2,   isMissile: false, canParry: true },
  { name: 'Torch',            damage: '1d4',  defaultSkill: 'Hammers (STR)', strikeRank: 0, encumbrance: 1, hitPoints: 4,  minSTR: 0,  minDEX: 0, cost: 1,   isMissile: false, canParry: false },
  // 2H melee — long, STR requirements
  { name: 'Battleaxe',        damage: '1d10', defaultSkill: 'Axes (STR)',    strikeRank: 0, encumbrance: 2, hitPoints: 10, minSTR: 13, minDEX: 0, cost: 50,  isMissile: false, canParry: false },
  { name: 'Great Axe',        damage: '1d12', defaultSkill: 'Axes (STR)',    strikeRank: 0, encumbrance: 2, hitPoints: 12, minSTR: 15, minDEX: 0, cost: 70,  isMissile: false, canParry: false },
  { name: 'Warhammer',        damage: '1d10', defaultSkill: 'Hammers (STR)', strikeRank: 0, encumbrance: 2, hitPoints: 10, minSTR: 13, minDEX: 0, cost: 60,  isMissile: false, canParry: false },
  { name: 'Halberd',          damage: '1d10', defaultSkill: 'Spears (STR)',  strikeRank: 0, encumbrance: 2, hitPoints: 12, minSTR: 13, minDEX: 0, cost: 50,  isMissile: false, canParry: false },
  { name: 'Pike',             damage: '1d10', defaultSkill: 'Spears (STR)',  strikeRank: 0, encumbrance: 2, hitPoints: 12, minSTR: 15, minDEX: 0, cost: 30,  isMissile: false, canParry: false },
  { name: 'Two-Handed Sword', damage: '1d12', defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 2, hitPoints: 14, minSTR: 15, minDEX: 0, cost: 120, isMissile: false, canParry: false },
  // Ranged
  { name: 'Short Bow',        damage: '1d6',  defaultSkill: 'Bows (AGL)',       strikeRank: 0, encumbrance: 1, hitPoints: 6,  minSTR: 0,  minDEX: 0, cost: 30,  isMissile: true, range: '30/60',  rateOfFire: 1, canParry: false },
  { name: 'Bow',              damage: '1d8',  defaultSkill: 'Bows (AGL)',       strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 11, minDEX: 0, cost: 60,  isMissile: true, range: '60/120', rateOfFire: 1, canParry: false },
  { name: 'Long Bow',         damage: '1d10', defaultSkill: 'Bows (AGL)',       strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 14, minDEX: 0, cost: 100, isMissile: true, range: '90/180', rateOfFire: 1, canParry: false },
  { name: 'Crossbow',         damage: '1d8',  defaultSkill: 'Crossbows (AGL)', strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 80,  isMissile: true, range: '60/120', rateOfFire: 1, canParry: false },
  { name: 'Heavy Crossbow',   damage: '1d10', defaultSkill: 'Crossbows (AGL)', strikeRank: 0, encumbrance: 2, hitPoints: 10, minSTR: 13, minDEX: 0, cost: 120, isMissile: true, range: '90/180', rateOfFire: 1, canParry: false },
  { name: 'Sling',            damage: '1d6',  defaultSkill: 'Bows (AGL)',       strikeRank: 0, encumbrance: 0, hitPoints: 4,  minSTR: 0,  minDEX: 0, cost: 1,   isMissile: true, range: '30/60',  rateOfFire: 1, canParry: false },
];

// In Dragonbane a shield adds +1 AR and uses the Shields (STR) skill.
// protectedLocations is unused (Dragonbane has no per-location armor).
const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Shield', armorPoints: 1, hitPoints: 10, encumbrance: 1, cost: 20, protectedLocations: [] },
];

function getBaseChance(attrValue: number): number {
  if (attrValue <= 5)  return 3;
  if (attrValue <= 8)  return 4;
  if (attrValue <= 12) return 5;
  if (attrValue <= 15) return 6;
  return 7;
}

// Dragonbane damage bonus is based on STR (≤12: none, 13–16: +D4, 17+: +D6)
function getDamageBonus(str: number): string {
  if (str >= 17) return '+1d6';
  if (str >= 13) return '+1d4';
  return '0';
}

// Movement base varies by Kin. The Kin is stored in background.homeland.
const KIN_MOVEMENT_BASE: Record<string, number> = {
  'Human':   10,
  'Halfling': 8,
  'Dwarf':    8,
  'Elf':     10,
  'Mallard':  8,
  'Wolfkin': 12,
};

// AGL modifier to base movement (AGL is stored in the DEX field)
function getAglMovementModifier(agl: number): number {
  if (agl <= 6)  return -4;
  if (agl <= 9)  return -2;
  if (agl <= 12) return 0;
  if (agl <= 15) return 2;
  return 4;
}

// Stat field that drives each DB attribute (AGL stored in DEX, WIL stored in POW)
const DB_ATTR_TO_STAT: Record<string, keyof CharacterStats> = {
  STR: 'STR',
  INT: 'INT',
  AGL: 'DEX',
  CHA: 'CHA',
};

// Build a flat map of skill name → attribute key for fast lookup
const SKILL_TO_ATTR: Record<string, string> = {};
for (const [attr, skills] of Object.entries(DB_SKILL_BY_ATTR)) {
  for (const skill of skills) {
    SKILL_TO_ATTR[skill] = attr;
  }
}

// 8 trained skills per profession matching the core rulebook.
// For Mage, General Magic + Animism are listed as defaults (player may swap to another school).
// Peddler, Rogue, Artisan, and Priest are not in the core rulebook but kept for flexibility.
const DB_PROFESSION_TRAINED_SKILLS: Record<string, string[]> = {
  'Fighter':  ['Axes (STR)', 'Swords (STR)', 'Spears (STR)', 'Hammers (STR)', 'Knives (AGL)', 'Bows (AGL)', 'Evade (AGL)', 'Awareness (INT)'],
  'Hunter':   ['Bows (AGL)', 'Knives (AGL)', 'Hunting & Fishing (AGL)', 'Bushcraft (INT)', 'Sneaking (AGL)', 'Awareness (INT)', 'Evade (AGL)', 'Crossbows (AGL)'],
  'Minstrel': ['Music & Dance (CHA)', 'Persuasion (CHA)', 'Performance (CHA)', 'Swords (STR)', 'Knives (AGL)', 'Languages (INT)', 'Awareness (INT)', 'Sneaking (AGL)'],
  'Mage':     ['Evade (AGL)', 'Awareness (INT)', 'Knives (AGL)', 'Staves (AGL)', 'General Magic (INT)', 'Animism (INT)', 'Languages (INT)', 'Myths & Legends (INT)'],
  'Mariner':  ['Seamanship (INT)', 'Swimming (AGL)', 'Swords (STR)', 'Knives (AGL)', 'Crossbows (AGL)', 'Acrobatics (AGL)', 'Awareness (INT)', 'Evade (AGL)'],
  'Knight':   ['Swords (STR)', 'Axes (STR)', 'Spears (STR)', 'Hammers (STR)', 'Shields (STR)', 'Riding (AGL)', 'Evade (AGL)', 'Awareness (INT)'],
  'Merchant': ['Persuasion (CHA)', 'Bartering (CHA)', 'Awareness (INT)', 'Swords (STR)', 'Knives (AGL)', 'Riding (AGL)', 'Languages (INT)', 'Myths & Legends (INT)'],
  'Scholar':  ['Myths & Legends (INT)', 'Languages (INT)', 'Healing (INT)', 'Awareness (INT)', 'Staves (AGL)', 'Knives (AGL)', 'Lore (INT)', 'Sneaking (AGL)'],
  'Thief':    ['Sneaking (AGL)', 'Sleight of Hand (AGL)', 'Acrobatics (AGL)', 'Knives (AGL)', 'Swords (STR)', 'Awareness (INT)', 'Evade (AGL)', 'Lock Picking (AGL)'],
  'Rider':    ['Riding (AGL)', 'Spears (STR)', 'Bows (AGL)', 'Swords (STR)', 'Knives (AGL)', 'Animal Handling (CHA)', 'Awareness (INT)', 'Evade (AGL)'],
  // Non-core professions — kept for flexibility, mapped to closest official skills
  'Peddler':  ['Bartering (CHA)', 'Persuasion (CHA)', 'Sneaking (AGL)', 'Sleight of Hand (AGL)', 'Languages (INT)', 'Awareness (INT)', 'Knives (AGL)', 'Riding (AGL)'],
  'Rogue':    ['Sneaking (AGL)', 'Sleight of Hand (AGL)', 'Knives (AGL)', 'Awareness (INT)', 'Evade (AGL)', 'Lock Picking (AGL)', 'Swords (STR)', 'Acrobatics (AGL)'],
  'Artisan':  ['Lore (INT)', 'Bartering (CHA)', 'Persuasion (CHA)', 'Languages (INT)', 'Awareness (INT)', 'Knives (AGL)', 'Staves (AGL)', 'Riding (AGL)'],
  'Priest':   ['Myths & Legends (INT)', 'Languages (INT)', 'Healing (INT)', 'Persuasion (CHA)', 'Awareness (INT)', 'Lore (INT)', 'Animism (INT)', 'General Magic (INT)'],
};

// Age stat modifiers from the rulebook: Young (≤20) → AGL+1/CON+1; Old (≥40) → STR/AGL/CON -2, INT/WIL +1
function getAgeModifiers(age: number): Partial<Record<keyof CharacterStats, number>> {
  if (age <= 20) return { DEX: 1, CON: 1 };
  if (age >= 40) return { STR: -2, DEX: -2, CON: -2, INT: 1, POW: 1 };
  return {};
}

// Age modifiers adjust the attributes themselves, so they must feed HP (CON), WP (WIL),
// movement (AGL), damage bonus and encumbrance (STR) as well as skill base chances.
function applyAgeModifiers(stats: CharacterStats, age: number): CharacterStats {
  const adjusted = { ...stats };
  for (const [key, delta] of Object.entries(getAgeModifiers(age)) as [keyof CharacterStats, number][]) {
    adjusted[key] = Math.min(18, Math.max(1, (adjusted[key] ?? 10) + delta));
  }
  return adjusted;
}

export const DB_SPELLS_BY_DISCIPLINE: Record<string, string[]> = {
  'Animism': [
    'Animal Friendship', 'Bewitch Animal', 'Commune with Nature', 'Drain Life Force',
    'Find the Path', 'Life Sense', "Nature's Armor", "Nature's Servant",
    'Pass Without Trace', 'Plant Growth', 'Purify', 'Spirit Ward', 'Tree Walk', 'Warp Wood',
  ],
  'Elementalism': [
    'Air Elemental', 'Breathe Water', 'Call Lightning', 'Dust Devil', 'Earth Strength',
    'Earthquake', 'Extinguish', 'Fire Elemental', 'Flaming Weapon', 'Freeze',
    'Gust of Wind', 'Ice Blast', 'Stone Skin', 'Tornado', 'Water Elemental',
  ],
  'General Magic': [
    'Cantrip', 'Comprehend Language', 'Fetch', 'Flaming Hands', 'Harm', 'Heal',
    'Identify', 'Illusion', 'Knock', 'Levitate', 'Light', 'Lock', 'Mend',
    'Missile Shield', 'Protection', 'Push/Pull', 'Reveal/Conceal', 'Second Sight',
    'Silence', 'Sleep', 'Sneak', 'Stun',
  ],
  'Mentalism': [
    'Calm', 'Daze', 'Detect Thoughts', 'Dominate', 'Fear', 'Forget', 'Hallucination',
    'Haste', 'Hex', 'Invisibility', 'Mental Blast', 'Mind Bond', 'Mind Shield',
    'Paralyze', 'Project Mind', 'See Through Eyes', 'Suggestion', 'Telekinesis',
    'Terror', 'True Sight',
  ],
};

// Combat spell effects, from public/docs/Dragonbane-Spells.md. All spells are
// cast at power level 1 in the combat tracker (2 WP; magic tricks cost 1 WP and
// always succeed). WP is spent even when the casting roll fails.
export const DB_SPELL_EFFECTS: SpellEffect[] = [
  // General Magic
  { name: 'Cantrip', target: 'self', kind: 'utility', autoSuccess: true, wpCost: 1,
    description: 'A minor, harmless display of magic — always succeeds' },
  { name: 'Flaming Hands', target: 'enemy', kind: 'damage', notation: '2d6',
    description: '2m cone — apply to any other targets in the cone manually' },
  { name: 'Harm', target: 'enemy', kind: 'damage', notation: '2d6', ignoresArmor: true,
    description: 'No effect on the undead' },
  { name: 'Heal', target: 'ally', kind: 'healing', notation: '2d6' },
  { name: 'Push/Pull', target: 'enemy', kind: 'utility',
    description: 'Target shoved 2d4 meters; takes that much bludgeoning damage if it strikes something solid' },
  { name: 'Stun', target: 'enemy', kind: 'utility',
    description: 'Target must make a WIL roll or become Dazed and lose their next action' },
  { name: 'Sleep', target: 'enemy', kind: 'utility',
    description: 'Target must succeed with a WIL roll or sleep for a stretch (Dazed on a success)' },
  // Animism
  { name: 'Drain Life Force', target: 'enemy', kind: 'damage', notation: '2d6',
    description: 'Opposed by CON; the caster regains the same amount of HP — apply manually. No effect on undead/monsters' },
  { name: "Nature's Armor", target: 'self', kind: 'utility',
    description: 'Bark and vines give armor rating 2 — apply manually' },
  // Elementalism
  { name: 'Call Lightning', target: 'enemy', kind: 'damage', notation: '3d6',
    description: 'Requires clouds above; anyone adjacent takes half — apply manually' },
  { name: 'Gust of Wind', target: 'enemy', kind: 'damage', notation: '2d4',
    description: '10m cone: targets pushed 2d4m and take that much bludgeoning damage (2d6 vs swarms)' },
  { name: 'Ice Blast', target: 'enemy', kind: 'damage', notation: '2d8',
    description: 'On a hit the target must make a STR roll or be Frozen in place' },
  { name: 'Tornado', target: 'enemy', kind: 'damage', notation: '2d6',
    description: '20m range, concentration: touched creatures are flung 2d6m and take that much bludgeoning damage; Large/Huge monsters unaffected' },
  { name: 'Earthquake', target: 'enemy', kind: 'utility',
    description: 'Everyone in the area: EVADE roll or fall and take 2d6 bludgeoning damage' },
  { name: 'Flaming Weapon', target: 'self', kind: 'utility',
    description: 'One weapon deals an extra d6 fire damage — set weapon damage manually' },
  { name: 'Stone Skin', target: 'self', kind: 'utility',
    description: 'Skin gains armor rating 4 — apply manually' },
  { name: 'Freeze', target: 'enemy', kind: 'utility',
    description: 'Target movement halved and bane on AGL rolls until your next turn' },
  { name: 'Dust Devil', target: 'enemy', kind: 'utility',
    description: 'Target gets a bane on attacks and AWARENESS until your next turn' },
  // Mentalism
  { name: 'Mental Blast', target: 'enemy', kind: 'damage', notation: '2d6', ignoresArmor: true,
    description: 'Opposed by WIL; no effect on mindless creatures' },
  { name: 'Daze', target: 'enemy', kind: 'utility',
    description: 'Target must make a WIL roll or become Dazed with a bane on their next roll' },
  { name: 'Fear', target: 'enemy', kind: 'utility',
    description: 'Target must make a WIL roll or become Scared and flee for one stretch' },
  { name: 'Paralyze', target: 'enemy', kind: 'utility',
    description: 'Opposed by WIL: the victim can neither move nor act for a round. No effect on monsters' },
];

const DB_SPELL_EFFECT_INDEX = buildSpellEffectIndex(DB_SPELL_EFFECTS);

// Magical Mishap table (Demon roll), from public/docs/Dragonbane-Spells.md
export const DB_MAGICAL_MISHAPS: string[] = [
  'The magical powers leave you Dazed.',
  'The spellcasting suddenly makes you Exhausted.',
  'The energies take a toll on your body and make you Sickly.',
  'You lose control of the spell, which makes you very Angry.',
  'The spell subjects you to demonic visions that leave you Scared.',
  'You see the world beyond the veil and realize your own insignificance. You feel Disheartened.',
  'The magic ravages your body, inflicting D6 damage per power level.',
  'The spell drains your willpower and you lose D6 WP per power level.',
  'The spell gives rise to a magical disease with virulence 3D6.',
  'Another random spell of yours activates instead, with the same target and power level.',
  'You vomit a frog the moment you tell a lie. Roll D4 every morning; on a 1 it wears off.',
  'Any gold or silver you touch withers into dust. Roll D4 every morning; on a 1 it wears off.',
  'The spell blinds you; you act as if in total darkness. Roll D4 every morning; on a 1 you recover.',
  'Amnesia — you forget who you and the other player characters are.',
  'The spell also affects a friend or other unintended victim.',
  'The spell backfires: an offensive spell affects you instead; a protecting or healing spell inflicts damage instead.',
  'You turn into an animal (D6: 1 cat, 2 fox, 3 goat, 4 wolf, 5 deer, 6 bear), retaining your mental acuity.',
  'You become one age category younger. Permanent.',
  'You become one age category older. Permanent.',
  'Your magic attracts a demon from another dimension. It shows up within the next shift.',
];

export class DragonbaneRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  calculateDerivedStats(
    rawStats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[],
    background?: BackgroundForBonuses,
    _armorType?: string
  ): DerivedStats {
    const stats = applyAgeModifiers(rawStats, background?.age ?? 21);
    const totalHP = stats.CON;

    // Encumbrance: max = half STR rounded up; over limit = bane on all physical rolls
    const maxEncumbrance = Math.ceil(stats.STR / 2);
    const equipmentENC = equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
    const weaponsENC = weapons.reduce((sum, w) => {
      const def = WEAPON_LIST.find(wd => wd.name === w.name);
      return sum + (def?.encumbrance ?? 0);
    }, 0);
    const shieldsENC = shields.reduce((sum, s) => {
      const def = SHIELD_LIST.find(sd => sd.name === s.name);
      return sum + (def?.encumbrance ?? 0);
    }, 0);
    const totalENC = equipmentENC + weaponsENC + shieldsENC;
    const overENC = Math.max(0, totalENC - maxEncumbrance);

    // Movement: kin base + AGL (DEX field) modifier. Over encumbrance gives bane (not movement loss).
    const kinBase = KIN_MOVEMENT_BASE[background?.homeland ?? ''] ?? 10;
    const aglMod = getAglMovementModifier(stats.DEX);
    const movementRate = Math.max(0, kinBase + aglMod);

    return {
      totalHitPoints: totalHP,
      maxHitPoints: totalHP,
      magicPoints: stats.POW,          // WIL (POW field) = Willpower Points
      damageBonus: getDamageBonus(stats.STR),
      spiritCombatDamage: '0',         // Not used in Dragonbane
      healingRate: 1,
      movementRate,
      strikeRank: 0,                   // Dragonbane uses initiative cards, not strike rank
      maxEncumbrance,
      totalEncumbrance: totalENC,
      encumbranceDefensePenalty: overENC > 0 ? 1 : 0, // 1 = over limit (bane on physical rolls)
    };
  }

  usesHitLocations(): boolean {
    return false;
  }

  calculateHitLocations(_stats: CharacterStats): null {
    return null;
  }

  getSkillDefinitions(): SkillDefinition[] {
    const allSkills = [...DB_SKILLS, ...DB_MAGIC_SKILLS, ...WEAPON_SKILLS];
    return allSkills.map(name => {
      const attr = SKILL_TO_ATTR[name];
      return { name, defaultValue: 0, attribute: attr };
    });
  }

  getDefaultSkills(): Record<string, number> {
    const skills: Record<string, number> = {};
    for (const s of DB_SKILLS) skills[s] = 0;
    for (const s of DB_MAGIC_SKILLS) skills[s] = 0;
    for (const s of WEAPON_SKILLS) skills[s] = 0;
    return skills;
  }

  getSkillCategories(): SkillCategory[] {
    return Object.entries(DB_SKILL_CATEGORIES).map(([name, skills]) => ({ name, skills }));
  }

  calculateSkillCategoryModifiers(stats: CharacterStats): Record<string, number> {
    return {
      STR: stats.STR,
      INT: stats.INT,
      AGL: stats.DEX,  // DEX field stores AGL in Dragonbane
      CHA: stats.CHA,
    };
  }

  applyBackgroundBonuses(
    skills: Record<string, number>,
    background: BackgroundForBonuses,
    stats?: CharacterStats
  ): Record<string, number> {
    const result = { ...skills };

    // Set every skill to its attribute-based chance
    if (stats) {
      // Apply age stat modifiers before computing base chances
      const adjustedStats = applyAgeModifiers(stats, background.age);

      for (const skill of Object.keys(result)) {
        const attr = SKILL_TO_ATTR[skill];
        if (!attr) continue;
        const statKey = DB_ATTR_TO_STAT[attr];
        if (!statKey) continue;
        result[skill] = getBaseChance(adjustedStats[statKey]);
      }
    }

    // Trained skills are doubled (base chance × 2)
    const professionSkills = DB_PROFESSION_TRAINED_SKILLS[background.occupation] ?? [];
    for (const skill of professionSkills) {
      if (result[skill] !== undefined) {
        result[skill] *= 2;
      }
    }

    return result;
  }

  getWeaponList(): WeaponDefinition[] {
    return WEAPON_LIST;
  }

  getShieldList(): ShieldDefinition[] {
    return SHIELD_LIST;
  }

  getArmorTypes(): ArmorTypeDefinition[] {
    return ARMOR_TYPES;
  }

  getConditions(): ConditionDefinition[] {
    return CONDITIONS;
  }

  getCharacterNames(): string[] {
    return FANTASY_NAMES;
  }

  getMagicSystemType(): string {
    return 'dragonbane';
  }

  getSpellEffect(spellName: string): SpellEffect | null {
    return DB_SPELL_EFFECT_INDEX.get(normalizeSpellName(spellName)) ?? null;
  }

  // Casting: d20 ≤ the school skill (e.g. 'Elementalism (INT)'). General Magic
  // spells can be cast with any school; we use the General Magic skill itself.
  getCastCheck(spell: CastableSpell, caster: SpellCasterInfo): CastCheck {
    if (spell.effect.autoSuccess) return { kind: 'auto' };
    const discipline = spell.discipline || 'General Magic';
    const skill = caster.skills[`${discipline} (INT)`] ?? 0;
    return { kind: 'd20-under', target: skill, label: discipline };
  }

  // Demon (20): the roll cannot be pushed and a magical mishap occurs.
  getCastFailureEffects(fumble: boolean): { logNotes: string[]; damageToCaster: number; blockCastingUntilRest: boolean } {
    if (!fumble) return { logNotes: [], damageToCaster: 0, blockCastingUntilRest: false };
    const roll = Math.floor(Math.random() * 20) + 1;
    return {
      logNotes: [`MAGICAL MISHAP (d20: ${roll}) — ${DB_MAGICAL_MISHAPS[roll - 1]}`],
      damageToCaster: 0,
      blockCastingUntilRest: false,
    };
  }

  // Dragonbane prices are listed in silver
  getCurrencyLabel(): string {
    return 'S';
  }

  getToHitMechanic(): ToHitMechanic { return { type: 'd20-under' }; }

  // Armor Rating subtracts flat from damage.
  getArmorModel(): ArmorModel { return { kind: 'flat' }; }

  // Initiative cards: each participant draws a unique card 1-10; low acts first.
  getInitiativeMechanic(): InitiativeMechanic { return { kind: 'unique-cards', deckSize: 10 }; }

  usesStrikeRank(): boolean { return false; }
  getInitiativeLabel(): string { return 'Initiative'; }
  getMovementInitiativeCost(_meters: number): number { return 0; }
  getSurpriseInitiativePenalty(_distanceMeters: number): number { return 0; }
  getHitLocationRollTable(): null { return null; }
  getLocationEffects(): null { return null; }
  getHitLocationsDisplayOrder(): string[] { return []; }
  getAttackBonuses(_stats: CharacterStats): { attack: number; parry: number; dodge: number } {
    return { attack: 0, parry: 0, dodge: 0 };
  }
  getParryRepeatPenalty(): number { return 0; }

  // Dragonbane reactions: parry with the weapon/Shields skill or dodge with EVADE.
  // A successful parry negates the damage; you may parry or dodge, not both.
  usesParryDodge(): boolean { return true; }
  getDodgeSkillName(): string { return 'Evade (AGL)'; }
  usesWeaponHP(): boolean { return false; }

  getSystemName(): string { return 'Dragonbane'; }
  getStatRange(): { min: number; max: number } { return { min: 1, max: 30 }; }
  canRollStats(): boolean { return true; }

  // Dragonbane attribute generation: 4d6, drop the lowest die
  rollStat(_stat: keyof CharacterStats): number {
    const rolls = [0, 0, 0, 0].map(() => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b);
    return rolls[1] + rolls[2] + rolls[3];
  }
  showsMagicPoints(): boolean { return true; }
  getMagicPointsLabel(): string { return 'WP'; }
  showsDamageBonus(): boolean { return true; }
  getDamageBonusLabel(): string { return 'Damage Bonus'; }
  showsHealingRate(): boolean { return false; }
  getHealingRateLabel(): string { return ''; }
  showsMovementRate(): boolean { return true; }
  getEncumbrancePenaltyText(_derivedStats: DerivedStats): string { return 'Bane on all physical rolls'; }

  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[] {
    return [
      { key: 'copper',           label: 'Copper',            hint: '10 copper = 1 silver' },
      { key: 'silver',           label: 'Silver',            hint: '10 silver = 1 gold' },
      { key: 'gold',             label: 'Gold' },
      { key: 'advancementMarks', label: 'Advancement Marks', hint: 'Roll D20 vs. skill to improve' },
    ];
  }

  getPrimaryWealthAmount(resources: Resources): number { return resources.silver ?? 0; }
  weaponSkillIsFixed(): boolean { return true; }
  weaponHasSelectableSkill(): boolean { return false; }
  getDefaultStats(): CharacterStats { return { STR: 10, CON: 10, SIZ: 0, DEX: 10, INT: 10, POW: 10, CHA: 10 }; }
  getArmorHint(): string { return ''; }
}
