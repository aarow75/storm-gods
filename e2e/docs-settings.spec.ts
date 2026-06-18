import { test, expect } from '@playwright/test';
import { clearStorage, goto } from './helpers';

test.describe('Docs', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'docs');
  });

  test('renders docs sidebar navigation', async ({ page }) => {
    await expect(page.locator('.docs-sidebar')).toBeVisible();
    await expect(page.locator('.docs-nav')).toBeVisible();
  });

  test('has Publications nav link', async ({ page }) => {
    await expect(page.locator('.docs-nav-link', { hasText: 'Publications' })).toBeVisible();
  });

  test('has GM Screen nav link', async ({ page }) => {
    await expect(page.locator('.docs-nav-link', { hasText: 'GM Screen' })).toBeVisible();
  });

  test('navigates to /docs/rules path', async ({ page }) => {
    await page.goto('http://localhost:4202/runequest/docs/rules');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/docs/rules');
    await expect(page.locator('.docs-sidebar')).toBeVisible();
  });

  test('navigates to /docs/publications', async ({ page }) => {
    await page.goto('http://localhost:4202/runequest/docs/publications');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/docs/publications');
  });

  test('navigates to /docs/gm-screen', async ({ page }) => {
    await page.goto('http://localhost:4202/runequest/docs/gm-screen');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/docs/gm-screen');
  });

  test('docs container is present', async ({ page }) => {
    await expect(page.locator('.docs-container')).toBeVisible();
  });
});

test.describe('Settings', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'settings');
  });

  test('renders Settings heading', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Settings' })).toBeVisible();
  });

  test('shows Game System section', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Game System' })).toBeVisible();
  });

  test('shows RuneQuest and Dragonbane system toggle buttons', async ({ page }) => {
    await expect(page.locator('.system-toggle-btn.system-toggle-rq')).toBeVisible();
    await expect(page.locator('.system-toggle-btn.system-toggle-db')).toBeVisible();
  });

  test('RuneQuest system button is active by default', async ({ page }) => {
    await expect(page.locator('.system-toggle-btn.system-toggle-rq')).toHaveClass(/active/);
  });

  test('switching to Dragonbane activates its button', async ({ page }) => {
    await page.locator('.system-toggle-btn.system-toggle-db').click();
    await page.waitForURL('**/dragonbane/**');
    await expect(page.locator('.system-toggle-btn.system-toggle-db')).toHaveClass(/active/);
  });

  test('switching back to RuneQuest restores runequest URL', async ({ page }) => {
    await page.locator('.system-toggle-btn.system-toggle-db').click();
    await page.waitForURL('**/dragonbane/**');
    await page.goto('http://localhost:4202/dragonbane/settings');
    await page.waitForLoadState('networkidle');
    await page.locator('.system-toggle-btn.system-toggle-rq').click();
    await page.waitForURL('**/runequest/**');
    expect(page.url()).toContain('/runequest/');
  });

  test('shows Data section', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Data' })).toBeVisible();
  });

  test('Data section has import format details element', async ({ page }) => {
    await expect(page.locator('details.import-help')).toBeVisible();
    await page.locator('details.import-help summary').click();
    await expect(page.locator('.import-help-body')).toBeVisible();
  });
});

test.describe('Wilderness Map', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'wilderness-map');
  });

  test('renders wilderness map page', async ({ page }) => {
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible();
  });

  test('has a map container', async ({ page }) => {
    const mapEl = page.locator('.wilderness-map-page, .map-container').first();
    await expect(mapEl).toBeVisible();
  });
});
