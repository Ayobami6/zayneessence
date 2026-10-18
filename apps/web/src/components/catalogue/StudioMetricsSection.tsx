'use client';

import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

const METRICS = [
  {
    number: '100%',
    label: 'Wild-harvested botanicals',
    detail: 'Unrefined shea, cold-pressed baobab and moringa sourced directly from northern Nigerian grower cooperatives.',
  },
  {
    number: '6 Yrs',
    label: 'Pure oud maturation',
    detail: 'Aged in dark pharmaceutical glass to cultivate deep honeyed and smoky nuances without synthetic extenders.',
  },
  {
    number: '37',
    label: 'States & territories',
    detail: 'Fast, secure nationwide delivery across all 36 states and the FCT, with real-time WhatsApp dispatch notices.',
  },
  {
    number: '0%',
    label: 'White cast or synthetic fillers',
    detail: 'Formulated exclusively for melanin-rich skin with zero white chalkiness, sulfates, parabens or artificial colours.',
  },
];

export function StudioMetricsSection() {
  return (
    <Box
      component="section"
      aria-label="Studio proof and metrics"
      sx={{
        py: { xs: 7, md: 10 },
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Eyebrow in Parade's parenthesis style */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 5,
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
            (Studio benchmarks)
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.875rem',
              color: 'text.secondary',
            }}
          >
            Ikoyi · Maitama · Worldwide
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: { xs: 4, md: 5 },
          }}
        >
          {METRICS.map((metric, idx) => (
            <Box
              key={idx}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.25,
                borderTop: 2,
                borderColor: 'text.primary',
                pt: 2.5,
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-jost), "Jost", sans-serif',
                  fontSize: { xs: '3rem', md: '3.75rem' },
                  fontWeight: 600,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.95,
                  color: 'text.primary',
                }}
              >
                {metric.number}
              </Typography>
              <Typography
                sx={{
                  fontSize: '1.0625rem',
                  fontWeight: 500,
                  color: 'text.primary',
                  mt: 0.5,
                }}
              >
                {metric.label}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.9375rem',
                  lineHeight: 1.55,
                }}
              >
                {metric.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
