export type ProductCategory = 'Skincare' | 'Perfume' | 'Oud' | 'Roll-ons' | 'Oils';

export type CategoryFilter = 'All' | ProductCategory;

export const CATEGORY_ORDER: CategoryFilter[] = [
  'All',
  'Skincare',
  'Perfume',
  'Oud',
  'Roll-ons',
  'Oils',
];

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
