import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, Resources } from '@characters/models/character.model';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses, ToHitMechanic,
  ArmorModel, InitiativeMechanic
} from './game-system-rules.interface';

// Mothership uses 4 primary stats rolled with 6d10.
// Mapped onto the shared CharacterStats interface:
//   STR → Strength   CON → Speed (SPD)   DEX → Combat (CMB)   INT → Intellect
//   SIZ / POW / CHA are hidden.
const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',  visible: true  },
  { key: 'CON', label: 'SPD (Speed)',     visible: true  },
  { key: 'SIZ', label: 'SIZ',            visible: false },
  { key: 'DEX', label: 'CMB (Combat)',    visible: true  },
  { key: 'INT', label: 'INT (Intellect)', visible: true  },
  { key: 'POW', label: 'POW',            visible: false },
  { key: 'CHA', label: 'CHA',            visible: false },
];

// Saves: Sanity, Fear, Body, Armor — class-derived starting values, tracked as skills.
// Default values here are rough averages; applyBackgroundBonuses sets class-specific values.

// Skills per the Mothership skill tree (stored as rank bonus: 10=Trained, 15=Expert, 20=Master)
const SKILL_DEFINITIONS: SkillDefinition[] = [
  // ── Saves ──────────────────────────────────────────────────────────────────
  { name: 'Sanity Save',         defaultValue: 0 },
  { name: 'Fear Save',           defaultValue: 0 },
  { name: 'Body Save',           defaultValue: 0 },
  { name: 'Armor Save',          defaultValue: 0 },

  // ── Trained tier ────────────────────────────────────────────────────────────
  { name: 'Linguistics',         defaultValue: 0 },
  { name: 'Biology',             defaultValue: 0 },
  { name: 'First Aid',           defaultValue: 0 },
  { name: 'Hydroponics',         defaultValue: 0 },
  { name: 'Geology',             defaultValue: 0 },
  { name: 'Zero-G',              defaultValue: 0 },
  { name: 'Scavenging',          defaultValue: 0 },
  { name: 'Heavy Machinery',     defaultValue: 0 },
  { name: 'Computers',           defaultValue: 0 },
  { name: 'Mechanical Repair',   defaultValue: 0 },
  { name: 'Driving',             defaultValue: 0 },
  { name: 'Piloting',            defaultValue: 0 },
  { name: 'Mathematics',         defaultValue: 0 },
  { name: 'Art',                 defaultValue: 0 },
  { name: 'Archaeology',         defaultValue: 0 },
  { name: 'Theology',            defaultValue: 0 },
  { name: 'Military Training',   defaultValue: 0 },
  { name: 'Rimwise',             defaultValue: 0 },
  { name: 'Athletics',           defaultValue: 0 },
  { name: 'Chemistry',           defaultValue: 0 },

  // ── Expert tier ─────────────────────────────────────────────────────────────
  { name: 'Psychology',          defaultValue: 0 },
  { name: 'Genetics',            defaultValue: 0 },
  { name: 'Pathology',           defaultValue: 0 },
  { name: 'Botany',              defaultValue: 0 },
  { name: 'Planetology',         defaultValue: 0 },
  { name: 'Asteroid Mining',     defaultValue: 0 },
  { name: 'Jury-Rigging',        defaultValue: 0 },
  { name: 'Engineering',         defaultValue: 0 },
  { name: 'Hacking',             defaultValue: 0 },
  { name: 'Vehicle Specialization', defaultValue: 0 },
  { name: 'Astrogation',         defaultValue: 0 },
  { name: 'Physics',             defaultValue: 0 },
  { name: 'Mysticism',           defaultValue: 0 },
  { name: 'Tactics',             defaultValue: 0 },
  { name: 'Gunnery',             defaultValue: 0 },
  { name: 'Firearms',            defaultValue: 0 },
  { name: 'Close-Quarters Combat', defaultValue: 0 },
  { name: 'Explosives',          defaultValue: 0 },

  // ── Master tier ─────────────────────────────────────────────────────────────
  { name: 'Sophontology',        defaultValue: 0 },
  { name: 'Xenobiology',         defaultValue: 0 },
  { name: 'Surgery',             defaultValue: 0 },
  { name: 'Cybernetics',         defaultValue: 0 },
  { name: 'Robotics',            defaultValue: 0 },
  { name: 'Artificial Intelligence', defaultValue: 0 },
  { name: 'Command',             defaultValue: 0 },
  { name: 'Hyperspace',          defaultValue: 0 },
  { name: 'Xenoesotericism',     defaultValue: 0 },
  { name: 'Weapon Specialization', defaultValue: 0 },
];

const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Saves',
    skills: ['Sanity Save', 'Fear Save', 'Body Save', 'Armor Save'],
  },
  {
    name: 'Trained Skills',
    skills: [
      'Linguistics', 'Biology', 'First Aid', 'Hydroponics', 'Geology', 'Zero-G',
      'Scavenging', 'Heavy Machinery', 'Computers', 'Mechanical Repair', 'Driving',
      'Piloting', 'Mathematics', 'Art', 'Archaeology', 'Theology',
      'Military Training', 'Rimwise', 'Athletics', 'Chemistry',
    ],
  },
  {
    name: 'Expert Skills',
    skills: [
      'Psychology', 'Genetics', 'Pathology', 'Botany', 'Planetology', 'Asteroid Mining',
      'Jury-Rigging', 'Engineering', 'Hacking', 'Vehicle Specialization', 'Astrogation',
      'Physics', 'Mysticism', 'Tactics', 'Gunnery', 'Firearms',
      'Close-Quarters Combat', 'Explosives',
    ],
  },
  {
    name: 'Master Skills',
    skills: [
      'Sophontology', 'Xenobiology', 'Surgery', 'Cybernetics', 'Robotics',
      'Artificial Intelligence', 'Command', 'Hyperspace', 'Xenoesotericism', 'Weapon Specialization',
    ],
  },
];

// Starting saves and skills by class (occupation in the background model)
const CLASS_STARTING_SKILLS: Record<string, Record<string, number>> = {
  'Teamster': {
    'Sanity Save': 30, 'Fear Save': 35, 'Body Save': 30, 'Armor Save': 35,
    'Zero-G': 10, 'Mechanical Repair': 10,
  },
  'Android': {
    'Sanity Save': 25, 'Fear Save': 35, 'Body Save': 45, 'Armor Save': 25,
    'Computers': 10, 'Mathematics': 10, 'Linguistics': 10,
  },
  'Scientist': {
    'Sanity Save': 40, 'Fear Save': 25, 'Body Save': 25, 'Armor Save': 25,
  },
  'Marine': {
    'Sanity Save': 25, 'Fear Save': 30, 'Body Save': 35, 'Armor Save': 50,
    'Military Training': 10,
  },
};

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Panicking',    effect: 'Roll on Panic Effect Table; results range from Laser Focus to Heart Attack' },
  { name: 'Stunned',      effect: 'Lose one action; stunned for 1 round (Stun Baton crit)' },
  { name: 'Unconscious',  effect: 'At 0 HP; must make Body save or die; success = secret 1d10 recovery roll' },
  { name: 'Entangled',    effect: 'Speed check to break free each round (Rigging Gun)' },
  { name: 'On Fire',      effect: 'Take 1d10 damage per turn until extinguished (Body save to put out)' },
  { name: 'Stuck',        effect: 'Body save to move; Foam Gun effect covering 5sqm' },
  { name: 'Aiming',       effect: 'Spent both actions aiming; next ranged shot has Advantage' },
  { name: 'Laser Focus',  effect: 'Panic result: Advantage on all rolls for 1d10 hours' },
  { name: 'Cowardice',    effect: 'Must make Fear save to engage in combat for 1d10 hours' },
  { name: 'Catatonic',    effect: 'Unresponsive for Stress×d10 minutes' },
];

// Armor — bonus to Armor Save percentage (stored in `points`)
const ARMOR_TYPES: ArmorTypeDefinition[] = [
  { name: 'Standard Crew Attire', points: 0  },
  { name: 'Hazard Suit',          points: 5  },
  { name: 'Vaccsuit',             points: 7  },
  { name: 'Standard Battle Dress', points: 10 },
  { name: 'Advanced Battle Dress', points: 15 },
];

// Weapons from the Mothership Player's Survival Guide weapon table.
// Range values stored as "short/medium/long" string in `range`.
// `strikeRank` is unused (Mothership uses Speed checks, not SR).
// `hitPoints` is unused but kept at 0.
const WEAPON_LIST: WeaponDefinition[] = [
  { name: 'Combat Shotgun',  damage: '2d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 1400, isMissile: true,  range: '10/20/30',     rateOfFire: 1, canParry: false },
  { name: 'Crowbar',         damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 50,   isMissile: false,                                             canParry: false },
  { name: 'Flame Thrower',   damage: '2d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 3, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 2000, isMissile: true,  range: '2/10/20',      rateOfFire: 1, canParry: false },
  { name: 'Flare Gun',       damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 1, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 85,   isMissile: true,  range: '5/10/20',      rateOfFire: 1, canParry: false },
  { name: 'Frag Grenade',    damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 1, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 70,   isMissile: true,  range: '20/30/40',     rateOfFire: 1, canParry: false },
  { name: 'Hand Welder',     damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 1, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 250,  isMissile: false,                                             canParry: false },
  { name: 'Laser Cutter',    damage: '1d%',        defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 1200, isMissile: true,  range: '25/250/700',   rateOfFire: 1, canParry: false },
  { name: 'Nail Gun',        damage: '2d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 150,  isMissile: true,  range: '1/5/10',       rateOfFire: 1, canParry: false },
  { name: 'Pulse Rifle',     damage: '5d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 4, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 1600, isMissile: true,  range: '15/125/300',   rateOfFire: 1, canParry: false },
  { name: 'Revolver',        damage: '3d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 1, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 750,  isMissile: true,  range: '2/30/125',     rateOfFire: 1, canParry: false },
  { name: 'Rigging Gun',     damage: '2d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 350,  isMissile: true,  range: '10/30/100',    rateOfFire: 1, canParry: false },
  { name: 'Scalpel',         damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 0, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 50,   isMissile: false,                                             canParry: false },
  { name: 'Smart Rifle',     damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 3, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 12000, isMissile: true, range: '25/200/500',   rateOfFire: 1, canParry: false },
  { name: 'SMG',             damage: '4d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 1200, isMissile: true,  range: '10/75/150',    rateOfFire: 1, canParry: false },
  { name: 'Stun Baton',      damage: '1d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 1, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 115,  isMissile: false,                                             canParry: false },
  { name: 'Vibechete',       damage: '2d10',       defaultSkill: 'CMB', strikeRank: 0, encumbrance: 2, hitPoints: 0, minSTR: 0, minDEX: 0, cost: 75,   isMissile: false,                                             canParry: false },
];

const SHIELD_LIST: ShieldDefinition[] = [];

const SCI_FI_NAMES = [
  'Vex', 'Kira', 'Dax', 'Mila', 'Rook', 'Sable', 'Ozark', 'Tess', 'Bryn', 'Cade',
  'Lena', 'Finn', 'Nova', 'Reef', 'Juno', 'Pike', 'Sable', 'Wren', 'Cruz', 'Lyra',
  'Axel', 'Zoe', 'Remy', 'Slate', 'Eden', 'Grim', 'Nox', 'Faye', 'Drake', 'Skye',
  'Unit 7', 'ARIA-4', 'Mk. IX', 'Alpha-3', 'Nexus', 'Vance', 'Torres', 'Okafor',
  'Reyes', 'Tanaka', 'Patel', 'Müller', 'Chen', 'Kowalski', 'Singh', 'Kim', 'Diaz',
];

export class MothershipRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    _weapons: Weapon[],
    _shields: Shield[],
    _background?: BackgroundForBonuses,
    _armorType?: string
  ): DerivedStats {
    // Max Health = Strength × 2
    const maxHitPoints = stats.STR * 2;

    // Encumbrance: basic weight sum
    const totalEncumbrance = equipment.reduce(
      (sum, item) => sum + item.encumbrance * item.quantity, 0
    );
    const maxEncumbrance = stats.STR;

    return {
      totalHitPoints: maxHitPoints,
      maxHitPoints,
      magicPoints: 0,
      damageBonus: '0',
      spiritCombatDamage: '0',
      healingRate: 0,
      movementRate: stats.CON,
      strikeRank: 0,
      armorClass: undefined,
      missileAttackBonus: undefined,
      maxEncumbrance,
      totalEncumbrance,
      encumbranceDefensePenalty: totalEncumbrance > maxEncumbrance ? 1 : 0,
    };
  }

  usesHitLocations(): boolean { return false; }
  calculateHitLocations(_stats: CharacterStats): HitLocations | null { return null; }

  getSkillDefinitions(): SkillDefinition[] {
    return SKILL_DEFINITIONS;
  }

  getDefaultSkills(): Record<string, number> {
    const skills: Record<string, number> = {};
    for (const s of SKILL_DEFINITIONS) skills[s.name] = s.defaultValue;
    return skills;
  }

  getSkillCategories(): SkillCategory[] {
    return SKILL_CATEGORIES;
  }

  calculateSkillCategoryModifiers(_stats: CharacterStats): Record<string, number> {
    return {};
  }

  applyBackgroundBonuses(
    skills: Record<string, number>,
    background: BackgroundForBonuses
  ): Record<string, number> {
    const result = { ...skills };
    const classSkills = CLASS_STARTING_SKILLS[background.occupation ?? ''];
    if (classSkills) {
      for (const [skill, value] of Object.entries(classSkills)) {
        result[skill] = value;
      }
    }
    return result;
  }

  getWeaponList(): WeaponDefinition[] { return WEAPON_LIST; }
  getShieldList(): ShieldDefinition[] { return SHIELD_LIST; }
  getArmorTypes(): ArmorTypeDefinition[] { return ARMOR_TYPES; }
  getConditions(): ConditionDefinition[] { return CONDITIONS; }
  getCharacterNames(): string[] { return SCI_FI_NAMES; }

  getMagicSystemType(): string { return 'mothership'; }
  getCurrencyLabel(): string { return 'Cr'; }

  // Combat check: d100 ≤ Combat stat (CMB is stored in stats.DEX).
  getToHitMechanic(): ToHitMechanic {
    return { type: 'percentile-under-stat', stat: 'DEX', statLabel: 'Combat' };
  }

  // Armor is not damage reduction: the defender rolls an Armor Save
  // (d100 ≤ Armor Save skill + armor type % bonus), opposed vs the attack roll.
  getArmorModel(): ArmorModel { return { kind: 'save', skill: 'Armor Save' }; }

  // Initiative: each character makes a Speed check (d100 ≤ SPD, stored in stats.CON);
  // pass acts before enemies, fail acts after.
  getInitiativeMechanic(): InitiativeMechanic {
    return { kind: 'stat-check', stat: 'CON', statLabel: 'Speed' };
  }

  usesStrikeRank(): boolean { return false; }
  getInitiativeLabel(): string { return 'Speed Check'; }
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

  getSystemName(): string { return 'Mothership'; }
  getStatRange(): { min: number; max: number } { return { min: 1, max: 100 }; }
  canRollStats(): boolean { return true; }
  showsMagicPoints(): boolean { return false; }
  getMagicPointsLabel(): string { return ''; }
  showsDamageBonus(): boolean { return false; }
  getDamageBonusLabel(): string { return ''; }
  showsHealingRate(): boolean { return false; }
  getHealingRateLabel(): string { return ''; }
  showsMovementRate(): boolean { return false; }

  getEncumbrancePenaltyText(derivedStats: DerivedStats): string {
    return `Over ${derivedStats.maxEncumbrance} units — encumbered`;
  }

  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[] {
    return [
      { key: 'lunars',           label: 'Credits (Cr)' },
      { key: 'advancementMarks', label: 'Stress',   hint: 'Starts at 2; triggers Panic Check' },
      { key: 'reputation',       label: 'Resolve',  hint: '0–5 max; each point = −1 to Panic Effect roll' },
      { key: 'level',            label: 'Level' },
      { key: 'xp',               label: 'XP',       hint: '10 XP per session survived' },
    ];
  }

  getPrimaryWealthAmount(resources: Resources): number { return resources.lunars ?? 0; }
  weaponSkillIsFixed(): boolean { return true; }
  weaponHasSelectableSkill(): boolean { return false; }
  getDefaultStats(): CharacterStats {
    return { STR: 40, CON: 40, SIZ: 0, DEX: 30, INT: 40, POW: 0, CHA: 0 };
  }
  getArmorHint(): string {
    return 'Armor Save bonus: Crew Attire +0%, Hazard Suit +5%, Vaccsuit +7%, Battle Dress +10%, Adv. Battle Dress +15%';
  }
}
