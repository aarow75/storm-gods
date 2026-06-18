import { test, expect } from '@playwright/test';
import { clearStorage, goto, seedCharacter } from './helpers';

test.describe('Character List', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
  });

  test('shows empty state when no characters exist', async ({ page }) => {
    await goto(page, 'characters');
    await expect(page.locator('.no-characters')).toBeVisible();
    await expect(page.locator('.no-characters p')).toContainText('No characters yet');
  });

  test('empty state has Create New Character link', async ({ page }) => {
    await goto(page, 'characters');
    await expect(page.locator('.btn-create-large')).toBeVisible();
  });

  test('shows character cards when characters exist', async ({ page }) => {
    await seedCharacter(page, 'Kallyr Starbrow');
    await goto(page, 'characters');
    await expect(page.locator('.character-card')).toBeVisible();
    await expect(page.locator('.character-card h3')).toContainText('Kallyr Starbrow');
  });

  test('character card shows derived stats', async ({ page }) => {
    await seedCharacter(page, 'Argrath');
    await goto(page, 'characters');
    await expect(page.locator('.derived-stat .derived-label', { hasText: 'Dmg Bonus' })).toBeVisible();
    await expect(page.locator('.derived-stat .derived-label', { hasText: 'Strike Rank' })).toBeVisible();
    await expect(page.locator('.derived-stat .derived-label', { hasText: 'Magic Points' })).toBeVisible();
  });

  test('character card shows characteristics', async ({ page }) => {
    await seedCharacter(page, 'Harrek');
    await goto(page, 'characters');
    await expect(page.locator('.stat', { hasText: 'STR:' })).toBeVisible();
    await expect(page.locator('.stat', { hasText: 'CON:' })).toBeVisible();
    await expect(page.locator('.stat', { hasText: 'SIZ:' })).toBeVisible();
  });

  test('character card shows hit locations', async ({ page }) => {
    await seedCharacter(page, 'Jar-eel');
    await goto(page, 'characters');
    await expect(page.locator('.hit-item', { hasText: 'Head:' })).toBeVisible();
    await expect(page.locator('.hit-item', { hasText: 'Chest:' })).toBeVisible();
  });

  test('header shows Create New Character button', async ({ page }) => {
    await seedCharacter(page, 'Broyan');
    await goto(page, 'characters');
    await expect(page.locator('.btn-create-character')).toBeVisible();
  });

  test('clicking Edit button navigates to character form', async ({ page }) => {
    await seedCharacter(page, 'Orlanth');
    await goto(page, 'characters');
    await page.locator('.btn.btn-edit').first().click();
    await page.waitForURL('**/create?id=*');
    expect(page.url()).toContain('/create?id=');
  });

  test('clicking Delete button removes the character', async ({ page }) => {
    await seedCharacter(page, 'Yelm');
    await goto(page, 'characters');
    await expect(page.locator('.character-card')).toBeVisible();
    page.once('dialog', (d) => d.accept());
    await page.locator('.btn.btn-delete').first().click();
    await expect(page.locator('.no-characters')).toBeVisible();
  });
});

test.describe('Character Creation', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
  });

  test('navigates to create form from list', async ({ page }) => {
    await goto(page, 'characters');
    await page.locator('.btn-create-large').click();
    await page.waitForURL('**/create');
    await expect(page.locator('h3', { hasText: 'Create New Character' })).toBeVisible();
  });

  test('navigates to create form from header button', async ({ page }) => {
    await seedCharacter(page, 'Temp');
    await goto(page, 'characters');
    await page.locator('.btn-create-character').click();
    await page.waitForURL('**/create');
    await expect(page.locator('h3', { hasText: 'Create New Character' })).toBeVisible();
  });

  test('shows validation error when submitting empty form', async ({ page }) => {
    await goto(page, 'create');
    await page.locator('form').evaluate((f) => (f as HTMLFormElement).requestSubmit());
    await expect(page.locator('.validation-banner')).toBeVisible();
    await expect(page.locator('.validation-banner-title')).toContainText('Required fields missing');
  });

  test('can dismiss validation banner', async ({ page }) => {
    await goto(page, 'create');
    await page.locator('form').evaluate((f) => (f as HTMLFormElement).requestSubmit());
    await expect(page.locator('.validation-banner')).toBeVisible();
    await page.locator('.btn-dismiss').click();
    await expect(page.locator('.validation-banner')).not.toBeVisible();
  });

  test('fills in name and saves character', async ({ page }) => {
    await goto(page, 'create');
    // Use randomize to populate all required fields, then override the name
    await page.locator('.btn-randomize').click();
    await page.locator('#name').fill('Vinga Adventurous');

    await page.locator('button[type="submit"], button:has-text("Create Character")').last().click();
    await page.waitForURL('**/characters');
    await expect(page.locator('.character-card h3', { hasText: 'Vinga Adventurous' })).toBeVisible();
  });

  test('Randomize Character button fills in the form', async ({ page }) => {
    await goto(page, 'create');
    await page.locator('.btn-randomize').click();
    await expect(page.locator('#name')).not.toHaveValue('');
  });

  test('selecting a color swatch marks it as selected', async ({ page }) => {
    await goto(page, 'create');
    const swatch = page.locator('.color-swatch').nth(1);
    await swatch.click();
    await expect(swatch).toHaveClass(/selected/);
  });

  test('collapsible sections can be toggled', async ({ page }) => {
    await goto(page, 'create');
    const header = page.locator('.section-header').first();
    await header.click();
    await expect(header.locator('.collapse-toggle')).toContainText('▶');
    await header.click();
    await expect(header.locator('.collapse-toggle')).toContainText('▼');
  });

  test('edit mode shows orange edit banner', async ({ page }) => {
    await seedCharacter(page, 'Elusu');
    await goto(page, 'characters');
    await page.locator('.btn.btn-edit').first().click();
    await page.waitForURL('**/create?id=*');
    await expect(page.locator('.edit-banner')).toBeVisible();
    await expect(page.locator('.edit-banner')).toContainText('Editing: Elusu');
  });

  test('edit mode shows Update Character heading', async ({ page }) => {
    await seedCharacter(page, 'Humakti');
    await goto(page, 'characters');
    await page.locator('.btn.btn-edit').first().click();
    await page.waitForURL('**/create?id=*');
    await expect(page.locator('h3', { hasText: 'Edit Character' })).toBeVisible();
  });
});
