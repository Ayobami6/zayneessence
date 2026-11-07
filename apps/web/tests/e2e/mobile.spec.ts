import { expect, test } from '@playwright/test';

const WELCOME_SEEN_KEY = 'zayneessence_welcome_seen_v1';

test.describe('zayneessence Glow mobile flows', () => {
  test('welcome screen shows once on the first mobile visit', async ({ page }) => {
    await page.goto('/');
    const welcome = page.getByTestId('welcome-screen');
    await expect(welcome).toBeVisible();
    await expect(welcome.getByRole('heading', { name: /Find the ritual your skin/ })).toBeVisible();

    await page.getByTestId('welcome-browse').click();
    await expect(welcome).toBeHidden();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'Skin that glows, quietly' })).toBeVisible();
    await expect(page.getByTestId('welcome-screen')).toHaveCount(0);
  });

  test.describe('after the welcome screen', () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((key) => window.localStorage.setItem(key, '1'), WELCOME_SEEN_KEY);
    });

    test('floating nav reaches the consultation, and a ritual unlocks free delivery', async ({ page }) => {
      test.setTimeout(90000);
      await page.goto('/');
      await page.getByTestId('mobile-nav-consultation').click();
      // App Router updates the URL once the route's payload arrives; in dev that includes compiling it.
      await page.waitForURL(/\/consultation/, { timeout: 45000 });
      await expect(page.getByRole('heading', { name: 'What should your ritual do?' })).toBeVisible();

      // Evening oud layering: Oud & Santal + Oud Mubakhar + Nuit d’Oud = ₦340,000
      await page.getByTestId('consultation-goal-evening_oud_layering').click();
      const addRitual = page.getByTestId('add-ritual-to-bag-button');
      await expect(addRitual).toContainText('₦340,000');
      await addRitual.click();
      await expect(addRitual).toContainText('✓ Ritual added to bag');

      await page.getByTestId('mobile-nav-bag').click();
      await expect(page.getByTestId('free-delivery-message')).toContainText(
        'You have complimentary delivery in Lagos and Abuja.'
      );
      await expect(page.locator('[data-testid^="bag-item-"]')).toHaveCount(3);
    });

    test('bag gauge counts down to free delivery below the threshold', async ({ page }) => {
      await page.goto('/');
      await page.getByTestId('quick-add-serum-lumiere').click();
      await page.getByTestId('mobile-nav-bag').click();
      // ₦150,000 − ₦85,000 = ₦65,000 to go
      await expect(page.getByTestId('free-delivery-message')).toContainText('Add ₦65,000 more');
    });

    test('bakhoor category page lists the four pieces', async ({ page }) => {
      await page.goto('/shop/bakhoor');
      await expect(page.getByRole('heading', { level: 1, name: /Bakhoor & turaren wuta/ })).toBeVisible();
      await expect(page.locator('[data-testid^="product-tile-"]')).toHaveCount(4);
    });
  });
});
