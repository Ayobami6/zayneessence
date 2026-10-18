'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { Product } from '@/types/domain';
import { useStoreData } from '@/context/StoreDataContext';
import { ProductDetailView } from '@/components/product/ProductDetailView';

export function ProductPageClient({
  slug,
  fallbackProduct,
}: {
  slug: string;
  fallbackProduct?: Product;
}) {
  const { products } = useStoreData();
  const product = products.find((p) => p.slug === slug) || fallbackProduct;

  if (!product) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          That piece could not be found.
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, mx: 'auto' }}>
          It may have been retired from our studio collection. Explore our current
          skincare, pure oud oils and perfume instead.
        </Typography>
        <Button component={Link} href="/" variant="contained" color="primary">
          Shop skincare
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 1 }}>
        <Button
          component={Link}
          href="/#catalogue"
          color="inherit"
          startIcon={<ArrowBackOutlinedIcon fontSize="small" />}
          sx={{ px: 1.5, py: 0.75, color: 'text.secondary' }}
        >
          Back to collection
        </Button>
      </Box>
      <ProductDetailView product={product} />
    </Container>
  );
}
