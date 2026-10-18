'use client';

import React from 'react';
import { SEED_PRODUCTS } from '@/data/seed-catalogue';
import { useStoreData } from '@/context/StoreDataContext';
import { ProductDetailDialog } from '@/components/product/ProductDetailDialog';

export default function InterceptedProductModalPage({
  params,
}: {
  params: { slug: string };
}) {
  const { products } = useStoreData();
  const product =
    products.find((p) => p.slug === params.slug) ||
    SEED_PRODUCTS.find((p) => p.slug === params.slug);

  if (!product) {
    return null;
  }

  return <ProductDetailDialog product={product} />;
}
