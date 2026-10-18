'use client';

import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import { useStoreData } from '@/context/StoreDataContext';
import { filterProducts } from '@/services/store-service';
import { ProductTile } from './ProductTile';

export function ProductGrid() {
  const {
    publishedProducts,
    isHydrated,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
  } = useStoreData();

  const filteredProducts = useMemo(
    () =>
      filterProducts(publishedProducts, {
        category: activeCategory,
        searchQuery,
      }),
    [publishedProducts, activeCategory, searchQuery]
  );

  if (!isHydrated) {
    return (
      <Box
        aria-busy="true"
        aria-label="Loading products"
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, minmax(0, 1fr))',
            sm: 'repeat(3, minmax(0, 1fr))',
            lg: 'repeat(4, minmax(0, 1fr))',
          },
          gap: { xs: 2.5, sm: 3.5 },
          mt: 3,
        }}
      >
        {Array.from({ length: 7 }).map((_, idx) => (
          <Box
            key={idx}
            sx={{
              gridColumn: idx === 0 ? { xs: 'span 2', sm: 'span 2' } : 'span 1',
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{
                width: '100%',
                aspectRatio: idx === 0 ? '16 / 10' : '4 / 5',
                height: 'auto',
                mb: 1.5,
              }}
            />
            <Skeleton variant="text" width="65%" height={28} />
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
          py: 10,
          px: 2,
          textAlign: 'center',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          bgcolor: 'background.paper',
          mt: 3,
        }}
      >
        <Typography variant="body1" sx={{ mb: 2.5, mx: 'auto' }}>
          Nothing matches that search. Try shea, rose, oud or serum.
        </Typography>
        <Button
          variant="outlined"
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
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, minmax(0, 1fr))',
          sm: 'repeat(3, minmax(0, 1fr))',
          lg: 'repeat(4, minmax(0, 1fr))',
        },
        gap: { xs: 2.5, sm: 3.5 },
        mt: 3,
      }}
    >
      {filteredProducts.map((product, index) => (
        <ProductTile
          key={product.id}
          product={product}
          isFeaturedSpan={index === 0 && !searchQuery}
        />
      ))}
    </Box>
  );
}
