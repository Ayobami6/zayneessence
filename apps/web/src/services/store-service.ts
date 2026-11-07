import { DEFAULT_STORE_SETTINGS, SEED_PRODUCTS } from '@/data/seed-catalogue';
import { OrderRecord, Product, StoreSettings } from '@/types/domain';

// v2: Glow redesign catalogue (photography, Bakhoor and Supplements categories).
const PRODUCTS_STORAGE_KEY = 'zayneessence_products_v2';
// The Parade-era catalogue. Read once to carry studio edits into v2, never written again.
const LEGACY_PRODUCTS_STORAGE_KEY = 'zayneessence_products_v1';
const FALLBACK_PRODUCT_IMAGE = '/products/serum-lumiere/1.jpg';
const SETTINGS_STORAGE_KEY = 'zayneessence_settings_v1';
const ORDERS_STORAGE_KEY = 'zayneessence_orders_v1';

export function loadProductsFromStore(): Product[] {
  if (typeof window === 'undefined') {
    return SEED_PRODUCTS;
  }
  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      const initial = readLegacyCatalogue() ?? SEED_PRODUCTS;
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PRODUCTS;
  } catch {
    return SEED_PRODUCTS;
  }
}

function readLegacyCatalogue(): Product[] | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_PRODUCTS_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? migrateLegacyCatalogue(parsed, SEED_PRODUCTS) : null;
  } catch {
    return null;
  }
}

/**
 * Carries a Parade-era (v1) catalogue into v2 without losing studio edits.
 * - Seed products keep every edited field (names, prices, stock, publish state, sizes, notes).
 *   Fields new in v2 (oud age, highlights, sample flag) come from the seed, and retired
 *   `.svg` artwork is swapped for the seed's photography.
 * - Products the studio added keep their data; retired `.svg` artwork moves to the
 *   matching product photo, or a stand-in.
 * - Seed products the old catalogue didn't have (Bakhoor, Supplements) are appended.
 */
export function migrateLegacyCatalogue(legacy: Product[], seed: Product[]): Product[] {
  const seedById = new Map(seed.map((p) => [p.id, p]));
  const seedSlugs = new Set(seed.map((p) => p.slug));
  const isRetired = (url: string) => url.endsWith('.svg');

  const migrated = legacy.map((old): Product => {
    const fresh = seedById.get(old.id);
    const keptImages = (old.images ?? []).filter((img) => !isRetired(img.url));
    if (fresh) {
      return {
        ...fresh,
        ...old,
        aged_years: old.aged_years ?? fresh.aged_years,
        highlights: old.highlights ?? fresh.highlights,
        is_sample: fresh.is_sample,
        images: keptImages.length > 0 ? keptImages : fresh.images,
      };
    }
    const images = (old.images ?? []).map((img) => {
      if (!isRetired(img.url)) return img;
      const slug = img.url.split('/')[2];
      return { ...img, url: slug && seedSlugs.has(slug) ? `/products/${slug}/1.jpg` : FALLBACK_PRODUCT_IMAGE };
    });
    return { ...old, images };
  });

  const legacyIds = new Set(legacy.map((p) => p.id));
  return [...migrated, ...seed.filter((p) => !legacyIds.has(p.id))];
}

export function saveProductsToStore(products: Product[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
}

export function loadSettingsFromStore(): StoreSettings {
  if (typeof window === 'undefined') {
    return DEFAULT_STORE_SETTINGS;
  }
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(
        SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_STORE_SETTINGS)
      );
      return DEFAULT_STORE_SETTINGS;
    }
    return { ...DEFAULT_STORE_SETTINGS, ...(JSON.parse(raw) as Partial<StoreSettings>) };
  } catch {
    return DEFAULT_STORE_SETTINGS;
  }
}

export function saveSettingsToStore(settings: StoreSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function loadOrdersFromStore(): OrderRecord[] {
  if (typeof window === 'undefined') {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OrderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOrdersToStore(orders: OrderRecord[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export function filterProducts(
  products: Product[],
  options: {
    category?: string;
    searchQuery?: string;
    includeUnpublished?: boolean;
  }
): Product[] {
  const { category = 'All', searchQuery = '', includeUnpublished = false } = options;
  const normalizedQuery = searchQuery.trim().toLowerCase();

  return products
    .filter((product) => (includeUnpublished ? true : product.is_published))
    .filter((product) => {
      if (category && category !== 'All' && product.category !== category) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      const inName = product.name.toLowerCase().includes(normalizedQuery);
      const inType = product.type.toLowerCase().includes(normalizedQuery);
      const inCategory = product.category.toLowerCase().includes(normalizedQuery);
      const inDescription = product.description.toLowerCase().includes(normalizedQuery);
      const inIngredients =
        product.ingredients?.some((ing) => ing.toLowerCase().includes(normalizedQuery)) ??
        false;
      const inNotes = product.notes
        ? `${product.notes.top} ${product.notes.heart} ${product.notes.base}`
            .toLowerCase()
            .includes(normalizedQuery)
        : false;

      return (
        inName || inType || inCategory || inDescription || inIngredients || inNotes
      );
    })
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function calculateDeliveryFeeKobo(
  deliveryMethod: 'lagos_abuja' | 'rest_of_nigeria' | 'store_pickup',
  subtotalKobo: number,
  settings: StoreSettings
): number {
  if (deliveryMethod === 'store_pickup') {
    return 0;
  }
  if (subtotalKobo >= settings.freeDeliveryThresholdKobo && deliveryMethod === 'lagos_abuja') {
    return 0;
  }
  if (deliveryMethod === 'lagos_abuja') {
    return settings.lagosAbujaRateKobo;
  }
  return settings.restOfNigeriaRateKobo;
}

export interface FreeDeliveryProgress {
  thresholdKobo: number;
  remainingKobo: number;
  /** 0–1, capped at 1. */
  progress: number;
  unlocked: boolean;
}

/** Progress toward the free-delivery threshold, shared by the bag, home card and checkout gauge. */
export function getFreeDeliveryProgress(
  subtotalKobo: number,
  settings: Pick<StoreSettings, 'freeDeliveryThresholdKobo'>
): FreeDeliveryProgress {
  const thresholdKobo = settings.freeDeliveryThresholdKobo;
  const unlocked = subtotalKobo > 0 && subtotalKobo >= thresholdKobo;
  const remainingKobo = Math.max(0, thresholdKobo - subtotalKobo);
  const progress = thresholdKobo > 0 ? Math.min(1, Math.max(0, subtotalKobo / thresholdKobo)) : 1;
  return { thresholdKobo, remainingKobo, progress, unlocked };
}
