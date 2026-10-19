'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const PILLARS = [
  {
    num: '01',
    title: 'Savanna Botanicals',
    desc: 'Wild-harvested unrefined northern shea, nutrient-dense moringa, and baobab seed oil cold-pressed in small agricultural cooperatives across Kaduna and Niger states.',
  },
  {
    num: '02',
    title: 'Aged Pure Oud',
    desc: 'Master-distilled Assam and Cambodian agarwood oils aged up to six years in dark pharmaceutical glass to develop complex balsamic, leather, and dark honey facets.',
  },
  {
    num: '03',
    title: 'Melanin-Centric Science',
    desc: 'Formulated specifically for melanin-rich skin barrier equilibrium: brightening post-inflammatory marks with active niacinamide and rich lipids with zero white cast.',
  },
  {
    num: '04',
    title: 'Studio Hand-Bottling',
    desc: 'Compounded and hand-poured in small batches at our Ikoyi and Maitama studios, preserved in recyclable ultraviolet violet glass bottles to safeguard active vitality.',
  },
];

export function BrandPhilosophySection() {
  return (
    <Box
      id="provenance"
      component="section"
      aria-label="Brand philosophy and provenance"
      sx={{
        py: { xs: 8, md: 13 },
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        {/* Parade-style parenthesis eyebrow */}
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
              fontSize: '0.9375rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'text.primary',
              opacity: 0.85,
            }}
          >
            (About zayneessence)
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
            Our Provenance &amp; Ethos
          </Typography>
        </Box>

        {/* Large Parade-style statement text */}
        <Typography
          variant="h2"
          sx={{
            fontFamily: 'var(--font-jost), "Jost", sans-serif',
            fontSize: { xs: '1.9rem', sm: '2.6rem', md: '3.4rem' },
            fontWeight: 600,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            color: 'text.primary',
            maxWidth: '38ch',
            mb: { xs: 6, md: 9 },
          }}
        >
          zayneessence is an independent luxury house born in Nigeria. We formulate for
          melanin-rich skin using wild savanna botanicals, alongside rare aged oud oils and fine attars.
        </Typography>

        {/* 4 Pillars Grid (Parade's "Four ways we help you stand out") */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {PILLARS.map((pillar) => (
            <Box
              key={pillar.num}
              sx={{
                p: { xs: 3.5, md: 4 },
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: { xs: 'auto', md: 270 },
                transition: 'border-color 0.3s ease, transform 0.25s ease',
                '&:hover': {
                  borderColor: 'text.primary',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-jost), "Jost", sans-serif',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'text.primary',
                  opacity: 0.8,
                  mb: 3,
                }}
              >
                {pillar.num}
              </Typography>

              <Box>
                <Typography
                  sx={{
                    fontFamily: 'var(--font-jost), "Jost", sans-serif',
                    fontSize: '1.35rem',
                    fontWeight: 600,
                    letterSpacing: '-0.015em',
                    color: 'text.primary',
                    mb: 1.25,
                  }}
                >
                  {pillar.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '1rem',
                    lineHeight: 1.62,
                  }}
                >
                  {pillar.desc}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
