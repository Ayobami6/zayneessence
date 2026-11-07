'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { AccentHeading } from '@/components/glow';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { DAILY_RITUAL, getUnavailableRitualSteps, resolveRitualSteps } from '@/data/rituals';
import { formatKoboToNgn } from '@/utils/currency';

export function RitualProcessSection() {
  const { publishedProducts } = useStoreData();
  const { addLinesToBag } = useBag();
  const [ritualAdded, setRitualAdded] = useState(false);

  const steps = resolveRitualSteps(DAILY_RITUAL, publishedProducts);
  const unavailable = getUnavailableRitualSteps(DAILY_RITUAL, publishedProducts);
  const isComplete = unavailable.length === 0;
  const resolvedBySlug = new Map(steps.map((s) => [s.slug, s]));
  const unavailableRoles = unavailable.map((s) => s.role.toLowerCase()).join(' and ');
  const totalKobo = steps.reduce((sum, s) => sum + s.variant.price_kobo, 0);

  const handleAddFullRitual = () => {
    const { addedUnits } = addLinesToBag(steps.map((s) => ({ product: s.product, variant: s.variant, quantity: 1 })));
    if (addedUnits === 0) return;
    setRitualAdded(true);
    setTimeout(() => setRitualAdded(false), 2200);
  };

  return (
    <Box id="rituals" component="section" aria-labelledby="ritual-heading" sx={{ py: { xs: 4, md: 8 }, scrollMarginTop: 96 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 2, mb: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="eyebrow" component="p">
              The daily ritual · morning &amp; night
            </Typography>
            <AccentHeading id="ritual-heading" component="h2" variant="h2" text="A simple ritual," accent="obsessively run." />
          </Box>
          {steps.length > 0 ? (
            <Button variant="contained" size="large" onClick={handleAddFullRitual} data-testid="add-full-ritual-button">
              {ritualAdded
                ? '✓ Ritual added to bag'
                : isComplete
                  ? `Add complete ritual · ${formatKoboToNgn(totalKobo)}`
                  : `Add the ${steps.length} available pieces · ${formatKoboToNgn(totalKobo)}`}
            </Button>
          ) : null}
        </Box>

        {!isComplete ? (
          <Typography
            variant="body2"
            data-testid="daily-ritual-unavailable-note"
            sx={{ mb: 2, p: 1.75, borderRadius: '20px', bgcolor: 'background.paper', fontWeight: 600 }}
          >
            {steps.length === 0
              ? 'Every piece in the daily ritual is sold out or unavailable right now.'
              : `The ${unavailableRoles} ${unavailable.length === 1 ? 'step is' : 'steps are'} unavailable right now, so the button adds the ${steps.length} pieces in stock.`}
          </Typography>
        ) : null}

        <Box
          component="ol"
          sx={{
            m: 0,
            p: 0,
            listStyle: 'none',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
            gap: 2,
          }}
        >
          {DAILY_RITUAL.map((step) => {
            const s = resolvedBySlug.get(step.slug);
            return (
              <Box
                key={step.slug}
                component="li"
                sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, p: 2.5, borderRadius: '32px', bgcolor: 'background.paper' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800 }}>
                    {step.step}
                  </Box>
                  <Typography component="h3" variant="h4" sx={{ fontSize: 15 }}>
                    {step.role}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
                {s ? (
                  <Box
                    component={Link}
                    href={`/products/${s.product.slug}`}
                    sx={{
                      mt: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.25,
                      p: 0.75,
                      pr: 1,
                      borderRadius: '999px',
                      bgcolor: 'background.default',
                      textDecoration: 'none',
                      color: 'text.primary',
                    }}
                  >
                    <Box sx={{ position: 'relative', width: 46, height: 46, flexShrink: 0, borderRadius: '999px', overflow: 'hidden', bgcolor: 'glow.petal' }}>
                      {s.product.images[0] ? <Image src={s.product.images[0].url} alt="" fill sizes="46px" style={{ objectFit: 'cover' }} /> : null}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }} noWrap>
                        {s.product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {s.variant.label}
                      </Typography>
                    </Box>
                    <Box sx={{ height: 36, px: 1.5, borderRadius: '999px', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 800 }}>
                      {formatKoboToNgn(s.variant.price_kobo)}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    data-testid={`ritual-step-unavailable-${step.slug}`}
                    sx={{ mt: 'auto', height: 58, px: 2, borderRadius: '999px', bgcolor: 'background.default', display: 'flex', alignItems: 'center', fontSize: 13.5, fontWeight: 600, color: 'text.secondary' }}
                  >
                    Unavailable right now
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
}
