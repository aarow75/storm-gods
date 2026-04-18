import { Injectable } from '@angular/core';
import { CombatParticipant, Monster, WEAPON_STRIKE_RANKS, CombatLogEntry } from '../models/combat.model';

@Injectable({
  providedIn: 'root'
})
export class CombatService {
  private readonly STORAGE_KEY = 'runequest-combat';
  private readonly MONSTERS_KEY = 'runequest-monsters';
  private readonly LOG_HISTORY_KEY = 'runequest-combat-log-history';

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

    const modifier = WEAPON_STRIKE_RANKS[weaponName] || 0;
    return baseStrikeRank + modifier;
  }

  sortParticipantsByStrikeRank(participants: CombatParticipant[]): CombatParticipant[] {
    return [...participants].sort((a, b) => a.finalStrikeRank - b.finalStrikeRank);
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
}
