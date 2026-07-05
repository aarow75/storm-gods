import { test, expect } from '@playwright/test';
import { clearStorage, clearCombatState, seedCharacter, goto, GAME_SYSTEMS } from './helpers';
import { CALC_FIXTURES } from './game-system-fixtures';

/**
 * Combat-specific fixtures: characters whose *finished* derivedStats are already
 * hand-computed (not placeholders) — combat tracker reads character.derivedStats
 * directly (no recalculation happens on add), so these fixtures supply real
 * numbers up front rather than relying on the "Calculate" button.
 */
const COMBAT_FIXTURES: Partial<Record<string, { character: unknown; expectedHP: string; expectedArmorOrAc?: string }>> = {
  runequest: {
    character: { ...CALC_FIXTURES.runequest.character, weapons: [{ name: 'Broadsword', damage: '1d8+1', skill: 75, currentHitPoints: 12 }], derivedStats: {
      totalHitPoints: 16, maxHitPoints: 16, magicPoints: 14, damageBonus: '+1d4',
      spiritCombatDamage: '1d6+1', healingRate: 1, movementRate: 8, strikeRank: 3,
      maxEncumbrance: 12, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
    }},
    expectedHP: '16 / 16',
  },

  dragonbane: {
    character: { ...CALC_FIXTURES.dragonbane.character, weapons: [{ name: 'Shortsword', damage: '1d6', skill: 10, currentHitPoints: 8 }], derivedStats: {
      totalHitPoints: 12, maxHitPoints: 12, magicPoints: 15, damageBonus: '+1d6',
      spiritCombatDamage: '0', healingRate: 0, movementRate: 12, strikeRank: 0,
      maxEncumbrance: 9, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
    }},
    expectedHP: '12 / 12',
  },

  'kal-arath': {
    character: { ...CALC_FIXTURES['kal-arath'].character, weapons: [{ name: 'Dagger', damage: '1d4', skill: 8, currentHitPoints: 6 }], derivedStats: {
      totalHitPoints: 14, maxHitPoints: 14, magicPoints: 0, damageBonus: '0',
      spiritCombatDamage: '0', healingRate: 9, movementRate: 0, strikeRank: 0,
      maxEncumbrance: 18, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
    }},
    expectedHP: '14 / 14',
  },

  mothership: {
    character: { ...CALC_FIXTURES.mothership.character, weapons: [{ name: 'Pulse Rifle', damage: '2d10', skill: 10, currentHitPoints: 20 }], derivedStats: {
      totalHitPoints: 100, maxHitPoints: 100, magicPoints: 0, damageBonus: '0',
      spiritCombatDamage: '0', healingRate: 0, movementRate: 50, strikeRank: 0,
      maxEncumbrance: 50, totalEncumbrance: 0, encumbranceDefensePenalty: 0,
    }},
    expectedHP: '100 / 100',
  },
};

// Skip OSRIC in the combat tracker test — its weapon seeding is out of scope for this minimal test.
// The derived-stats calculation test above already covers OSRIC AC/HP formula correctness.
const SYSTEMS_TO_TEST = Object.keys(COMBAT_FIXTURES) as unknown as (keyof typeof COMBAT_FIXTURES)[];

for (const system of SYSTEMS_TO_TEST) {
  const fixture = COMBAT_FIXTURES[system];
  if (!fixture) continue;

  test.describe(`${system} combat tracker — seeded character rendering`, () => {
    test.beforeEach(async ({ page }) => {
      await clearStorage(page);
      await seedCharacter(page, fixture.character, system);
      await clearCombatState(page, system);
    });

    test(`renders correct HP and static stats from seeded character`, async ({ page }) => {
      const charName = (fixture.character as { name: string }).name;

      await goto(page, 'combat', system);

      // Open the "Add Participant" modal.
      await page.locator('.btn.btn-primary', { hasText: 'Add Participant' }).click();

      // Character tab should be active by default; select the seeded character from the dropdown.
      const characterSelect = page.locator('select').first();
      await characterSelect.selectOption({ label: charName });

      // Wait a moment for the form to update, then select any available weapon.
      await page.waitForTimeout(300);

      // Try to find and select a weapon from the second select (if it exists).
      const selects = page.locator('select');
      const selectCount = await selects.count();
      if (selectCount > 1) {
        const weaponSelect = selects.nth(1);
        const options = weaponSelect.locator('option');
        const optCount = await options.count();
        for (let i = 1; i < optCount; i++) {
          const optText = await options.nth(i).textContent();
          if (optText && optText.trim() && optText.trim() !== '-- Select Weapon --') {
            await weaponSelect.selectOption(optText.trim());
            break;
          }
        }
      }

      // Click "Add to Combat".
      await page.locator('.btn.btn-primary', { hasText: 'Add to Combat' }).click();

      // Wait for the modal to close and the participant card to appear.
      await page.waitForSelector(`.combat-participant`);

      // Find the participant row by name and assert HP.
      const participantRow = page.locator('.combat-participant', { hasText: charName });
      await expect(participantRow).toBeVisible();

      // Assert HP display.
      const hpLabel = participantRow.locator('label', { hasText: 'HP Remaining:' }).or(participantRow.locator('label', { hasText: 'HP:' }));
      await expect(hpLabel).toContainText(fixture.expectedHP);

      // Assert Armor/AC if applicable.
      if (fixture.expectedArmorOrAc) {
        const armorLabel = participantRow.locator('label', { hasText: 'Armor:' });
        await expect(armorLabel).toContainText(fixture.expectedArmorOrAc);
      }
    });
  });
}
