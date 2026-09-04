import { CharacterStats } from '@shared/models/character-stats.model';
import { RUNEQUEST_NAMES } from '@characters/constants/runequest-names.constants';
import {
  WeaponDefinition, ShieldDefinition, HitLocations, Weapon, Shield,
  WEAPON_LIST, SHIELD_LIST, ARMOR_TYPES,
  getSizeModifier, getDexterityModifier, calculateHitLocations as rqCalculateHitLocations
} from '@shared/rules/game-rules';
import {
  DerivedStats, EquipmentItem, CharacterBackground, Resources,
  calculateDerivedStats as rqCalculateDerivedStats,
  calculateSkillCategoryModifiers as rqCalculateSkillCategoryModifiers,
  applySkillBonuses as rqApplySkillBonuses,
  getSizHPModifier, getPowHPModifier, getCharacteristicModifier,
  DEFAULT_SKILLS, COMBAT_SKILLS,
  OCCUPATION_SKILL_BONUSES, HOMELAND_SKILL_BONUSES, CULT_SKILL_BONUSES
} from '@characters/models/character.model';
import {
  GameSystemRules, StatDefinition, ConditionDefinition,
  SkillDefinition, SkillCategory, ArmorTypeDefinition, BackgroundForBonuses
} from './game-system-rules.interface';
import {
  SpellEffect, CastCheck, CastableSpell, SpellCasterInfo,
  buildSpellEffectIndex, normalizeSpellName
} from './spell-effects.model';

const CONDITIONS: ConditionDefinition[] = [
  { name: 'Prone',    effect: 'Melee attackers +20%, ranged attackers -20%' },
  { name: 'Blinded',  effect: '-50% to all skills except close combat' },
  { name: 'Poisoned', effect: 'Varies by poison; often damage/round or -skill modifier' },
  { name: 'Stunned',  effect: 'Cannot act; roll CON to recover' },
  { name: 'Fatigued', effect: '-5% per fatigue level; can only cast 1 spell/round' },
  { name: 'Confused', effect: 'Cannot take effective actions; react randomly' },
];

const SKILL_DEFINITIONS: SkillDefinition[] = [
  { name: 'Sword & Shield',    defaultValue: 15 },
  { name: 'Two-Handed Weapon', defaultValue: 10 },
  { name: 'Spear',             defaultValue: 10 },
  { name: 'Bow',               defaultValue: 5  },
  { name: 'Sling',             defaultValue: 5  },
  { name: 'Unarmed',           defaultValue: 25 },
  { name: 'Shield',            defaultValue: 15 },
  { name: 'Spirit Combat',     defaultValue: 20 },
  { name: 'Sorcery',           defaultValue: 0  },
  { name: 'Rune Magic',        defaultValue: 0  },
  { name: 'Lore (World)',      defaultValue: 15 },
  { name: 'Lore (Animal)',     defaultValue: 5  },
  { name: 'Lore (Plant)',      defaultValue: 5  },
  { name: 'Speak (Native)',    defaultValue: 50 },
  { name: 'Speak (Other)',     defaultValue: 0  },
  { name: 'Read/Write',        defaultValue: 0  },
  { name: 'Craft',             defaultValue: 10 },
  { name: 'Farm',              defaultValue: 10 },
  { name: 'Heal',              defaultValue: 10 },
  { name: 'Listen',            defaultValue: 25 },
  { name: 'Scan',              defaultValue: 25 },
  { name: 'Search',            defaultValue: 25 },
  { name: 'Track',             defaultValue: 5  },
  { name: 'Hide',              defaultValue: 10 },
  { name: 'Move Quietly',      defaultValue: 10 },
  { name: 'Climb',             defaultValue: 40 },
  { name: 'Dodge',             defaultValue: 20 },
  { name: 'Ride',              defaultValue: 5  },
  { name: 'Swim',              defaultValue: 15 },
];

const SKILL_CATEGORIES: SkillCategory[] = [
  { name: 'Combat Skills',       skills: COMBAT_SKILLS },
  { name: 'Magic Skills',        skills: ['Spirit Combat', 'Sorcery', 'Rune Magic'] },
  { name: 'Knowledge Skills',    skills: ['Lore (World)', 'Lore (Animal)', 'Lore (Plant)'] },
  { name: 'Communication Skills',skills: ['Speak (Native)', 'Speak (Other)', 'Read/Write'] },
  { name: 'Manipulation Skills', skills: ['Craft', 'Farm', 'Heal'] },
  { name: 'Perception Skills',   skills: ['Listen', 'Scan', 'Search', 'Track'] },
  { name: 'Stealth Skills',      skills: ['Hide', 'Move Quietly'] },
  { name: 'Agility Skills',      skills: ['Climb', 'Dodge', 'Ride', 'Swim'] },
];

// Spirit magic combat effects, from public/docs/RuneQuest-Spells.md. Costs come
// from the character's learned Spell.points at cast time (variable spells are
// bought at 1-4 points), so no cost is stored here.
export const RQ_SPIRIT_SPELL_EFFECTS: SpellEffect[] = [
  { name: 'Disruption', target: 'enemy', kind: 'damage', notation: '1d3', ignoresArmor: true, resisted: true },
  { name: 'Heal', target: 'ally', kind: 'healing', notation: '1', perPoint: true,
    description: 'Heals 1 point per point of spell to a touched location' },
  { name: 'Bladesharp', target: 'self', kind: 'utility',
    description: '+5% to hit and +1 damage per point (max +20%/+4) on a hacking/stabbing weapon — apply manually' },
  { name: 'Countermagic', target: 'self', kind: 'utility',
    description: 'Defensive shell vs incoming spells; stops spells 2+ points weaker' },
  { name: 'Detect', target: 'self', kind: 'utility',
    description: 'Locates the named thing by direction and distance (40m)' },
  { name: 'Extinguish', target: 'self', kind: 'utility',
    description: 'Puts out one large fire or all small fires within 10m' },
  { name: 'Fanaticism', target: 'ally', kind: 'utility',
    description: 'Hit chance ×1.5, but no parries/protective spells and Defense halved — apply manually' },
  { name: 'Firearrow', target: 'self', kind: 'utility',
    description: 'Next missile does 3d6 heat damage (armor absorbs); the missile is consumed — set manually' },
  { name: 'Fireblade', target: 'self', kind: 'utility',
    description: 'Edged weapon does 3d6 damage instead of normal (armor absorbs) — set weapon damage manually' },
  { name: 'Glamour', target: 'ally', kind: 'utility', description: 'CHA ×1.5 for the duration' },
  { name: 'Ignite', target: 'self', kind: 'utility', description: 'Sets fire to anything normally burnable (40m)' },
  { name: 'Light', target: 'self', kind: 'utility', description: 'Lights a 12m radius on a cast object' },
  { name: 'Lightwall', target: 'self', kind: 'utility', description: '10m × 3m wall of light; blocks vision from the far side' },
  { name: 'Mobility', target: 'ally', kind: 'utility', description: 'Doubles the movement class of the recipient' },
  { name: 'Protection', target: 'self', kind: 'utility',
    description: '+1 armor point per point of spell on all locations — apply manually' },
  { name: 'Shimmer', target: 'self', kind: 'utility', description: '+5% Defense per point vs all attackers' },
  { name: 'Speedart', target: 'self', kind: 'utility', description: 'Missiles get +15% to hit and +3 damage — apply manually' },
  { name: 'Spirit Screen', target: 'self', kind: 'utility',
    description: 'Spirit combat ward: each point destroys 2 points of an attacking spirit\'s POW' },
  { name: 'Strength', target: 'ally', kind: 'utility', description: 'STR ×1.5 (max species maximum) for the duration' },
  { name: 'Vigor', target: 'ally', kind: 'utility', description: 'CON ×1.5 (max species maximum) for the duration' },
];

// Rune magic combat effects, from public/docs/RuneQuest-Spells.md. Cost = the
// spell's runePointCost, deducted from magic.currentRunePoints.
export const RQ_RUNE_SPELL_EFFECTS: SpellEffect[] = [
  { name: 'Lightning', target: 'enemy', kind: 'damage', notation: '3d6', ignoresArmor: true, resisted: true },
  { name: 'Thunderbolt', target: 'enemy', kind: 'damage', notation: '3d6', ignoresArmor: true, resisted: true,
    targetsTotalHp: true, description: 'Damage to total HP; must be healed magically before natural healing' },
  { name: 'Sever Spirit', target: 'enemy', kind: 'damage', resisted: true, slays: true,
    notation: '1d6', targetsTotalHp: true,
    description: 'POW vs POW: success kills the target; on failure the target takes 1d6' },
  { name: 'Heal Body', target: 'ally', kind: 'healing', notation: 'full',
    description: 'Cures the total damage taken by a body, regardless of hit location' },
  { name: 'Wind Words', target: 'self', kind: 'utility', description: 'Hear conversations carried downwind within 160m' },
  { name: 'Bless Crops', target: 'self', kind: 'utility', description: 'Wards one hectare and increases harvest ×1.5' },
  { name: 'Truesword', target: 'self', kind: 'utility',
    description: 'Doubles sword damage (up to the sword\'s max roll) — apply manually' },
  { name: 'Shield', target: 'self', kind: 'utility',
    description: '+2 armor points on all locations and 2 points of Countermagic per point — apply manually' },
  { name: 'Reflection', target: 'self', kind: 'utility',
    description: 'Reflects spells of no more POW points than the Reflection back at their casters' },
  { name: 'Axis Mundi', target: 'self', kind: 'utility',
    description: 'Warded circle: worshippers add the priest\'s rune magic to their defense' },
];

// Sorcery combat effects, from public/docs/RuneQuest-Spells.md. Cost = 1 MP
// per point of intensity (spell.cost). Most sorcery spells are buffs/debuffs/
// utility with no direct damage — those stay 'utility' with a manual-apply
// note, matching the spirit magic convention above. 'Spirit Screen' is
// omitted here since it's identical to the spirit magic version and already
// resolves through the shared index.
export const RQ_SORCERY_SPELL_EFFECTS: SpellEffect[] = [
  { name: 'Animate (Substance)', target: 'self', kind: 'utility',
    description: 'Animates ~1 SIZ of the named substance per intensity to grip, carry, or strike' },
  { name: 'Banish', target: 'enemy', kind: 'utility',
    description: 'Intensity vs POW: on success expels a spirit/elemental/entity back to its home plane — resolve manually' },
  { name: 'Beast Form', target: 'self', kind: 'utility',
    description: 'Transforms the subject into an ordinary animal of ~SIZ per intensity; keeps INT/POW' },
  { name: 'Blessing', target: 'ally', kind: 'utility',
    description: '+5% per intensity to one named skill for the duration — apply manually' },
  { name: 'Castback', target: 'self', kind: 'utility',
    description: 'Ward: a spell failing to beat this intensity strikes its own caster instead; collapses after one reflection' },
  { name: 'Curse', target: 'enemy', kind: 'utility',
    description: '-5% per intensity to all skills if POW is overcome, until dispelled — apply manually' },
  { name: 'Damage Boosting', target: 'self', kind: 'utility',
    description: '+1 damage per intensity on a cast weapon — apply manually' },
  { name: 'Damage Resistance', target: 'self', kind: 'utility',
    description: 'Reduces incoming damage per blow by the intensity, before armor — apply manually' },
  { name: 'Diminish (Characteristic)', target: 'enemy', kind: 'utility',
    description: '-1 characteristic per 2 intensity if POW is overcome — apply manually' },
  { name: 'Dispel Magic', target: 'enemy', kind: 'utility',
    description: 'Removes one active spell of equal or lower magnitude (full strength vs spirit magic, half vs rune magic)' },
  { name: 'Dominate (Species)', target: 'enemy', kind: 'utility',
    description: 'Seizes the will of one creature of the named species whose POW is overcome, for the duration' },
  { name: 'Enhance (Characteristic)', target: 'ally', kind: 'utility',
    description: '+1 characteristic per 2 intensity, up to 1.5x natural — apply manually' },
  { name: 'Flight', target: 'ally', kind: 'utility',
    description: 'Grants flight at ~movement class 3 per intensity; unwilling targets require overcoming POW' },
  { name: 'Forge (Substance)', target: 'self', kind: 'utility',
    description: 'Shapes/mends/joins 1 SIZ of the named substance per intensity, without tools or heat' },
  { name: 'Glow', target: 'self', kind: 'utility',
    description: 'Sorcerous light illuminating 3m per intensity, color and brightness at the caster\'s whim' },
  { name: 'Haste', target: 'ally', kind: 'utility',
    description: '+1 movement class and -1 strike rank per 2 intensity; fatigues the target when it ends — apply manually' },
  { name: 'Illusion', target: 'self', kind: 'utility',
    description: 'Phantom of sight/sound up to 1 SIZ per intensity; disbelieved by overcoming intensity with INT' },
  { name: 'Neutralize Magic', target: 'enemy', kind: 'utility',
    description: 'Suppresses magic of equal or lower magnitude in the area for the duration' },
  { name: 'Palsy', target: 'enemy', kind: 'utility',
    description: 'Locks one hit location rigid if POW is overcome; vital locations render the victim helpless' },
  { name: 'Phantom (Sense)', target: 'enemy', kind: 'utility',
    description: 'Creates a false sensory impression perceived by all within range' },
  { name: 'Regenerate', target: 'ally', kind: 'utility',
    description: 'Heals 1 HP per intensity per hit location over the spell\'s duration; regrows severed members over weeks' },
  { name: 'Sculpt (Substance)', target: 'self', kind: 'utility',
    description: 'Plastically reshapes 1 SIZ of the named substance per intensity; keeps its new shape' },
  { name: 'Sense (Substance)', target: 'self', kind: 'utility',
    description: 'Perceives the named substance\'s direction, distance, and rough quantity within range' },
  { name: 'Slow', target: 'enemy', kind: 'utility',
    description: '-1 movement class and +1 strike rank per 2 intensity if POW is overcome — apply manually' },
  { name: 'Summon (Entity)', target: 'self', kind: 'utility',
    description: 'Calls an entity of the named type from its home plane; size/power scale with intensity' },
  { name: 'Teleport', target: 'self', kind: 'utility',
    description: 'Moves the caster (or a touched target) to a seen spot within range; ~SIZ 7 per intensity' },
  { name: 'Venom', target: 'enemy', kind: 'damage', notation: '6', perPoint: true,
    ignoresArmor: true, resisted: true, halfOnResistFailure: true, targetsTotalHp: true,
    description: 'Poison potency 6 per intensity vs CON on the resistance table; half potency if resisted' },
  { name: 'Ward', target: 'self', kind: 'utility',
    description: 'Warded area of 1m radius per intensity; intruders take 1d3 per 2 intensity unless they overcome the ward\'s intensity with POW' },
];

const RQ_SPELL_EFFECT_INDEX = buildSpellEffectIndex([
  ...RQ_SPIRIT_SPELL_EFFECTS, ...RQ_RUNE_SPELL_EFFECTS, ...RQ_SORCERY_SPELL_EFFECTS,
]);

const STAT_DEFINITIONS: StatDefinition[] = [
  { key: 'STR', label: 'STR (Strength)',      visible: true },
  { key: 'CON', label: 'CON (Constitution)',  visible: true },
  { key: 'SIZ', label: 'SIZ (Size)',          visible: true },
  { key: 'DEX', label: 'DEX (Dexterity)',     visible: true },
  { key: 'INT', label: 'INT (Intelligence)',  visible: true },
  { key: 'POW', label: 'POW (Power)',         visible: true },
  { key: 'CHA', label: 'CHA (Charisma)',      visible: true },
];

export class RuneQuestRules implements GameSystemRules {
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
    return rqCalculateDerivedStats(stats, equipment, weapons, shields);
  }

  usesHitLocations(): boolean {
    return true;
  }

  calculateHitLocations(stats: CharacterStats): HitLocations {
    // RQ2: Total HP = CON + HP modifier(SIZ) + HP modifier(POW)
    const totalHP = Math.max(1, stats.CON + getSizHPModifier(stats.SIZ) + getPowHPModifier(stats.POW));
    return rqCalculateHitLocations(totalHP);
  }

  getSkillDefinitions(): SkillDefinition[] {
    return SKILL_DEFINITIONS;
  }

  getDefaultSkills(): Record<string, number> {
    return { ...DEFAULT_SKILLS };
  }

  getSkillCategories(): SkillCategory[] {
    return SKILL_CATEGORIES;
  }

  calculateSkillCategoryModifiers(stats: CharacterStats): Record<string, number> {
    return rqCalculateSkillCategoryModifiers(stats);
  }

  applyBackgroundBonuses(
    skills: Record<string, number>,
    background: Pick<CharacterBackground, 'occupation' | 'homeland' | 'cult' | 'age'>,
    _stats?: CharacterStats
  ): Record<string, number> {
    return rqApplySkillBonuses(
      skills as any,
      background.occupation,
      background.homeland,
      background.cult
    );
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
    return RUNEQUEST_NAMES;
  }

  usesStrikeRank(): boolean {
    return true;
  }

  getInitiativeLabel(): string {
    return 'Strike Rank';
  }

  getMovementInitiativeCost(meters: number): number {
    if (!meters || meters <= 0) return 0;
    return Math.ceil(meters / 3);
  }

  getSurpriseInitiativePenalty(distanceMeters: number): number {
    if (distanceMeters <= 3) return 3;
    return 1;
  }

  getHitLocationRollTable(): Record<number, string> {
    return {
      1: 'Right Leg', 2: 'Right Leg', 3: 'Right Leg', 4: 'Right Leg',
      5: 'Left Leg',  6: 'Left Leg',  7: 'Left Leg',  8: 'Left Leg',
      9: 'Abdomen',  10: 'Abdomen',  11: 'Abdomen',
      12: 'Chest',
      13: 'Right Arm', 14: 'Right Arm', 15: 'Right Arm',
      16: 'Left Arm',  17: 'Left Arm',  18: 'Left Arm',
      19: 'Head', 20: 'Head',
    };
  }

  // RQ2 Damage Results: at 0 location HP, limbs go useless and vital locations knock the
  // character out (dying in 1d6 rounds); `fatal` locations kill only at −(location max),
  // i.e. once total damage to the location reaches double its HP.
  getLocationEffects(): Record<string, { label: string; fatal: boolean }> {
    return {
      'Head':      { label: 'Unconscious — dies in 1d6 rounds without healing', fatal: true  },
      'Chest':     { label: 'Unconscious — dies in 1d6 rounds without healing', fatal: true  },
      'Abdomen':   { label: 'Unconscious — dies in 1d6 rounds without healing', fatal: true  },
      'Right Arm': { label: 'Arm Useless', fatal: false },
      'Left Arm':  { label: 'Arm Useless', fatal: false },
      'Right Leg': { label: 'Leg Useless', fatal: false },
      'Left Leg':  { label: 'Leg Useless', fatal: false },
    };
  }

  getHitLocationsDisplayOrder(): string[] {
    return ['Head', 'Right Arm (Weapon)', 'Chest', 'Left Arm (Shield)', 'Abdomen', 'Right Leg', 'Left Leg'];
  }

  // RQ2 Attack/Parry/Defense modifiers all use the same DEX-based table
  // (RuneQuest Classic Mechanics Reference, Ability Modifier Tables).
  getAttackBonuses(stats: CharacterStats): { attack: number; parry: number; dodge: number } {
    const dexMod = getCharacteristicModifier(stats.DEX ?? 10);
    return { attack: dexMod, parry: dexMod, dodge: dexMod };
  }

  getParryRepeatPenalty(): number {
    return 20;
  }

  usesParryDodge(): boolean { return true; }
  usesWeaponHP(): boolean { return true; }

  getMagicSystemType(): string {
    return 'runequest';
  }

  getSpellEffect(spellName: string): SpellEffect | null {
    return RQ_SPELL_EFFECT_INDEX.get(normalizeSpellName(spellName)) ?? null;
  }

  // Casting checks per public/docs/RuneQuest-Spells.md: spirit magic on POW×5,
  // rune magic on the caster's affinity for the spell's rune (POW×5 when the
  // rune is untrained), sorcery on the Sorcery skill.
  getCastCheck(spell: CastableSpell, caster: SpellCasterInfo): CastCheck {
    const powTimes5 = (caster.stats.POW ?? 10) * 5;
    if (spell.category === 'rune') {
      // spell.discipline carries the RuneSpell's associatedRune
      const affinity = spell.discipline ? (caster.runes?.[spell.discipline] ?? 0) : 0;
      if (affinity > 0) {
        return { kind: 'percentile-under', target: affinity, label: `${spell.discipline} rune` };
      }
      return { kind: 'percentile-under', target: powTimes5, label: 'POW×5' };
    }
    if (spell.category === 'sorcery') {
      return { kind: 'percentile-under', target: caster.skills['Sorcery'] ?? 0, label: 'Sorcery' };
    }
    return { kind: 'percentile-under', target: powTimes5, label: 'POW×5' };
  }

  getCurrencyLabel(): string {
    return 'L';
  }

  getSystemName(): string { return 'RuneQuest'; }
  getStatRange(): { min: number; max: number } { return { min: 1, max: 30 }; }
  canRollStats(): boolean { return true; }

  // RQ2 characteristic generation: 3D6 for most stats, 2D6+6 for SIZ and INT
  rollStat(stat: keyof CharacterStats): number {
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    if (stat === 'SIZ' || stat === 'INT') return d6() + d6() + 6;
    return d6() + d6() + d6();
  }
  showsMagicPoints(): boolean { return true; }
  getMagicPointsLabel(): string { return 'Magic Points'; }
  showsDamageBonus(): boolean { return true; }
  getDamageBonusLabel(): string { return 'Damage Bonus'; }
  showsHealingRate(): boolean { return true; }
  getHealingRateLabel(): string { return 'Healing Rate'; }
  showsMovementRate(): boolean { return true; }

  getEncumbrancePenaltyText(derivedStats: DerivedStats): string {
    return `-${derivedStats.encumbranceDefensePenalty}% Dodge`;
  }

  getResourceFields(): { key: keyof Resources; label: string; hint?: string }[] {
    return [
      { key: 'wheels',     label: 'Wheels (2 Gold)' },
      { key: 'lunars',     label: 'Lunars (Silver)' },
      { key: 'clacks',     label: 'Clacks (Copper)' },
      { key: 'reputation', label: 'Reputation' },
      { key: 'ransom',     label: 'Ransom' },
    ];
  }

  getPrimaryWealthAmount(resources: Resources): number {
    return (resources.wheels ?? 0) * 20 + (resources.lunars ?? 0) + (resources.clacks ?? 0) / 10;
  }

  weaponSkillIsFixed(): boolean { return false; }
  weaponHasSelectableSkill(): boolean { return true; }
  getDefaultStats(): CharacterStats { return { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 10, CHA: 10 }; }
  getArmorHint(): string { return ''; }
}
