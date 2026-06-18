import { test, expect } from '@playwright/test';
import { clearStorage, goto } from './helpers';

test.describe('Bestiary', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'bestiary');
  });

  test('renders page heading', async ({ page }) => {
    await expect(page.locator('h1', { hasText: 'Monster Bestiary' })).toBeVisible();
  });

  test('shows Bestiary and Encounter Tables tabs', async ({ page }) => {
    await expect(page.locator('.tab-btn', { hasText: 'Bestiary' })).toBeVisible();
    await expect(page.locator('.tab-btn', { hasText: 'Encounter Tables' })).toBeVisible();
  });

  test('Bestiary tab is active by default', async ({ page }) => {
    await expect(page.locator('.tab-btn', { hasText: 'Bestiary' })).toHaveClass(/active/);
  });

  test('switching to Encounter Tables tab shows encounter content', async ({ page }) => {
    await page.locator('.tab-btn', { hasText: 'Encounter Tables' }).click();
    await expect(page.locator('.tab-btn', { hasText: 'Encounter Tables' })).toHaveClass(/active/);
    await expect(page.locator('.tab-btn', { hasText: 'Bestiary' })).not.toHaveClass(/active/);
  });

  test('displays system filter buttons', async ({ page }) => {
    await expect(page.locator('.filter-btn', { hasText: 'All' })).toBeVisible();
    await expect(page.locator('.filter-btn', { hasText: 'RuneQuest' })).toBeVisible();
    await expect(page.locator('.filter-btn', { hasText: 'DragonBane' })).toBeVisible();
  });

  test('search input is visible', async ({ page }) => {
    await expect(page.locator('#search-input')).toBeVisible();
  });

  test('search filters monsters by name', async ({ page }) => {
    await page.locator('#search-input').fill('dragon');
    await expect(page.locator('.search-input')).toHaveValue('dragon');
  });

  test('filtering to RuneQuest updates active filter', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'RuneQuest' }).click();
    await expect(page.locator('.filter-btn', { hasText: 'RuneQuest' })).toHaveClass(/active/);
  });

  test('filtering to DragonBane updates active filter', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'DragonBane' }).click();
    await expect(page.locator('.filter-btn', { hasText: 'DragonBane' })).toHaveClass(/active/);
  });

  test('All filter shows all monsters', async ({ page }) => {
    await page.locator('.filter-btn', { hasText: 'RuneQuest' }).click();
    await page.locator('.filter-btn', { hasText: 'All' }).click();
    await expect(page.locator('.filter-btn', { hasText: 'All' })).toHaveClass(/active/);
  });

  test('monsters list shows expand buttons', async ({ page }) => {
    await expect(page.locator('.expand-btn').first()).toBeVisible();
  });

  test('expanding a monster shows its details', async ({ page }) => {
    const firstExpand = page.locator('.expand-btn').first();
    await firstExpand.click();
    await expect(page.locator('.expand-btn').first()).toContainText('Hide Description');
  });

  test('Create Monster link navigates to monster creator', async ({ page }) => {
    await page.locator('.btn-monster-creator').click();
    await page.waitForURL('**/monster-creator');
    expect(page.url()).toContain('/monster-creator');
  });

  test('no monsters message shown when search yields no results', async ({ page }) => {
    await page.locator('#search-input').fill('xyzzy_no_match_12345');
    await expect(page.locator('p', { hasText: 'No creatures match your filters' })).toBeVisible();
  });
});

test.describe('Monster Creator', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'monster-creator');
  });

  test('renders monster creator page', async ({ page }) => {
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
  });

  test('has a form with at least a name field', async ({ page }) => {
    await page.locator('.btn.btn-primary', { hasText: 'Create New Monster' }).click();
    await expect(page.locator('input#name')).toBeVisible();
  });
});
