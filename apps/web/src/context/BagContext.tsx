'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CartItem, Product, ProductVariant } from '@/types/domain';
import { useStoreData } from './StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';
import { getFreeDeliveryProgress } from '@/services/store-service';

const BAG_STORAGE_KEY = 'zayneessence_bag_v1';
/** Most units of one size a shopper can hold in the bag, whatever the stock. */
export const MAX_UNITS_PER_LINE = 9;

/** A bag line with the current product photo and how many units the shopper may hold. */
export interface BagLine extends CartItem {
  maxQuantity: number;
}

export interface BagAddLine {
  product: Product;
  variant: ProductVariant;
  quantity?: number;
}

export interface BagAddResult {
  /** Units actually added across all lines. */
  addedUnits: number;
  /** Names of pieces where stock (or the per-line cap) allowed fewer units than asked. */
  limited: string[];
}

interface BagContextValue {
  items: BagLine[];
  totalCount: number;
  subtotalKobo: number;
  remainingForFreeDeliveryKobo: number;
  hasUnlockedFreeDelivery: boolean;
  freeDeliveryProgressPercent: number;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addToBag: (product: Product, variant: ProductVariant, quantity?: number) => BagAddResult;
  /** Adds several pieces at once (rituals, Buy again) with one confirmation. */
  addLinesToBag: (lines: BagAddLine[]) => BagAddResult;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearBag: () => void;
  badgeBumpKey: number;
  liveAnnouncement: string;
}

const BagContext = createContext<BagContextValue | undefined>(undefined);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const { settings, products } = useStoreData();
  const [storedItems, setItems] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [badgeBumpKey, setBadgeBumpKey] = useState<number>(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');
  const [snackbarMessage, setSnackbarMessage] = useState<string>('Added to bag');
  const [hasLoadedBag, setHasLoadedBag] = useState<boolean>(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(BAG_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartItem[];
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore storage error
    }
    setHasLoadedBag(true);
  }, []);

  // Persist after every change, outside the state updaters, so a failed write
  // (quota, private mode) never blocks the in-memory bag.
  useEffect(() => {
    if (!hasLoadedBag) return;
    try {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(storedItems));
    } catch {
      // The bag keeps working for this visit; it just won't survive a reload.
    }
  }, [storedItems, hasLoadedBag]);

  const findVariant = (productId: string, variantId: string) =>
    products.find((p) => p.id === productId)?.variants.find((v) => v.id === variantId);

  /** Units of a size a shopper may hold: current stock, capped per line. */
  const capFor = (stock: number) => Math.max(0, Math.min(MAX_UNITS_PER_LINE, stock));

  // Always show the product's current photo, so bags saved before a catalogue
  // change never point at retired image files, and expose the stock cap.
  const items = useMemo<BagLine[]>(
    () =>
      storedItems.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        const variant = product?.variants.find((v) => v.id === item.variantId);
        const image = product?.images[0];
        return {
          ...item,
          thumbnailUrl: image?.url ?? item.thumbnailUrl,
          thumbnailAlt: image?.alt ?? item.thumbnailAlt,
          maxQuantity: variant ? capFor(variant.stock) : Math.min(MAX_UNITS_PER_LINE, item.quantity),
        };
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [storedItems, products]
  );

  const addLinesToBag = (lines: BagAddLine[]): BagAddResult => {
    const limited: string[] = [];
    const accepted: Array<{ product: Product; variant: ProductVariant; quantity: number }> = [];

    for (const { product, variant, quantity = 1 } of lines) {
      const inBag = storedItems.find((i) => i.id === `${product.id}__${variant.id}`)?.quantity ?? 0;
      const room = Math.max(0, capFor(variant.stock) - inBag);
      const allowed = Math.min(quantity, room);
      if (allowed < quantity) limited.push(product.name);
      if (allowed > 0) accepted.push({ product, variant, quantity: allowed });
    }

    const addedUnits = accepted.reduce((sum, line) => sum + line.quantity, 0);

    if (accepted.length > 0) {
      setItems((prev) =>
        accepted.reduce<CartItem[]>((acc, { product, variant, quantity }) => {
          const itemId = `${product.id}__${variant.id}`;
          const cap = capFor(variant.stock);
          const existing = acc.find((item) => item.id === itemId);
          if (existing) {
            return acc.map((item) =>
              item.id === itemId ? { ...item, quantity: Math.min(cap, item.quantity + quantity) } : item
            );
          }
          const primaryImage = product.images[0];
          return [
            ...acc,
            {
              id: itemId,
              productId: product.id,
              variantId: variant.id,
              slug: product.slug,
              name: product.name,
              type: product.type,
              sizeLabel: variant.label,
              priceKobo: variant.price_kobo,
              quantity: Math.min(cap, quantity),
              thumbnailUrl: primaryImage?.url || '/products/serum-lumiere/1.jpg',
              thumbnailAlt: primaryImage?.alt || product.name,
            },
          ];
        }, prev)
      );
      setBadgeBumpKey((k) => k + 1);
    }

    const limitedNames = limited.join(', ');
    let message: string;
    let announcement: string;
    if (addedUnits === 0) {
      message = limited.length > 0 ? `No more ${limitedNames} in stock to add.` : 'Nothing to add.';
      announcement = message;
    } else if (limited.length > 0) {
      message = `Added to bag. Only the remaining stock of ${limitedNames} was added.`;
      announcement = `Added ${addedUnits} ${addedUnits === 1 ? 'piece' : 'pieces'} to bag. ${limitedNames}: limited by stock.`;
    } else {
      message = 'Added to bag';
      announcement =
        accepted.length === 1
          ? `Added ${accepted[0].quantity} ${accepted[0].product.name} (${accepted[0].variant.label}) to bag. Price ${formatKoboToNgn(
              accepted[0].variant.price_kobo * accepted[0].quantity
            )}.`
          : `Added ${addedUnits} pieces to bag.`;
    }
    setSnackbarMessage(message);
    setSnackbarOpen(true);
    setLiveAnnouncement(announcement);

    return { addedUnits, limited };
  };

  const addToBag = (product: Product, variant: ProductVariant, quantity = 1) =>
    addLinesToBag([{ product, variant, quantity }]);

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const current = storedItems.find((i) => i.id === itemId);
    const variant = current ? findVariant(current.productId, current.variantId) : undefined;
    const nextQuantity = variant ? Math.min(quantity, Math.max(1, capFor(variant.stock))) : quantity;
    setItems((prev) => prev.map((item) => (item.id === itemId ? { ...item, quantity: nextQuantity } : item)));
    if (current) {
      setLiveAnnouncement(
        nextQuantity < quantity
          ? `Only ${nextQuantity} ${current.name} available. Quantity set to ${nextQuantity}.`
          : `Updated ${current.name} quantity to ${nextQuantity}.`
      );
    }
  };

  const removeItem = (itemId: string) => {
    const removed = storedItems.find((i) => i.id === itemId);
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (removed) {
      setLiveAnnouncement(`Removed ${removed.name} from bag.`);
    }
  };

  const clearBag = () => {
    setItems([]);
    setLiveAnnouncement('Cleared all items from bag.');
  };

  const totalCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotalKobo = useMemo(
    () => items.reduce((acc, item) => acc + item.priceKobo * item.quantity, 0),
    [items]
  );

  const freeDelivery = getFreeDeliveryProgress(subtotalKobo, settings);
  const remainingForFreeDeliveryKobo = freeDelivery.remainingKobo;
  const hasUnlockedFreeDelivery = freeDelivery.unlocked;
  const freeDeliveryProgressPercent = Math.round(freeDelivery.progress * 100);

  const value = useMemo(
    () => ({
      items,
      totalCount,
      subtotalKobo,
      remainingForFreeDeliveryKobo,
      hasUnlockedFreeDelivery,
      freeDeliveryProgressPercent,
      isBagOpen,
      openBag: () => setIsBagOpen(true),
      closeBag: () => setIsBagOpen(false),
      addToBag,
      addLinesToBag,
      updateQuantity,
      removeItem,
      clearBag,
      badgeBumpKey,
      liveAnnouncement,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      items,
      totalCount,
      subtotalKobo,
      remainingForFreeDeliveryKobo,
      hasUnlockedFreeDelivery,
      freeDeliveryProgressPercent,
      isBagOpen,
      badgeBumpKey,
      liveAnnouncement,
    ]
  );

  return (
    <BagContext.Provider value={value}>
      {children}
      {/* Accessible ARIA live region for screen readers when bag updates */}
      <Box
        role="status"
        aria-live="polite"
        aria-atomic="true"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
          pointerEvents: 'none',
        }}
      >
        {liveAnnouncement}
      </Box>

      {/* Add-to-bag Snackbar with "View bag" action */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message={snackbarMessage}
        sx={{
          bottom: { xs: 84, md: 28 },
        }}
        action={
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              setSnackbarOpen(false);
              setIsBagOpen(true);
            }}
            sx={{
              fontWeight: 500,
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
              px: 1.5,
              py: 0.5,
            }}
          >
            View bag
          </Button>
        }
      />
    </BagContext.Provider>
  );
}

export function useBag(): BagContextValue {
  const ctx = useContext(BagContext);
  if (!ctx) {
    throw new Error('useBag must be used within a BagProvider');
  }
  return ctx;
}
