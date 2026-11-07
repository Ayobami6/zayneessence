'use client';

import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { AccentHeading, PhotoTile, RingGauge } from '@/components/glow';
import { useAuth } from '@/context/AuthContext';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { getFreeDeliveryProgress } from '@/services/store-service';
import { formatKoboToNgn } from '@/utils/currency';

function greetingForHour(hour: number) {
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function HeroSection() {
  const { session } = useAuth();
  const { subtotalKobo, totalCount, openBag } = useBag();
  const { settings, publishedProducts, setActiveCategory } = useStoreData();
  const [greeting, setGreeting] = React.useState('Welcome to the studio');

  React.useEffect(() => {
    const firstName = session?.name?.split(' ')[0];
    setGreeting(firstName ? `${greetingForHour(new Date().getHours())}, ${firstName}` : 'Welcome to the studio');
  }, [session?.name]);

  const delivery = getFreeDeliveryProgress(subtotalKobo, settings);
  const threshold = formatKoboToNgn(delivery.thresholdKobo);
  const deliveryLine = delivery.unlocked
    ? 'Unlocked in Lagos & Abuja'
    : totalCount > 0
      ? `${formatKoboToNgn(delivery.remainingKobo)} away · ${totalCount} ${totalCount === 1 ? 'piece' : 'pieces'} in your bag`
      : `On Lagos & Abuja orders over ${threshold}`;

  const signature = publishedProducts.find((p) => p.slug === 'serum-lumiere') ?? publishedProducts[0];

  return (
    <Box component="section" aria-labelledby="home-hero-heading" sx={{ pt: { xs: 1, md: 3 }, pb: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 2.5, md: 7 } }}>
          <Box sx={{ flex: '1 1 440px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 3 } }}>
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
              <Typography sx={{ fontWeight: 600, fontSize: 15 }}>{greeting}</Typography>
              <Box
                sx={{
                  height: 28,
                  px: 1.5,
                  borderRadius: '999px',
                  bgcolor: 'background.paper',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                <Box component="span" sx={{ width: 6, height: 6, borderRadius: '999px', bgcolor: 'glow.accent' }} />
                For melanin-rich skin
              </Box>
            </Box>

            <Box
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                alignSelf: 'flex-start',
                height: 34,
                px: 1.75,
                borderRadius: '999px',
                bgcolor: 'background.paper',
                alignItems: 'center',
                gap: 1,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Box component="span" sx={{ width: 7, height: 7, borderRadius: '999px', bgcolor: 'glow.accent' }} />
              Melanin-rich skincare &amp; pure aged oud
            </Box>

            <AccentHeading
              id="home-hero-heading"
              component="h1"
              variant="h1"
              text="Skin that glows,"
              accent="quietly."
              sx={{ fontSize: { xs: 38, sm: 52, md: 'clamp(52px, 6.2vw, 88px)' }, lineHeight: { xs: 1.06, md: 1 } }}
            />

            <Typography
              color="text.secondary"
              sx={{ display: { xs: 'none', md: 'block' }, fontSize: { md: 18 }, maxWidth: 500 }}
            >
              Formulated with unrefined northern Nigerian shea, cold-pressed baobab and moringa, alongside pure aged oud
              oils and fine perfume. Hand-bottled in Lagos and Abuja.
            </Typography>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1.25 }}>
              <Button
                component={Link}
                href="/consultation"
                variant="contained"
                size="large"
                endIcon={
                  <Box
                    component="span"
                    sx={{ width: 36, height: 36, borderRadius: '999px', bgcolor: 'primary.contrastText', color: 'primary.main', display: 'grid', placeItems: 'center', mr: -1.25 }}
                  >
                    <NorthEastRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                }
              >
                Start skin consultation
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  setActiveCategory('All');
                  document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Shop the collection
              </Button>
            </Box>

            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
              {['Unrefined northern shea', 'Cold-pressed baobab & moringa', 'Aged Assam agarwood'].map((label) => (
                <Box
                  key={label}
                  sx={{ height: 32, px: 1.5, borderRadius: '999px', border: (t) => `1px solid ${t.palette.glow.mauve}`, display: 'inline-flex', alignItems: 'center', fontSize: 12.5, fontWeight: 600 }}
                >
                  {label}
                </Box>
              ))}
            </Box>

            <ButtonBase
              onClick={openBag}
              aria-label={`Free delivery: ${deliveryLine}. Open bag`}
              sx={{
                display: { xs: 'flex', md: 'none' },
                alignItems: 'center',
                gap: 1.75,
                p: 1.25,
                borderRadius: '999px',
                bgcolor: 'background.paper',
                boxShadow: (t) => t.palette.glow.shadow,
                textAlign: 'left',
                justifyContent: 'flex-start',
              }}
            >
              <Box sx={{ width: 52, height: 52, flexShrink: 0, borderRadius: '999px', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>
                <LocalShippingOutlinedIcon />
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, fontSize: 15 }}>Free delivery</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                  {deliveryLine}
                </Typography>
              </Box>
              <RingGauge
                value={delivery.progress}
                size={56}
                label={`${Math.round(delivery.progress * 100)}%`}
                ariaLabel={`${Math.round(delivery.progress * 100)} percent of the way to free delivery`}
              />
            </ButtonBase>
          </Box>

          <Box sx={{ flex: '1 1 520px', minWidth: 0, display: { xs: 'none', md: 'block' } }}>
            <PhotoTile
              src="/images/hero.jpg"
              alt="Woman with deep brown skin and an afro, hands raised to frame her glowing face"
              height="clamp(440px, 46vw, 620px)"
              radius="48px"
              priority
              sizes="(max-width: 1200px) 50vw, 620px"
              objectPosition="50% 28%"
            >
              <Box component="svg" viewBox="0 0 520 270" aria-hidden="true" sx={{ position: 'absolute', left: '6%', width: '88%', top: '30%' }}>
                <path d="M20 260a240 240 0 0 1 480 0" fill="none" stroke="#FFFFFF" strokeWidth={2.5} strokeDasharray="2 9" strokeLinecap="round" />
                <path d="M20 260a240 240 0 0 1 380 -210" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
                <circle cx={400} cy={50} r={7} fill="#FFFFFF" />
              </Box>
              <Box
                sx={{
                  position: 'absolute',
                  left: 20,
                  top: 20,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1,
                  pl: 1,
                  pr: 2,
                  borderRadius: '999px',
                  bgcolor: 'glow.scrim',
                  boxShadow: (t) => t.palette.glow.shadow,
                }}
              >
                <Box sx={{ width: 40, height: 40, borderRadius: '999px', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>
                  <LocalShippingOutlinedIcon sx={{ fontSize: 19 }} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 700 }}>Free delivery over {threshold}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Lagos &amp; Abuja · delivering to all 36 states + FCT
                  </Typography>
                </Box>
              </Box>
              {signature ? (
                <Box
                  component={Link}
                  href={`/products/${signature.slug}`}
                  sx={{
                    position: 'absolute',
                    right: 20,
                    bottom: 20,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.75,
                    py: 1,
                    pr: 1,
                    pl: 2.25,
                    borderRadius: '999px',
                    bgcolor: 'glow.scrim',
                    color: 'text.primary',
                    textDecoration: 'none',
                    boxShadow: (t) => t.palette.glow.shadow,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      2026 signature
                    </Typography>
                    <Typography sx={{ fontSize: 14.5, fontWeight: 700 }}>
                      {signature.name} · {formatKoboToNgn(signature.variants[0]?.price_kobo ?? 0)}
                    </Typography>
                  </Box>
                  <Box sx={{ width: 40, height: 40, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center' }}>
                    <AddRoundedIcon sx={{ fontSize: 18 }} />
                  </Box>
                </Box>
              ) : null}
            </PhotoTile>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
