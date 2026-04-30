import { Injectable } from '@angular/core';
import { CombatParticipant, Monster, CombatLogEntry, CombatMapState } from '../models/combat.model';
import { WEAPON_LIST } from '../models/character.model';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private readonly STORAGE_KEY = 'runequest-combat';
  private readonly MONSTERS_KEY = 'runequest-monsters';
  private readonly LOG_HISTORY_KEY = 'runequest-combat-log-history';
  private readonly MAP_KEY = 'runequest-combat-map';

  getCombatParticipants(): CombatParticipant[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  saveCombatParticipants(participants: CombatParticipant[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(participants));
  }

  clearCombat(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  clearAllCombatState(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.MAP_KEY);
    localStorage.removeItem(this.ROUND_KEY);
    localStorage.removeItem(this.ACTIVE_PARTICIPANT_KEY);
  }

  getMonsters(): Monster[] {
    const data = localStorage.getItem(this.MONSTERS_KEY);
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
    localStorage.setItem(this.MONSTERS_KEY, JSON.stringify(monsters));
  }

  deleteMonster(id: string): void {
    const monsters = this.getMonsters();
    const filtered = monsters.filter(m => m.id !== id);
    localStorage.setItem(this.MONSTERS_KEY, JSON.stringify(filtered));
  }

  calculateFinalStrikeRank(baseStrikeRank: number, weaponName?: string): number {
    if (!weaponName) return baseStrikeRank;

    const modifier = WEAPON_LIST.find(w => w.name === weaponName)?.strikeRank ?? 0;
    return baseStrikeRank + modifier;
  }

  calculateMovementSRCost(meters: number): number {
    if (!meters || meters <= 0) return 0;
    return Math.ceil(meters / 3);
  }

  calculateSurpriseDistancePenalty(isSurprised: boolean | undefined, opponentDistance: number): number {
    if (!isSurprised) return 0;
    if (opponentDistance <= 3) return 3;
    if (opponentDistance > 3) return 1;
    return 0;
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
    return [...participants].sort((a, b) => (a.effectiveSR ?? a.finalStrikeRank) - (b.effectiveSR ?? b.finalStrikeRank));
  }

  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Combat Log History
  getCombatLogHistory(): CombatLogEntry[] {
    const data = localStorage.getItem(this.LOG_HISTORY_KEY);
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

    localStorage.setItem(this.LOG_HISTORY_KEY, JSON.stringify(history));
  }

  deleteCombatLogEntry(timestamp: number): void {
    const history = this.getCombatLogHistory();
    const filtered = history.filter(entry => entry.timestamp !== timestamp);
    localStorage.setItem(this.LOG_HISTORY_KEY, JSON.stringify(filtered));
  }

  clearCombatLogHistory(): void {
    localStorage.removeItem(this.LOG_HISTORY_KEY);
  }

  // Combat Map State
  getCombatMapState(): CombatMapState {
    const data = localStorage.getItem(this.MAP_KEY);
    return data ? JSON.parse(data) : { positions: {}, movedThisRound: [] };
  }

  saveCombatMapState(state: CombatMapState): void {
    localStorage.setItem(this.MAP_KEY, JSON.stringify(state));
  }

  clearCombatMapState(): void {
    localStorage.removeItem(this.MAP_KEY);
  }

  // Combat Round Management
  private readonly ROUND_KEY = 'runequest-combat-round';

  getCurrentRound(): number {
    const round = localStorage.getItem(this.ROUND_KEY);
    return round ? parseInt(round, 10) : 0;
  }

  setCurrentRound(round: number): void {
    localStorage.setItem(this.ROUND_KEY, round.toString());
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
  private readonly ACTIVE_PARTICIPANT_KEY = 'runequest-active-participant';

  getActiveParticipantId(): string | null {
    const id = localStorage.getItem(this.ACTIVE_PARTICIPANT_KEY);
    return id || null;
  }

  setActiveParticipantId(participantId: string | null): void {
    if (participantId) {
      localStorage.setItem(this.ACTIVE_PARTICIPANT_KEY, participantId);
    } else {
      localStorage.removeItem(this.ACTIVE_PARTICIPANT_KEY);
    }
  }
}
