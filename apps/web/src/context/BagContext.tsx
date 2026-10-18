'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { CartItem, Product, ProductVariant } from '@/types/domain';
import { useStoreData } from './StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

const BAG_STORAGE_KEY = 'zayneessence_bag_v1';

interface BagContextValue {
  items: CartItem[];
  totalCount: number;
  subtotalKobo: number;
  remainingForFreeDeliveryKobo: number;
  hasUnlockedFreeDelivery: boolean;
  freeDeliveryProgressPercent: number;
  isBagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
  addToBag: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  clearBag: () => void;
  badgeBumpKey: number;
  liveAnnouncement: string;
}

const BagContext = createContext<BagContextValue | undefined>(undefined);

export function BagProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useStoreData();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isBagOpen, setIsBagOpen] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [badgeBumpKey, setBadgeBumpKey] = useState<number>(0);
  const [liveAnnouncement, setLiveAnnouncement] = useState<string>('');

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
  }, []);

  const persistBag = (next: CartItem[]) => {
    setItems(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(next));
    }
  };

  const addToBag = (product: Product, variant: ProductVariant, quantity = 1) => {
    const itemId = `${product.id}__${variant.id}`;
    const primaryImage = product.images[0];

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      const next = existing
        ? prev.map((item) =>
            item.id === itemId
              ? { ...item, quantity: item.quantity + quantity }
              : item
          )
        : [
            ...prev,
            {
              id: itemId,
              productId: product.id,
              variantId: variant.id,
              slug: product.slug,
              name: product.name,
              type: product.type,
              sizeLabel: variant.label,
              priceKobo: variant.price_kobo,
              quantity,
              thumbnailUrl: primaryImage?.url || '/products/serum-lumiere/1.svg',
              thumbnailAlt: primaryImage?.alt || product.name,
            },
          ];

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify(next));
      }
      return next;
    });

    setBadgeBumpKey((k) => k + 1);
    setSnackbarOpen(true);
    setLiveAnnouncement(
      `Added ${quantity} ${product.name} (${variant.label}) to bag. Price ${formatKoboToNgn(
        variant.price_kobo * quantity
      )}.`
    );
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    const next = items.map((item) =>
      item.id === itemId ? { ...item, quantity } : item
    );
    persistBag(next);
    const updatedItem = next.find((i) => i.id === itemId);
    if (updatedItem) {
      setLiveAnnouncement(
        `Updated ${updatedItem.name} (${updatedItem.sizeLabel}) quantity to ${quantity}.`
      );
    }
  };

  const removeItem = (itemId: string) => {
    const removed = items.find((i) => i.id === itemId);
    const next = items.filter((item) => item.id !== itemId);
    persistBag(next);
    if (removed) {
      setLiveAnnouncement(`Removed ${removed.name} from bag.`);
    }
  };

  const clearBag = () => {
    persistBag([]);
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

  const remainingForFreeDeliveryKobo = Math.max(
    0,
    settings.freeDeliveryThresholdKobo - subtotalKobo
  );

  const hasUnlockedFreeDelivery =
    subtotalKobo >= settings.freeDeliveryThresholdKobo && subtotalKobo > 0;

  const freeDeliveryProgressPercent = Math.min(
    100,
    Math.round((subtotalKobo / settings.freeDeliveryThresholdKobo) * 100)
  );

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
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
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
        message="Added to bag"
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
