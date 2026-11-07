import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { HeroSection } from '@/components/catalogue/HeroSection';
import { StudioMetricsSection } from '@/components/catalogue/StudioMetricsSection';
import { ForYouCarousel } from '@/components/catalogue/ForYouCarousel';
import { CatalogueHeader } from '@/components/catalogue/CatalogueHeader';
import { CategoryChips } from '@/components/catalogue/CategoryChips';
import { ConcernAndIngredientBar } from '@/components/catalogue/ConcernAndIngredientBar';
import { ProductGrid } from '@/components/catalogue/ProductGrid';
import { CategorySpotlight } from '@/components/catalogue/CategorySpotlight';
import { ConsultationBand } from '@/components/catalogue/ConsultationBand';
import { RitualProcessSection } from '@/components/catalogue/RitualProcessSection';
import { ClientWordsSection } from '@/components/catalogue/ClientWordsSection';
import { StudioJournalSection } from '@/components/catalogue/StudioJournalSection';

export default function HomePage() {
  return (
    <Box>
      <HeroSection />
      <ForYouCarousel />
      <StudioMetricsSection />

      <Box id="catalogue" component="section" aria-labelledby="catalogue-heading" sx={{ py: { xs: 3, md: 6 }, scrollMarginTop: 96 }}>
        <Container maxWidth="lg">
          <CatalogueHeader />
          <CategoryChips />
          <ConcernAndIngredientBar />
          <ProductGrid />
        </Container>
      </Box>

      <CategorySpotlight />
      <ConsultationBand />
      <RitualProcessSection />
      <ClientWordsSection />
      <StudioJournalSection />
    </Box>
  );
}
