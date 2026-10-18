'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_STORE_SETTINGS, SEED_PRODUCTS } from '@/data/seed-catalogue';
import {
  CategoryFilter,
  OrderRecord,
  OrderStatus,
  Product,
  StoreSettings,
} from '@/types/domain';
import {
  loadOrdersFromStore,
  loadProductsFromStore,
  loadSettingsFromStore,
  saveOrdersToStore,
  saveProductsToStore,
  saveSettingsToStore,
} from '@/services/store-service';
import { createOrderNotifications } from '@/services/notification-service';

interface StoreDataContextValue {
  products: Product[];
  publishedProducts: Product[];
  isHydrated: boolean;
  activeCategory: CategoryFilter;
  setActiveCategory: (category: CategoryFilter) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  settings: StoreSettings;
  updateSettings: (next: StoreSettings) => void;
  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  upsertProduct: (product: Product) => void;
  resetCatalogueToSeed: () => void;
}

const StoreDataContext = createContext<StoreDataContextValue | undefined>(undefined);

export function StoreDataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(SEED_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    setProducts(loadProductsFromStore());
    setSettings(loadSettingsFromStore());
    setOrders(loadOrdersFromStore());
    setIsHydrated(true);
  }, []);

  const publishedProducts = useMemo(
    () =>
      products
        .filter((p) => p.is_published)
        .sort((a, b) => a.sort_order - b.sort_order),
    [products]
  );

  const updateSettings = (next: StoreSettings) => {
    setSettings(next);
    saveSettingsToStore(next);
  };

  const addOrder = (order: OrderRecord) => {
    // Decrement variant stock when an order is placed
    const nextProducts = products.map((product) => {
      const matchingItems = order.items.filter((item) => item.productId === product.id);
      if (matchingItems.length === 0) return product;
      return {
        ...product,
        variants: product.variants.map((variant) => {
          const orderedItem = matchingItems.find((item) => item.variantId === variant.id);
          if (!orderedItem) return variant;
          return {
            ...variant,
            stock: Math.max(0, variant.stock - orderedItem.quantity),
          };
        }),
      };
    });

    setProducts(nextProducts);
    saveProductsToStore(nextProducts);

    const nextOrders = [order, ...orders];
    setOrders(nextOrders);
    saveOrdersToStore(nextOrders);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const nextOrders = orders.map((order) => {
      if (order.id !== orderId) return order;
      const newLogs = createOrderNotifications(
        order,
        status,
        settings.whatsappUpdatesEnabled
      );
      return {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
        notifications: [...newLogs, ...order.notifications],
      };
    });
    setOrders(nextOrders);
    saveOrdersToStore(nextOrders);
  };

  const upsertProduct = (updatedProduct: Product) => {
    const exists = products.some((p) => p.id === updatedProduct.id);
    const nextProducts = exists
      ? products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      : [...products, updatedProduct];
    setProducts(nextProducts);
    saveProductsToStore(nextProducts);
  };

  const resetCatalogueToSeed = () => {
    setProducts(SEED_PRODUCTS);
    saveProductsToStore(SEED_PRODUCTS);
  };

  const value = useMemo(
    () => ({
      products,
      publishedProducts,
      isHydrated,
      activeCategory,
      setActiveCategory,
      searchQuery,
      setSearchQuery,
      isSearchOpen,
      setIsSearchOpen,
      settings,
      updateSettings,
      orders,
      addOrder,
      updateOrderStatus,
      upsertProduct,
      resetCatalogueToSeed,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      products,
      publishedProducts,
      isHydrated,
      activeCategory,
      searchQuery,
      isSearchOpen,
      settings,
      orders,
    ]
  );

  return (
    <StoreDataContext.Provider value={value}>{children}</StoreDataContext.Provider>
  );
}

export function useStoreData(): StoreDataContextValue {
  const ctx = useContext(StoreDataContext);
  if (!ctx) {
    throw new Error('useStoreData must be used within a StoreDataProvider');
  }
  return ctx;
}
