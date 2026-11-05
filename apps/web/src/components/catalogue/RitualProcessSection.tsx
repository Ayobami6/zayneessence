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
import { DAILY_RITUAL, resolveRitualSteps } from '@/data/rituals';
import { formatKoboToNgn } from '@/utils/currency';

export function RitualProcessSection() {
  const { publishedProducts } = useStoreData();
  const { addToBag } = useBag();
  const [ritualAdded, setRitualAdded] = useState(false);

  const steps = resolveRitualSteps(DAILY_RITUAL, publishedProducts);
  const totalKobo = steps.reduce((sum, s) => sum + s.variant.price_kobo, 0);

  const handleAddFullRitual = () => {
    steps.forEach((s) => addToBag(s.product, s.variant, 1));
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
              {ritualAdded ? '✓ Ritual added to bag' : `Add complete ritual · ${formatKoboToNgn(totalKobo)}`}
            </Button>
          ) : null}
        </Box>

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
          {steps.map((s) => (
            <Box
              key={s.slug}
              component="li"
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, p: 2.5, borderRadius: '32px', bgcolor: 'background.paper' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
                <Box sx={{ width: 38, height: 38, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800 }}>
                  {s.step}
                </Box>
                <Typography component="h3" variant="h4" sx={{ fontSize: 15 }}>
                  {s.role}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {s.description}
              </Typography>
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
                <Box sx={{ position: 'relative', width: 46, height: 46, flexShrink: 0, borderRadius: '999px', overflow: 'hidden' }}>
                  <Image src={s.product.images[0].url} alt="" fill sizes="46px" style={{ objectFit: 'cover' }} />
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
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
