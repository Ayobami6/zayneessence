'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const TESTIMONIALS = [
  {
    quote:
      '“The Sérum Lumière completely cleared my stubborn hyperpigmentation without drying out my face. My skin has never felt this calm, hydrated or radiant.”',
    author: 'Dr. Amina B.',
    title: 'Consultant Dermatologist',
    location: 'Maitama, Abuja',
  },
  {
    quote:
      '“Oud Mubakhar is hands-down the most nuanced pure oud oil in my collection. Two drops on linen linger for days without sharpness. Extraordinary craftsmanship.”',
    author: 'Tunde E.',
    title: 'Fragrance Collector',
    location: 'Ikoyi, Lagos',
  },
  {
    quote:
      '“Crème Velours completely rescued my compromised moisture barrier. It melts immediately into melanin-rich skin with zero ashiness or stickiness. An essential.”',
    author: 'Folashade O.',
    title: 'Creative Director',
    location: 'London & Lagos',
  },
];

export function ClientWordsSection() {
  return (
    <Box
      component="section"
      aria-label="Client testimonials"
      sx={{
        py: { xs: 8, md: 12 },
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
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
            (Kind words)
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}
          >
            Client Impressions
          </Typography>
        </Box>

        <Typography
          variant="h2"
          sx={{
            fontFamily: 'var(--font-jost), "Jost", sans-serif',
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3.2rem' },
            fontWeight: 600,
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            color: 'text.primary',
            mb: { xs: 5, md: 7 },
            maxWidth: '32ch',
          }}
        >
          Clients say it better.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {TESTIMONIALS.map((t, idx) => (
            <Box
              key={idx}
              sx={{
                p: { xs: 3.5, md: 4 },
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.25s ease',
                '&:hover': {
                  borderColor: 'text.primary',
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'var(--font-jost), "Jost", sans-serif',
                  fontSize: { xs: '1.05rem', md: '1.15rem' },
                  lineHeight: 1.6,
                  color: 'text.primary',
                  mb: 4,
                }}
              >
                {t.quote}
              </Typography>

              <Box sx={{ borderTop: 1, borderColor: 'divider', pt: 2 }}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.96875rem', color: 'text.primary' }}>
                  {t.author}
                </Typography>
                <Typography sx={{ fontSize: '0.84375rem', color: 'text.secondary' }}>
                  {t.title} · {t.location}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
