import { Injectable, effect, signal } from '@angular/core';
import { DataPort } from '@shared/services/data-port.service';
import { GameSystemService } from '@shared/services/game-system.service';

@Injectable({
  providedIn: 'root'
})
export class CombatLogService implements DataPort {
  private readonly SAVE_DELAY_MS = 500;

  readonly dataPortLabel = 'Combat Log';
  readonly dataPortKey = 'combat-log';

  private log = signal<string[]>([]);
  private saveTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(private gameSystemService: GameSystemService) {
    effect(() => {
      this.gameSystemService.gameSystem(); // track system changes
      this.loadLog();
    });
  }

  private key(): string {
    return `${this.gameSystemService.gameSystem()}-combat-log`;
  }

  exportData(): unknown {
    return {
      exportedAt: new Date().toISOString(),
      entries: this.getEntries(),
    };
  }

  private loadLog(): void {
    const stored = localStorage.getItem(this.key());
    if (stored) {
      try {
        this.log.set(JSON.parse(stored));
      } catch {
        this.log.set([]);
      }
    } else {
      this.log.set([]);
    }
  }

  private debouncedSaveLog(): void {
    if (this.saveTimeout) clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      localStorage.setItem(this.key(), JSON.stringify(this.log()));
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
    localStorage.removeItem(this.key());
  }

  flushLog(): void {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
      localStorage.setItem(this.key(), JSON.stringify(this.log()));
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
