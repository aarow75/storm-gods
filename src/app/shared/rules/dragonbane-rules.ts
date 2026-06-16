import { CharacterStats } from '@shared/models/character-stats.model';
import { WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield } from '@shared/rules/game-rules';
import { DerivedStats, EquipmentItem, CharacterBackground, WEAPON_SKILLS } from '@characters/models/character.model';
import { DB_SKILLS, DB_SKILL_BY_ATTR, DB_SKILL_CATEGORIES } from '@characters/constants/skill-categories.constants';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition
} from './game-system-rules.interface';

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Wounded',   effect: 'Reduced movement and combat effectiveness' },
  { name: 'Stunned',   effect: 'Cannot act this round' },
  { name: 'Exhausted', effect: 'Reduced all physical actions' },
];

// Dragonbane uses STR, INT, AGL (mapped to DEX field), WIL (mapped to POW field), CHA.
// SIZ and CON are not core Dragonbane attributes; CON is kept as an HP proxy.
const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',    visible: true  },
  { key: 'CON', label: 'CON (Constitution)', visible: true  },
  { key: 'SIZ', label: 'SIZ (Size)',         visible: false },
  { key: 'DEX', label: 'AGL (Agility)',      visible: true  },
  { key: 'INT', label: 'INT (Intelligence)', visible: true  },
  { key: 'POW', label: 'WIL (Willpower)',    visible: true  },
  { key: 'CHA', label: 'CHA (Charisma)',     visible: true  },
];

// Dragonbane armor: a single Armor Rating (AR) value
const ARMOR_TYPES: ArmorTypeDefinition[] = [
  { name: 'None',         points: 0 },
  { name: 'Light Armor',  points: 2 },
  { name: 'Medium Armor', points: 4 },
  { name: 'Heavy Armor',  points: 6 },
];

// Dragonbane weapon list — placeholder until system-specific weapons are defined
const WEAPON_LIST: WeaponDefinition[] = [
  { name: 'Knife',        damage: '1d6',  defaultSkill: 'Knives (AGL)',  strikeRank: 0, encumbrance: 0, hitPoints: 6,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Short Sword',  damage: '1d8',  defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Sword',        damage: '1d10', defaultSkill: 'Swords (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 12, minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Axe',          damage: '1d8',  defaultSkill: 'Axes (STR)',    strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Great Axe',    damage: '2d8',  defaultSkill: 'Axes (STR)',    strikeRank: 0, encumbrance: 2, hitPoints: 10, minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: false },
  { name: 'Spear',        damage: '1d8',  defaultSkill: 'Spears (STR)',  strikeRank: 0, encumbrance: 1, hitPoints: 10, minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Staff',        damage: '1d6',  defaultSkill: 'Staves (AGL)',  strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Hammer',       damage: '1d8',  defaultSkill: 'Hammers (STR)', strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: false, canParry: true },
  { name: 'Shortbow',     damage: '1d8',  defaultSkill: 'Bows (AGL)',    strikeRank: 0, encumbrance: 1, hitPoints: 6,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: true,  range: '20/40/80',  rateOfFire: 1, canParry: false },
  { name: 'Longbow',      damage: '1d10', defaultSkill: 'Bows (AGL)',    strikeRank: 0, encumbrance: 1, hitPoints: 8,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: true,  range: '40/80/160', rateOfFire: 1, canParry: false },
  { name: 'Crossbow',     damage: '1d10', defaultSkill: 'Crossbows (AGL)', strikeRank: 0, encumbrance: 1, hitPoints: 8, minSTR: 0, minDEX: 0, cost: 0, isMissile: true,  range: '20/60/120', rateOfFire: 1, canParry: false },
  { name: 'Sling',        damage: '1d6',  defaultSkill: 'Slings (AGL)',  strikeRank: 0, encumbrance: 0, hitPoints: 4,  minSTR: 0,  minDEX: 0, cost: 0, isMissile: true,  range: '20/40/80',  rateOfFire: 1, canParry: false },
];

// Dragonbane uses round shields and no complex shield rules
const SHIELD_LIST: ShieldDefinition[] = [
  { name: 'Round Shield', armorPoints: 4, hitPoints: 10, encumbrance: 1, cost: 0, protectedLocations: ['Chest', 'Left Arm'] },
  { name: 'Tower Shield', armorPoints: 6, hitPoints: 14, encumbrance: 2, cost: 0, protectedLocations: ['Chest', 'Left Arm', 'Abdomen'] },
];

export class DragonbaneRules implements GameSystemRules {
  getStatDefinitions(): StatDefinition[] {
    return STAT_DEFINITIONS;
  }

  // Dragonbane derived stats: no damage bonus, no spirit combat, movement is 10.
  // HP comes from CON; WIL (stored in POW) drives willpower saves.
  // This is an approximation — full Dragonbane tables require kin-specific HP values.
  calculateDerivedStats(
    stats: CharacterStats,
    equipment: EquipmentItem[],
    weapons: Weapon[],
    shields: Shield[]
  ): DerivedStats {
    const totalHP = stats.CON;
    const maxEncumbrance = stats.STR;
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

    return {
      totalHitPoints: totalHP,
      maxHitPoints: totalHP,
      magicPoints: stats.POW,   // WIL drives willpower / magic in Dragonbane
      damageBonus: '0',         // No damage bonus in Dragonbane
      spiritCombatDamage: '0',  // Different magic system
      healingRate: 1,
      movementRate: Math.max(0, 10 - overENC),
      strikeRank: 0,            // Dragonbane uses initiative differently
      maxEncumbrance,
      totalEncumbrance: totalENC,
      encumbranceDefensePenalty: overENC * 5,
    };
  }

  usesHitLocations(): boolean {
    return false;
  }

  calculateHitLocations(_stats: CharacterStats): null {
    return null;
  }

  getSkillDefinitions(): SkillDefinition[] {
    return [
      ...DB_SKILLS.map(name => {
        const attr = Object.entries(DB_SKILL_BY_ATTR).find(([, skills]) => skills.includes(name))?.[0];
        return { name, defaultValue: 0, attribute: attr };
      }),
      ...WEAPON_SKILLS.map(name => {
        const attr = Object.entries(DB_SKILL_BY_ATTR).find(([, skills]) => skills.includes(name))?.[0];
        return { name, defaultValue: 0, attribute: attr };
      }),
    ];
  }

  getDefaultSkills(): Record<string, number> {
    const skills: Record<string, number> = {};
    for (const s of DB_SKILLS) skills[s] = 0;
    for (const s of WEAPON_SKILLS) skills[s] = 0;
    return skills;
  }

  getSkillCategories(): SkillCategory[] {
    return Object.entries(DB_SKILL_CATEGORIES).map(([name, skills]) => ({ name, skills }));
  }

  // Dragonbane skill bonuses are derived per-attribute (each AGL skill = AGL score / 5, etc.)
  // This returns a per-category multiplier keyed by attribute.
  calculateSkillCategoryModifiers(stats: CharacterStats): Record<string, number> {
    return {
      STR: stats.STR,
      INT: stats.INT,
      AGL: stats.DEX,  // DEX field stores AGL in Dragonbane
      CHA: stats.CHA,
    };
  }

  // Dragonbane uses kin/profession bonuses instead of occupation/homeland/cult.
  // Stub: returns skills unchanged until profession tables are defined.
  applyBackgroundBonuses(
    skills: Record<string, number>,
    _background: Pick<CharacterBackground, 'occupation' | 'homeland' | 'cult'>
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

  getMagicSystemType(): string {
    return 'dragonbane';
  }
}
