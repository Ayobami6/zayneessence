'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TICKER_ITEMS = [
  'Unrefined Northern Nigerian Shea',
  'Cold-Pressed Savanna Baobab & Moringa',
  'Pure Aged Assam Agarwood Oils',
  'Formulated for Melanin-Rich Skin',
  'Hand-Bottled in Dark Violet Glass',
  'Ikoyi & Maitama Compounding Studios',
  'Complimentary Delivery Nationwide over ₦150,000',
  'Zero White Cast, Sulfates or Synthetic Fillers',
];

export function ParadeTicker() {
  const content = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        pr: 4,
        whiteSpace: 'nowrap',
      }}
    >
      {TICKER_ITEMS.map((item, idx) => (
        <React.Fragment key={idx}>
          <Typography
            component="span"
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'text.primary',
              opacity: 0.95,
            }}
          >
            {item}
          </Typography>
          <Typography
            component="span"
            sx={{
              color: 'text.secondary',
              opacity: 0.7,
              fontSize: '0.9rem',
            }}
          >
            ✦
          </Typography>
        </React.Fragment>
      ))}
    </Box>
  );

  return (
    <Box
      component="aside"
      aria-label="Artisanal provenance marquee"
      sx={{
        py: 1.75,
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        overflow: 'hidden',
        position: 'relative',
        userSelect: 'none',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: 'max-content',
          animation: 'paradeMarquee 34s linear infinite',
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {content}
        {content}
      </Box>
    </Box>
  );
}
