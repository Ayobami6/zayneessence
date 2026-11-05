'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import NightsStayOutlinedIcon from '@mui/icons-material/NightsStayOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { AccentHeading, ArcGauge, PhotoTile } from '@/components/glow';
import { useStoreData } from '@/context/StoreDataContext';
import { useBag } from '@/context/BagContext';
import { CONSULTATION_RITUALS, RitualGoalId, RitualIcon, resolveRitualSteps } from '@/data/rituals';
import { formatKoboToNgn } from '@/utils/currency';

const ICONS: Record<RitualIcon, React.ReactNode> = {
  sparkle: <AutoAwesomeOutlinedIcon />,
  drop: <WaterDropOutlinedIcon />,
  moon: <NightsStayOutlinedIcon />,
  sun: <WbSunnyOutlinedIcon />,
};

/** Skin & scent consultation: pick a goal, get a three-step ritual priced from the catalogue. */
export function SkinConsultationSection() {
  const { publishedProducts } = useStoreData();
  const { addToBag } = useBag();
  const [selectedGoal, setSelectedGoal] = useState<RitualGoalId>('hyperpigmentation');
  const [added, setAdded] = useState(false);

  const ritual = CONSULTATION_RITUALS.find((r) => r.id === selectedGoal) || CONSULTATION_RITUALS[0];
  const steps = resolveRitualSteps(ritual.steps, publishedProducts);
  const totalKobo = steps.reduce((sum, s) => sum + s.variant.price_kobo, 0);
  const verbs = ritual.steps.map((s) => s.verb);

  const handleAddRitual = () => {
    steps.forEach((s) => addToBag(s.product, s.variant, 1));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return (
    <Box id="consultation" component="section" aria-labelledby="consultation-heading" sx={{ pt: { xs: 1, md: 3 }, pb: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2.5, md: 6 }, alignItems: 'flex-start' }}>
          <Box sx={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.75 } }}>
            <Box sx={{ alignSelf: 'flex-start', height: 32, px: 1.75, borderRadius: '999px', bgcolor: 'background.paper', display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 12.5, fontWeight: 600 }}>
              <Box component="span" sx={{ width: 7, height: 7, borderRadius: '999px', bgcolor: 'glow.accent' }} />
              Skin &amp; scent consultation
            </Box>
            <AccentHeading
              id="consultation-heading"
              component="h1"
              variant="h1"
              text="What should your ritual"
              accent="do?"
              sx={{ fontSize: { xs: 31, md: 'clamp(40px, 4.6vw, 64px)' } }}
            />
            <Typography color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, maxWidth: 460 }}>
              Pick one goal. The studio builds a three-step ritual from the collection for melanin-rich skin, priced as one.
            </Typography>

            <Box role="radiogroup" aria-label="Choose your ritual goal" sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: { xs: 1.25, md: 1.5 } }}>
              {CONSULTATION_RITUALS.map((r) => {
                const active = r.id === selectedGoal;
                return (
                  <ButtonBase
                    key={r.id}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedGoal(r.id)}
                    data-testid={`consultation-goal-${r.id}`}
                    sx={{
                      height: { xs: 108, md: 124 },
                      p: { xs: 1.75, md: 2.25 },
                      borderRadius: '28px',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      bgcolor: active ? 'primary.main' : 'background.paper',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      transition: 'background-color 0.25s ease',
                    }}
                  >
                    <Box
                      sx={{
                        width: 38,
                        height: 38,
                        borderRadius: '999px',
                        display: 'grid',
                        placeItems: 'center',
                        bgcolor: active ? 'rgba(255,255,255,0.14)' : 'background.default',
                        '& svg': { fontSize: 18 },
                      }}
                    >
                      {ICONS[r.icon]}
                    </Box>
                    <Box component="span" sx={{ fontSize: { xs: 14, md: 15 }, lineHeight: 1.25, fontWeight: 700 }}>
                      {r.label}
                    </Box>
                  </ButtonBase>
                );
              })}
            </Box>

            <PhotoTile
              src="/images/apply.jpg"
              alt="Woman with deep brown skin pressing cream into her cheek"
              height={240}
              radius="32px"
              sizes="560px"
              objectPosition="50% 40%"
              sx={{ display: { xs: 'none', md: 'block' } }}
            >
              <Box sx={{ position: 'absolute', left: 16, right: 16, bottom: 16, px: 2, py: 1.5, borderRadius: '20px', bgcolor: 'glow.scrim', fontSize: 13.5, fontWeight: 600 }}>
                Every ritual is formulated for melanin-rich skin, with zero white cast.
              </Box>
            </PhotoTile>
          </Box>

          <Box
            component="section"
            aria-labelledby="ritual-result-heading"
            aria-live="polite"
            sx={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.25, p: { xs: 2.25, md: 5 }, borderRadius: { xs: '32px', md: '40px' }, bgcolor: 'background.paper' }}
          >
            <ArcGauge
              segments={verbs}
              value={formatKoboToNgn(totalKobo)}
              caption="Complete ritual · 3 steps"
              ariaLabel={`Your ritual has three steps: ${verbs.join(', ')}. Complete ritual ${formatKoboToNgn(totalKobo)}`}
              maxWidth={380}
            />
            <Box>
              <Typography variant="eyebrow" component="p">
                Your ritual
              </Typography>
              <Typography id="ritual-result-heading" component="h2" variant="h3" sx={{ fontSize: { xs: 21, md: 26 }, mt: 0.5 }}>
                {ritual.headline}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: { md: 15 } }}>
                {ritual.summary}
              </Typography>
            </Box>
            <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {steps.map((s, i) => (
                <Box key={s.slug} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: 1.25, borderRadius: '24px', bgcolor: 'background.default' }}>
                  <Box
                    component={Link}
                    href={`/products/${s.product.slug}`}
                    aria-label={s.product.name}
                    sx={{ position: 'relative', width: { xs: 64, md: 88 }, height: { xs: 76, md: 100 }, flexShrink: 0, borderRadius: '18px', overflow: 'hidden', bgcolor: 'glow.petal' }}
                  >
                    <Image src={s.product.images[0].url} alt="" fill sizes="88px" style={{ objectFit: 'cover' }} />
                    <Box sx={{ position: 'absolute', top: 6, left: 6, width: 22, height: 22, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 11.5, fontWeight: 800 }}>
                      {i + 1}
                    </Box>
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="eyebrow" component="p" sx={{ fontSize: 11.5 }}>
                      Step {i + 1} · {s.verb}
                    </Typography>
                    <Typography sx={{ fontSize: { xs: 15, md: 16 }, fontWeight: 700 }}>{s.product.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 12.5, md: 13.5 } }}>
                      {s.note}
                    </Typography>
                  </Box>
                  <Typography variant="price" sx={{ alignSelf: 'flex-start', pt: 0.75, pr: 0.5, fontSize: { xs: 13, md: 15 }, whiteSpace: 'nowrap' }}>
                    {s.product.variants.length > 1 ? 'From ' : ''}
                    {formatKoboToNgn(s.variant.price_kobo)}
                  </Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleAddRitual}
                disabled={steps.length === 0}
                data-testid="add-ritual-to-bag-button"
                sx={{ flex: '1 1 260px' }}
              >
                {added ? '✓ Ritual added to bag' : `Add ritual to bag · ${formatKoboToNgn(totalKobo)}`}
              </Button>
              <Button component={Link} href="/#catalogue" variant="text" size="large" sx={{ flex: '0 1 auto', bgcolor: 'background.default' }}>
                Browse instead
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
