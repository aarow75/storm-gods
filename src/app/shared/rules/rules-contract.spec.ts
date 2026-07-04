import { getRulesForSystem } from './game-system-rules.factory';
import { GameSystem } from '@shared/models/game-system.model';
import { GameSystemRules } from './game-system-rules.interface';
import { RuneQuestRules } from './runequest-rules';

describe('GameSystemRules contract', () => {
  const systems: GameSystem[] = ['runequest', 'dragonbane', 'kal-arath', 'osric', 'mothership'];

  it('strike-rank initiative is used exactly when usesStrikeRank() is true', () => {
    for (const system of systems) {
      const rules = getRulesForSystem(system);
      const mechanic = rules.getInitiativeMechanic?.() ?? { kind: 'strike-rank' as const };
      expect(mechanic.kind === 'strike-rank', `${system} initiative/usesStrikeRank mismatch`)
        .toBe(rules.usesStrikeRank());
    }
  });

  it('RuneQuest relies on the strike-rank and locations defaults (hooks omitted)', () => {
    const rq: GameSystemRules = new RuneQuestRules();
    expect(rq.getInitiativeMechanic).toBeUndefined();
    expect(rq.getArmorModel).toBeUndefined();
    expect(rq.usesHitLocations()).toBe(true);
  });

  it('declares the expected armor model per system', () => {
    expect(getRulesForSystem('osric').getArmorModel?.()).toEqual({ kind: 'ac' });
    expect(getRulesForSystem('dragonbane').getArmorModel?.()).toEqual({ kind: 'flat' });
    expect(getRulesForSystem('kal-arath').getArmorModel?.()).toEqual({ kind: 'flat' });
    expect(getRulesForSystem('mothership').getArmorModel?.()).toEqual({ kind: 'save', skill: 'Armor Save' });
  });

  it('declares the expected initiative mechanic per system', () => {
    expect(getRulesForSystem('osric').getInitiativeMechanic?.()).toEqual({ kind: 'side-d6' });
    expect(getRulesForSystem('dragonbane').getInitiativeMechanic?.()).toEqual({ kind: 'unique-cards', deckSize: 10 });
    expect(getRulesForSystem('kal-arath').getInitiativeMechanic?.().kind).toBe('d6-plus-stat');
    expect(getRulesForSystem('mothership').getInitiativeMechanic?.().kind).toBe('stat-check');
  });
});
