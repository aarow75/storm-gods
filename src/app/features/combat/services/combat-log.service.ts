import { Injectable, signal } from '@angular/core';
import { DataPort } from '@shared/services/data-port.service';

@Injectable({
  providedIn: 'root'
})
export class CombatLogService implements DataPort {
  private readonly STORAGE_KEY = 'combat-log';
  private readonly SAVE_DELAY_MS = 500;

  readonly dataPortLabel = 'Combat Log';
  readonly dataPortKey = 'combat-log';

  private log = signal<string[]>([]);
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.loadLog();
  }

  exportData(): unknown {
    return {
      exportedAt: new Date().toISOString(),
      entries: this.getEntries(),
    };
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

  private debouncedSaveLog(): void {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.log()));
      this.saveTimeout = null;
    }, this.SAVE_DELAY_MS);
  }

  getLog() {
    return this.log.asReadonly();
  }

  addEntry(entry: string): void {
    if (!entry?.trim()) return;
    const current = this.log();
    this.log.set([entry, ...current]);
    this.debouncedSaveLog();
  }

  addEntries(entries: string[]): void {
    const filtered = entries.filter(e => e?.trim());
    if (filtered.length === 0) return;
    const current = this.log();
    this.log.set([...filtered, ...current]);
    this.debouncedSaveLog();
  }

  clearLog(): void {
    this.log.set([]);
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  flushLog(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.log()));
      this.saveTimeout = null;
    }
  }

  hasEntries(): boolean {
    return this.log().length > 0;
  }

  getEntries(): string[] {
    return [...this.log()];
  }
}
