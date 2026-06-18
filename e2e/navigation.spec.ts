import { test, expect } from '@playwright/test';
import { clearStorage, goto } from './helpers';

test.describe('Navigation & App Shell', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
  });

  test('redirects / to /runequest/characters', async ({ page }) => {
    await page.goto('http://localhost:4202/');
    await page.waitForURL('**/runequest/characters');
    expect(page.url()).toContain('/runequest/characters');
  });

  test('displays main navigation links', async ({ page }) => {
    await goto(page, 'characters');
    await expect(page.locator('nav.main-nav')).toBeVisible();
    await expect(page.locator('nav.main-nav a', { hasText: 'Characters' })).toBeVisible();
    await expect(page.locator('nav.main-nav a', { hasText: 'Bestiary' })).toBeVisible();
    await expect(page.locator('nav.main-nav a', { hasText: 'Combat' })).toBeVisible();
    await expect(page.locator('nav.main-nav a', { hasText: 'Maps' })).toBeVisible();
    await expect(page.locator('nav.main-nav a', { hasText: 'Campaigns' })).toBeVisible();
    await expect(page.locator('nav.main-nav a', { hasText: 'Docs' })).toBeVisible();
  });

  test('navigates to each main section via nav links', async ({ page }) => {
    await goto(page, 'characters');

    await page.locator('nav.main-nav a', { hasText: 'Bestiary' }).click();
    await page.waitForURL('**/bestiary');
    expect(page.url()).toContain('/bestiary');

    await page.locator('nav.main-nav a', { hasText: 'Combat' }).click();
    await page.waitForURL('**/combat');
    expect(page.url()).toContain('/combat');

    await page.locator('nav.main-nav a', { hasText: 'Campaigns' }).click();
    await page.waitForURL('**/campaigns');
    expect(page.url()).toContain('/campaigns');

    await page.locator('nav.main-nav a', { hasText: 'Docs' }).click();
    await page.waitForURL('**/docs');
    expect(page.url()).toContain('/docs');

    await page.locator('nav.main-nav a', { hasText: 'Characters' }).click();
    await page.waitForURL('**/characters');
    expect(page.url()).toContain('/characters');
  });

  test('active nav link is highlighted', async ({ page }) => {
    await goto(page, 'bestiary');
    const bestiaryLink = page.locator('nav.main-nav a', { hasText: 'Bestiary' });
    await expect(bestiaryLink).toHaveClass(/active/);
  });

  test('settings icon navigates to settings', async ({ page }) => {
    await goto(page, 'characters');
    await page.locator('a.settings-link').click();
    await page.waitForURL('**/settings');
    expect(page.url()).toContain('/settings');
  });

  test('dice roller button opens and closes modal', async ({ page }) => {
    await goto(page, 'characters');
    const diceBtn = page.locator('button.btn-dice-roller');
    await diceBtn.click();
    await expect(page.locator('.dice-modal')).toBeVisible();
    await page.locator('button.dice-modal-close').click();
    await expect(page.locator('.dice-modal')).not.toBeVisible();
  });

  test('clicking backdrop closes dice modal', async ({ page }) => {
    await goto(page, 'characters');
    await page.locator('button.btn-dice-roller').click();
    await expect(page.locator('.dice-modal')).toBeVisible();
    // Click top-left corner of the viewport, which is covered by the backdrop but not the modal
    await page.mouse.click(5, 5);
    await expect(page.locator('.dice-modal')).not.toBeVisible();
  });

  test('dragonbane URL renders dragonbane theme', async ({ page }) => {
    await page.goto('http://localhost:4202/dragonbane/characters');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('.app-container')).toHaveClass(/dragonbane-theme/);
  });

  test('runequest URL renders runequest theme', async ({ page }) => {
    await goto(page, 'characters');
    await expect(page.locator('.app-container')).toHaveClass(/runequest-theme/);
  });
});
