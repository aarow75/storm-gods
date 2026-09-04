import { GameSystemService } from '@shared/services/game-system.service';
import { CombatParticipant, CombatMonster } from '@shared/models/combat-participant.model';
import { Monster as BestiaryMonster, getMonsterCombatArmor } from '@bestiary/models/monster.model';
import { MONSTERS as BESTIARY_MONSTERS } from '@bestiary/constants/monsters.constants';
import { getSizeModifier, getDexterityModifier } from '@shared/rules/game-rules';
import { EncounterRollResult } from './encounter-roll.util';

export function convertBestiaryMonster(bm: BestiaryMonster, gameSystemService: GameSystemService): CombatMonster {
  return {
    id: `bestiary-${bm.id}`,
    name: bm.name,
    hitPoints: bm.hitPoints,
    // The SIZ/DEX strike-rank formula is RuneQuest-only; other systems roll initiative
    strikeRank: gameSystemService.getRules().usesStrikeRank()
      ? getSizeModifier(bm.stats.SIZ) + getDexterityModifier(bm.stats.DEX)
      : 0,
    armor: getMonsterCombatArmor(bm, gameSystemService.gameSystem()),
    weapons: bm.attacks.map((a) => ({
      name: a.name,
      damage: a.damage,
      strikeRankModifier: 0,
    })),
  };
}

export function parseCountString(countStr: string): number {
  if (countStr === '-') return 0;
  const diceMatch = countStr.match(/(\d+)d(\d+)/);
  if (diceMatch) {
    const count = parseInt(diceMatch[1], 10);
    const sides = parseInt(diceMatch[2], 10);
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total;
  }
  const numMatch = countStr.match(/\d+/);
  return numMatch ? parseInt(numMatch[0], 10) : 1;
}

export type BuildEncounterParticipantsResult =
  | { success: true; participants: CombatParticipant[] }
  | { success: false; reason: 'no-creatures' | 'not-found' };

/**
 * Builds CombatParticipant[] for an encounter roll result by looking up the creature
 * in the bestiary and rolling its count. Shared by the standalone wilderness map's
 * manual-encounter flow and the scenario hex-crawl's automatic encounter flow.
 */
export function buildEncounterParticipants(
  encounterResult: Pick<EncounterRollResult, 'creature' | 'count'>,
  gameSystemService: GameSystemService,
  generateId: () => string
): BuildEncounterParticipantsResult {
  const count = parseCountString(encounterResult.count);
  if (count === 0) {
    return { success: false, reason: 'no-creatures' };
  }

  const bestiaryMonster = BESTIARY_MONSTERS.find(
    (m) => m.name.toLowerCase() === encounterResult.creature.toLowerCase()
  );
  if (!bestiaryMonster) {
    return { success: false, reason: 'not-found' };
  }

  const combatMonster = convertBestiaryMonster(bestiaryMonster, gameSystemService);
  const participants: CombatParticipant[] = [];

  for (let i = 0; i < count; i++) {
    const id = generateId();
    const baseStrikeRank = combatMonster.strikeRank;
    const firstWeapon = combatMonster.weapons[0]?.name || 'Bite';
    const weapon = combatMonster.weapons.find((w) => w.name === firstWeapon);
    const finalStrikeRank = baseStrikeRank + (weapon?.strikeRankModifier || 0);

    participants.push({
      id,
      name: count > 1 ? `${combatMonster.name} ${i + 1}` : combatMonster.name,
      type: 'monster',
      monsterId: combatMonster.id,
      maxHitPoints: combatMonster.hitPoints,
      currentHitPoints: new Array(combatMonster.hitPoints).fill(false),
      baseStrikeRank,
      selectedWeapon: firstWeapon,
      selectedParryItem: firstWeapon,
      finalStrikeRank,
      isDead: false,
      kills: 0,
      color: '#666666',
      locationDamage: {},
      distanceToOpponent: 0,
      movementThisRound: 0,
      isSurprised: false,
      movementRate: 8,
    });
  }

  return { success: true, participants };
}
