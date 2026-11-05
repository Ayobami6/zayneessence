'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';
import { AccentHeading, Wordmark } from '@/components/glow';

const COLUMNS: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: 'Shop',
    links: [
      { label: 'Skincare', href: '/shop/skincare' },
      { label: 'Pure oud', href: '/shop/oud' },
      { label: 'Perfume', href: '/shop/perfume' },
      { label: 'Roll-ons & oils', href: '/shop/roll-ons' },
      { label: 'Bakhoor & turaren wuta', href: '/shop/bakhoor' },
      { label: 'Supplements', href: '/shop/supplements' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track an order', href: '/account' },
      { label: 'Skin & scent consultation', href: '/consultation' },
      { label: 'Saved pieces', href: '/saved' },
      { label: 'Email the studio', href: 'mailto:concierge@zayneessence.com' },
    ],
  },
];

export function Footer() {
  const pathname = usePathname() || '/';
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const year = new Date().getFullYear();

  const bottomPad = { xs: 'calc(108px + env(safe-area-inset-bottom, 0px))', md: 6 };

  if (pathname.startsWith('/checkout')) {
    return (
      <Container maxWidth="lg" component="footer" sx={{ pb: { xs: 4, md: 6 }, pt: 4 }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            px: { xs: 3, md: 4 },
            py: 3,
            borderRadius: '32px',
            bgcolor: 'glow.inverse',
            color: 'glow.inverseText',
          }}
        >
          <Wordmark size={30} sx={{ color: 'inherit' }} />
          <Typography variant="body2" sx={{ color: 'glow.inverseMuted' }}>
            © {year} · Paystack secured · Delivery to all 36 states and the FCT
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" component="footer" sx={{ pt: { xs: 6, md: 10 }, pb: bottomPad }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 4, md: 5 },
          p: { xs: 3, sm: 4, md: 7 },
          borderRadius: { xs: '32px', md: '48px' },
          bgcolor: 'glow.inverse',
          color: 'glow.inverseText',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: { xs: 4, md: 6 } }}>
          <Box
            component="form"
            onSubmit={(e: React.FormEvent) => {
              e.preventDefault();
              if (email.includes('@')) setJoined(true);
            }}
            sx={{ flex: '1 1 340px', display: 'flex', flexDirection: 'column', gap: 1.75, minWidth: 0 }}
          >
            <AccentHeading component="h2" variant="h3" text="The Studio" accent="Dispatch" onInverse sx={{ fontSize: 26 }} />
            <Typography variant="body2" sx={{ color: 'glow.inverseMuted', maxWidth: 380 }}>
              Rare agarwood harvests, new formulations and private studio appointments in Ikoyi and Maitama.
            </Typography>
            {joined ? (
              <Typography role="status" sx={{ fontWeight: 700 }}>
                You’re on the list. Watch your inbox.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.75,
                  p: 0.75,
                  borderRadius: '999px',
                  bgcolor: 'rgba(255,255,255,0.1)',
                  maxWidth: 440,
                }}
              >
                <InputBase
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  inputProps={{ 'aria-label': 'Email address for the Studio Dispatch' }}
                  sx={{ flex: 1, minWidth: 0, px: 2, color: 'inherit', fontSize: 15, '& input::placeholder': { color: 'glow.inverseMuted', opacity: 1 } }}
                />
                <Button
                  type="submit"
                  sx={{
                    minHeight: 46,
                    px: 3,
                    bgcolor: 'glow.inverseText',
                    color: 'glow.inverse',
                    '&:hover': { bgcolor: 'glow.inverseText', opacity: 0.9 },
                  }}
                >
                  Join
                </Button>
              </Box>
            )}
          </Box>

          <Box
            component="nav"
            aria-label="Footer"
            sx={{
              flex: '1 1 420px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: 3,
            }}
          >
            {COLUMNS.map((col) => (
              <Box key={col.title} sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'glow.bloom' }}>{col.title}</Typography>
                {col.links.map((l) => (
                  <Box
                    key={l.label}
                    component={Link}
                    href={l.href}
                    sx={{ color: 'inherit', fontSize: 14, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                  >
                    {l.label}
                  </Box>
                ))}
              </Box>
            ))}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: 'glow.bloom' }}>Studios</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Ikoyi, Lagos</Typography>
              <Typography sx={{ fontSize: 13, color: 'glow.inverseMuted', mt: -0.75 }}>
                14 Bourdillon Road · Mon–Sat, 10 am – 6 pm
              </Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600 }}>Maitama, Abuja</Typography>
              <Typography sx={{ fontSize: 13, color: 'glow.inverseMuted', mt: -0.75 }}>
                By appointment &amp; studio pickup
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            gap: 2,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <Wordmark size={{ xs: 48, sm: 80, md: 128 }} sx={{ color: 'inherit', lineHeight: 0.9 }} />
          <Typography variant="body2" sx={{ color: 'glow.inverseMuted' }}>
            © {year} zayneessence · Formulated and bottled in Nigeria · Paystack secured
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
