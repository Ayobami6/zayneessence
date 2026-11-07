'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { AccentHeading, ArcGauge, PhotoTile } from '@/components/glow';
import { CONSULTATION_RITUALS, getRitualTotalKobo, getUnavailableRitualSteps, resolveRitualSteps } from '@/data/rituals';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

/** Inverse band inviting shoppers into the skin & scent consultation. */
export function ConsultationBand() {
  const { publishedProducts } = useStoreData();
  const sample = CONSULTATION_RITUALS[0];
  const steps = resolveRitualSteps(sample.steps, publishedProducts);
  const total = getRitualTotalKobo(sample.steps, publishedProducts);
  const isComplete = getUnavailableRitualSteps(sample.steps, publishedProducts).length === 0;

  return (
    <Box component="section" aria-labelledby="consult-band-heading" sx={{ py: { xs: 3, md: 6 } }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 2, md: 4 },
            p: { xs: 3, md: 7 },
            borderRadius: { xs: '32px', md: '48px' },
            bgcolor: 'glow.inverse',
            color: 'glow.inverseText',
          }}
        >
          <Box sx={{ flex: '1 1 380px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: { xs: 1.25, md: 2.25 } }}>
            <Box
              sx={{
                alignSelf: 'flex-start',
                height: 30,
                px: 1.5,
                borderRadius: '999px',
                bgcolor: 'rgba(255,255,255,0.12)',
                display: 'inline-flex',
                alignItems: 'center',
                fontSize: 12.5,
                fontWeight: 600,
              }}
            >
              {CONSULTATION_RITUALS.length} rituals · 3 steps each
            </Box>
            <AccentHeading
              id="consult-band-heading"
              component="h2"
              variant="h2"
              text="What should your ritual"
              accent="do?"
              onInverse
              sx={{ fontSize: { xs: 26, md: 'clamp(30px, 3.6vw, 48px)' }, maxWidth: { xs: 220, sm: 'none' } }}
            />
            <Typography sx={{ color: 'glow.inverseMuted', maxWidth: { xs: 200, sm: 460 }, fontSize: { xs: 14, md: 16 } }}>
              Choose a goal. The studio builds a three-step ritual from the collection, priced as one.
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
              {CONSULTATION_RITUALS.map((r, i) => (
                <Box
                  key={r.id}
                  component={Link}
                  href={`/consultation?goal=${r.id}`}
                  sx={{
                    height: 44,
                    px: 2.25,
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 14,
                    fontWeight: i === 0 ? 700 : 600,
                    textDecoration: 'none',
                    color: i === 0 ? 'glow.inverse' : 'glow.inverseText',
                    bgcolor: i === 0 ? 'glow.inverseText' : 'transparent',
                    border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.3)',
                  }}
                >
                  {r.label}
                </Box>
              ))}
            </Box>
            <Button
              component={Link}
              href="/consultation"
              endIcon={<ArrowForwardRoundedIcon />}
              sx={{
                display: { xs: 'inline-flex', md: 'none' },
                alignSelf: 'flex-start',
                mt: 0.5,
                bgcolor: 'glow.inverseText',
                color: 'glow.inverse',
                '&:hover': { bgcolor: 'glow.inverseText', opacity: 0.9 },
              }}
            >
              Begin
            </Button>
          </Box>

          <Box sx={{ flex: '1 1 320px', minWidth: 0, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <ArcGauge
              segments={sample.steps.map((s) => s.verb)}
              value={formatKoboToNgn(total)}
              caption={steps.map((s) => s.product.name).join(' · ')}
              ariaLabel={`${sample.label} ritual: ${sample.steps.map((s) => s.verb).join(', ')}. ${
                isComplete ? 'Complete ritual' : `${steps.length} of ${sample.steps.length} pieces available`
              } ${formatKoboToNgn(total)}`}
              onInverse
              maxWidth={400}
            />
            <Button
              component={Link}
              href="/consultation"
              size="large"
              sx={{ bgcolor: 'glow.inverseText', color: 'glow.inverse', '&:hover': { bgcolor: 'glow.inverseText', opacity: 0.9 } }}
            >
              Begin consultation
            </Button>
          </Box>

          <PhotoTile
            src="/images/glow.jpg"
            alt="Close-up of a woman with luminous deep brown skin, fingertips at her temple"
            height={360}
            radius="32px"
            sizes="300px"
            objectPosition="50% 35%"
            sx={{ display: { xs: 'none', md: 'block' }, flex: '1 1 240px', width: 'auto', minWidth: 0 }}
          />

          <Box
            aria-hidden="true"
            sx={{ display: { xs: 'block', md: 'none' }, position: 'absolute', right: 18, bottom: 18, width: 124, height: 124 }}
          >
            <Box component="svg" viewBox="0 0 124 124" sx={{ position: 'absolute', inset: 0 }}>
              <circle cx={62} cy={62} r={58} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={5} />
              <circle cx={62} cy={62} r={58} fill="none" stroke="#E7B3D2" strokeWidth={5} strokeLinecap="round" strokeDasharray="243 364" transform="rotate(-90 62 62)" />
            </Box>
            <Box sx={{ position: 'absolute', top: 10, left: 10, width: 104, height: 104, borderRadius: '999px', overflow: 'hidden' }}>
              <Image src="/images/apply.jpg" alt="" fill sizes="104px" style={{ objectFit: 'cover' }} />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
