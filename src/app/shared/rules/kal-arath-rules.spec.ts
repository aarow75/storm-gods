import { KalArathRules } from './kal-arath-rules';

describe('KalArathRules', () => {
  const rules = new KalArathRules();

  it('resolves attacks as 2d6 + stat vs 8 (STR melee, AGI missile)', () => {
    expect(rules.getToHitMechanic()).toEqual({
      type: '2d6-over', target: 8,
      meleeStat: 'STR', meleeStatLabel: 'STR',
      missileStat: 'DEX', missileStatLabel: 'AGI',
    });
  });

  it('uses flat armor damage reduction', () => {
    expect(rules.getArmorModel()).toEqual({ kind: 'flat' });
    const heavy = rules.getArmorTypes().find(a => a.name === 'Heavy Armor');
    expect(heavy?.points).toBe(3);
  });

  it('rolls initiative as d6 + AGI vs 4', () => {
    expect(rules.getInitiativeMechanic()).toEqual({
      kind: 'd6-plus-stat', stat: 'DEX', statLabel: 'AGI', target: 4,
    });
    expect(rules.usesStrikeRank()).toBe(false);
  });
});
