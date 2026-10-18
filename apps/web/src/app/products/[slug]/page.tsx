import React from 'react';
import type { Metadata } from 'next';
import { SEED_PRODUCTS } from '@/data/seed-catalogue';
import { ProductJsonLd } from '@/components/product/ProductJsonLd';
import { ProductPageClient } from './ProductPageClient';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return SEED_PRODUCTS.map((product) => ({
    slug: product.slug,
  }));
}

export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = SEED_PRODUCTS.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: 'Piece not found',
    };
  }

  const primaryImage = product.images[0];

  return {
    title: `${product.name} — ${product.type}`,
    description: product.description,
    openGraph: {
      title: `${product.name} · zayneessence`,
      description: product.description,
      type: 'website',
      images: primaryImage
        ? [
            {
              url: primaryImage.url,
              width: 1600,
              height: 2000,
              alt: primaryImage.alt,
            },
          ]
        : [],
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const seedProduct = SEED_PRODUCTS.find((p) => p.slug === params.slug);

  return (
    <>
      {seedProduct && <ProductJsonLd product={seedProduct} />}
      <ProductPageClient slug={params.slug} fallbackProduct={seedProduct} />
    </>
  );
}
