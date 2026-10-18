import React from 'react';
import { Product } from '@/types/domain';
import { koboToNaira } from '@/utils/currency';

export function ProductJsonLd({ product }: { product: Product }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://zayneessence.com';
  const lowestVariant = product.variants[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    category: product.category,
    image: product.images.map((img) =>
      img.url.startsWith('http') ? img.url : `${siteUrl}${img.url}`
    ),
    brand: {
      '@type': 'Brand',
      name: 'zayneessence',
    },
    offers: product.variants.map((variant) => ({
      '@type': 'Offer',
      sku: variant.sku,
      name: `${product.name} (${variant.label})`,
      priceCurrency: 'NGN',
      price: koboToNaira(variant.price_kobo),
      availability:
        variant.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${siteUrl}/products/${product.slug}`,
    })),
    ...(lowestVariant
      ? {
          sku: lowestVariant.sku,
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
