'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { AccentHeading, PhotoTile, Wordmark } from '@/components/glow';

export const WELCOME_SEEN_KEY = 'zayneessence_welcome_seen_v1';

/** One-time welcome on the first mobile visit to the home page. Never shown on desktop. */
export function WelcomeScreen() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const primaryRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (pathname !== '/') return;
    try {
      const isPhone = window.matchMedia('(max-width: 899.95px)').matches;
      const seen = window.localStorage.getItem(WELCOME_SEEN_KEY);
      if (isPhone && !seen) setOpen(true);
    } catch {
      // Storage unavailable (private mode): skip the welcome rather than block the shop.
    }
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    primaryRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    try {
      window.localStorage.setItem(WELCOME_SEEN_KEY, '1');
    } catch {
      // ignore
    }
    setOpen(false);
  };

  if (!open) return null;

  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-heading"
      data-testid="welcome-screen"
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (t) => t.zIndex.modal + 1,
        bgcolor: 'background.default',
        display: { xs: 'flex', md: 'none' },
        flexDirection: 'column',
        overflowY: 'auto',
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <PhotoTile
        src="/images/hero.jpg"
        alt="Woman with deep brown skin and an afro, hands raised to frame her glowing face"
        height="min(58vh, 520px)"
        radius="40px"
        priority
        sizes="100vw"
        objectPosition="50% 28%"
        sx={{ m: 1.5, width: 'auto', flexShrink: 0 }}
      >
        <Box sx={{ position: 'absolute', top: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ height: 40, px: 2.25, borderRadius: '999px', bgcolor: 'glow.scrim', display: 'flex', alignItems: 'center' }}>
            <Wordmark size={24} />
          </Box>
        </Box>
        <Box
          component="svg"
          viewBox="0 0 350 180"
          aria-hidden="true"
          sx={{ position: 'absolute', left: '3%', width: '94%', bottom: '6%' }}
        >
          <path d="M15 175a160 160 0 0 1 320 0" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray="2 8" strokeLinecap="round" />
          <path d="M15 175a160 160 0 0 1 240 -140" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
          <circle cx={255} cy={35} r={6} fill="#FFFFFF" />
        </Box>
        {[
          { label: 'For melanin-rich skin', sx: { left: 16, bottom: 108 } },
          { label: 'Pure oud, aged 6 yrs', sx: { right: 16, bottom: 64 } },
          { label: 'Lagos & Abuja · Est. 2026', sx: { left: 16, bottom: 16 } },
        ].map((chip) => (
          <Box
            key={chip.label}
            sx={{
              position: 'absolute',
              height: 32,
              px: 1.5,
              borderRadius: '999px',
              bgcolor: 'glow.scrim',
              display: 'flex',
              alignItems: 'center',
              fontSize: 12,
              fontWeight: 600,
              ...chip.sx,
            }}
          >
            {chip.label}
          </Box>
        ))}
      </PhotoTile>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 3, px: 3, pt: 2, pb: 3, textAlign: 'center' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <AccentHeading
            id="welcome-heading"
            component="h2"
            variant="h2"
            text="Find the ritual your skin"
            accent="asks for."
            sx={{ fontSize: 31, lineHeight: 1.1 }}
          />
          <Typography color="text.secondary" sx={{ maxWidth: 310 }}>
            Northern shea, cold-pressed baobab and moringa, alongside pure aged oud.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Button
            ref={primaryRef}
            component={Link}
            href="/consultation"
            onClick={dismiss}
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            data-testid="welcome-start-consultation"
          >
            Start skin consultation
          </Button>
          <Button onClick={dismiss} variant="text" size="large" data-testid="welcome-browse">
            Browse the collection
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
