'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { RingGauge } from '@/components/glow';

const METRICS = [
  {
    value: '100%',
    progress: 1,
    title: 'Wild-harvested botanicals',
    body: 'Shea, baobab and moringa from northern grower cooperatives.',
  },
  {
    value: '6 yrs',
    progress: 1,
    title: 'Pure oud maturation',
    body: 'Aged in dark glass, with no synthetic extenders.',
  },
  {
    value: '37',
    progress: 1,
    title: 'States & territories',
    body: 'All 36 states and the FCT, with WhatsApp dispatch notices.',
  },
  {
    value: '0%',
    progress: 0,
    title: 'White cast or fillers',
    body: 'No chalkiness, sulfates, parabens or artificial colours.',
  },
];

export function StudioMetricsSection() {
  return (
    <Box component="section" aria-label="Studio benchmarks" sx={{ pb: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
            gap: { xs: 1.25, md: 2 },
          }}
        >
          {METRICS.map((m) => (
            <Box
              key={m.title}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', lg: 'row' },
                alignItems: { xs: 'flex-start', lg: 'center' },
                gap: { xs: 1.25, md: 2 },
                p: { xs: 1.75, md: 2 },
                borderRadius: '30px',
                bgcolor: 'background.paper',
              }}
            >
              <RingGauge value={m.progress} size={84} stroke={7} label={m.value} filled ariaLabel={`${m.value} ${m.title}`} />
              <Box sx={{ minWidth: 0 }}>
                <Typography component="h3" variant="h4" sx={{ fontSize: { xs: 14, md: 15 } }}>
                  {m.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12.5, md: 13 }, mt: 0.5 }}>
                  {m.body}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
