import { test, expect } from '@playwright/test';
import { clearStorage, goto } from './helpers';

test.describe('Campaigns', () => {
  test.beforeEach(async ({ page }) => {
    await clearStorage(page);
    await page.evaluate(() => {
      localStorage.setItem('gameSystem', 'runequest');
      localStorage.removeItem('rq-campaigns-index');
    });
    await goto(page, 'campaigns');
  });

  test('renders Campaigns heading', async ({ page }) => {
    await expect(page.locator('h2', { hasText: 'Campaigns' })).toBeVisible();
  });

  test('shows empty state when no campaigns exist', async ({ page }) => {
    await expect(page.locator('.no-campaigns')).toBeVisible();
    await expect(page.locator('.no-campaigns p')).toContainText('No campaigns yet');
  });

  test('New Campaign button in header is visible', async ({ page }) => {
    await expect(page.locator('.btn-create-campaign')).toBeVisible();
  });

  test('opening create modal shows campaign form', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await expect(page.locator('.modal')).toBeVisible();
    await expect(page.locator('.modal h3', { hasText: 'Create New Campaign' })).toBeVisible();
  });

  test('modal has name, setting, date and description fields', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await expect(page.locator('input[placeholder*="campaign name" i]')).toBeVisible();
    await expect(page.locator('input[placeholder*="Glorantha" i]')).toBeVisible();
    await expect(page.locator('input[type="date"]')).toBeVisible();
    await expect(page.locator('textarea[placeholder*="description" i]')).toBeVisible();
  });

  test('closing modal via Cancel hides the modal', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.locator('.modal .btn', { hasText: 'Cancel' }).click();
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('closing modal via × button hides the modal', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await page.locator('.btn-close').click();
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('clicking backdrop closes modal', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await expect(page.locator('.modal')).toBeVisible();
    await page.locator('.modal').click({ position: { x: 5, y: 5 } });
    await expect(page.locator('.modal')).not.toBeVisible();
  });

  test('creating a campaign shows it in the list', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await page.locator('input[placeholder*="campaign name" i]').fill('The Dragon Pass Campaign');
    await page.locator('.modal .btn', { hasText: 'Create Campaign' }).click();
    await expect(page.locator('.campaign-card h3', { hasText: 'The Dragon Pass Campaign' })).toBeVisible();
  });

  test('campaign card has View Details and Delete buttons', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await page.locator('input[placeholder*="campaign name" i]').fill('Test Campaign');
    await page.locator('.modal .btn', { hasText: 'Create Campaign' }).click();
    await expect(page.locator('.campaign-actions .btn', { hasText: 'View Details' })).toBeVisible();
    await expect(page.locator('.campaign-actions .btn', { hasText: 'Delete' })).toBeVisible();
  });

  test('clicking View Details navigates to campaign detail', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await page.locator('input[placeholder*="campaign name" i]').fill('Sartar Rising');
    await page.locator('.modal .btn', { hasText: 'Create Campaign' }).click();
    await page.locator('.campaign-actions .btn', { hasText: 'View Details' }).first().click();
    await page.waitForURL('**/campaigns/**');
    expect(page.url()).toMatch(/\/campaigns\/[a-zA-Z0-9-]+$/);
  });

  test('deleting a campaign removes it from the list', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await page.locator('input[placeholder*="campaign name" i]').fill('Doomed Campaign');
    await page.locator('.modal .btn', { hasText: 'Create Campaign' }).click();
    await expect(page.locator('.campaign-card h3', { hasText: 'Doomed Campaign' })).toBeVisible();
    page.once('dialog', (d) => d.accept());
    await page.locator('.campaign-actions .btn', { hasText: 'Delete' }).first().click();
    await expect(page.locator('.no-campaigns')).toBeVisible();
  });

  test('campaign card shows status badge', async ({ page }) => {
    await page.locator('.btn-create-campaign').click();
    await page.locator('input[placeholder*="campaign name" i]').fill('Active Campaign');
    await page.locator('.modal .btn', { hasText: 'Create Campaign' }).click();
    await expect(page.locator('.status-badge')).toBeVisible();
  });

  test('empty state Create New Campaign button also opens modal', async ({ page }) => {
    await page.locator('.btn-create-large').click();
    await expect(page.locator('.modal')).toBeVisible();
  });
});
