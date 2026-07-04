import type { GameSystem } from '../src/app/shared/models/game-system.model';

/** Base fields required for any Character, used across all systems. */
function baseCharacter(system: GameSystem, overrides: Record<string, unknown> = {}) {
  return {
    id: `test-${system}-1`,
    name: `Test ${system}`,
    color: '#3498db',
    gameSystem: system,
    skills: {},
    weapons: [],
    equipment: [],
    conditions: [],
    notes: '',
    cultStatus: null,
    ...overrides,
  };
}

/**
 * Per-system calculation fixtures with hand-computed expected values.
 * Every `expected` value is HAND-COMPUTED from the real formulas in
 * src/app/shared/rules/{system}-rules.ts — never derived by calling
 * GameSystemRules in this file. See implementation plan for formula details.
 */
export const CALC_FIXTURES: Record<GameSystem, { character: unknown; expected: Record<string, string> }> = {
  runequest: {
    character: baseCharacter('runequest', {
      name: 'Kallyr Test',
      background: { cult: 'Orlanth', occupation: 'Farmer', homeland: 'Sartar', age: 25, gender: 'Male' },
      stats: { STR: 12, CON: 14, SIZ: 13, DEX: 15, INT: 12, POW: 14, CHA: 11 },
      derivedStats: {
        totalHitPoints: 0, maxHitPoints: 0, magicPoints: 0, damageBonus: '0',
        spiritCombatDamage: '0', healingRate: 0, movementRate: 0, strikeRank: 0,
        maxEncumbrance: 0, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
      },
      hitLocations: {},
      armor: { 'Right Leg': 0, 'Left Leg': 0, 'Abdomen': 0, 'Chest': 0, 'Right Arm': 0, 'Left Arm': 0, 'Head': 0 },
      armorType: 'None',
      shields: [],
      runes: { elemental: {}, power: {}, form: {} },
      passions: [],
      magic: { spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0, doom: '', dragonbaneSpells: [] },
      resources: { lunars: 0, wheels: 0, clacks: 0, reputation: 0, ransom: 0, silver: 0, gold: 0 },
    }),
    // Formulas:
    // totalHP = max(1, SIZ + conHPMod(CON) + powHPMod(POW))
    //   conHPMod(14) = 1
    //   powHPMod(14) = 1
    //   = max(1, 13 + 1 + 1) = 15
    // damageBonus: STR+SIZ = 25 -> floor((25-13)/8)+1 = 2 -> '+2d6'
    // magicPoints = POW = 14
    // healingRate = ceil(CON/4) = ceil(14/4) = 4
    // movementRate = 8 (no encumbrance overage)
    // strikeRank = sizeMod(13) + dexMod(15) = 2 + 1 = 3
    // maxEncumbrance = min(12, floor((12+14)/2)) = min(12, 13) = 12
    expected: {
      totalHP: '15',
      damageBonus: '+2d6',
      magicPoints: '14',
      healingRate: '4',
      movementRate: '8',
      strikeRank: '3',
      encumbrance: '0 / 12',
    },
  },

  dragonbane: {
    character: baseCharacter('dragonbane', {
      name: 'Bjorn Test',
      background: { cult: 'None', occupation: 'None', homeland: 'Human', age: 25, gender: 'Male' },
      stats: { STR: 17, CON: 12, SIZ: 10, DEX: 14, INT: 10, POW: 15, CHA: 10 },
      derivedStats: {
        totalHitPoints: 0, maxHitPoints: 0, magicPoints: 0, damageBonus: '0',
        spiritCombatDamage: '0', healingRate: 0, movementRate: 0, strikeRank: 0,
        maxEncumbrance: 0, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
      },
      armorType: 'None',
      shields: [],
      magic: { spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0, doom: '', dragonbaneSpells: [] },
      resources: { fatePoints: 1, gold: 0 },
    }),
    // Formulas:
    // totalHP = CON = 12
    // damageBonus: STR >= 17 -> '+1d6'
    // magicPoints = POW = 15
    // movementRate = kinBase(Human=10) + aglMod(DEX=14)
    //   aglMod: 13-15 -> +2
    //   = 10 + 2 = 12
    // encumbrance: ceil(STR/2) = ceil(17/2) = 9
    expected: {
      totalHP: '12',
      damageBonus: '+1d6',
      magicPoints: '15',
      movementRate: '12',
      encumbrance: '0 / 9',
    },
  },

  'kal-arath': {
    character: baseCharacter('kal-arath', {
      name: 'Test Origin-Kin',
      background: { cult: 'None', occupation: 'None', homeland: 'None', age: 25, gender: 'Male' },
      stats: { STR: 10, CON: 8, SIZ: 0, DEX: 10, INT: 10, POW: 0, CHA: 10 },
      derivedStats: {
        totalHitPoints: 0, maxHitPoints: 0, magicPoints: 0, damageBonus: '0',
        spiritCombatDamage: '0', healingRate: 0, movementRate: 0, strikeRank: 0,
        maxEncumbrance: 0, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
      },
      hitLocations: {},
      armor: { 'Right Leg': 0, 'Left Leg': 0, 'Abdomen': 0, 'Chest': 0, 'Right Arm': 0, 'Left Arm': 0, 'Head': 0 },
      armorType: 'None',
      shields: [],
      magic: { spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0, doom: '', dragonbaneSpells: [] },
      resources: { gold: 0 },
    }),
    // Formulas:
    // maxHitPoints = 4 + CON(TOU) = 4 + 8 = 12
    // healingRate = max(1, 1 + CON) = max(1, 1 + 8) = 9
    // encumbrance: maxEncumbrance = STR + 8 = 10 + 8 = 18
    expected: {
      totalHP: '12',
      healingRate: '9',
      encumbrance: '0 / 18',
    },
  },

  osric: {
    character: baseCharacter('osric', {
      name: 'Test Fighter',
      background: { cult: 'Lawful Good', occupation: 'Fighter', homeland: 'Human', age: 25, gender: 'Male' },
      stats: { STR: 17, CON: 17, SIZ: 10, DEX: 17, INT: 12, POW: 13, CHA: 10 },
      derivedStats: {
        totalHitPoints: 0, maxHitPoints: 0, magicPoints: 0, damageBonus: '0',
        spiritCombatDamage: '0', healingRate: 0, movementRate: 0, strikeRank: 0,
        maxEncumbrance: 0, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
      },
      armorType: 'Chain Mail',
      shields: [],
      magic: { spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0, doom: '', dragonbaneSpells: [] },
      resources: { level: 1, xp: 0, gold: 0 },
    }),
    // Formulas:
    // maxHitPoints = max(1, 6 + conMod(17))
    //   conMod(17) = 3
    //   = max(1, 6 + 3) = 9
    // armorClass = max(-10, baseArmor - dexMod - shields.length)
    //   Chain Mail baseArmor = 5, dexMod(17) = 3, shields = 0
    //   = max(-10, 5 - 3 - 0) = 2
    // damageBonus(label "STR Bonus") = getStrBonus(17) = '+1/+1'
    // healingRate = 1
    // missileAttackBonus = getDexMissileModifier(17) = 2
    // movementRate: no equipment, effectiveENC = -50 -> 12
    // maxEncumbrance = getStrMaxEncumbrance(17) = 200
    expected: {
      totalHP: '9',
      damageBonus: '+1/+1',
      healingRate: '1',
      armorClass: '2',
      missileAttack: '+2',
      movementRate: '12',
      encumbrance: '0 / 200',
    },
  },

  mothership: {
    character: baseCharacter('mothership', {
      name: 'Test Marine',
      background: { cult: 'Marine', occupation: 'Marine', homeland: 'Earther', age: 25, gender: '' },
      stats: { STR: 50, CON: 35, SIZ: 0, DEX: 45, INT: 40, POW: 0, CHA: 0 },
      derivedStats: {
        totalHitPoints: 0, maxHitPoints: 0, magicPoints: 0, damageBonus: '0',
        spiritCombatDamage: '0', healingRate: 0, movementRate: 0, strikeRank: 0,
        maxEncumbrance: 0, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
      },
      magic: { spiritMagic: [], runeMagic: [], sorcery: [], runePoints: 0, doom: '', dragonbaneSpells: [] },
      resources: { level: 1, xp: 0 },
    }),
    // Formulas:
    // maxHitPoints = STR * 2 = 50 * 2 = 100
    // maxEncumbrance = STR = 50
    expected: {
      totalHP: '100',
      encumbrance: '0 / 50',
    },
  },
};
