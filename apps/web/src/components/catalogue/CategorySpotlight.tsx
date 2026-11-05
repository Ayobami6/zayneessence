'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import { AccentHeading, PhotoTile } from '@/components/glow';
import { useStoreData } from '@/context/StoreDataContext';
import { CATEGORY_META, ProductCategory } from '@/types/domain';

const SPOTLIGHTS: Array<{
  category: ProductCategory;
  lead: string;
  accent: string;
  image: string;
  alt: string;
}> = [
  {
    category: 'Bakhoor',
    lead: 'Bakhoor &',
    accent: 'turaren wuta',
    image: '/products/bakhoor-malaki/1.jpg',
    alt: 'Bronze burner with glowing bakhoor chips and rising smoke',
  },
  {
    category: 'Supplements',
    lead: 'Daily',
    accent: 'supplements',
    image: '/products/moringa-pure/1.jpg',
    alt: 'Bowl of bright green moringa powder on a blush pink surface',
  },
];

/** Large cards that introduce the Bakhoor and Supplements categories. */
export function CategorySpotlight() {
  const { publishedProducts } = useStoreData();

  return (
    <Box component="section" aria-label="New in the studio" sx={{ py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' }, gap: 2 }}>
          {SPOTLIGHTS.map((spot) => {
            const meta = CATEGORY_META[spot.category];
            const count = publishedProducts.filter((p) => p.category === spot.category).length;
            return (
              <Box
                key={spot.category}
                component={Link}
                href={`/shop/${meta.slug}`}
                data-testid={`spotlight-${meta.slug}`}
                sx={{ display: 'block', textDecoration: 'none', color: 'text.primary', '&:hover img': { transform: 'scale(1.03)' }, '& img': { transition: 'transform 0.7s ease' } }}
              >
                <PhotoTile src={spot.image} alt={spot.alt} height={{ xs: 380, md: 440 }} radius={{ xs: '32px', md: '40px' }} sizes="(max-width: 900px) 92vw, 640px">
                  <Box
                    sx={{
                      position: 'absolute',
                      left: { xs: 10, md: 16 },
                      right: { xs: 10, md: 16 },
                      bottom: { xs: 10, md: 16 },
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: 2,
                      p: { xs: 2, md: 3 },
                      borderRadius: '28px',
                      bgcolor: 'glow.scrim',
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="eyebrow" component="p">
                        New category · {count} {count === 1 ? 'piece' : 'pieces'}
                      </Typography>
                      <AccentHeading component="h3" variant="h2" text={spot.lead} accent={spot.accent} sx={{ fontSize: { xs: 24, md: 30 }, mt: 0.5 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 380 }}>
                        {meta.intro}
                      </Typography>
                    </Box>
                    <Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center' }}>
                      <NorthEastRoundedIcon />
                    </Box>
                  </Box>
                </PhotoTile>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
