'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

const RITUAL_STEPS = [
  {
    step: 'Step 01',
    role: 'Prepare & Clarify',
    slug: 'serum-lumiere',
    name: 'Sérum Lumière',
    type: 'Brightening face serum',
    size: '30 ml',
    priceKobo: 8500000,
    desc: 'Stabilized niacinamide, vitamin C and moringa leaf extract formulated to smooth texture and brighten hyperpigmentation without barrier compromise.',
    image: '/products/serum-lumiere/1.svg',
  },
  {
    step: 'Step 02',
    role: 'Nourish & Veil',
    slug: 'huile-visage',
    name: 'Huile Visage',
    type: 'Nourishing face oil',
    size: '30 ml',
    priceKobo: 7500000,
    desc: 'Cold-pressed northern baobab and nutrient-dense savanna moringa oils that absorb instantly to seal in moisture and prevent trans-epidermal water loss.',
    image: '/products/huile-visage/1.svg',
  },
  {
    step: 'Step 03',
    role: 'Seal & Restore',
    slug: 'creme-velours',
    name: 'Crème Velours',
    type: 'Rich night cream',
    size: '50 ml',
    priceKobo: 11000000,
    desc: 'Unrefined northern shea butter paired with plant ceramides that melt on melanin-rich skin to calm irritation and lock in overnight hydration.',
    image: '/products/creme-velours/1.svg',
  },
  {
    step: 'Step 04',
    role: 'Scent & Anchor',
    slug: 'oud-mubakhar',
    name: 'Oud Mubakhar',
    type: 'Pure aged oud oil',
    size: '3 ml',
    priceKobo: 9500000,
    desc: 'Distilled pure Assam agarwood aged six years in dark glass. Dabbed on pulse points to project a tranquil, intimate sillage throughout the day.',
    image: '/products/oud-mubakhar/1.svg',
  },
];

export function RitualProcessSection() {
  const { publishedProducts } = useStoreData();
  const { addToBag } = useBag();
  const [ritualAdded, setRitualAdded] = useState(false);

  const totalRitualKobo = RITUAL_STEPS.reduce((sum, s) => sum + s.priceKobo, 0);

  const handleAddFullRitual = () => {
    RITUAL_STEPS.forEach((step) => {
      const product = publishedProducts.find((p) => p.slug === step.slug);
      if (product && product.variants[0]) {
        addToBag(product, product.variants[0], 1);
      }
    });
    setRitualAdded(true);
    setTimeout(() => setRitualAdded(false), 2400);
  };

  return (
    <Box
      id="rituals"
      component="section"
      aria-label="Daily ritual sequence"
      sx={{
        py: { xs: 8, md: 13 },
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Eyebrow */}
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
            (The Daily Ritual)
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}
          >
            Four Steps · Morning &amp; Night
          </Typography>
        </Box>

        {/* Section title & Add-all button header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 3,
            mb: { xs: 5, md: 7 },
          }}
        >
          <Box sx={{ maxWidth: '44ch' }}>
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
              A simple ritual, obsessively run.
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Four complementary steps to balance, nourish and lock in skin vitality, anchored by artisanal pure aged oud.
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddFullRitual}
            sx={{
              px: 3.5,
              py: 1.5,
              fontSize: '1rem',
              flexShrink: 0,
            }}
          >
            {ritualAdded
              ? '✓ 4-Piece ritual added to bag'
              : `Add complete ritual · ${formatKoboToNgn(totalRitualKobo)}`}
          </Button>
        </Box>

        {/* 4 Steps timeline grid (Parade's "Week 1 Discover / Weeks 2–3 Define" timeline) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: { xs: 3, md: 3.5 },
          }}
        >
          {RITUAL_STEPS.map((step) => {
            const product = publishedProducts.find((p) => p.slug === step.slug);
            const variant = product?.variants[0];

            return (
              <Box
                key={step.step}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 3,
                  borderRadius: 2,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  transition: 'border-color 0.25s ease, transform 0.25s ease',
                  '&:hover': {
                    borderColor: 'text.primary',
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box>
                  {/* Step label & Role tag */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      mb: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      pb: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        letterSpacing: '0.04em',
                        color: 'text.secondary',
                        textTransform: 'uppercase',
                      }}
                    >
                      {step.step}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                    >
                      {step.role}
                    </Typography>
                  </Box>

                  {/* Thumbnail */}
                  <Box
                    component={Link}
                    href={`/products/${step.slug}`}
                    sx={(t) => ({
                      display: 'block',
                      position: 'relative',
                      aspectRatio: '1 / 1',
                      borderRadius: 1.5,
                      bgcolor: t.palette.zayne.productTile,
                      overflow: 'hidden',
                      mb: 2.5,
                    })}
                  >
                    <Image
                      src={step.image}
                      alt={step.name}
                      fill
                      sizes="(max-width: 600px) 90vw, 280px"
                      style={{ objectFit: 'cover' }}
                    />
                  </Box>

                  <Typography
                    component={Link}
                    href={`/products/${step.slug}`}
                    sx={{
                      display: 'block',
                      fontFamily: 'var(--font-italiana), "Italiana", serif',
                      fontSize: '1.4rem',
                      fontWeight: 400,
                      color: 'text.primary',
                      textDecoration: 'none',
                      mb: 0.5,
                    }}
                  >
                    {step.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      mb: 1.5,
                    }}
                  >
                    {step.type} · {step.size}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontSize: '0.875rem',
                      lineHeight: 1.55,
                      mb: 2.5,
                    }}
                  >
                    {step.desc}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography sx={{ fontWeight: 600, fontSize: '0.96875rem' }}>
                    {formatKoboToNgn(step.priceKobo)}
                  </Typography>

                  {product && variant && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => addToBag(product, variant, 1)}
                      sx={{ py: 0.6, px: 2, fontSize: '0.8125rem' }}
                    >
                      Add to bag
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
