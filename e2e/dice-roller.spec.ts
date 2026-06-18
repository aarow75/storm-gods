import { test, expect } from '@playwright/test';
import { clearStorage, goto } from './helpers';

test.describe('Dice Roller Modal', () => {
  test.setTimeout(60_000);
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => localStorage.setItem('gameSystem', 'runequest'));
    await goto(page, 'characters');
    await page.locator('button.btn-dice-roller').click();
    await expect(page.locator('.dice-modal')).toBeVisible();
  });

  test('shows all standard dice buttons', async ({ page }) => {
    const modal = page.locator('.dice-modal');
    await expect(modal.locator('.btn-roll.dice-d4')).toBeVisible();
    await expect(modal.locator('.btn-roll.dice-d6')).toBeVisible();
    await expect(modal.locator('.btn-roll.dice-d8')).toBeVisible();
    await expect(modal.locator('.btn-roll.dice-d10')).toBeVisible();
    await expect(modal.locator('.btn-roll.dice-d12')).toBeVisible();
    await expect(modal.locator('.btn-roll.dice-d20')).toBeVisible();
    await expect(modal.locator('.btn-roll.dice-d100')).toBeVisible();
  });

  test('shows 3d6 / 2d6+6 button', async ({ page }) => {
    await expect(page.locator('.btn-roll.dice-3d6')).toBeVisible();
  });

  test('rolling d6 produces a result', async ({ page }) => {
    await page.locator('.dice-modal .btn-roll.dice-d6').click();
    await expect(page.locator('.dice-modal .roll-result, .dice-modal .result, .dice-modal .roll-history, .dice-modal .log-entry').first()).toBeVisible();
  });

  test('rolling d20 produces a result', async ({ page }) => {
    await page.locator('.dice-modal .btn-roll.dice-d20').click();
    const resultArea = page.locator('.dice-modal').locator('.roll-result, .result-value, .result, .history-item, .log-entry').first();
    await expect(resultArea).toBeVisible();
  });

  test('rolling d100 produces a result', async ({ page }) => {
    await page.locator('.dice-modal .btn-roll.dice-d100').click();
    const resultArea = page.locator('.dice-modal').locator('.roll-result, .result-value, .result, .history-item, .log-entry').first();
    await expect(resultArea).toBeVisible();
  });

  test('custom roll inputs are visible', async ({ page }) => {
    await expect(page.locator('#numDice')).toBeVisible();
    await expect(page.locator('#diceType')).toBeVisible();
    await expect(page.locator('#modifier')).toBeVisible();
    await expect(page.locator('.btn-roll.btn-custom')).toBeVisible();
  });

  test('custom roll can be configured and rolled', async ({ page }) => {
    await page.locator('#numDice').fill('2');
    await page.locator('#diceType').selectOption('6');
    await page.locator('#modifier').fill('3');
    await page.locator('.btn-roll.btn-custom').click();
    const resultArea = page.locator('.dice-modal').locator('.roll-result, .result-value, .result, .history-item, .log-entry').first();
    await expect(resultArea).toBeVisible();
  });

  test('boon/bane buttons are visible', async ({ page }) => {
    await expect(page.locator('.btn-boon-bane.boon').first()).toBeVisible();
    await expect(page.locator('.btn-boon-bane.bane').first()).toBeVisible();
  });

  test('clear history button appears after rolling', async ({ page }) => {
    await page.locator('.dice-modal .btn-roll.dice-d6').click();
    await expect(page.locator('.btn-clear')).toBeVisible();
  });

  test('clear history removes all results', async ({ page }) => {
    await page.locator('.dice-modal .btn-roll.dice-d6').click();
    await expect(page.locator('.dice-modal .history-item')).toHaveCount(1);
    await page.locator('.btn-clear').click();
    await expect(page.locator('.dice-modal .history-item')).toHaveCount(0);
  });
});
