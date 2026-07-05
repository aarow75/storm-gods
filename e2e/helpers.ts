import { Page } from '@playwright/test';
import type { GameSystem } from '../src/app/shared/models/game-system.model';

export const BASE_URL = 'http://localhost:4202';

export const GAME_SYSTEMS: GameSystem[] = [
  'runequest', 'dragonbane', 'kal-arath', 'osric', 'mothership',
];

/** Navigate to a `/${system}/${path}` route and wait for it to settle. */
export async function goto(page: Page, path: string, system: GameSystem = 'runequest') {
  await page.goto(`${BASE_URL}/${system}/${path}`);
  await page.waitForLoadState('networkidle');
}

/** Clear localStorage so each test starts fresh. */
export async function clearStorage(page: Page) {
  await page.goto(BASE_URL);
  await page.evaluate(() => localStorage.clear());
}

/**
 * Seed one or more fully-formed characters directly into the unified
 * `characters` localStorage key that CharacterService actually reads
 * (NOT a per-system key — see implementation notes).
 * Also sets `gameSystem` so GameSystemService boots into the right system
 * even before the URL-based detection kicks in.
 */
export async function seedCharacters(page: Page, characters: unknown[], system: GameSystem = 'runequest') {
  await page.goto(BASE_URL);
  await page.evaluate(({ characters: chars, system: sys }) => {
    const existing = JSON.parse(localStorage.getItem('characters') || '[]');
    localStorage.setItem('characters', JSON.stringify([...existing, ...chars]));
    localStorage.setItem('gameSystem', sys);
  }, { characters, system });
}

/** Convenience single-character wrapper used by most specs. */
export async function seedCharacter(page: Page, character: unknown, system: GameSystem = 'runequest') {
  await seedCharacters(page, [character], system);
}

/** Clear this system's combat state (still stored per-system: `${system}-combat` etc). */
export async function clearCombatState(page: Page, system: GameSystem) {
  await page.evaluate((sys) => {
    localStorage.removeItem(`${sys}-combat`);
    localStorage.removeItem(`${sys}-combat-monsters`);
  }, system);
}

/**
 * Build a RuneQuest character matching the exact shape from the original helpers.ts.
 * Used by existing RQ-only specs that previously called seedCharacter(page, name).
 */
export function buildRuneQuestCharacter(overrides: Record<string, unknown> = {}) {
  return {
    id: 'test-char-1',
    name: 'Test Hero',
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
    armorType: 'None',
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
    ...overrides,
  };
}
