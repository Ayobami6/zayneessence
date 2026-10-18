'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: { xs: 8, md: 12 },
        mb: 0,
        pb: { xs: 'calc(80px + env(safe-area-inset-bottom, 0px))', md: 5 },
        pt: { xs: 6, md: 7 },
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.5fr 1fr 1fr' },
            gap: { xs: 4, md: 6 },
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
                fontSize: '1.85rem',
                color: 'text.primary',
                textTransform: 'lowercase',
                mb: 1.5,
              }}
            >
              zayneessence
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '46ch' }}>
              Skincare formulated with unrefined northern Nigerian shea, cold-pressed
              baobab and moringa for melanin-rich skin, alongside aged pure oud oils and
              fine perfume.
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ mb: 1.5 }}>
              Studios
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
              Ikoyi, Lagos — 14 Bourdillon Road (Monday to Saturday, 10 am – 6 pm)
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Maitama, Abuja — 22 Pope John Paul II Street (By appointment &amp; pickup)
            </Typography>
          </Box>

          <Box>
            <Typography variant="h4" sx={{ mb: 1.5 }}>
              Client care
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                '& a': {
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '0.9375rem',
                  '&:hover': {
                    color: 'text.primary',
                  },
                },
              }}
            >
              <Link href="/#catalogue">Shop collection</Link>
              <Link href="/saved">Saved pieces</Link>
              <Link href="/account">Account &amp; order tracking</Link>
              <Link href="/checkout">Checkout</Link>
              <Link href="/admin">Studio admin</Link>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            gap: 1.5,
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            © {new Date().getFullYear()} zayneessence. Formulated and bottled in Nigeria.
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Lagos &amp; Abuja 1–2 day delivery · Complimentary delivery over ₦150,000
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
