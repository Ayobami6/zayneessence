import path from 'node:path';
import { expect, test } from '@playwright/test';

const ARTIFACT_DIR =
  '/Users/mac/.gemini/antigravity/brain/5162610d-8cfa-42c0-897f-ca48ff4a71e4';

test.describe('zayneessence luxury storefront E2E flows', () => {
  test('theme toggle switches between light and dark plum modes and persists', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { name: 'Skin that glows, quietly' })
    ).toBeVisible();

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'home-light.png'),
      fullPage: false,
    });

    const initialMode = await page.locator('html').getAttribute('data-color-mode');
    const toggleBtn = page.getByTestId('theme-toggle-button');
    await toggleBtn.click();

    const nextMode = initialMode === 'dark' ? 'light' : 'dark';
    await expect(page.locator('html')).toHaveAttribute('data-color-mode', nextMode);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'home-dark.png'),
      fullPage: false,
    });
  });

  test('wishlist heart saves a piece and displays it on /saved', async ({ page }) => {
    await page.goto('/');

    const heartBtn = page.getByTestId('save-heart-prod-serum-lumiere');
    await heartBtn.click();
    await expect(heartBtn).toHaveAttribute('aria-pressed', 'true');

    await page.goto('/saved');
    await expect(page.getByTestId('product-tile-serum-lumiere')).toBeVisible();
  });

  test('search filters live and shows exact empty message when nothing matches', async ({
    page,
  }) => {
    await page.goto('/');

    await page.getByTestId('search-toggle-button').click();
    const searchInput = page.getByTestId('search-input');
    await searchInput.fill('nonexistent-botanical');

    await expect(page.getByTestId('search-empty-state')).toContainText(
      'Nothing matches that search. Try shea, rose, oud or serum.'
    );
  });

  test('browse -> product slide-up dialog -> add to bag -> checkout (Paystack test mode) -> confirmation', async ({
    page,
  }) => {
    await page.goto('/');

    // 1. Click Oud Mubakhar tile to open slide-up product dialog
    await page.getByTestId('product-tile-oud-mubakhar').locator('a').first().click();

    await expect(page.getByTestId('product-detail-dialog')).toBeVisible();
    await expect(page.getByTestId('product-detail-price')).toContainText('₦95,000');

    // 2. Select 6 ml variant (₦170,000 — unlocks free delivery over ₦150,000)
    await page.getByTestId('size-option-6-ml').click();
    await expect(page.getByTestId('product-detail-price')).toContainText('₦170,000');

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'product-dialog.png'),
      fullPage: false,
    });

    // 3. Add to bag and verify button swaps to "✓ Added to bag"
    const addToBagBtn = page.getByTestId('add-to-bag-button');
    await addToBagBtn.click();
    await expect(addToBagBtn).toContainText('✓ Added to bag');

    // 4. Open bag via header button and verify free delivery unlocked
    await page.getByTestId('close-product-dialog').click();
    await page.getByTestId('header-bag-button').click();
    await expect(page.getByTestId('free-delivery-message')).toContainText(
      'You have complimentary delivery in Lagos and Abuja.'
    );

    // 5. Proceed to checkout
    await page.getByTestId('proceed-to-checkout-button').click();
    await expect(page).toHaveURL(/\/checkout/);

    // 6. Verify Lagos/Abuja free delivery over ₦150,000, add gift wrap, and place order
    await expect(page.getByTestId('checkout-delivery-fee')).toContainText('Free');
    await page.getByTestId('gift-wrap-toggle').click();
    await page.getByTestId('gift-note-input').fill('With warmth from Lagos.');

    await page.getByTestId('place-order-button').click();

    // 7. Complete Paystack test mode modal
    await expect(page.getByTestId('payment-gateway-dialog')).toBeVisible();
    await page.getByTestId('confirm-mock-payment-button').click();

    // 8. Verify exact order confirmation copy
    await expect(page.getByTestId('order-confirmation-heading')).toHaveText(
      'Order placed. You’ll get a WhatsApp message when it leaves our studio.'
    );

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'order-confirmation.png'),
      fullPage: false,
    });
  });
});
