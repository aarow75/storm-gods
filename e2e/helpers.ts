import { Page } from '@playwright/test';

export const BASE_URL = 'http://localhost:4202';
export const RQ_BASE = `${BASE_URL}/runequest`;

/** Navigate to a runequest route and wait for it to stabilize. */
export async function goto(page: Page, path: string) {
  await page.goto(`${RQ_BASE}/${path}`);
  await page.waitForLoadState('networkidle');
}

/** Clear localStorage so each test starts fresh. */
export async function clearStorage(page: Page) {
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.clear());
}

/** Seed a minimal character directly into localStorage. */
export async function seedCharacter(page: Page, name = 'Test Hero') {
  await page.goto(BASE_URL);
  await page.evaluate((charName) => {
    const character = {
      id: 'test-char-1',
      name: charName,
      color: '#e74c3c',
      gameSystem: 'runequest',
      background: { cult: 'Orlanth', occupation: 'Farmer', homeland: 'Sartar', age: 25, gender: 'Male' },
      stats: { STR: 12, CON: 14, SIZ: 13, DEX: 15, INT: 12, POW: 14, CHA: 11 },
      derivedStats: {
        totalHitPoints: 14, maxHitPoints: 14, magicPoints: 14,
        damageBonus: '0', spiritCombatDamage: '1d6', healingRate: 3,
        movementRate: 8, strikeRank: 3, maxEncumbrance: 12,
        totalEncumbrance: 0, encumbranceDefensePenalty: 0,
      },
      skills: {},
      hitLocations: { 'Right Leg': 5, 'Left Leg': 5, 'Abdomen': 6, 'Chest': 7, 'Right Arm': 4, 'Left Arm': 4, 'Head': 5 },
      armor: { 'Right Leg': 0, 'Left Leg': 0, 'Abdomen': 0, 'Chest': 0, 'Right Arm': 0, 'Left Arm': 0, 'Head': 0 },
      shields: [],
      weapons: [{ name: 'Broadsword', damage: '1d8+1', skill: 75, currentHitPoints: 12 }],
      runes: { elemental: { Air: 60, Earth: 40, Fire: 20, Water: 20, Moon: 0, Darkness: 20 }, power: {}, form: {} },
      passions: [],
      magic: { spiritMagic: [], runeMagic: [], sorcery: [] },
      resources: { lunars: 0, wheels: 0, clacks: 0, reputation: 0, ransom: 0 },
      equipment: [],
      conditions: [],
      notes: '',
      cultStatus: null,
    };
    const existing = JSON.parse(localStorage.getItem('runequest-characters') || '[]');
    existing.push(character);
    localStorage.setItem('runequest-characters', JSON.stringify(existing));
    localStorage.setItem('gameSystem', 'runequest');
  }, name);
}
