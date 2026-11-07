'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { InfoPanel, PhotoTile, SectionHeader } from '@/components/glow';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

const FOR_YOU_SLUGS = ['huile-visage', 'serum-lumiere', 'oud-mubakhar', 'musc-soie', 'creme-velours'];

/** Mobile-only "For your ritual" carousel with snap-scrolling photo cards. */
export function ForYouCarousel() {
  const { publishedProducts } = useStoreData();
  const items = useMemo(
    () => FOR_YOU_SLUGS.map((slug) => publishedProducts.find((p) => p.slug === slug)).filter(Boolean),
    [publishedProducts]
  );

  if (items.length === 0) return null;

  return (
    <Box component="section" aria-labelledby="for-you-heading" sx={{ display: { xs: 'block', md: 'none' }, pb: 3 }}>
      <Container maxWidth="lg">
        <SectionHeader id="for-you-heading" title="For your ritual" actionLabel="View all" actionHref="/#catalogue" />
      </Container>
      <Box
        sx={{
          mt: 1.75,
          display: 'flex',
          gap: 1.75,
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          px: 2,
          pb: 1,
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {items.map((product) => {
          if (!product) return null;
          const image = product.images[0];
          const variant = product.variants[0];
          return (
            <Box
              key={product.id}
              component={Link}
              href={`/products/${product.slug}`}
              sx={{ flex: '0 0 236px', scrollSnapAlign: 'center', textDecoration: 'none', color: 'text.primary' }}
            >
              <PhotoTile src={image.url} alt={image.alt} height={300} radius="32px" badge sizes="240px">
                <InfoPanel>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {product.type}
                  </Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700 }} noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="price">
                    {product.variants.length > 1 ? 'From ' : ''}
                    {formatKoboToNgn(variant?.price_kobo ?? 0)}
                  </Typography>
                </InfoPanel>
              </PhotoTile>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
