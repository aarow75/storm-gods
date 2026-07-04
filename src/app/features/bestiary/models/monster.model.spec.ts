import { Monster, getMonsterCombatArmor } from './monster.model';
import { MONSTERS } from '@bestiary/constants/monsters.constants';

function monster(overrides: Partial<Monster>): Monster {
  return {
    id: 'm', name: 'M', gameSystem: 'runequest', category: 'beast',
    description: '', stats: { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 10, CHA: 10 },
    hitPoints: 10, armor: 3, armorDescription: '', movement: 8, attacks: [],
    ...overrides,
  };
}

describe('getMonsterCombatArmor', () => {
  it('keeps the authored value for the entry\'s native system', () => {
    expect(getMonsterCombatArmor(monster({ gameSystem: 'osric', armor: 5 }), 'osric')).toBe(5);
    expect(getMonsterCombatArmor(monster({ gameSystem: 'runequest', armor: 3 }), 'runequest')).toBe(3);
  });

  it('converts shared damage-reduction armor to descending AC for OSRIC combat', () => {
    // RQ-style 0 points (unarmored) → AC 10; 3 points (hide) → AC 7
    expect(getMonsterCombatArmor(monster({ gameSystem: 'runequest', armor: 0 }), 'osric')).toBe(10);
    expect(getMonsterCombatArmor(monster({ gameSystem: 'runequest', armor: 3 }), 'osric')).toBe(7);
  });

  it('leaves armor unchanged when crossing into non-AC systems', () => {
    expect(getMonsterCombatArmor(monster({ gameSystem: 'runequest', armor: 3 }), 'dragonbane')).toBe(3);
    expect(getMonsterCombatArmor(monster({ gameSystem: 'runequest', armor: 3 }), 'kal-arath')).toBe(3);
  });

  it('native OSRIC bestiary entries hold plausible descending AC values', () => {
    const osric = MONSTERS.filter(m => m.gameSystem === 'osric');
    expect(osric.length).toBeGreaterThan(0);
    for (const m of osric) {
      expect(m.armor, `${m.name} AC out of range`).toBeGreaterThanOrEqual(-2);
      expect(m.armor, `${m.name} AC out of range`).toBeLessThanOrEqual(10);
    }
    // Spot-check known OSRIC ACs
    expect(osric.find(m => m.name === 'Giant Rat')?.armor).toBe(7);
    expect(osric.find(m => m.name === 'Troll')?.armor).toBe(4);
    expect(osric.find(m => m.name === 'Lich')?.armor).toBe(0);
  });
});
