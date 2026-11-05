import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CATEGORY_META, PRODUCT_CATEGORIES, categoryFromSlug } from '@/types/domain';
import { CategoryPageClient } from '@/components/catalogue/CategoryPageClient';

interface CategoryPageProps {
  params: { category: string };
}

export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCT_CATEGORIES.map((category) => ({ category: CATEGORY_META[category].slug }));
}

export function generateMetadata({ params }: CategoryPageProps): Metadata {
  const category = categoryFromSlug(params.category);
  if (!category) return { title: 'Collection not found' };
  const meta = CATEGORY_META[category];
  return {
    title: meta.label,
    description: meta.intro,
    openGraph: { title: `${meta.label} · zayneessence`, description: meta.intro },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = categoryFromSlug(params.category);
  if (!category) notFound();
  return <CategoryPageClient category={category} />;
}
