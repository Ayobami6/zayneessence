import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { AccentHeading } from '@/components/glow';

const TESTIMONIALS = [
  {
    quote:
      'The Sérum Lumière completely cleared my stubborn hyperpigmentation without drying out my face. My skin has never felt this calm, hydrated or radiant.',
    author: 'Dr. Amina B.',
    title: 'Consultant Dermatologist',
    location: 'Maitama, Abuja',
  },
  {
    quote:
      'Oud Mubakhar is hands-down the most nuanced pure oud oil in my collection. Two drops on linen linger for days without sharpness. Extraordinary craftsmanship.',
    author: 'Tunde E.',
    title: 'Fragrance Collector',
    location: 'Ikoyi, Lagos',
  },
  {
    quote:
      'Crème Velours completely rescued my compromised moisture barrier. It melts immediately into melanin-rich skin with zero ashiness or stickiness. An essential.',
    author: 'Folashade O.',
    title: 'Creative Director',
    location: 'London & Lagos',
  },
];

export function ClientWordsSection() {
  return (
    <Box component="section" aria-labelledby="words-heading" sx={{ py: { xs: 4, md: 8 } }}>
      <Container maxWidth="lg">
        <AccentHeading id="words-heading" component="h2" variant="h2" text="Clients say it" accent="better." sx={{ mb: { xs: 2.5, md: 3 } }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {TESTIMONIALS.map((t) => (
            <Box
              key={t.author}
              component="figure"
              sx={{ m: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 3, p: { xs: 2.5, md: 3.25 }, borderRadius: '32px', bgcolor: 'background.paper' }}
            >
              <Typography component="blockquote" sx={{ m: 0, fontSize: { xs: 15.5, md: 17 }, lineHeight: 1.55, fontWeight: 500, maxWidth: 'none' }}>
                “{t.quote}”
              </Typography>
              <Box component="figcaption" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 44, height: 44, borderRadius: '999px', bgcolor: 'glow.petal', color: 'glow.accent', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
                  {t.author.replace('Dr. ', '').charAt(0)}
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 700 }}>{t.author}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                    {t.title} · {t.location}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
