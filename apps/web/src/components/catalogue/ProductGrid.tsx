'use client';

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useStoreData } from '@/context/StoreDataContext';
import { filterProducts } from '@/services/store-service';
import { Product } from '@/types/domain';
import { ProductTile } from './ProductTile';

const GRID_COLUMNS = {
  xs: 'repeat(2, minmax(0, 1fr))',
  sm: 'repeat(3, minmax(0, 1fr))',
  lg: 'repeat(4, minmax(0, 1fr))',
};

interface ProductGridProps {
  /** Render these products instead of the store's category/search filter (category pages). */
  products?: Product[];
  /** Span the first tile across two columns (catalogue home view only). */
  featureFirst?: boolean;
}

export function ProductGrid({ products, featureFirst = true }: ProductGridProps) {
  const { publishedProducts, isHydrated, activeCategory, setActiveCategory, searchQuery, setSearchQuery } =
    useStoreData();

  const filteredProducts = useMemo(
    () => products ?? filterProducts(publishedProducts, { category: activeCategory, searchQuery }),
    [products, publishedProducts, activeCategory, searchQuery]
  );

  if (!isHydrated) {
    return (
      <Box
        aria-busy="true"
        aria-label="Loading products"
        sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: { xs: 1.5, sm: 2 }, mt: 3 }}
      >
        {Array.from({ length: 8 }).map((_, idx) => (
          <Box key={idx} sx={{ p: 1, borderRadius: '30px', bgcolor: 'background.paper' }}>
            <Skeleton variant="rectangular" sx={{ width: '100%', aspectRatio: '4 / 5', height: 'auto', mb: 1.5 }} />
            <Skeleton variant="text" width="65%" height={24} />
            <Skeleton variant="text" width="45%" height={20} />
          </Box>
        ))}
      </Box>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <Box
        data-testid="search-empty-state"
        sx={{
          mt: 3,
          py: { xs: 7, md: 10 },
          px: 3,
          textAlign: 'center',
          borderRadius: '32px',
          bgcolor: 'background.paper',
        }}
      >
        <Typography variant="body1" sx={{ mb: 2.5, mx: 'auto', fontWeight: 600 }}>
          Nothing matches that search. Try shea, rose, oud or serum.
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            setSearchQuery('');
            setActiveCategory('All');
          }}
        >
          See everything
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: GRID_COLUMNS, gap: { xs: 1.5, sm: 2 }, mt: 3 }}>
      {filteredProducts.map((product, index) => (
        <ProductTile
          key={product.id}
          product={product}
          isFeaturedSpan={featureFirst && !products && index === 0 && !searchQuery}
        />
      ))}
    </Box>
  );
}
