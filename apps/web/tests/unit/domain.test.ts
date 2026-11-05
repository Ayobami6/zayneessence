import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { formatKoboToNgn, koboToNaira, nairaToKobo } from '@/utils/currency';
import {
  formatNigerianPhone,
  isValidNigerianPhone,
  toE164NigerianPhone,
} from '@/utils/phone';
import { DEFAULT_STORE_SETTINGS, SEED_PRODUCTS } from '@/data/seed-catalogue';
import {
  calculateDeliveryFeeKobo,
  filterProducts,
  getFreeDeliveryProgress,
} from '@/services/store-service';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  PRODUCT_CATEGORIES,
  categoryFromSlug,
} from '@/types/domain';
import { CONSULTATION_RITUALS, DAILY_RITUAL, getRitualTotalKobo, resolveRitualSteps } from '@/data/rituals';
import { NIGERIA_STATES_AND_FCT, isLagosOrAbuja } from '@/data/nigeria-states';
import { verifyPaystackWebhookSignature } from '../../../api/src/webhooks/paystack.controller';

describe('Currency utilities (kobo & en-NG formatting)', () => {
  it('formats kobo integers as en-NG Naira without decimals (e.g., ₦185,000)', () => {
    expect(formatKoboToNgn(18500000)).toBe('₦185,000');
    expect(formatKoboToNgn(8500000)).toBe('₦85,000');
    expect(formatKoboToNgn(32000000)).toBe('₦320,000');
  });

  it('converts accurately between Naira and kobo', () => {
    expect(nairaToKobo(150000)).toBe(15000000);
    expect(koboToNaira(15000000)).toBe(150000);
  });
});

describe('Nigerian +234 phone formatting and validation', () => {
  it('formats local 080/090 numbers into +234 display strings', () => {
    expect(formatNigerianPhone('08031234567')).toBe('+234 803 123 4567');
    expect(formatNigerianPhone('+2349012345678')).toBe('+234 901 234 5678');
  });

  it('validates genuine Nigerian mobile prefixes and rejects invalid numbers', () => {
    expect(isValidNigerianPhone('+234 803 456 7890')).toBe(true);
    expect(isValidNigerianPhone('07061234567')).toBe(true);
    expect(isValidNigerianPhone('09151234567')).toBe(true);
    expect(isValidNigerianPhone('+234 123 456')).toBe(false);
    expect(toE164NigerianPhone('0803 456 7890')).toBe('+2348034567890');
  });
});

describe('Catalogue & live search filtering', () => {
  it('contains the 12 core pieces plus 8 marked samples, each with 3 photos', () => {
    expect(SEED_PRODUCTS).toHaveLength(20);
    expect(SEED_PRODUCTS.filter((p) => p.is_sample)).toHaveLength(8);
    for (const product of SEED_PRODUCTS) {
      expect(product.images.length).toBeGreaterThanOrEqual(3);
      expect(product.variants.length).toBeGreaterThanOrEqual(1);
      for (const image of product.images) {
        expect(image.url).toMatch(/\.jpg$/);
        expect(image.alt.length).toBeGreaterThan(10);
      }
    }
  });

  it('has unique slugs, ids and SKUs', () => {
    const slugs = SEED_PRODUCTS.map((p) => p.slug);
    const skus = SEED_PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(skus).size).toBe(skus.length);
  });

  it('filters live by name, type, category, and Nigerian ingredients', () => {
    const sheaMatches = filterProducts(SEED_PRODUCTS, { searchQuery: 'shea' });
    expect(sheaMatches.some((p) => p.slug === 'creme-velours')).toBe(true);

    const oudCategory = filterProducts(SEED_PRODUCTS, { category: 'Oud' });
    expect(oudCategory.map((p) => p.name)).toEqual(['Oud Mubakhar', 'Oud Malaki']);

    const noMatches = filterProducts(SEED_PRODUCTS, {
      searchQuery: 'nonexistent-ingredient-xyz',
    });
    expect(noMatches).toHaveLength(0);
  });

  it('filters the new Bakhoor and Supplements categories', () => {
    const bakhoor = filterProducts(SEED_PRODUCTS, { category: 'Bakhoor' });
    expect(bakhoor.map((p) => p.slug)).toEqual([
      'bakhoor-malaki',
      'turaren-wuta-amarya',
      'dukhan-ambre',
      'mabkhara',
    ]);
    const supplements = filterProducts(SEED_PRODUCTS, { category: 'Supplements' });
    expect(supplements).toHaveLength(4);
    expect(filterProducts(SEED_PRODUCTS, { searchQuery: 'moringa' }).some((p) => p.slug === 'moringa-pure')).toBe(true);
  });
});

describe('Category metadata', () => {
  it('describes every category with a unique, URL-safe slug', () => {
    const slugs = PRODUCT_CATEGORIES.map((c) => CATEGORY_META[c].slug);
    expect(new Set(slugs).size).toBe(PRODUCT_CATEGORIES.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
    expect(CATEGORY_ORDER[0]).toBe('All');
    expect(CATEGORY_ORDER).toHaveLength(PRODUCT_CATEGORIES.length + 1);
  });

  it('maps slugs back to categories', () => {
    expect(categoryFromSlug('bakhoor')).toBe('Bakhoor');
    expect(categoryFromSlug('roll-ons')).toBe('Roll-ons');
    expect(categoryFromSlug('unknown')).toBeUndefined();
    expect(CATEGORY_META.Bakhoor.label).toBe('Bakhoor & turaren wuta');
    expect(CATEGORY_META.Supplements.isScent).toBe(false);
  });
});

describe('Rituals', () => {
  it('resolves every ritual step to a published catalogue product', () => {
    for (const ritual of CONSULTATION_RITUALS) {
      expect(resolveRitualSteps(ritual.steps, SEED_PRODUCTS)).toHaveLength(ritual.steps.length);
    }
    expect(resolveRitualSteps(DAILY_RITUAL, SEED_PRODUCTS)).toHaveLength(4);
  });

  it('prices rituals from the catalogue', () => {
    // Sérum Lumière 85,000 + Huile Visage 75,000 + Musc Soie 38,000
    expect(getRitualTotalKobo(CONSULTATION_RITUALS[0].steps, SEED_PRODUCTS)).toBe(19800000);
    // Sérum Lumière + Huile Visage + Crème Velours + Oud Mubakhar 3 ml
    expect(getRitualTotalKobo(DAILY_RITUAL, SEED_PRODUCTS)).toBe(36500000);
  });
});

describe('Nigerian states, delivery zones, and ₦150,000 free-delivery threshold', () => {
  it('includes all 36 states plus FCT (37 entries total)', () => {
    expect(NIGERIA_STATES_AND_FCT).toHaveLength(37);
    expect(isLagosOrAbuja('Lagos')).toBe(true);
    expect(isLagosOrAbuja('Federal Capital Territory (Abuja)')).toBe(true);
    expect(isLagosOrAbuja('Kano')).toBe(false);
  });

  it('grants free delivery in Lagos and Abuja at or above ₦150,000 (15,000,000 kobo)', () => {
    expect(
      calculateDeliveryFeeKobo('lagos_abuja', 8500000, DEFAULT_STORE_SETTINGS)
    ).toBe(350000);
    expect(
      calculateDeliveryFeeKobo('lagos_abuja', 15000000, DEFAULT_STORE_SETTINGS)
    ).toBe(0);
    expect(
      calculateDeliveryFeeKobo('rest_of_nigeria', 20000000, DEFAULT_STORE_SETTINGS)
    ).toBe(650000);
    expect(
      calculateDeliveryFeeKobo('store_pickup', 4500000, DEFAULT_STORE_SETTINGS)
    ).toBe(0);
  });

  it('reports progress toward the free-delivery threshold', () => {
    const partial = getFreeDeliveryProgress(12300000, DEFAULT_STORE_SETTINGS);
    expect(partial.unlocked).toBe(false);
    expect(partial.remainingKobo).toBe(2700000);
    expect(partial.progress).toBeCloseTo(0.82, 2);

    const unlocked = getFreeDeliveryProgress(17000000, DEFAULT_STORE_SETTINGS);
    expect(unlocked.unlocked).toBe(true);
    expect(unlocked.remainingKobo).toBe(0);
    expect(unlocked.progress).toBe(1);

    expect(getFreeDeliveryProgress(0, DEFAULT_STORE_SETTINGS).unlocked).toBe(false);
  });
});

describe('Paystack HMAC-SHA512 webhook verification', () => {
  it('accepts valid HMAC-SHA512 signatures and rejects tampered payloads', () => {
    const secret = 'sk_test_zayneessence_secret';
    const rawBody = JSON.stringify({
      event: 'charge.success',
      data: { reference: 'ZE-PSK-123', amount: 8500000, currency: 'NGN', status: 'success' },
    });
    const validSig = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');

    expect(verifyPaystackWebhookSignature(rawBody, validSig, secret)).toBe(true);
    expect(verifyPaystackWebhookSignature(rawBody, 'invalid_signature', secret)).toBe(
      false
    );
  });
});
