'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';

const LOCAL_WISHLIST_KEY = 'zayneessence_wishlist_guest_v1';

interface WishlistContextValue {
  savedIds: string[];
  isSaved: (productId: string) => boolean;
  toggleSaved: (productId: string) => void;
  clearSaved: () => void;
  isSyncedToAccount: boolean;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const storageKey = session ? `zayneessence_wishlist_${session.id}` : LOCAL_WISHLIST_KEY;

  useEffect(() => {
    try {
      const guestRaw = window.localStorage.getItem(LOCAL_WISHLIST_KEY);
      const guestItems: string[] = guestRaw ? JSON.parse(guestRaw) : [];

      if (session) {
        const userRaw = window.localStorage.getItem(storageKey);
        const userItems: string[] = userRaw ? JSON.parse(userRaw) : [];
        // Merge guest saved items into account wishlist on sign-in
        const merged = Array.from(new Set([...userItems, ...guestItems]));
        setSavedIds(merged);
        window.localStorage.setItem(storageKey, JSON.stringify(merged));
      } else {
        setSavedIds(guestItems);
      }
    } catch {
      setSavedIds([]);
    }
  }, [session, storageKey]);

  const toggleSaved = (productId: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
        if (session) {
          window.localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(next));
        }
      }
      return next;
    });
  };

  const clearSaved = () => {
    setSavedIds([]);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(storageKey);
    }
  };

  const isSaved = (productId: string) => savedIds.includes(productId);

  const value = useMemo(
    () => ({
      savedIds,
      isSaved,
      toggleSaved,
      clearSaved,
      isSyncedToAccount: Boolean(session),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedIds, session]
  );

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return ctx;
}
