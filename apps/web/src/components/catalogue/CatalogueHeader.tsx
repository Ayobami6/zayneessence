'use client';

import React from 'react';
import Box from '@mui/material/Box';
import { AccentHeading } from '@/components/glow';
import { useStoreData } from '@/context/StoreDataContext';

export function CatalogueHeader() {
  const { publishedProducts } = useStoreData();
  const inStock = publishedProducts.filter((p) => p.variants.some((v) => v.stock > 0)).length;
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, mb: { xs: 2, md: 3 } }}>
      <AccentHeading id="catalogue-heading" component="h2" variant="h2" text="Formulations we’re" accent="proud of." />
      <Box sx={{ height: 34, px: 1.75, borderRadius: '999px', bgcolor: 'background.paper', display: 'inline-flex', alignItems: 'center', fontSize: 13, fontWeight: 600 }}>
        {inStock} {inStock === 1 ? 'piece' : 'pieces'} in stock
      </Box>
    </Box>
  );
}
