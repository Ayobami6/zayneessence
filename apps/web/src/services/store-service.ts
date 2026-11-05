import { DEFAULT_STORE_SETTINGS, SEED_PRODUCTS } from '@/data/seed-catalogue';
import { OrderRecord, Product, StoreSettings } from '@/types/domain';

// v2: Glow redesign catalogue (photography, Bakhoor and Supplements categories).
const PRODUCTS_STORAGE_KEY = 'zayneessence_products_v2';
const SETTINGS_STORAGE_KEY = 'zayneessence_settings_v1';
const ORDERS_STORAGE_KEY = 'zayneessence_orders_v1';

export function loadProductsFromStore(): Product[] {
  if (typeof window === 'undefined') {
    return SEED_PRODUCTS;
  }
  try {
    const raw = window.localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      window.localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_PRODUCTS;
  } catch {
    return SEED_PRODUCTS;
  }
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
