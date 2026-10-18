import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { HeroSection } from '@/components/catalogue/HeroSection';
import { ParadeTicker } from '@/components/ui/ParadeTicker';
import { StudioMetricsSection } from '@/components/catalogue/StudioMetricsSection';
import { CategoryChips } from '@/components/catalogue/CategoryChips';
import { ConcernAndIngredientBar } from '@/components/catalogue/ConcernAndIngredientBar';
import { ProductGrid } from '@/components/catalogue/ProductGrid';
import { BrandPhilosophySection } from '@/components/catalogue/BrandPhilosophySection';
import { RitualProcessSection } from '@/components/catalogue/RitualProcessSection';
import { ClientWordsSection } from '@/components/catalogue/ClientWordsSection';
import { StudioJournalSection } from '@/components/catalogue/StudioJournalSection';

export default function HomePage() {
  return (
    <Box>
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Continuous Scrolling Provenance Ticker */}
      <ParadeTicker />

      {/* 3. Studio Proof Benchmarks */}
      <StudioMetricsSection />

      {/* 4. Catalogue Collection */}
      <Box
        id="catalogue"
        component="section"
        aria-label="Product catalogue"
        sx={{ py: { xs: 7, md: 11 } }}
      >
        <Container maxWidth="lg">
          {/* Parade-style Parenthesis Eyebrow */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 4,
              borderBottom: 1,
              borderColor: 'divider',
              pb: 2,
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'text.secondary',
              }}
            >
              (Catalogue collection)
            </Typography>
            <Typography
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '0.875rem',
                color: 'text.secondary',
              }}
            >
              12 Formulations · In Stock
            </Typography>
          </Box>

          <Box sx={{ mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
                fontWeight: 600,
                letterSpacing: '-0.03em',
                lineHeight: 1.05,
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              Formulations we’re proud of.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '48ch' }}>
              Skincare formulated for melanin-rich skin with unrefined northern shea, baobab and moringa, alongside pure aged oud oils and perfume.
            </Typography>
          </Box>

          <CategoryChips />
          <ConcernAndIngredientBar />
          <ProductGrid />
        </Container>
      </Box>

      {/* 5. Brand Philosophy & Savanna Provenance (About zayneessence) */}
      <BrandPhilosophySection />

      {/* 6. The 4-Step Daily Ritual (Parade Process Timeline) */}
      <RitualProcessSection />

      {/* 7. Client Impressions (Kind Words) */}
      <ClientWordsSection />

      {/* 8. Studio Journal Notes */}
      <StudioJournalSection />
    </Box>
  );
}
