import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CombatLogService {
  private readonly STORAGE_KEY = 'combat-log';
  private log = signal<string[]>([]);

  constructor() {
    this.loadLog();
  }

  private loadLog(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.log.set(JSON.parse(stored));
      } catch {
        this.log.set([]);
      }
    }
  }

  private saveLog(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.log()));
  }

  getLog() {
    return this.log.asReadonly();
  }

  addEntry(entry: string): void {
    const current = this.log();
    this.log.set([entry, ...current]);
    this.saveLog();
  }

  addEntries(entries: string[]): void {
    const current = this.log();
    this.log.set([...entries, ...current]);
    this.saveLog();
  }

  clearLog(): void {
    this.log.set([]);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  hasEntries(): boolean {
    return this.log().length > 0;
  }

  getEntries(): string[] {
    return [...this.log()];
  }
}
