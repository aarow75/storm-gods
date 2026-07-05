import { test, expect } from '@playwright/test';
import { clearStorage, goto, seedCharacter, buildRuneQuestCharacter } from './helpers';

test.describe('Combat Tracker', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => {
      localStorage.setItem('gameSystem', 'runequest');
      localStorage.removeItem('runequest-combat');
    });
    await goto(page, 'combat');
  });

  test('renders combat tracker heading', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Combat Tracker' })).toBeVisible();
  });

  test('shows header action buttons', async ({ page }) => {
    await expect(page.locator('.btn.btn-primary', { hasText: 'Add Participant' })).toBeVisible();
    await expect(page.locator('.btn', { hasText: 'Combat Map' })).toBeVisible();
    await expect(page.locator('.btn', { hasText: 'New Round' })).toBeVisible();
    await expect(page.locator('.btn.btn-danger', { hasText: 'Clear Combat' })).toBeVisible();
  });

  test('Add Participant button opens modal', async ({ page }) => {
    await page.locator('.btn.btn-primary', { hasText: 'Add Participant' }).click();
    await expect(page.locator('.modal, [role="dialog"], .participant-modal, .add-modal')).toBeVisible();
  });

  test('Combat Map link navigates to combat map', async ({ page }) => {
    await page.locator('.btn', { hasText: 'Combat Map' }).click();
    await page.waitForURL('**/combat-map');
    expect(page.url()).toContain('/combat-map');
  });

  test('no turn control bar when no participants', async ({ page }) => {
    await expect(page.locator('.turn-control-bar')).not.toBeVisible();
  });

  test('Show History / Hide History button toggles log history', async ({ page }) => {
    const historyBtn = page.locator('.btn', { hasText: /Show History|Hide History/ });
    await expect(historyBtn).toBeVisible();
    await historyBtn.click();
    await expect(historyBtn).toContainText(/Hide History/);
    await historyBtn.click();
    await expect(historyBtn).toContainText(/Show History/);
  });

  test('Clear Combat button resets combat state', async ({ page }) => {
    page.once('dialog', (d) => d.accept());
    await page.locator('.btn.btn-danger', { hasText: 'Clear Combat' }).click();
    await expect(page.locator('.turn-control-bar')).not.toBeVisible();
  });

  test('Monster Creator link navigates to monster creator', async ({ page }) => {
    await page.locator('.btn', { hasText: 'Monster Creator' }).click();
    await page.waitForURL('**/monster-creator');
    expect(page.url()).toContain('/monster-creator');
  });
});

test.describe('Combat Map', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'combat-map');
  });

  test('renders combat map page', async ({ page }) => {
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible();
  });

  test('has a grid or map container element', async ({ page }) => {
    const mapEl = page.locator('.combat-map-page, .grid-container, .grid-area').first();
    await expect(mapEl).toBeVisible();
  });
});
