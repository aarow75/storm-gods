import { test, expect, Page } from '@playwright/test';
import { clearStorage, seedCharacter, goto, GAME_SYSTEMS } from './helpers';
import { CALC_FIXTURES } from './game-system-fixtures';

/**
 * Maps a fixture's expected-value key to the input's `name` attribute or a
 * label-based locator, since a couple of fields have no `name` attribute.
 */
function derivedStatLocator(page: Page, key: string) {
  switch (key) {
    case 'totalHP':
      return page.locator('input[name="totalHP"]');
    case 'magicPoints':
      return page.locator('input[name="magicPoints"]');
    case 'damageBonus':
      return page.locator('input[name="damageBonus"]');
    case 'healingRate':
      return page.locator('input[name="healingRate"]');
    case 'movementRate':
      return page.locator('input[name="movementRate"]');
    case 'strikeRank':
      return page.locator('input[name="strikeRank"]');
    case 'armorClass':
      return page.locator('input[name="armorClass"]');
    case 'missileAttack':
      return page.locator('.form-group', { hasText: 'Missile Attack:' }).locator('input').first();
    case 'encumbrance':
      return page.locator('.form-group', { hasText: 'Encumbrance:' }).locator('input');
    default:
      throw new Error(`Unknown derived-stat key: ${key}`);
  }
}

for (const system of GAME_SYSTEMS) {
  const { character, expected } = CALC_FIXTURES[system];

  test.describe(`${system} — derived stat calculations`, () => {
    test.beforeEach(async ({ page }) => {
      await clearStorage(page);
      await seedCharacter(page, character, system);
    });

    test(`computes correct derived stats from raw ability scores`, async ({ page }) => {
      const charId = (character as { id: string }).id;
      await goto(page, `create?id=${charId}`, system);

      // Verify the form loaded and is in edit mode (the seeded character should appear).
      await expect(page.locator('.edit-banner')).toContainText('Editing:');

      // Trigger the real production calculation path (rules.calculateDerivedStats).
      // Use the "Calculate" button in the derived-stats heading (h4 > button),
      // which is distinct from the "Apply Skill Bonuses" button elsewhere.
      await page.locator('h4:has-text("Calculate") .btn-calculate').click();

      // Assert each expected derived-stat field matches the hand-computed value.
      for (const [key, value] of Object.entries(expected)) {
        const locator = derivedStatLocator(page, key);
        await expect(locator).toHaveValue(value);
      }
    });
  });
}
