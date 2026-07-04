import { MothershipRules } from './mothership-rules';
import { DiceService } from '@shared/services/dice.service';
import { UIStateService } from '@shared/services/ui-state.service';

describe('MothershipRules', () => {
  const rules = new MothershipRules();

  it('resolves attacks as a Combat check against the CMB stat (stored in DEX)', () => {
    expect(rules.getToHitMechanic()).toEqual({
      type: 'percentile-under-stat', stat: 'DEX', statLabel: 'Combat',
    });
  });

  it('models armor as an opposed Armor Save, not damage reduction', () => {
    expect(rules.getArmorModel()).toEqual({ kind: 'save', skill: 'Armor Save' });
  });

  it('uses a Speed check (SPD stored in CON) for initiative', () => {
    expect(rules.getInitiativeMechanic()).toEqual({
      kind: 'stat-check', stat: 'CON', statLabel: 'Speed',
    });
    expect(rules.usesStrikeRank()).toBe(false);
    expect(rules.getInitiativeLabel()).toBe('Speed Check');
  });

  it('stores Armor Save % bonuses in armor type points', () => {
    const vaccsuit = rules.getArmorTypes().find(a => a.name === 'Vaccsuit');
    expect(vaccsuit?.points).toBe(7);
  });

  it('has weapon damage notations that DiceService can parse (including 1d%)', () => {
    const dice = new DiceService({ use2d6Plus6: () => false } as unknown as UIStateService);
    for (const weapon of rules.getWeaponList()) {
      const result = dice.rollDiceNotation(weapon.damage);
      expect(result.total, `${weapon.name} damage "${weapon.damage}" should roll > 0`).toBeGreaterThan(0);
    }
  });

  it('computes Max Health as STR × 2', () => {
    const derived = rules.calculateDerivedStats(
      { STR: 40, CON: 40, SIZ: 0, DEX: 30, INT: 40, POW: 0, CHA: 0 }, [], [], []
    );
    expect(derived.maxHitPoints).toBe(80);
  });
});
