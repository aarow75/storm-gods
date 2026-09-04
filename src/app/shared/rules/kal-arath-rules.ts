import { CharacterStats } from '@shared/models/character-stats.model';
import { KAL_ARATH_NAMES } from '@characters/constants/kal-arath-names.constants';
import { WeaponDefinition, ShieldDefinition, HitLocations } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, Resources } from '@characters/models/character.model';
import { KA_WARRIOR_SKILLS, KA_ROGUE_SKILLS, KA_MYSTIC_SKILLS, KA_EXPLORER_SKILLS, KA_SKILL_CATEGORIES } from '@characters/constants/skill-categories.constants';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses, ToHitMechanic,
  ArmorModel, InitiativeMechanic
} from './game-system-rules.interface';
import { Weapon, Shield } from './game-rules';
import {
  SpellEffect, CastCheck, CastableSpell, SpellCasterInfo,
  buildSpellEffectIndex, normalizeSpellName
} from './spell-effects.model';

export const KA_PACT_SPELLS: Record<string, { name: string; tier: number }[]> = {
  'Blood': [
    { name: 'Crimson Palm Scripture', tier: 1 },
    { name: 'Eternal River of Blessed Strength', tier: 2 },
    { name: 'Mantra of Thirst', tier: 3 },
    { name: 'Ascendance of the Scarlet Flower', tier: 4 },
    { name: 'Mandala of Calm Serenity', tier: 5 },
  ],
  'Destruction': [
    { name: 'Vision of Transience', tier: 1 },
    { name: 'Way of the Sundering Fist', tier: 2 },
    { name: "Temple's Demolishing Breath", tier: 3 },
    { name: 'Cleansing By Fire', tier: 4 },
    { name: 'Enlightenment Through Ruin', tier: 5 },
  ],
  'Domination': [
    { name: 'Diamond Mind Shatters', tier: 1 },
    { name: 'Doctrine of the Subservient Path', tier: 2 },
    { name: 'Life Is Only A Mirage', tier: 3 },
    { name: 'Heavenly Edict of Obedience', tier: 4 },
    { name: 'Liberation From All Earthly Choice', tier: 5 },
  ],
  'Illumination': [
    { name: 'Flame of Insight', tier: 1 },
    { name: 'Lantern of the Revealing Path', tier: 2 },
    { name: 'Ecstatic Meditation on Death', tier: 3 },
    { name: 'All-Encompassing Gaze', tier: 4 },
    { name: 'Golden Final Enlightenment', tier: 5 },
  ],
  'Shadow': [
    { name: 'Sworn to the Dark', tier: 1 },
    { name: 'Veil of the Hidden Monastery', tier: 2 },
    { name: 'Silent Passage Through The Realm of the Master', tier: 3 },
    { name: "Blessed Guardian of Night's Temple", tier: 4 },
    { name: 'Void of the Black Lotus', tier: 5 },
  ],
  'Corruption': [
    { name: 'Decay is the Way of All Things', tier: 1 },
    { name: 'Clouds Descend To The Earth', tier: 2 },
    { name: 'Withering Mandala', tier: 3 },
    { name: 'Soldiers Of the 10,000 Strong Army', tier: 4 },
    { name: 'Forbidden Temple of the 7th Sigil', tier: 5 },
  ],
};

// Pact spell combat effects, from public/docs/Kal-Arath-Spells.md. Casting is
// free (pacts have no point pool); the price is failure — 1 damage and no more
// casting until a rest — and the Arcane Disaster table on a critical failure.
export const KA_SPELL_EFFECTS: SpellEffect[] = [
  // Pact of Blood
  { name: 'Crimson Palm Scripture', target: 'enemy', kind: 'damage', notation: 'd6', ignoresArmor: true,
    description: 'Drains HP by touch (no attack roll); the caster gains the same amount — add manually' },
  { name: 'Eternal River of Blessed Strength', target: 'self', kind: 'utility',
    description: 'Sacrifice 4 HP: +2 STR and AGI for 1 hour — apply manually' },
  { name: 'Mantra of Thirst', target: 'self', kind: 'utility',
    description: 'Exchange 6 HP to roll the next casting check at advantage' },
  { name: 'Ascendance of the Scarlet Flower', target: 'self', kind: 'utility',
    description: 'Summon a blood demon for d6 rounds (HP 5d6, Armor 2, Claws 2d6, Morale 10)' },
  { name: 'Mandala of Calm Serenity', target: 'enemy', kind: 'utility',
    description: 'Sacrifice 2 HP per d6: deal d6 damage automatically to targets in missile range — apply manually' },
  // Pact of Destruction
  { name: 'Vision of Transience', target: 'enemy', kind: 'damage', notation: 'd6',
    description: 'Or shatter one non-magical item within missile range' },
  { name: 'Way of the Sundering Fist', target: 'self', kind: 'utility',
    description: 'All your unarmed blows roll damage at advantage' },
  { name: "Temple's Demolishing Breath", target: 'enemy', kind: 'damage', notation: 'd6',
    description: 'Hits all in melee range and knocks them back 10\' — apply to other targets manually' },
  { name: 'Cleansing By Fire', target: 'enemy', kind: 'damage', notation: '3d6',
    description: 'Exploding fireball, 20\' radius — apply to all in the area' },
  { name: 'Enlightenment Through Ruin', target: 'enemy', kind: 'damage', notation: '2d6',
    description: 'Meteor storms, 100\'×100\' for d6+ rounds — 2d6 per round; apply later rounds manually' },
  // Pact of Domination
  { name: 'Diamond Mind Shatters', target: 'enemy', kind: 'utility',
    description: 'Uncontrollable confusion and fear in d6 targets for d6 rounds' },
  { name: 'Doctrine of the Subservient Path', target: 'enemy', kind: 'utility',
    description: 'Target obeys the caster within reasonable boundaries of friendship for 1 day' },
  { name: 'Life Is Only A Mirage', target: 'self', kind: 'utility',
    description: 'Create a believable illusion up to the size of a large temple (total concentration)' },
  { name: 'Heavenly Edict of Obedience', target: 'enemy', kind: 'utility',
    description: 'Complete mental domination of an individual; recast each day to maintain' },
  { name: 'Liberation From All Earthly Choice', target: 'enemy', kind: 'utility',
    description: 'Control d6×10 individuals for d6 rounds plus caster level' },
  // Pact of Illumination
  { name: 'Flame of Insight', target: 'self', kind: 'utility',
    description: 'Force a re-roll of any one roll' },
  { name: 'Lantern of the Revealing Path', target: 'self', kind: 'utility',
    description: 'Shows the location of any object known to the caster' },
  { name: 'Ecstatic Meditation on Death', target: 'self', kind: 'utility',
    description: 'For one day, advantage on all attack and dodge rolls' },
  { name: 'All-Encompassing Gaze', target: 'self', kind: 'utility',
    description: 'Gain d6 Fate Points this session — add manually' },
  { name: 'Golden Final Enlightenment', target: 'self', kind: 'utility',
    description: 'One re-roll of any roll in the game, caster\'s choice, all session' },
  // Pact of Shadow
  { name: 'Sworn to the Dark', target: 'self', kind: 'utility',
    description: 'Invisibility except in full daylight, 1 hour per level; attacking negates' },
  { name: 'Veil of the Hidden Monastery', target: 'self', kind: 'utility',
    description: 'Mobile 20\' globe of darkness around the caster for d6 rounds +1/level' },
  { name: 'Silent Passage Through The Realm of the Master', target: 'self', kind: 'utility',
    description: 'Teleport from one shadow to another the caster can see' },
  { name: "Blessed Guardian of Night's Temple", target: 'self', kind: 'utility',
    description: 'Summon a shadow demon for d6 rounds +1/level (HP 24, Armor 2, 2d6, Morale 10)' },
  { name: 'Void of the Black Lotus', target: 'enemy', kind: 'damage', slays: true,
    description: 'Kills one individual with a mantra. Roll d6: on a 6, gain a level' },
  // Pact of Corruption
  { name: 'Decay is the Way of All Things', target: 'self', kind: 'utility',
    description: 'Animate one recently deceased body to serve for d6 hours (Skeleton Warrior stats)' },
  { name: 'Clouds Descend To The Earth', target: 'enemy', kind: 'damage', notation: 'd6',
    description: 'Fog 30\' around the caster: d6/round to all but the caster for d6 rounds — apply later rounds manually' },
  { name: 'Withering Mandala', target: 'enemy', kind: 'damage', notation: 'd6',
    description: 'Necrotic rot on d6 targets; any slain rise as ghouls under the caster\'s control' },
  { name: 'Soldiers Of the 10,000 Strong Army', target: 'self', kind: 'utility',
    description: 'Summon 3d6 ghouls in a thick fog (total concentration to control)' },
  { name: 'Forbidden Temple of the 7th Sigil', target: 'self', kind: 'utility',
    description: 'Major plague outbreak in a populated area for d6 days' },
];

const KA_SPELL_EFFECT_INDEX = buildSpellEffectIndex(KA_SPELL_EFFECTS);

// Arcane Disaster table (critical casting failure), indexed by 2d6 result,
// from public/docs/Kal-Arath-Spells.md
export const KA_ARCANE_DISASTERS: Record<number, string> = {
  2: 'A lesser demon takes hold of the caster\'s body. The caster\'s soul is trapped and enslaved — the adventure is at an end!',
  3: 'Blood vessels burst: reduced to 0 HP and −2 TOU permanently unless healed by powerful magic. Roll on the Death Table.',
  4: 'Sigils overwhelm the mind: −2 INT and vivid, traumatic hallucinations.',
  5: 'Part of the soul is torn away: −1 INT and −1 PRE; horror and overwhelming emptiness.',
  6: 'Cursed by a demon: lose the ability to use Fate Points until the curse is ended.',
  7: 'The caster\'s body changes disturbingly: −1 PRE, but +1 PRE to intimidation.',
  8: 'Sigils burn into the flesh: −1 PRE and chronic pain — STR checks at disadvantage.',
  9: 'The magic lashes back with burns and injuries: −1 permanent HP.',
  10: 'A psychic echo causes headaches and nightmares: −1 INT for d6 sessions.',
  11: 'The spell drains the caster\'s vitality: −1 STR from fatigue for the remainder of the session.',
  12: 'The spell fails, but the caster suffers only a minor psychic backlash.',
};

export const KA_DOOMS: string[] = [
  'Cannot use metal weapons or armor — violation breaks the pact and all powers are lost',
  'Each new moon, must sacrifice something of great value; failure may result in a curse',
  'Must speak pact names aloud when casting; cannot cast while silenced',
  'Must periodically travel to a desolate place of significance and spend d6 days in prayer',
  'Spells require blood scrolls (costs 1 HP permanently per active scroll)',
  'Cannot speak for hours equal to the tier of the last spell cast',
];

// Kal-Arath uses 5 stats as signed modifiers (-1 to +5), not 3-18 values.
// Internal CharacterStats fields mapped as: STR=STR, TOU=CON, AGI=DEX, INT=INT, PRE=CHA.
// SIZ and POW are hidden and unused.
const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',   visible: true  },
  { key: 'CON', label: 'TOU (Toughness)',  visible: true  },
  { key: 'SIZ', label: 'SIZ',             visible: false },
  { key: 'DEX', label: 'AGI (Agility)',    visible: true  },
  { key: 'INT', label: 'INT (Intelligence)', visible: true },
  { key: 'POW', label: 'POW',             visible: false },
  { key: 'CHA', label: 'PRE (Presence)',  visible: true  },
];

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Prone',         effect: 'Attack and dodge at disadvantage' },
  { name: 'Stunned',       effect: 'Cannot act this round' },
  { name: 'Grappled',      effect: 'Only Light weapons or brawling; must roll STR to break free' },
  { name: 'Broken',        effect: '-1 HP permanently; d6 days to heal without magic' },
  { name: 'Shattered',     effect: 'Permanent -1 to a stat; d6 days to heal past ½ HP without magic' },
  { name: 'Unconscious',   effect: 'Out for 2d6 rounds' },
  { name: 'Fatigued',      effect: 'All rolls at disadvantage until long rest' },
  { name: 'Silenced',      effect: 'Cannot cast spells (vocal component required)' },
];

// Armor types from the Kal-Arath rules: damage reduction values.
const ARMOR_TYPES: ArmorTypeDefinition[] = [
  { name: 'None',         points: 0 },
  { name: 'Light Armor',  points: 1 },
  { name: 'Medium Armor', points: 2 },
  { name: 'Heavy Armor',  points: 3 },
];

// Kal-Arath weapons organized by size category.
// Light = d6/d (disadvantage — 2d6 take worst); Medium = d6; Heavy = d6/a (advantage — 2d6 take best).
// strikeRank unused (initiative is rolled d6+AGI in play). encumbrance counts as 1 item each.
const WEAPON_LIST: WeaponDefinition[] = [
  // Light weapons (d6/d)
  { name: 'Dagger',           damage: 'd6/d',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 6,  minSTR: 0, minDEX: 0, cost: 5,   isMissile: false, canParry: true },
  { name: 'Knife',            damage: 'd6/d',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 4,  minSTR: 0, minDEX: 0, cost: 3,   isMissile: true,  range: '10/20', rateOfFire: 1, canParry: false },
  { name: 'Hatchet',          damage: 'd6/d',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 6,  minSTR: 0, minDEX: 0, cost: 8,   isMissile: true,  range: '10/20', rateOfFire: 1, canParry: false },
  { name: 'Staff/Stick',      damage: 'd6/d',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 2,   isMissile: false, canParry: true },

  // Medium weapons (d6)
  { name: 'Sword',            damage: 'd6',    defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 12, minSTR: 0, minDEX: 0, cost: 30,  isMissile: false, canParry: true },
  { name: 'Battle Axe',       damage: 'd6',    defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 20,  isMissile: false, canParry: true },
  { name: 'Flail',            damage: 'd6',    defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 15,  isMissile: false, canParry: false },
  { name: 'Spear',            damage: 'd6',    defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0, minDEX: 0, cost: 10,  isMissile: false, canParry: true },
  { name: 'Mace',             damage: 'd6',    defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0, minDEX: 0, cost: 25,  isMissile: false, canParry: true },

  // Heavy weapons (d6/a — 2H)
  { name: 'Greataxe',         damage: 'd6/a',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 2, hitPoints: 12, minSTR: 0, minDEX: 0, cost: 50,  isMissile: false, canParry: false },
  { name: 'Two-Handed Sword', damage: 'd6/a',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 2, hitPoints: 14, minSTR: 0, minDEX: 0, cost: 70,  isMissile: false, canParry: false },
  { name: 'Maul',             damage: 'd6/a',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 2, hitPoints: 14, minSTR: 0, minDEX: 0, cost: 40,  isMissile: false, canParry: false },

  // Missile weapons
  { name: 'Sling',            damage: 'd6/d',  defaultSkill: 'Missile', strikeRank: 0, encumbrance: 0, hitPoints: 4,  minSTR: 0, minDEX: 0, cost: 2,   isMissile: true,  range: '30/60',  rateOfFire: 1, canParry: false },
  { name: 'Javelin',          damage: 'd6',    defaultSkill: 'Missile', strikeRank: 0, encumbrance: 1, hitPoints: 6,  minSTR: 0, minDEX: 0, cost: 5,   isMissile: true,  range: '20/40',  rateOfFire: 1, canParry: false },
  { name: 'Shortbow',         damage: 'd6',    defaultSkill: 'Missile', strikeRank: 0, encumbrance: 1, hitPoints: 6,  minSTR: 0, minDEX: 0, cost: 30,  isMissile: true,  range: '30/60',  rateOfFire: 1, canParry: false },
  { name: 'Longbow',          damage: 'd6',    defaultSkill: 'Missile', strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0, minDEX: 0, cost: 60,  isMissile: true,  range: '60/120', rateOfFire: 1, canParry: false },

  // Unarmed
  { name: 'Brawling',         damage: 'd6/d',  defaultSkill: 'Melee',   strikeRank: 0, encumbrance: 0, hitPoints: 0,  minSTR: 0, minDEX: 0, cost: 0,   isMissile: false, canParry: false },
];

// Shield provides -1 damage reduction and can be sacrificed to negate all damage from one attack.
const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Shield', armorPoints: 1, hitPoints: 10, encumbrance: 1, cost: 15, protectedLocations: [] },
];

const ALL_KA_SKILLS = [
  ...KA_WARRIOR_SKILLS,
  ...KA_ROGUE_SKILLS,
  ...KA_MYSTIC_SKILLS,
  ...KA_EXPLORER_SKILLS,
];

export class KalArathRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[],
    _background?: BackgroundForBonuses,
    _armorType?: string
  ): DerivedStats {
    // TOU is stored in the CON field. HP = d6+TOU at creation; we use the reference's
    // optional max-HP rule (6+TOU) "for higher survival rate".
    const tou = stats.CON;
    const str = stats.STR;
    const maxHitPoints = 6 + tou;

    // Encumbrance: STR+8 items (shields count); over limit = all physical rolls at disadvantage
    const maxEncumbrance = str + 8;
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
    // Reference: at double max, character cannot move at all
    const movementRate = totalENC >= maxEncumbrance * 2 ? 0 : 6;

    return {
      totalHitPoints: maxHitPoints,
      maxHitPoints,
      magicPoints: 0,
      damageBonus: '0',
      spiritCombatDamage: '0',
      // End-of-battle healing: 1+TOU (min 1); full rest: d6+TOU
      healingRate: Math.max(1, 1 + tou),
      movementRate,
      strikeRank: 0,
      maxEncumbrance,
      totalEncumbrance: totalENC,
      encumbranceDefensePenalty: overENC > 0 ? 1 : 0,
    };
  }

  usesHitLocations(): boolean {
    return false;
  }

  calculateHitLocations(_stats: CharacterStats): HitLocations | null {
    return null;
  }

  getSkillDefinitions(): SkillDefinition[] {
    return ALL_KA_SKILLS.map(name => ({ name, defaultValue: 0 }));
  }

  getDefaultSkills(): Record<string, number> {
    const skills: Record<string, number> = {};
    for (const s of ALL_KA_SKILLS) skills[s] = 0;
    return skills;
  }

  getSkillCategories(): SkillCategory[] {
    return Object.entries(KA_SKILL_CATEGORIES).map(([name, skills]) => ({ name, skills }));
  }

  calculateSkillCategoryModifiers(_stats: CharacterStats): Record<string, number> {
    return {};
  }

  applyBackgroundBonuses(
    skills: Record<string, number>,
    _background: BackgroundForBonuses
  ): Record<string, number> {
    return { ...skills };
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
    return KAL_ARATH_NAMES;
  }

  getMagicSystemType(): string {
    return 'kal-arath';
  }

  getSpellEffect(spellName: string): SpellEffect | null {
    return KA_SPELL_EFFECT_INDEX.get(normalizeSpellName(spellName)) ?? null;
  }

  // Casting is an INT check vs Spell Difficulty: 2d6 + INT ≥ 8 + tier.
  // Natural 12 always succeeds with the effect doubled (crit).
  getCastCheck(spell: CastableSpell, caster: SpellCasterInfo): CastCheck {
    return {
      kind: '2d6-over',
      bonus: caster.stats.INT ?? 0,
      target: 8 + spell.cost, // cost carries the spell's tier
      label: 'INT',
    };
  }

  // Casting Failure: the caster takes 1 damage and cannot cast again until a
  // rest. Critical Failure additionally rolls on the Arcane Disaster table.
  getCastFailureEffects(fumble: boolean): { logNotes: string[]; damageToCaster: number; blockCastingUntilRest: boolean } {
    const logNotes: string[] = [];
    if (fumble) {
      const roll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      logNotes.push(`ARCANE DISASTER (2d6: ${roll}) — ${KA_ARCANE_DISASTERS[roll]}`);
    }
    return { logNotes, damageToCaster: 1, blockCastingUntilRest: true };
  }

  getCurrencyLabel(): string {
    return 'S';
  }

  // Attack: 2d6 + STR (melee) or AGI (missile) vs 8. Double-6 crits (damage dice
  // doubled); double-1 fumbles (automatic miss). AGI is stored in stats.DEX.
  getToHitMechanic(): ToHitMechanic {
    return {
      type: '2d6-over', target: 8,
      meleeStat: 'STR', meleeStatLabel: 'STR',
      missileStat: 'DEX', missileStatLabel: 'AGI',
    };
  }

  // Armor is flat damage reduction (Light -1 / Medium -2 / Heavy -3).
  getArmorModel(): ArmorModel { return { kind: 'flat' }; }

  // Damage dice explode: a 6 is rerolled once and added (a second 6 counts as-is).
  damageDiceExplode(): boolean { return true; }

  // Initiative: each character rolls d6 + AGI; 4+ acts before enemies, natural 1 always loses.
  getInitiativeMechanic(): InitiativeMechanic {
    return { kind: 'd6-plus-stat', stat: 'DEX', statLabel: 'AGI', target: 4 };
  }

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

  // Kal-Arath is player-facing: the defender rolls 2d6+AGI vs 8 to dodge enemy attacks.
  // There is no parry roll (a shield is sacrificed manually to negate one attack).
  usesParryDodge(): boolean { return true; }
  getDefenseOptions(): { parry: boolean; dodge: boolean } { return { parry: false, dodge: true }; }
  usesWeaponHP(): boolean { return false; }

  getSystemName(): string { return 'Kal-Arath'; }
  getStatRange(): { min: number; max: number } { return { min: -1, max: 5 }; }
  canRollStats(): boolean { return false; }
  showsMagicPoints(): boolean { return false; }
  getMagicPointsLabel(): string { return ''; }
  showsDamageBonus(): boolean { return false; }
  getDamageBonusLabel(): string { return ''; }
  showsHealingRate(): boolean { return true; }
  getHealingRateLabel(): string { return 'Post-Battle Healing'; }
  showsMovementRate(): boolean { return false; }
  getEncumbrancePenaltyText(_derivedStats: DerivedStats): string { return 'All physical rolls at disadvantage'; }

  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[] {
    return [
      { key: 'silver',     label: 'Silver' },
      { key: 'fatePoints', label: 'Fate Points' },
      { key: 'level',      label: 'Level' },
      { key: 'xp',         label: 'XP' },
    ];
  }

  getPrimaryWealthAmount(resources: Resources): number { return resources.silver ?? 0; }
  weaponSkillIsFixed(): boolean { return false; }
  weaponHasSelectableSkill(): boolean { return false; }
  // 4 points across the 5 stats at creation (one stat may drop to -1 for an extra point)
  getDefaultStats(): CharacterStats { return { STR: 1, CON: 1, SIZ: 0, DEX: 1, INT: 1, POW: 0, CHA: 0 }; }
  getArmorHint(): string {
    return 'Armor reduces all incoming damage (Light: −1, Medium: −2, Heavy: −3). A shield adds −1 and can be sacrificed to reduce a single attack to 0 damage.';
  }
}
