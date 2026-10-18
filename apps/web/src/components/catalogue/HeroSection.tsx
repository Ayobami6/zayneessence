'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { ArchedWindow } from '@/components/ui/ArchedWindow';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

export function HeroSection() {
  const { publishedProducts, setActiveCategory, setSearchQuery } = useStoreData();

  const heroProduct =
    publishedProducts.find((p) => p.slug === 'serum-lumiere') ||
    publishedProducts.find((p) => p.category === 'Skincare') ||
    publishedProducts[0];

  const primaryImage = heroProduct?.images[0];
  const startingPrice = heroProduct?.variants[0]?.price_kobo ?? 8500000;

  const handleShopSkincare = () => {
    setSearchQuery('');
    setActiveCategory('Skincare');
    const el = document.getElementById('catalogue');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSeeEverything = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setSearchQuery('');
    setActiveCategory('All');
    const el = document.getElementById('catalogue');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      component="section"
      aria-label="Featured skincare introduction"
      sx={{
        pt: { xs: 4, md: 7 },
        pb: { xs: 6, md: 10 },
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.15fr 0.85fr' },
            alignItems: 'center',
            gap: { xs: 5, md: 8 },
          }}
        >
          {/* Left column: Headline, subline, CTA button & link */}
          <Box>
            <Typography
              variant="h1"
              sx={{
                mb: 3,
                animation:
                  'heroHeadlineSettle 1.35s cubic-bezier(0.2, 0.7, 0.2, 1) both',
              }}
            >
              Skin that glows, quietly
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                opacity: 0.88,
                fontSize: { xs: '1.125rem', md: '1.22rem' },
                fontWeight: 400,
                mb: 4,
                maxWidth: '52ch',
              }}
            >
              Skincare made with Nigerian shea, baobab and moringa for melanin-rich
              skin, alongside pure oud oils and perfume.
            </Typography>

            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 3,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleShopSkincare}
                data-testid="hero-shop-skincare-btn"
              >
                Shop skincare
              </Button>

              <Typography
                component="a"
                href="#catalogue"
                onClick={handleSeeEverything}
                data-testid="hero-see-everything-link"
                sx={{
                  color: 'text.primary',
                  fontSize: '1.03125rem',
                  fontWeight: 500,
                  textDecoration: 'underline',
                  textUnderlineOffset: '5px',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'text.secondary',
                  },
                }}
              >
                See everything
              </Typography>
            </Box>
          </Box>

          {/* Right column: Featured skincare product in the signature arched window */}
          {heroProduct && primaryImage && (
            <Box
              sx={{
                maxWidth: { xs: 440, md: 540 },
                width: '100%',
                ml: 'auto',
                mr: { xs: 'auto', md: 0 },
              }}
            >
              <Box
                component={Link}
                href={`/products/${heroProduct.slug}`}
                aria-label={`Explore ${heroProduct.name}, ${heroProduct.type}`}
                sx={{
                  display: 'block',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <ArchedWindow enableLightSweep animateRiseOnLoad>
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt}
                    fill
                    priority
                    fetchPriority="high"
                    placeholder="blur"
                    blurDataURL={primaryImage.blurDataURL}
                    sizes="(max-width: 900px) 90vw, 540px"
                    style={{ objectFit: 'cover' }}
                  />
                </ArchedWindow>

                <Box
                  sx={{
                    mt: 2.25,
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: 0.5,
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
                        fontSize: '1.55rem',
                        WebkitTextStroke: '0.22px currentColor',
                        color: 'text.primary',
                      }}
                    >
                      {heroProduct.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontSize: '0.96875rem', fontWeight: 400 }}
                    >
                      {heroProduct.type} · {heroProduct.variants[0]?.label}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
                    {formatKoboToNgn(startingPrice)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
