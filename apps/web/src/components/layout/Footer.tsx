'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 10, md: 16 },
        borderTopLeftRadius: { xs: 24, md: 36 },
        borderTopRightRadius: { xs: 24, md: 36 },
        bgcolor: '#170C1B',
        color: '#F1EAF3',
        pt: { xs: 8, md: 12 },
        pb: { xs: 'calc(80px + env(safe-area-inset-bottom, 0px))', md: 5 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        {/* Parade-style massive callout header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 4,
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            pb: { xs: 6, md: 8 },
            mb: { xs: 6, md: 8 },
          }}
        >
          <Box sx={{ maxWidth: '44ch' }}>
            <Typography
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.75)',
                mb: 2,
              }}
            >
              (Bespoke appointments &amp; gifting)
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: { xs: '2.8rem', sm: '3.6rem', md: '4.8rem' },
                fontWeight: 700,
                lineHeight: 0.96,
                letterSpacing: '-0.045em',
                color: '#F1EAF3',
              }}
            >
              Let’s elevate
              <br />
              your ritual.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: '1rem', fontWeight: 500 }}>
              Speak with our Ikoyi studio concierge:
            </Typography>
            <Button
              component="a"
              href="mailto:concierge@zayneessence.com"
              variant="contained"
              sx={{
                bgcolor: '#F1EAF3',
                color: '#170C1B',
                borderRadius: 999,
                px: 4,
                py: 1.6,
                fontSize: '1.05rem',
                fontWeight: 700,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#ffffff',
                  opacity: 0.95,
                },
              }}
            >
              concierge@zayneessence.com
            </Button>
          </Box>
        </Box>

        {/* 3 Columns links */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1.5fr 1fr 1fr' },
            gap: { xs: 5, md: 7 },
            mb: { xs: 8, md: 10 },
          }}
        >
          {/* Brand bio */}
          <Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-italiana), "Italiana", serif',
                fontSize: '2.2rem',
                WebkitTextStroke: '0.35px currentColor',
                color: '#F1EAF3',
                mb: 1.5,
              }}
            >
              zayneessence
            </Typography>
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '1rem',
                lineHeight: 1.65,
                maxWidth: '42ch',
              }}
            >
              Independent luxury house formulating with unrefined northern Nigerian shea,
              cold-pressed baobab and moringa for melanin-rich skin, alongside aged pure oud oils.
            </Typography>
          </Box>

          {/* Studios */}
          <Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.75)',
                mb: 2,
              }}
            >
              Compounding Studios
            </Typography>
            <Typography sx={{ color: '#F1EAF3', fontSize: '1.05rem', mb: 0.5, fontWeight: 600 }}>
              Ikoyi, Lagos
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9375rem', mb: 2 }}>
              14 Bourdillon Road · Mon–Sat, 10 am – 6 pm
            </Typography>

            <Typography sx={{ color: '#F1EAF3', fontSize: '1.05rem', mb: 0.5, fontWeight: 600 }}>
              Maitama, Abuja
            </Typography>
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.9375rem' }}>
              22 Pope John Paul II Street · By appointment &amp; studio pickup
            </Typography>
          </Box>

          {/* Navigation */}
          <Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.75)',
                mb: 2,
              }}
            >
              Navigation
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1.15,
                '& a': {
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  fontSize: '1rem',
                  fontWeight: 500,
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#FFFFFF',
                  },
                },
              }}
            >
              <Link href="/#catalogue">Catalogue collection</Link>
              <Link href="/#rituals">The 4-step daily ritual</Link>
              <Link href="/#provenance">Artisanal provenance</Link>
              <Link href="/#journal">Studio journal notes</Link>
              <Link href="/saved">Saved pieces</Link>
              <Link href="/account">Account &amp; order tracking</Link>
              <Link href="/checkout">Checkout</Link>
              <Link href="/admin">Studio admin</Link>
            </Box>
          </Box>
        </Box>

        {/* Parade-style massive edge-to-edge wordmark watermark */}
        <Typography
          sx={{
            fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
            fontSize: { xs: '15vw', md: '13.5vw' },
            lineHeight: 0.8,
            letterSpacing: '-0.03em',
            color: 'rgba(255, 255, 255, 0.07)',
            textAlign: 'center',
            userSelect: 'none',
            pointerEvents: 'none',
            mb: { xs: 3, md: 4 },
          }}
        >
          zayneessence
        </Typography>

        {/* Bottom copyright row */}
        <Box
          sx={{
            pt: 3,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.84375rem' }}>
            © {new Date().getFullYear()} zayneessence. Formulated and bottled in Nigeria. All rights reserved.
          </Typography>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.84375rem' }}>
            Lagos &amp; Abuja 1–2 day delivery · Free nationwide over ₦150,000
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
