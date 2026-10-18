import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { HeroSection } from '@/components/catalogue/HeroSection';
import { CategoryChips } from '@/components/catalogue/CategoryChips';
import { ProductGrid } from '@/components/catalogue/ProductGrid';

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <Box
        id="catalogue"
        component="section"
        aria-label="Product catalogue"
        sx={{ pt: { xs: 4, md: 6 } }}
      >
        <Container maxWidth="lg">
          <CategoryChips />
          <ProductGrid />
        </Container>
      </Box>
    </Box>
  );
}
