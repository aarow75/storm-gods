import { Injectable } from '@angular/core';
import { CombatParticipant, Monster, CombatLogEntry, CombatMapState, CombatMapTemplate } from '@combat/models/combat.model';
import { GameSystemService } from '@shared/services/game-system.service';
import { DiceService } from '@shared/services/dice.service';
import { InitiativeMechanic } from '@shared/rules/game-system-rules.interface';
import { CharacterStats } from '@shared/models/character-stats.model';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private readonly STORAGE_KEY = 'combat';
  private readonly MONSTERS_KEY = 'combat-monsters';
  private readonly LOG_HISTORY_KEY = 'combat-log-history';
  private readonly MAP_KEY = 'combat-map';
  private readonly MAP_TEMPLATES_KEY = 'combat-map-templates';

  constructor(private gameSystemService: GameSystemService, private diceService: DiceService) {}

  private key(base: string): string {
    return `${this.gameSystemService.gameSystem()}-${base}`;
  }

  getCombatParticipants(): CombatParticipant[] {
    const data = localStorage.getItem(this.key(this.STORAGE_KEY));
    return data ? JSON.parse(data) : [];
  }

  saveCombatParticipants(participants: CombatParticipant[]): void {
    localStorage.setItem(this.key(this.STORAGE_KEY), JSON.stringify(participants));
  }

  clearCombat(): void {
    localStorage.removeItem(this.key(this.STORAGE_KEY));
  }

  clearAllCombatState(): void {
    localStorage.removeItem(this.key(this.STORAGE_KEY));
    localStorage.removeItem(this.key(this.MAP_KEY));
    localStorage.removeItem(this.key(this.ROUND_KEY));
    localStorage.removeItem(this.key(this.ACTIVE_PARTICIPANT_KEY));
  }

  getMonsters(): Monster[] {
    const data = localStorage.getItem(this.key(this.MONSTERS_KEY));
    return data ? JSON.parse(data) : [];
  }

  saveMonster(monster: Monster): void {
    const monsters = this.getMonsters();
    const index = monsters.findIndex(m => m.id === monster.id);
    if (index !== -1) {
      monsters[index] = monster;
    } else {
      monsters.push(monster);
    }
    localStorage.setItem(this.key(this.MONSTERS_KEY), JSON.stringify(monsters));
  }

  deleteMonster(id: string): void {
    const monsters = this.getMonsters();
    const filtered = monsters.filter(m => m.id !== id);
    localStorage.setItem(this.key(this.MONSTERS_KEY), JSON.stringify(filtered));
  }

  calculateFinalInitiative(baseInitiative: number, weaponName?: string): number {
    if (!weaponName) return baseInitiative;

    const modifier = this.gameSystemService.getRules().getWeaponList().find(w => w.name === weaponName)?.strikeRank ?? 0;
    return baseInitiative + modifier;
  }

  calculateMovementSRCost(meters: number): number {
    return this.gameSystemService.getRules().getMovementInitiativeCost(meters);
  }

  calculateSurpriseDistancePenalty(isSurprised: boolean | undefined, opponentDistance: number): number {
    if (!isSurprised) return 0;
    return this.gameSystemService.getRules().getSurpriseInitiativePenalty(opponentDistance);
  }

  getOpponentDistance(participant: CombatParticipant, allParticipants: CombatParticipant[], mapState: CombatMapState): number {
    if (!participant.selectedOpponentId) return 0;

    const opponent = allParticipants.find(p => p.id === participant.selectedOpponentId);
    if (!opponent) return 0;

    const participantPos = mapState.positions[participant.id];
    const opponentPos = mapState.positions[opponent.id];

    if (!participantPos || !opponentPos) return 0;

    return Math.max(Math.abs(participantPos.x - opponentPos.x), Math.abs(participantPos.y - opponentPos.y));
  }

  calculateEffectiveSR(participant: CombatParticipant, allParticipants?: CombatParticipant[], mapState?: CombatMapState): number {
    const moveCost = this.calculateMovementSRCost(participant.movementThisRound ?? 0);
    let distancePenalty = 0;

    if (participant.isSurprised && allParticipants && mapState) {
      const opponentDistance = this.getOpponentDistance(participant, allParticipants, mapState);
      distancePenalty = this.calculateSurpriseDistancePenalty(participant.isSurprised, opponentDistance);
    }

    return participant.finalStrikeRank + moveCost + distancePenalty;
  }

  sortParticipantsByStrikeRank(participants: CombatParticipant[]): CombatParticipant[] {
    // Rolled initiative wins when present; strike-rank systems never set it.
    return [...participants].sort((a, b) =>
      (a.initiativeOrder ?? a.effectiveSR ?? a.finalStrikeRank) -
      (b.initiativeOrder ?? b.effectiveSR ?? b.finalStrikeRank));
  }

  /**
   * Roll initiative for one round using the system's mechanic, mutating
   * initiativeRoll/initiativeOrder/initiativeDisplay on each participant.
   * initiativeOrder is a normalized ascending key: lower acts first.
   * Returns combat-log lines describing the rolls.
   */
  rollInitiativeForRound(
    participants: CombatParticipant[],
    mechanic: InitiativeMechanic,
    statsFor: (p: CombatParticipant) => CharacterStats | null
  ): string[] {
    if (mechanic.kind === 'strike-rank' || participants.length === 0) return [];
    const lines: string[] = [];

    if (mechanic.kind === 'side-d6') {
      const partyRoll = this.diceService.rollD6();
      const enemyRoll = this.diceService.rollD6();
      for (const p of participants) {
        const roll = p.type === 'character' ? partyRoll : enemyRoll;
        p.initiativeRoll = roll;
        p.initiativeOrder = roll;
        p.initiativeDisplay = `d6: ${roll}`;
      }
      const outcome = partyRoll < enemyRoll ? 'party acts first'
                    : enemyRoll < partyRoll ? 'enemies act first'
                    : 'simultaneous!';
      lines.push(`[INITIATIVE] Party d6: ${partyRoll} vs Enemies d6: ${enemyRoll} — ${outcome}`);
      return lines;
    }

    if (mechanic.kind === 'd6-plus-stat') {
      for (const p of participants) {
        if (p.type !== 'character') {
          p.initiativeRoll = undefined;
          p.initiativeOrder = 1;
          p.initiativeDisplay = '—';
          continue;
        }
        const die = this.diceService.rollD6();
        const bonus = statsFor(p)?.[mechanic.stat] ?? 0;
        const total = die + bonus;
        const losesOnNatural1 = die === 1;
        const actsFirst = !losesOnNatural1 && total >= mechanic.target;
        p.initiativeRoll = total;
        p.initiativeOrder = actsFirst ? 0 : 2;
        const bonusStr = bonus ? (bonus > 0 ? `+${bonus}` : `${bonus}`) : '';
        const outcome = losesOnNatural1 ? 'natural 1 — loses initiative'
                      : `${die}${bonusStr} = ${total} — ${actsFirst ? 'before enemies' : 'after enemies'}`;
        p.initiativeDisplay = `d6+${mechanic.statLabel}: ${outcome}`;
        lines.push(`[INITIATIVE] ${p.name} d6+${mechanic.statLabel}: ${outcome}`);
      }
      return lines;
    }

    if (mechanic.kind === 'unique-cards') {
      const deck = Array.from(
        { length: Math.max(mechanic.deckSize, participants.length) },
        (_, i) => i + 1
      );
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      participants.forEach((p, i) => {
        p.initiativeRoll = deck[i];
        p.initiativeOrder = deck[i];
        p.initiativeDisplay = `Card ${deck[i]}`;
        lines.push(`[INITIATIVE] ${p.name} draws card ${deck[i]}`);
      });
      return lines;
    }

    // stat-check (Mothership Speed check)
    for (const p of participants) {
      if (p.type !== 'character') {
        p.initiativeRoll = undefined;
        p.initiativeOrder = 1;
        p.initiativeDisplay = '—';
        continue;
      }
      const roll = this.diceService.rollPercentile();
      const target = statsFor(p)?.[mechanic.stat] ?? 0;
      const passed = roll <= target;
      p.initiativeRoll = roll;
      p.initiativeOrder = passed ? 0 : 2;
      p.initiativeDisplay = `${mechanic.statLabel}: ${roll} vs ${target} — ${passed ? 'pass' : 'fail'}`;
      lines.push(`[INITIATIVE] ${p.name} ${mechanic.statLabel} check: ${roll} vs ${target} — ${passed ? 'acts before enemies' : 'acts after enemies'}`);
    }
    return lines;
  }

  /** Remove rolled initiative so stale values never leak into sorting. */
  clearInitiative(participants: CombatParticipant[]): void {
    for (const p of participants) {
      delete p.initiativeRoll;
      delete p.initiativeOrder;
      delete p.initiativeDisplay;
    }
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Combat Log History
  getCombatLogHistory(): CombatLogEntry[] {
    const data = localStorage.getItem(this.key(this.LOG_HISTORY_KEY));
    return data ? JSON.parse(data) : [];
  }

  saveCombatLog(entries: string[]): void {
    if (entries.length === 0) return;

    const history = this.getCombatLogHistory();
    const now = new Date();

    const logEntry: CombatLogEntry = {
      timestamp: now.getTime(),
      date: now.toLocaleString(),
      entries: [...entries]
    };

    history.unshift(logEntry);

    // Keep only last 50 combat logs
    if (history.length > 50) {
      history.splice(50);
    }

    localStorage.setItem(this.key(this.LOG_HISTORY_KEY), JSON.stringify(history));
  }

  deleteCombatLogEntry(timestamp: number): void {
    const history = this.getCombatLogHistory();
    const filtered = history.filter(entry => entry.timestamp !== timestamp);
    localStorage.setItem(this.key(this.LOG_HISTORY_KEY), JSON.stringify(filtered));
  }

  clearCombatLogHistory(): void {
    localStorage.removeItem(this.key(this.LOG_HISTORY_KEY));
  }

  // Combat Map State
  getCombatMapState(): CombatMapState {
    const data = localStorage.getItem(this.key(this.MAP_KEY));
    return data ? JSON.parse(data) : { positions: {}, movedThisRound: [] };
  }

  saveCombatMapState(state: CombatMapState): void {
    localStorage.setItem(this.key(this.MAP_KEY), JSON.stringify(state));
  }

  clearCombatMapState(): void {
    localStorage.removeItem(this.key(this.MAP_KEY));
  }

  getMapTemplates(): CombatMapTemplate[] {
    const data = localStorage.getItem(this.MAP_TEMPLATES_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveMapTemplate(template: CombatMapTemplate): void {
    const templates = this.getMapTemplates();
    const idx = templates.findIndex(t => t.id === template.id);
    if (idx !== -1) templates[idx] = template;
    else templates.push(template);
    localStorage.setItem(this.MAP_TEMPLATES_KEY, JSON.stringify(templates));
  }

  deleteMapTemplate(id: string): void {
    const templates = this.getMapTemplates().filter(t => t.id !== id);
    localStorage.setItem(this.MAP_TEMPLATES_KEY, JSON.stringify(templates));
  }

  // Combat Round Management
  private readonly ROUND_KEY = 'combat-round';

  getCurrentRound(): number {
    const round = localStorage.getItem(this.key(this.ROUND_KEY));
    return round ? parseInt(round, 10) : 0;
  }

  setCurrentRound(round: number): void {
    localStorage.setItem(this.key(this.ROUND_KEY), round.toString());
  }

  incrementRound(): number {
    const newRound = this.getCurrentRound() + 1;
    this.setCurrentRound(newRound);
    return newRound;
  }

  resetRound(): void {
    this.setCurrentRound(0);
  }

  // Active Participant Management
  private readonly ACTIVE_PARTICIPANT_KEY = 'active-participant';

  getActiveParticipantId(): string | null {
    const id = localStorage.getItem(this.key(this.ACTIVE_PARTICIPANT_KEY));
    return id || null;
  }

  setActiveParticipantId(participantId: string | null): void {
    if (participantId) {
      localStorage.setItem(this.key(this.ACTIVE_PARTICIPANT_KEY), participantId);
    } else {
      localStorage.removeItem(this.key(this.ACTIVE_PARTICIPANT_KEY));
    }
  }
}
