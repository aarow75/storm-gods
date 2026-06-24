import { CharacterStats } from '@shared/models/character-stats.model';
import { KAL_ARATH_NAMES } from '@characters/constants/kal-arath-names.constants';
import { WeaponDefinition, ShieldDefinition, HitLocations } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, Resources } from '@characters/models/character.model';
import { KA_WARRIOR_SKILLS, KA_ROGUE_SKILLS, KA_MYSTIC_SKILLS, KA_EXPLORER_SKILLS, KA_SKILL_CATEGORIES } from '@characters/constants/skill-categories.constants';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses, ToHitMechanic
} from './game-system-rules.interface';
import { Weapon, Shield } from './game-rules';

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
    _shields: Shield[],
    _background?: BackgroundForBonuses,
    _armorType?: string
  ): DerivedStats {
    // TOU is stored in the CON field. HP = d6+TOU at creation; we show the average (4+TOU).
    const tou = stats.CON;
    const str = stats.STR;
    const maxHitPoints = 4 + tou;

    // Encumbrance: STR+8 items; over limit = all physical rolls at disadvantage
    const maxEncumbrance = str + 8;
    const equipmentENC = equipment.reduce((sum, item) => sum + item.encumbrance * item.quantity, 0);
    const weaponsENC = weapons.reduce((sum, w) => {
      const def = WEAPON_LIST.find(wd => wd.name === w.name);
      return sum + (def?.encumbrance ?? 0);
    }, 0);
    const totalENC = equipmentENC + weaponsENC;
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

  getCurrencyLabel(): string {
    return 'S';
  }

  // Roll d6 + skill ≥ 4 to hit. Skill starts at 0 (50% base chance) and improves with advancement.
  getToHitMechanic(): ToHitMechanic { return { type: 'd6-pool', difficulty: 4 }; }

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
  usesParryDodge(): boolean { return false; }
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
  getDefaultStats(): CharacterStats { return { STR: 1, CON: 1, SIZ: 0, DEX: 1, INT: 1, POW: 0, CHA: 1 }; }
  getArmorHint(): string {
    return 'Armor reduces all incoming damage (Light: −1, Medium: −2, Heavy: −3). A shield adds −1 and can be sacrificed to reduce a single attack to 0 damage.';
  }
}
