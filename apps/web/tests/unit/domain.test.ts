import crypto from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { formatKoboToNgn, koboToNaira, nairaToKobo } from '@/utils/currency';
import {
  formatNigerianPhone,
  isValidNigerianPhone,
  toE164NigerianPhone,
} from '@/utils/phone';
import { DEFAULT_STORE_SETTINGS, SEED_PRODUCTS } from '@/data/seed-catalogue';
import { calculateDeliveryFeeKobo, filterProducts } from '@/services/store-service';
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
  it('contains all 12 required seed products with 3 images each', () => {
    expect(SEED_PRODUCTS).toHaveLength(12);
    for (const product of SEED_PRODUCTS) {
      expect(product.images.length).toBeGreaterThanOrEqual(3);
      expect(product.variants.length).toBeGreaterThanOrEqual(1);
    }
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
