import { Injectable } from '@angular/core';
import { Monster } from '@bestiary/models/monster.model';

@Injectable({
  providedIn: 'root'
})
export class CustomMonsterService {
  private readonly STORAGE_KEY = 'custom-monsters';

  getMonsters(): Monster[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  }

  getMonster(id: string): Monster | undefined {
    return this.getMonsters().find(m => m.id === id);
  }

  saveMonster(monster: Monster): void {
    const monsters = this.getMonsters();
    const existingIndex = monsters.findIndex(m => m.id === monster.id);

    if (existingIndex >= 0) {
      monsters[existingIndex] = monster;
    } else {
      monsters.push(monster);
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(monsters));
  }

  importMonsters(incoming: Monster[]): { imported: number; skipped: number } {
    const existing = this.getMonsters();
    const existingIds = new Set(existing.map(m => m.id));
    const toAdd = incoming.filter(m => !existingIds.has(m.id));
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify([...existing, ...toAdd]));
    return { imported: toAdd.length, skipped: incoming.length - toAdd.length };
  }

  deleteMonster(id: string): void {
    const monsters = this.getMonsters().filter(m => m.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(monsters));
  }

  generateId(): string {
    return 'custom-' + Date.now();
  }
}
