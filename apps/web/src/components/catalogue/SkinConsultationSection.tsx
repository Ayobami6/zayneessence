'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { useStoreData } from '@/context/StoreDataContext';
import { useBag } from '@/context/BagContext';
import { formatKoboToNgn } from '@/utils/currency';

type RitualGoalId =
  | 'hyperpigmentation'
  | 'barrier_recovery'
  | 'evening_oud_layering'
  | 'daytime_skin_scent';

interface RitualDefinition {
  id: RitualGoalId;
  label: string;
  headline: string;
  summary: string;
  steps: Array<{
    stepLabel: string;
    slug: string;
    note: string;
  }>;
}

const RITUALS: RitualDefinition[] = [
  {
    id: 'hyperpigmentation',
    label: 'Even tone & brightening',
    headline: 'Morning radiance for melanin-rich skin',
    summary:
      'Pairs cold-pressed baobab, Kano hibiscus alpha-hydroxy acids and 5% niacinamide to soften dark marks without sensitising melanin-rich skin.',
    steps: [
      {
        stepLabel: 'Step 1 · Treat',
        slug: 'serum-lumiere',
        note: 'Press three drops into damp skin to target uneven tone and post-blemish marks.',
      },
      {
        stepLabel: 'Step 2 · Seal',
        slug: 'huile-visage',
        note: 'Lock in hydration with two drops of cold-pressed baobab and Zaria moringa oil.',
      },
      {
        stepLabel: 'Step 3 · Scent',
        slug: 'musc-soie',
        note: 'Finish with a quiet touch of botanical silk musk on the wrists.',
      },
    ],
  },
  {
    id: 'barrier_recovery',
    label: 'Dry skin & harmattan repair',
    headline: 'Overnight lipid replenishment with unrefined shea',
    summary:
      'Built around hand-kneaded northern Nigerian shea butter from Kwara and Niger states to restore dry, tight barriers overnight.',
    steps: [
      {
        stepLabel: 'Step 1 · Nourish',
        slug: 'huile-visage',
        note: 'Warm three drops between palms and press across cheeks and neck.',
      },
      {
        stepLabel: 'Step 2 · Cocoon',
        slug: 'creme-velours',
        note: 'Melt a pea-sized amount of unrefined shea night cream over the face to seal the barrier.',
      },
      {
        stepLabel: 'Step 3 · Body',
        slug: 'huile-precieuse',
        note: 'Smooth shea olein and desert date dry oil across shoulders and shins after bathing.',
      },
    ],
  },
  {
    id: 'evening_oud_layering',
    label: 'Evening oud layering',
    headline: 'How our studio layers pure oud and eau de parfum',
    summary:
      'In warm Nigerian air, layering an oil base beneath eau de parfum anchors the heartwood resin so it unfolds slowly until morning.',
    steps: [
      {
        stepLabel: 'Step 1 · Prepare skin',
        slug: 'oud-et-santal',
        note: 'Smooth moringa and sandalwood oil over collarbones so fragrance has a lipid base to hold.',
      },
      {
        stepLabel: 'Step 2 · Pulse points',
        slug: 'oud-mubakhar',
        note: 'Touch the glass dipstick of six-year-aged pure oud oil to the inside of each wrist.',
      },
      {
        stepLabel: 'Step 3 · Mist',
        slug: 'nuit-doud',
        note: 'Mist Nuit d’Oud once from twenty centimetres away to complete the sillage.',
      },
    ],
  },
  {
    id: 'daytime_skin_scent',
    label: 'Close-to-skin rose & musk',
    headline: 'Intimate daytime scent and gleamed skin',
    summary:
      'For warm afternoons in Lagos or Abuja when you want skin that looks quietly luminous and smells of dewy rose and clean cotton.',
    steps: [
      {
        stepLabel: 'Step 1 · Body gleam',
        slug: 'huile-precieuse',
        note: 'Apply to damp skin after showering for a satin finish that never transfers to linen.',
      },
      {
        stepLabel: 'Step 2 · Attar pulse',
        slug: 'rose-taifi',
        note: 'Glide Rose Taïfi across the wrists for a bright, un-powdery Damask rose lift.',
      },
      {
        stepLabel: 'Step 3 · Veil',
        slug: 'velours-blanc',
        note: 'Mist Velours Blanc onto the inside of your collar for a soft ambrette and rice-vapour trail.',
      },
    ],
  },
];

export function SkinConsultationSection() {
  const { publishedProducts } = useStoreData();
  const { addToBag } = useBag();
  const [selectedGoal, setSelectedGoal] = useState<RitualGoalId>('hyperpigmentation');

  const currentRitual =
    RITUALS.find((r) => r.id === selectedGoal) || RITUALS[0];

  const resolvedSteps = currentRitual.steps
    .map((step) => {
      const product = publishedProducts.find((p) => p.slug === step.slug);
      return product ? { ...step, product } : null;
    })
    .filter(
      (
        item
      ): item is {
        stepLabel: string;
        slug: string;
        note: string;
        product: NonNullable<typeof publishedProducts[number]>;
      } => item !== null
    );

  const ritualTotalKobo = resolvedSteps.reduce(
    (sum, item) => sum + (item.product.variants[0]?.price_kobo || 0),
    0
  );

  const handleAddFullRitual = () => {
    for (const step of resolvedSteps) {
      const firstVariant = step.product.variants[0];
      if (firstVariant) {
        addToBag(step.product, firstVariant, 1);
      }
    }
  };

  return (
    <Box
      id="consultation"
      component="section"
      aria-label="Skin and scent consultation"
      sx={{
        mt: { xs: 8, md: 12 },
        py: { xs: 6, md: 9 },
        borderTop: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            justifyContent: 'space-between',
            gap: 3,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ mb: 1.5 }}>
              Skin and scent consultation
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Select your skin concern or fragrance mood to view our studio’s three-step
              ritual recommendation.
            </Typography>
          </Box>

          <ToggleButtonGroup
            exclusive
            value={selectedGoal}
            onChange={(_e, next) => {
              if (next !== null) setSelectedGoal(next);
            }}
            aria-label="Choose skin concern or fragrance mood"
          >
            {RITUALS.map((ritual) => (
              <ToggleButton
                key={ritual.id}
                value={ritual.id}
                data-testid={`consultation-goal-${ritual.id}`}
              >
                {ritual.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        <Box
          sx={{
            p: { xs: 3, md: 4.5 },
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.default',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              mb: 3.5,
            }}
          >
            <Box>
              <Typography variant="h3" sx={{ mb: 0.75 }}>
                {currentRitual.headline}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {currentRitual.summary}
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddFullRitual}
              data-testid="add-ritual-to-bag-button"
              sx={{ flexShrink: 0 }}
            >
              Add 3-piece ritual · {formatKoboToNgn(ritualTotalKobo)}
            </Button>
          </Box>

          <Divider sx={{ mb: 3.5 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3,
            }}
          >
            {resolvedSteps.map(({ stepLabel, note, product }) => {
              const firstVariant = product.variants[0];
              const primaryImage = product.images[0];
              return (
                <Box
                  key={product.id}
                  sx={{
                    p: 2.5,
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{
                        display: 'block',
                        color: 'text.secondary',
                        mb: 1.5,
                        fontWeight: 500,
                      }}
                    >
                      {stepLabel}
                    </Typography>

                    <Box
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: '72px 1fr',
                        gap: 2,
                        alignItems: 'center',
                        mb: 2,
                      }}
                    >
                      <Box
                        component={Link}
                        href={`/products/${product.slug}`}
                        sx={(t) => ({
                          position: 'relative',
                          width: 72,
                          aspectRatio: '4 / 5',
                          borderRadius: `${t.palette.zayne.tileRadius}px`,
                          bgcolor: t.palette.zayne.productTile,
                          overflow: 'hidden',
                          display: 'block',
                        })}
                      >
                        {primaryImage && (
                          <Image
                            src={primaryImage.url}
                            alt={primaryImage.alt}
                            fill
                            sizes="72px"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </Box>

                      <Box>
                        <Typography
                          component={Link}
                          href={`/products/${product.slug}`}
                          variant="h4"
                          sx={{
                            display: 'block',
                            color: 'text.primary',
                            textDecoration: 'none',
                            mb: 0.25,
                          }}
                        >
                          {product.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {product.type} · {firstVariant?.label}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {note}
                    </Typography>
                  </Box>

                  {firstVariant && (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => addToBag(product, firstVariant, 1)}
                    >
                      Add to bag · {formatKoboToNgn(firstVariant.price_kobo)}
                    </Button>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
