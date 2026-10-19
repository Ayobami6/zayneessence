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

  const handleExploreOud = () => {
    setSearchQuery('');
    setActiveCategory('Oud');
    const el = document.getElementById('catalogue');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box
      component="section"
      aria-label="Featured introduction"
      sx={{
        pt: { xs: 4, md: 6 },
        pb: { xs: 7, md: 11 },
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Parade-style top eyebrow row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 4, md: 6 },
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'text.primary',
              opacity: 0.85,
            }}
          >
            (Melanin-rich skincare &amp; pure aged oud)
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'text.primary',
              opacity: 0.85,
            }}
          >
            Lagos &amp; Abuja — Est. 2026
          </Typography>
        </Box>

        {/* Hero asymmetric grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
            alignItems: 'center',
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* Left Column: Stacked monumental typography & CTAs */}
          <Box>
            <Typography
              component="h1"
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: 'clamp(58px, 9vw, 116px)',
                fontWeight: 700,
                lineHeight: 0.92,
                letterSpacing: '-0.045em',
                color: 'text.primary',
                mb: 3.5,
                animation: 'heroHeadlineSettle 1.2s cubic-bezier(0.2, 0.7, 0.2, 1) both',
              }}
            >
              Skin that
              <br />
              glows,
              <br />
              quietly.
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                opacity: 0.88,
                fontSize: { xs: '1.15rem', md: '1.28rem' },
                lineHeight: 1.65,
                mb: 4.5,
                maxWidth: '48ch',
              }}
            >
              Skincare formulated with unrefined northern Nigerian shea, cold-pressed baobab
              and moringa for melanin-rich skin, alongside pure aged oud oils and fine perfume.
            </Typography>

            {/* Parade-style pill action cluster */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleShopSkincare}
                data-testid="hero-shop-skincare-btn"
                sx={{
                  px: 4,
                  py: 1.6,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                }}
              >
                Shop skincare
              </Button>

              <Button
                variant="outlined"
                onClick={handleExploreOud}
                sx={{
                  px: 4,
                  py: 1.6,
                  fontSize: '1.05rem',
                  fontWeight: 600,
                }}
              >
                Explore pure oud
              </Button>

              <Typography
                component={Link}
                href="/#rituals"
                sx={{
                  color: 'text.primary',
                  fontSize: '1.05rem',
                  fontWeight: 600,
                  textDecoration: 'underline',
                  textUnderlineOffset: '5px',
                  ml: { xs: 0, sm: 1 },
                  '&:hover': {
                    color: 'text.secondary',
                  },
                }}
              >
                View 4-step ritual →
              </Typography>
            </Box>
          </Box>

          {/* Right Column: Featured skincare showcase in signature arched window */}
          {heroProduct && primaryImage && (
            <Box
              sx={{
                maxWidth: { xs: 440, md: 520 },
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
                    sizes="(max-width: 900px) 90vw, 520px"
                    style={{ objectFit: 'cover' }}
                  />
                </ArchedWindow>

                {/* Metadata caption card */}
                <Box
                  sx={{
                    mt: 2.5,
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: 2,
                    px: 0.5,
                  }}
                >
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography
                        sx={{
                          fontSize: '0.84375rem',
                          fontWeight: 600,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          color: 'text.primary',
                          opacity: 0.8,
                        }}
                      >
                        2026 Signature formulation
                      </Typography>
                    </Box>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-italiana), "Italiana", serif',
                        fontSize: '1.75rem',
                        fontWeight: 400,
                        WebkitTextStroke: '0.25px currentColor',
                        color: 'text.primary',
                        lineHeight: 1.15,
                      }}
                    >
                      {heroProduct.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', fontSize: '1rem', fontWeight: 500 }}
                    >
                      {heroProduct.type} · {heroProduct.variants[0]?.label}
                    </Typography>
                  </Box>

                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-jost), "Jost", sans-serif',
                        fontWeight: 700,
                        fontSize: '1.35rem',
                        color: 'text.primary',
                      }}
                    >
                      {formatKoboToNgn(startingPrice)}
                    </Typography>
                    <Typography sx={{ fontSize: '0.84375rem', color: 'text.secondary', fontWeight: 500 }}>
                      Free delivery eligible
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}
