export type ProductCategory =
  | 'Skincare'
  | 'Perfume'
  | 'Oud'
  | 'Roll-ons'
  | 'Oils'
  | 'Bakhoor'
  | 'Supplements';

export type CategoryFilter = 'All' | ProductCategory;

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  'Skincare',
  'Perfume',
  'Oud',
  'Roll-ons',
  'Oils',
  'Bakhoor',
  'Supplements',
];

export const CATEGORY_ORDER: CategoryFilter[] = ['All', ...PRODUCT_CATEGORIES];

export interface CategoryMeta {
  /** Full display name, e.g. "Bakhoor & turaren wuta". */
  label: string;
  /** Short chip / nav label. */
  shortLabel: string;
  /** URL + test-id safe slug, used by /shop/[category]. */
  slug: string;
  /** Scent products show scent notes and "How to wear". */
  isScent: boolean;
  /** Heading for the product how-to accordion. */
  usageHeading: string;
  /** One-line intro for the category page. */
  intro: string;
  /** Small label shown on product tiles. */
  tileTag: string;
}

export const CATEGORY_META: Record<ProductCategory, CategoryMeta> = {
  Skincare: {
    label: 'Skincare',
    shortLabel: 'Skincare',
    slug: 'skincare',
    isScent: false,
    usageHeading: 'How to use',
    intro:
      'Unrefined northern shea, cold-pressed baobab and moringa, formulated for melanin-rich skin.',
    tileTag: 'Active skincare',
  },
  Perfume: {
    label: 'Perfume',
    shortLabel: 'Perfume',
    slug: 'perfume',
    isScent: true,
    usageHeading: 'How to wear',
    intro: 'Eau de parfum built on pure oud, Taif rose and skin musk.',
    tileTag: 'Eau de parfum',
  },
  Oud: {
    label: 'Pure oud',
    shortLabel: 'Pure oud',
    slug: 'oud',
    isScent: true,
    usageHeading: 'How to wear',
    intro: 'Hydro-distilled agarwood oils, aged in dark glass before bottling.',
    tileTag: 'Pure oud',
  },
  'Roll-ons': {
    label: 'Attar roll-ons',
    shortLabel: 'Roll-ons',
    slug: 'roll-ons',
    isScent: true,
    usageHeading: 'How to wear',
    intro: 'Alcohol-free attars to glide across pulse points, close to the skin.',
    tileTag: 'Attar roll-on',
  },
  Oils: {
    label: 'Body & fragrance oils',
    shortLabel: 'Oils',
    slug: 'oils',
    isScent: true,
    usageHeading: 'How to use',
    intro: 'Dry savanna oils that gleam on skin and anchor fragrance.',
    tileTag: 'Savanna oil',
  },
  Bakhoor: {
    label: 'Bakhoor & turaren wuta',
    shortLabel: 'Bakhoor',
    slug: 'bakhoor',
    isScent: true,
    usageHeading: 'How to burn',
    intro:
      'Agarwood chips, resins and bridal blends, burned slowly over charcoal to scent the home, clothes and hair.',
    tileTag: 'Bakhoor',
  },
  Supplements: {
    label: 'Supplements',
    shortLabel: 'Supplements',
    slug: 'supplements',
    isScent: false,
    usageHeading: 'How to take',
    intro: 'Moringa, baobab, black seed and hibiscus for the everyday ritual.',
    tileTag: 'Supplement',
  },
};

export function categoryFromSlug(slug: string): ProductCategory | undefined {
  return PRODUCT_CATEGORIES.find((c) => CATEGORY_META[c].slug === slug);
}

export interface ProductHighlight {
  value: string;
  label: string;
}

export interface ScentNotes {
  top: string;
  heart: string;
  base: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  position: number;
  blurDataURL?: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  label: string;
  price_kobo: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  type: string;
  description: string;
  notes: ScentNotes | null;
  ingredients: string[] | null;
  how_to_use: string;
  is_published: boolean;
  sort_order: number;
  images: ProductImage[];
  variants: ProductVariant[];
  /** Years the oil matured in glass; drives the product maturation arc. */
  aged_years?: number;
  /** Short facts shown as stat discs on the product page. */
  highlights?: ProductHighlight[];
  /** Draft product for design review; must be replaced before launch. */
  is_sample?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  type: string;
  sizeLabel: string;
  priceKobo: number;
  quantity: number;
  thumbnailUrl: string;
  thumbnailAlt: string;
}

export type OrderStatus = 'paid' | 'packed' | 'shipped' | 'delivered';

export const ORDER_STEPS: OrderStatus[] = ['paid', 'packed', 'shipped', 'delivered'];

export type DeliveryMethodId = 'lagos_abuja' | 'rest_of_nigeria' | 'store_pickup';

export type PaymentProvider = 'paystack' | 'flutterwave';

export interface CustomerAddress {
  id: string;
  customerId?: string;
  recipientName: string;
  phone: string;
  state: string;
  cityOrLga: string;
  streetAddress: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface OrderItemRecord {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  sizeLabel: string;
  priceKobo: number;
  quantity: number;
  thumbnailUrl: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  provider: PaymentProvider;
  reference: string;
  channel: 'card' | 'bank_transfer' | 'ussd';
  status: 'pending' | 'verified';
  amountKobo: number;
  verifiedByWebhook: boolean;
  createdAt: string;
}

export interface NotificationDispatchLog {
  id: string;
  orderId: string;
  channel: 'email_resend' | 'whatsapp_cloud';
  recipient: string;
  status: OrderStatus;
  message: string;
  timestamp: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerPhone: string;
  customerName: string;
  address: CustomerAddress;
  deliveryMethod: DeliveryMethodId;
  deliveryFeeKobo: number;
  subtotalKobo: number;
  giftWrap: boolean;
  giftWrapFeeKobo: number;
  giftNote: string;
  totalKobo: number;
  status: OrderStatus;
  items: OrderItemRecord[];
  payment: PaymentRecord;
  notifications: NotificationDispatchLog[];
  /** The customer's WhatsApp choice at checkout. Orders saved before this field existed count as opted in. */
  whatsappOptIn?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  freeDeliveryThresholdKobo: number; // Default: 150,000 NGN = 15,000,000 kobo
  lagosAbujaRateKobo: number; // Default: 3,500 NGN = 350,000 kobo
  restOfNigeriaRateKobo: number; // Default: 6,500 NGN = 650,000 kobo
  giftWrapFeeKobo: number; // Default: 0 kobo (Complimentary)
  whatsappUpdatesEnabled: boolean;
  lowStockThreshold: number; // Default: 5 units
}

export interface CustomerSession {
  id: string;
  email: string;
  phone: string;
  name: string;
  authMethod: 'phone_otp' | 'email_magic_link';
  role: 'customer' | 'admin';
  savedAddresses: CustomerAddress[];
}
