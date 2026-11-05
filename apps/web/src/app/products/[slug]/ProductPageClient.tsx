'use client';

import React from 'react';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
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
          Back to the shop
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 1, md: 2 } }}>
      <Box sx={{ mb: 2 }}>
        <Button
          component={Link}
          href="/#catalogue"
          variant="outlined"
          startIcon={<ArrowBackRoundedIcon fontSize="small" />}
          sx={{ minHeight: 44 }}
        >
          Back to collection
        </Button>
      </Box>
      <ProductDetailView key={product.id} product={product} />
    </Container>
  );
}
