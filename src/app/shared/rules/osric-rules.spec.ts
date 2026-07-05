import { OsricRules, getOsricThac0, getOsricMonsterAttackLevel } from './osric-rules';
import { CharacterStats } from '@shared/models/character-stats.model';

describe('OsricRules', () => {
  const rules = new OsricRules();
  const stats: CharacterStats = { STR: 10, CON: 10, SIZ: 0, DEX: 10, INT: 10, POW: 10, CHA: 10 };

  describe('THAC0', () => {
    it('follows class attack matrices by level band', () => {
      expect(getOsricThac0('Fighter', 1)).toBe(20);
      expect(getOsricThac0('Fighter', 2)).toBe(20);
      expect(getOsricThac0('Fighter', 7)).toBe(14);
      expect(getOsricThac0('Fighter', 19)).toBe(2);
      expect(getOsricThac0('Cleric', 7)).toBe(18);
      expect(getOsricThac0('Thief', 9)).toBe(16);
      expect(getOsricThac0('Magic User', 9)).toBe(18);
    });

    it('falls back to 20 for unknown classes', () => {
      expect(getOsricThac0(undefined, 5)).toBe(20);
      expect(getOsricThac0('Innkeeper', 5)).toBe(20);
    });

    it('converts monster HP to an HD-equivalent attack level', () => {
      expect(getOsricMonsterAttackLevel(4)).toBe(2);   // ~1 HD → level 2
      expect(getOsricMonsterAttackLevel(38)).toBe(9);  // ~8 HD vampire → level 9
      expect(getOsricMonsterAttackLevel(1)).toBe(2);   // never below 1 HD
    });

    it('getD20AttackTarget routes characters by class and monsters by HP', () => {
      expect(rules.getD20AttackTarget({ className: 'Fighter', level: 7 })).toBe(14);
      expect(rules.getD20AttackTarget({ className: 'Fighter' })).toBe(20); // level defaults to 1
      // 38 HP monster → 8 HD → fighter level 9 → THAC0 12
      expect(rules.getD20AttackTarget({ monsterMaxHp: 38 })).toBe(12);
    });
  });

  describe('melee attacks per round', () => {
    it('fighters follow the 1/1, 3/2, 2/1 progression', () => {
      expect(rules.getMeleeAttacksPerRound('Fighter', 1, 1)).toBe(1);
      expect(rules.getMeleeAttacksPerRound('Fighter', 6, 1)).toBe(1);
      // 3/2: extra attack on odd rounds
      expect(rules.getMeleeAttacksPerRound('Fighter', 7, 1)).toBe(2);
      expect(rules.getMeleeAttacksPerRound('Fighter', 7, 2)).toBe(1);
      expect(rules.getMeleeAttacksPerRound('Fighter', 13, 1)).toBe(2);
      expect(rules.getMeleeAttacksPerRound('Fighter', 13, 2)).toBe(2);
      expect(rules.getMeleeAttacksPerRound('Fighter', 20, 2)).toBe(2); // beyond table = level 13+ rules
    });

    it('paladins and rangers gain 3/2 attacks at level 8', () => {
      expect(rules.getMeleeAttacksPerRound('Paladin', 7, 1)).toBe(1);
      expect(rules.getMeleeAttacksPerRound('Paladin', 8, 1)).toBe(2);
      expect(rules.getMeleeAttacksPerRound('Ranger', 8, 2)).toBe(1);
    });

    it('other classes and monsters get one attack', () => {
      expect(rules.getMeleeAttacksPerRound('Cleric', 15, 1)).toBe(1);
      expect(rules.getMeleeAttacksPerRound(undefined, 1, 1)).toBe(1);
    });
  });

  describe('armor encumbrance and movement', () => {
    it('counts worn armor weight toward total encumbrance', () => {
      const unarmored = rules.calculateDerivedStats(stats, [], [], [], undefined, 'None');
      const plated = rules.calculateDerivedStats(stats, [], [], [], undefined, 'Plate Mail');
      expect(unarmored.totalEncumbrance).toBe(0);
      expect(plated.totalEncumbrance).toBe(45);
    });

    it('applies the armor movement cap regardless of weight carried', () => {
      // Plate alone is only 45 lbs (weight tier 90 ft) but plate caps movement at 60 ft
      const plated = rules.calculateDerivedStats(stats, [], [], [], undefined, 'Plate Mail');
      expect(plated.movementRate).toBe(6);
      // Leather imposes no cap below the weight tiers
      const leather = rules.calculateDerivedStats(stats, [], [], [], undefined, 'Leather');
      expect(leather.movementRate).toBe(12);
    });

    it('weight tiers still apply beneath the armor cap', () => {
      const gear = [{ name: 'Chest', quantity: 1, cost: 0, hitPoints: 1, encumbrance: 100 }];
      const leather = rules.calculateDerivedStats(stats, gear, [], [], undefined, 'Leather');
      // 100 + 15 lbs = 115 lbs → 30 ft tier, below leather's 120 ft cap
      expect(leather.totalEncumbrance).toBe(115);
      expect(leather.movementRate).toBe(3);
    });
  });

  describe('race/class level caps', () => {
    it('returns the OSRIC cap for restricted combinations', () => {
      expect(rules.getMaxCharacterLevel('Dwarf', 'Fighter')).toBe(9);
      expect(rules.getMaxCharacterLevel('Half-Orc', 'Cleric')).toBe(4);
    });

    it('returns the 999 sentinel when unrestricted', () => {
      expect(rules.getMaxCharacterLevel('Human', 'Fighter')).toBe(999);
      expect(rules.getMaxCharacterLevel('Dwarf', 'Thief')).toBe(999);
    });
  });
});
