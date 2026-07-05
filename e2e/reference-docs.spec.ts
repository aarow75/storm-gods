import { test, expect } from '@playwright/test';
import { clearStorage, goto, GAME_SYSTEMS } from './helpers';
import type { GameSystem } from '../src/app/shared/models/game-system.model';

const REFERENCE_PAGES: Record<GameSystem, { name: string; file: string; heading: string }[]> = {
  runequest: [
    { name: 'Spells', file: 'RuneQuest-Spells.md', heading: 'RuneQuest Spells' },
    { name: 'Weapons & Armor', file: 'RuneQuest-Weapons.md', heading: 'RuneQuest Weapons & Armor' },
    { name: 'Equipment', file: 'RuneQuest-Equipment.md', heading: 'RuneQuest Equipment' },
  ],
  dragonbane: [
    { name: 'Spells', file: 'Dragonbane-Spells.md', heading: 'Dragonbane Spells' },
    { name: 'Weapons & Armor', file: 'Dragonbane-Weapons.md', heading: 'Dragonbane Weapons & Armor' },
    { name: 'Equipment', file: 'Dragonbane-Equipment.md', heading: 'Dragonbane Equipment' },
  ],
  'kal-arath': [
    { name: 'Spells', file: 'Kal-Arath-Spells.md', heading: 'Kal-Arath Spells' },
    { name: 'Weapons & Armor', file: 'Kal-Arath-Weapons.md', heading: 'Kal-Arath Weapons & Armor' },
    { name: 'Equipment', file: 'Kal-Arath-Equipment.md', heading: 'Kal-Arath Equipment' },
  ],
  osric: [
    { name: 'Spells', file: 'OSRIC-Spells.md', heading: 'OSRIC Spells' },
    { name: 'Weapons & Armor', file: 'OSRIC-Weapons.md', heading: 'OSRIC Weapons & Armor' },
    { name: 'Equipment', file: 'OSRIC-Equipment.md', heading: 'OSRIC Equipment' },
  ],
  mothership: [
    { name: 'Weapons & Armor', file: 'Mothership-Weapons.md', heading: 'Mothership Weapons & Armor' },
    { name: 'Equipment', file: 'Mothership-Equipment.md', heading: 'Mothership Equipment' },
  ],
  brp: [],
};

test.describe('Reference docs sidebar', () => {
  for (const system of GAME_SYSTEMS) {
    test(`${system}: Reference group lists its pages and they render`, async ({ page }) => {
      await clearStorage(page);
      await goto(page, 'docs', system);

      const referenceToggle = page.locator('.docs-nav-toggle', { hasText: 'Reference' });
      await expect(referenceToggle).toBeVisible();

      for (const doc of REFERENCE_PAGES[system]) {
        await expect(
          page.locator('.docs-nav-sublink', { hasText: doc.name }).first()
        ).toBeVisible();
      }

      // Open the first reference page and check the markdown rendered
      const first = REFERENCE_PAGES[system][0];
      await page.goto(
        `http://localhost:4202/${system}/docs/page?file=${encodeURIComponent(first.file)}`
      );
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1', { hasText: first.heading })).toBeVisible();
    });
  }

  test('mothership: no Spells entry in the Reference group', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'docs', 'mothership');
    await expect(page.locator('.docs-nav-toggle', { hasText: 'Reference' })).toBeVisible();
    await expect(
      page.locator('.docs-nav-submenu .docs-nav-sublink', { hasText: /^\s*🪄?\s*Spells\s*$/ })
    ).toHaveCount(0);
  });
});

test.describe('Reference links in combat tracker', () => {
  test('runequest: header shows Weapons and Spells reference links', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'combat', 'runequest');
    await expect(page.locator('.header-actions .doc-ref-link', { hasText: 'Weapons' })).toBeVisible();
    await expect(page.locator('.header-actions .doc-ref-link', { hasText: 'Spells' })).toBeVisible();
  });

  test('mothership: header shows Weapons but no Spells link', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'combat', 'mothership');
    await expect(page.locator('.header-actions .doc-ref-link', { hasText: 'Weapons' })).toBeVisible();
    await expect(page.locator('.header-actions .doc-ref-link', { hasText: 'Spells' })).toHaveCount(0);
  });

  test('runequest: Weapons link opens the weapons reference page', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'combat', 'runequest');
    await page.locator('.header-actions .doc-ref-link', { hasText: 'Weapons' }).click();
    await expect(page).toHaveURL(/\/runequest\/docs\/page\?file=RuneQuest-Weapons\.md/);
    await expect(page.locator('h1', { hasText: 'RuneQuest Weapons & Armor' })).toBeVisible();
  });
});

test.describe('Reference links in combat map', () => {
  test('runequest: header shows Weapons reference link', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'combat-map', 'runequest');
    await expect(page.locator('.header-actions .doc-ref-link', { hasText: 'Weapons' })).toBeVisible();
  });
});

test.describe('Reference links in character creator', () => {
  test('runequest: weapons, equipment, and magic sections show reference links', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'create', 'runequest');
    await expect(
      page.locator('app-character-weapons .doc-ref-link', { hasText: 'Weapons' })
    ).toBeVisible();
    await expect(
      page.locator('app-character-equipment .doc-ref-link', { hasText: 'Equipment' })
    ).toBeVisible();
    await expect(
      page.locator('app-character-magic .doc-ref-link', { hasText: 'Spells' })
    ).toBeVisible();
  });

  test('mothership: magic section shows no Spells reference link', async ({ page }) => {
    await clearStorage(page);
    await goto(page, 'create', 'mothership');
    await expect(page.locator('app-character-magic .doc-ref-link')).toHaveCount(0);
  });
});
