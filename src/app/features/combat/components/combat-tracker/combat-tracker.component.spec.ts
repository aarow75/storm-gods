import { vi } from 'vitest';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { CombatTrackerComponent } from './combat-tracker.component';
import { CharacterService } from '@characters/services/character.service';
import { CustomMonsterService } from '@bestiary/services/custom-monster.service';
import { GameSystemService, GameSystem } from '@shared/services/game-system.service';
import { CombatParticipant, Monster } from '@combat/models/combat.model';
import { Character } from '@characters/models/character.model';
import { Monster as BestiaryMonster } from '@bestiary/models/monster.model';

function makeCharacter(overrides: Partial<Character>): Character {
  return {
    id: 'char-1',
    name: 'Hero',
    color: '#3498db',
    gameSystem: 'runequest',
    background: { cult: '', occupation: '', homeland: '', age: 25, gender: '' },
    stats: { STR: 10, CON: 10, SIZ: 10, DEX: 10, INT: 10, POW: 10, CHA: 10 },
    derivedStats: {
      totalHitPoints: 10, maxHitPoints: 10, magicPoints: 0, damageBonus: '0',
      spiritCombatDamage: '0', healingRate: 0, movementRate: 8, strikeRank: 0,
      maxEncumbrance: 10, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
    },
    skills: {},
    hitLocations: {
      'Right Leg': 4, 'Left Leg': 4, 'Abdomen': 4, 'Chest': 5,
      'Right Arm': 3, 'Left Arm': 3, 'Head': 4,
    },
    armor: {
      'Right Leg': 0, 'Left Leg': 0, 'Abdomen': 0, 'Chest': 0,
      'Right Arm': 0, 'Left Arm': 0, 'Head': 0,
    },
    weapons: [],
    shields: [],
    runes: { elemental: '', power: '', form: '' },
    passions: [],
    magic: { spiritMagic: [], runeMagic: [], sorcery: [], dragonbaneSpells: [] },
    resources: { lunars: 0, wheels: 0, clacks: 0, silver: 0, gold: 0, reputation: 0, ransom: 0 },
    equipment: [],
    notes: '',
    ...overrides,
  } as Character;
}

function makeParticipant(overrides: Partial<CombatParticipant>): CombatParticipant {
  return {
    id: 'p-' + Math.random().toString(36).slice(2),
    name: 'P',
    type: 'character',
    maxHitPoints: 10,
    currentHitPoints: new Array(10).fill(false),
    baseStrikeRank: 0,
    finalStrikeRank: 0,
    locationDamage: {},
    ...overrides,
  };
}

describe('CombatTrackerComponent', () => {
  let fixture: ComponentFixture<CombatTrackerComponent>;
  let component: CombatTrackerComponent;
  let characters: Character[];

  async function setup(system: GameSystem, chars: Character[]): Promise<void> {
    characters = chars;
    localStorage.clear();
    localStorage.setItem('gameSystem', system);
    await TestBed.configureTestingModule({
      imports: [CombatTrackerComponent],
      providers: [
        provideRouter([]),
        { provide: CharacterService, useValue: { getCharacters: () => characters } },
        { provide: CustomMonsterService, useValue: { getMonsters: () => [] } },
      ],
    }).compileComponents();

    TestBed.inject(GameSystemService).gameSystem.set(system);
    fixture = TestBed.createComponent(CombatTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function addCombatPair(character: Character, monster: Monster):
      { attacker: CombatParticipant; defender: CombatParticipant } {
    component.monsters.push(monster);
    const defender = makeParticipant({
      id: 'monster-p', name: monster.name, type: 'monster', monsterId: monster.id,
      maxHitPoints: monster.hitPoints, currentHitPoints: new Array(monster.hitPoints).fill(false),
    });
    const attacker = makeParticipant({
      id: 'char-p', name: character.name, type: 'character', characterId: character.id,
      selectedWeapon: character.weapons[0]?.name, selectedOpponentId: defender.id,
    });
    component.combatParticipants.push(attacker, defender);
    return { attacker, defender };
  }

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('Mothership', () => {
    const monster: Monster = {
      id: 'm-1', name: 'Carcinid', hitPoints: 20, strikeRank: 0, armor: 40,
      weapons: [{ name: 'Claw', damage: '1d10', strikeRankModifier: 0 }],
    };

    function mothershipCharacter(): Character {
      return makeCharacter({
        gameSystem: 'mothership',
        stats: { STR: 40, CON: 40, SIZ: 0, DEX: 60, INT: 40, POW: 0, CHA: 0 },
        skills: { 'Armor Save': 30 } as unknown as Character['skills'],
        armorType: 'Vaccsuit',
        weapons: [{ name: 'Revolver', damage: '3d10', skill: 'CMB' }],
        derivedStats: {
          totalHitPoints: 80, maxHitPoints: 80, magicPoints: 0, damageBonus: '0',
          spiritCombatDamage: '0', healingRate: 0, movementRate: 40, strikeRank: 0,
          maxEncumbrance: 40, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
        },
      });
    }

    it('hits with a Combat check against the CMB stat (was: always missed via skills lookup)', async () => {
      await setup('mothership', [mothershipCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);

      expect(component.getEffectiveAttackSkill(attacker)).toBe(60);

      // attack d100 = 50 (≤ 60, hit); damage 3d10 = 5,5,5; armor save d100 = 90 (> 37, fails)
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)  // attack roll → 50
        .mockReturnValueOnce(0.49).mockReturnValueOnce(0.49).mockReturnValueOnce(0.49) // 3d10 → 5+5+5
        .mockReturnValueOnce(0.89); // armor save → 90
      component.rollWeaponDamage(attacker);

      const result = component.lastDamageRolls.get(attacker.id);
      expect(result?.finalDamage).toBe(15);
      expect(result?.attackRollDisplay).toContain('Combat check');
    });

    it('computes the Armor Save target as skill + armor type bonus', async () => {
      await setup('mothership', [mothershipCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);
      const charParticipant = attacker;
      // 30 (Armor Save skill) + 7 (Vaccsuit) = 37
      expect(component.getArmorSaveTarget(charParticipant)).toBe(37);
      expect(component.getArmorDisplay(charParticipant)).toBe('Save: 37%');
    });

    it('negates all damage when the Armor Save succeeds and beats the attack roll', async () => {
      await setup('mothership', [mothershipCharacter()]);
      const { attacker, defender } = addCombatPair(characters[0], monster);

      // attack 10 (hit vs 60); damage 3d10; monster save d100 = 30 ≤ 40 and 30 > 10 → save wins
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.09)  // attack roll → 10
        .mockReturnValueOnce(0.49).mockReturnValueOnce(0.49).mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.29); // save roll → 30
      component.rollWeaponDamage(attacker);

      expect(component.lastDamageRolls.get(attacker.id)?.finalDamage).toBe(0);
      expect(defender.currentHitPoints.filter(hp => hp).length).toBe(0);
    });

    it('still damages when the save succeeds but the attack roll is higher (opposed check)', async () => {
      await setup('mothership', [mothershipCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);

      // attack 50 (hit); save 30 (≤ 40, succeeds) but 50 > 30 → attack wins
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.49).mockReturnValueOnce(0.49).mockReturnValueOnce(0.49)
        .mockReturnValueOnce(0.29);
      component.rollWeaponDamage(attacker);

      expect(component.lastDamageRolls.get(attacker.id)?.finalDamage).toBe(15);
    });

    it('does not subtract armor points from damage as flat reduction', async () => {
      await setup('mothership', [mothershipCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);
      expect(component.getArmorValue(attacker)).toBe(0);
    });
  });

  describe('Kal-Arath', () => {
    const monster: Monster = {
      id: 'm-2', name: 'Marsh Troll', hitPoints: 12, strikeRank: 0, armor: 1,
      weapons: [{ name: 'Club', damage: 'd6', strikeRankModifier: 0 }],
    };

    function kalArathCharacter(): Character {
      return makeCharacter({
        gameSystem: 'kal-arath',
        stats: { STR: 2, CON: 1, SIZ: 0, DEX: 1, INT: 0, POW: 0, CHA: 0 },
        weapons: [{ name: 'Sword', damage: 'd6', skill: 'Melee' }],
      });
    }

    it('hits on 2d6 + STR ≥ 8 and subtracts flat armor', async () => {
      await setup('kal-arath', [kalArathCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);

      expect(component.getEffectiveAttackSkill(attacker)).toBe(2); // STR bonus

      // 2d6 = 3+4, +2 STR = 9 ≥ 8 hit; damage d6 = 5; armor 1 → 4
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.4)   // d1 → 3
        .mockReturnValueOnce(0.5)   // d2 → 4
        .mockReturnValueOnce(0.75); // damage d6 → 5
      component.rollWeaponDamage(attacker);

      const result = component.lastDamageRolls.get(attacker.id);
      expect(result?.total).toBe(5);
      expect(result?.finalDamage).toBe(4);
      expect(result?.attackRollDisplay).toContain('2d6+STR');
    });

    it('misses on 2d6 + STR < 8', async () => {
      await setup('kal-arath', [kalArathCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);

      // 2d6 = 2+3, +2 STR = 7 < 8 → miss
      vi.spyOn(Math, 'random').mockReturnValueOnce(0.2).mockReturnValueOnce(0.4);
      component.rollWeaponDamage(attacker);

      expect(component.lastDamageRolls.get(attacker.id)).toBeUndefined();
      expect(component.lastMissResult.get(attacker.id)).toBeDefined();
    });

    it('double 6s crit: damage dice are doubled', async () => {
      await setup('kal-arath', [kalArathCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);

      // 6+6 crit; damage d6 = 6 and d6 = 4 → 10 raw; armor 1 → 9
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.99).mockReturnValueOnce(0.99)
        .mockReturnValueOnce(0.99)  // first damage die → 6
        .mockReturnValueOnce(0.5);  // crit damage die → 4
      component.rollWeaponDamage(attacker);

      const result = component.lastDamageRolls.get(attacker.id);
      expect(result?.total).toBe(10);
      expect(result?.finalDamage).toBe(9);
      expect(result?.attackRollDisplay).toContain('CRITICAL');
    });

    it('double 1s fumble: automatic miss even with a high stat', async () => {
      const strong = kalArathCharacter();
      strong.stats.STR = 5;
      await setup('kal-arath', [strong]);
      const { attacker } = addCombatPair(characters[0], monster);

      // 1+1 = 2, +5 = 7 — but even 2d6+5 ≥ 8 totals must fumble on double 1s
      vi.spyOn(Math, 'random').mockReturnValueOnce(0.0).mockReturnValueOnce(0.0);
      component.rollWeaponDamage(attacker);

      expect(component.lastDamageRolls.get(attacker.id)).toBeUndefined();
      expect(component.lastMissResult.get(attacker.id)?.display).toContain('FUMBLE');
    });
  });

  describe('RuneQuest (regression)', () => {
    const monster: Monster = {
      id: 'm-3', name: 'Broo', hitPoints: 12, strikeRank: 2, armor: 1,
      weapons: [{ name: 'Gore', damage: '1d6', strikeRankModifier: 0 }],
    };

    function runequestCharacter(): Character {
      return makeCharacter({
        gameSystem: 'runequest',
        skills: { Broadsword: 80 } as unknown as Character['skills'],
        weapons: [{ name: 'Broadsword', damage: '1d8+1', skill: 'Broadsword' }],
        armor: {
          'Right Leg': 2, 'Left Leg': 2, 'Abdomen': 2, 'Chest': 2,
          'Right Arm': 2, 'Left Arm': 2, 'Head': 2,
        },
      });
    }

    it('resolves percentile attacks with a hit-location roll and per-location armor', async () => {
      await setup('runequest', [runequestCharacter()]);
      const { attacker } = addCombatPair(characters[0], monster);

      // 80 weapon skill − 5 characteristic attack modifier (all stats 10)
      expect(component.getEffectiveAttackSkill(attacker)).toBe(75);

      // d100 = 40 ≤ 75 hit; damage 1d8 = 5 (+1 = 6); location d20 = 20 → Head
      vi.spyOn(Math, 'random')
        .mockReturnValueOnce(0.39)   // attack roll → 40
        .mockReturnValueOnce(0.55)   // 1d8 → 5
        .mockReturnValueOnce(0.99);  // location d20 → 20
      component.rollWeaponDamage(attacker);

      // RuneQuest keeps the attack pending for parry/dodge/take-hit
      expect(component.pendingAttack).not.toBeNull();
      expect(component.pendingAttack?.rawDamage).toBe(6);
      expect(component.pendingAttack?.hitLocation).toBeDefined();
    });

    it('keeps strike-rank ordering and numeric initiative display', async () => {
      await setup('runequest', [runequestCharacter()]);
      const slow = makeParticipant({ name: 'slow', finalStrikeRank: 7 });
      const fast = makeParticipant({ name: 'fast', finalStrikeRank: 2 });
      component.combatParticipants = [slow, fast];
      expect(component.usesRolledInitiative).toBe(false);
      expect(component.getInitiativeDisplay(fast)).toBe('2');
    });

    it('applies the SIZ/DEX strike-rank formula to bestiary monsters', async () => {
      await setup('runequest', [runequestCharacter()]);
      const bm = {
        id: 'bm-1', name: 'Bison', hitPoints: 20, armor: 3,
        stats: { STR: 30, CON: 15, SIZ: 30, DEX: 10, INT: 3, POW: 8, CHA: 3 },
        attacks: [{ name: 'Horn', damage: '1d8' }],
        gameSystem: 'runequest',
      } as unknown as BestiaryMonster;
      const converted = (component as unknown as {
        convertBestiaryMonster: (m: BestiaryMonster) => Monster;
      }).convertBestiaryMonster(bm);
      expect(converted.strikeRank).toBeGreaterThan(0);
    });
  });

  describe('bestiary conversion in non-strike-rank systems', () => {
    it('gives bestiary monsters strike rank 0 outside RuneQuest', async () => {
      await setup('mothership', [makeCharacter({ gameSystem: 'mothership' })]);
      const bm = {
        id: 'bm-2', name: 'Carcinid', hitPoints: 20, armor: 40,
        stats: { STR: 50, CON: 40, SIZ: 30, DEX: 40, INT: 10, POW: 0, CHA: 0 },
        attacks: [{ name: 'Claw', damage: '1d10' }],
        gameSystem: 'mothership',
      } as unknown as BestiaryMonster;
      const converted = (component as unknown as {
        convertBestiaryMonster: (m: BestiaryMonster) => Monster;
      }).convertBestiaryMonster(bm);
      expect(converted.strikeRank).toBe(0);
    });
  });

  describe('rolled initiative flow', () => {
    it('rolls Speed-check initiative and re-sorts participants (Mothership)', async () => {
      const char = makeCharacter({
        gameSystem: 'mothership',
        stats: { STR: 40, CON: 50, SIZ: 0, DEX: 30, INT: 40, POW: 0, CHA: 0 },
        weapons: [{ name: 'Revolver', damage: '3d10', skill: 'CMB' }],
      });
      await setup('mothership', [char]);
      const monster: Monster = {
        id: 'm-4', name: 'Alien', hitPoints: 10, strikeRank: 0, armor: 0,
        weapons: [{ name: 'Bite', damage: '1d10', strikeRankModifier: 0 }],
      };
      const { attacker, defender } = addCombatPair(char, monster);

      expect(component.usesRolledInitiative).toBe(true);
      vi.spyOn(Math, 'random').mockReturnValue(0.29); // d100 → 30 ≤ 50 SPD → pass
      component.rollInitiative();

      expect(attacker.initiativeOrder).toBe(0);
      expect(defender.initiativeOrder).toBe(1);
      expect(component.getInitiativeDisplay(attacker)).toContain('pass');
      expect(component.combatParticipants[0].id).toBe(attacker.id);
    });
  });
});
