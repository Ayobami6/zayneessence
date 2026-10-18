'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';

interface JournalNote {
  id: string;
  title: string;
  readingTime: string;
  excerpt: string;
  body: string[];
}

const JOURNAL_NOTES: JournalNote[] = [
  {
    id: 'unrefined-northern-shea',
    title: 'Why unrefined northern Nigerian shea outperforms bleached butter on melanin-rich skin',
    readingTime: '3 minute read · Ingredients',
    excerpt:
      'Industrial refining strips Vitellaria paradoxa of its cinnamic acid esters and allantoin—the very compounds that calm hyperpigmentation triggers.',
    body: [
      'Across Kwara and Niger states, women’s cooperatives hand-knead roasted shea kernels at low temperatures to preserve the butter’s unsaponifiable lipid fraction. When shea is chemically deodorised or bleached white for mass-market lotions, up to seventy percent of its natural triterpenes, vitamin E and allantoin are lost.',
      'For melanin-rich skin, barrier irritation is the quiet precursor to post-inflammatory hyperpigmentation. By tempering unrefined northern Nigerian shea with cold-pressed Zaria moringa seed oil in Crème Velours, the butter melts at skin temperature without feeling heavy or occlusive in humid coastal weather.',
    ],
  },
  {
    id: 'wearing-oud-in-humid-air',
    title: 'How to wear pure six-year-aged oud oil in Lagos and Abuja',
    readingTime: '2 minute read · Olfactory notes',
    excerpt:
      'Warm air amplifies top notes quickly. A single glass-wand swipe of aged agarwood on moisturised pulse points lasts from dusk until the following afternoon.',
    body: [
      'Pure hydro-distilled agarwood oil behaves differently from alcohol-based eau de parfum. Without volatile ethanol to project the scent outward all at once, pure oud warms gradually against the skin’s natural lipids.',
      'Draw the glass dipstick of Oud Mubakhar or Oud Malaki lightly across the inside of each wrist and behind the earlobes. Never rub the wrists together—friction heats the delicate top notes of cardamom husk and Taif rose Otto prematurely. Let the resin settle on its own.',
    ],
  },
  {
    id: 'baobab-hibiscus-brightening',
    title: 'Pairing cold-pressed baobab and Kano hibiscus for quiet brightening',
    readingTime: '3 minute read · Formulation',
    excerpt:
      'Harsh bleaching agents compromise the stratum corneum. Natural hibiscus organic acids paired with 5% niacinamide clarify tone while strengthening the lipid barrier.',
    body: [
      'Many brightening treatments marketed in West Africa rely on aggressive concentrations that strip the epidermis and trigger rebound pigmentation under equatorial sun.',
      'In Sérum Lumière, we pair cold-extracted Kano hibiscus sabdariffa calyx—naturally rich in gentle malic and citric acids—with five percent niacinamide, licorice root filtrate and cold-pressed baobab oil. The result is a calm, progressive luminosity that respects melanin-rich skin.',
    ],
  },
];

const PROVENANCE_PILLARS = [
  {
    title: 'Kwara & Niger unrefined shea',
    detail:
      'Small-batch Vitellaria paradoxa butter cold-kneaded by women’s cooperatives, retaining its natural ivory-gold hue and barrier-repairing triterpenes.',
  },
  {
    title: 'Kano baobab & hibiscus',
    detail:
      'First-press Adansonia digitata seed oil and sun-dried hibiscus calyx rich in omega-3, -6 and -9 fatty acids for supple, even-toned skin.',
  },
  {
    title: 'Zaria moringa & aged agarwood',
    detail:
      'Lightweight Moringa oleifera oil that mirrors natural sebum, paired with six-year-matured pure oud resins and first-flush Taif rose.',
  },
];

export function ProvenanceAndJournalSection() {
  const [activeArticle, setActiveArticle] = useState<JournalNote | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [subscribed, setSubscribed] = useState<boolean>(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.includes('@')) return;
    setSubscribed(true);
    setNewsletterEmail('');
  };

  return (
    <Box component="section" aria-label="Nigerian provenance and studio journal">
      {/* 1. Nigerian Botanical Provenance */}
      <Container maxWidth="lg" sx={{ pt: { xs: 7, md: 10 }, pb: { xs: 5, md: 8 } }}>
        <Typography variant="h2" sx={{ mb: 1.5 }}>
          Rooted in Nigerian botanicals
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Every formula begins with traceable harvests across northern and middle-belt
          Nigeria, compounded in small runs in our Lagos studio.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {PROVENANCE_PILLARS.map((pillar) => (
            <Box
              key={pillar.title}
              sx={{
                p: 3,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Typography variant="h3" sx={{ fontSize: '1.4rem', mb: 1.25 }}>
                {pillar.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {pillar.detail}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>

      <Divider />

      {/* 2. Studio Journal (inspired by Nectar Beauty Hub Skincare Blog) */}
      <Container maxWidth="lg" sx={{ py: { xs: 7, md: 10 } }}>
        <Typography variant="h2" sx={{ mb: 1.5 }}>
          Studio journal
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Notes on melanin-rich skin physiology, unrefined Nigerian lipids and the art of
          wearing pure oud.
        </Typography>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {JOURNAL_NOTES.map((note) => (
            <Box
              key={note.id}
              component="article"
              sx={{
                p: 3,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2.5,
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: 'text.secondary', mb: 1 }}
                >
                  {note.readingTime}
                </Typography>
                <Typography variant="h3" sx={{ fontSize: '1.35rem', mb: 1.5 }}>
                  {note.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {note.excerpt}
                </Typography>
              </Box>

              <Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setActiveArticle(note)}
                >
                  Read note
                </Button>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Quiet studio dispatch newsletter */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 3, md: 5 },
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.2fr 0.8fr' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="h3" sx={{ mb: 1 }}>
              Studio dispatch
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Receive quiet notes when new aged oud demijohns are bottled or seasonal
              shea harvests arrive in Ikoyi and Maitama.
            </Typography>
          </Box>

          {subscribed ? (
            <Typography variant="body2" sx={{ fontWeight: 400 }}>
              ✓ You are on the studio list. We write only when a new harvest or flacon is
              ready.
            </Typography>
          ) : (
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{ display: 'flex', gap: 1.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}
            >
              <InputBase
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                inputProps={{ 'aria-label': 'Email address for studio dispatch' }}
                sx={{
                  px: 2.5,
                  py: 1,
                  borderRadius: 999,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                  flexGrow: 1,
                  fontSize: '0.9375rem',
                }}
              />
              <Button type="submit" variant="contained" color="primary" sx={{ flexShrink: 0 }}>
                Join list
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      <Dialog
        open={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
        maxWidth="sm"
        fullWidth
      >
        {activeArticle && (
          <DialogContent sx={{ p: { xs: 3, md: 5 } }}>
            <Typography
              variant="caption"
              sx={{ display: 'block', color: 'text.secondary', mb: 1 }}
            >
              {activeArticle.readingTime}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: '1.85rem', mb: 3 }}>
              {activeArticle.title}
            </Typography>
            {activeArticle.body.map((paragraph, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2.5 }}>
                {paragraph}
              </Typography>
            ))}
            <Button variant="outlined" onClick={() => setActiveArticle(null)}>
              Close note
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
