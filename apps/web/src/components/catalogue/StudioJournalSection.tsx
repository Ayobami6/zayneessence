'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { AccentHeading, CircleIconButton, PhotoTile } from '@/components/glow';

interface JournalArticle {
  image: string;
  imageAlt: string;
  tag: string;
  readingTime: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
}

const ARTICLES: JournalArticle[] = [
  {
    image: '/images/shea.jpg',
    imageAlt: 'Pieces of unrefined shea butter in a dark bowl',
    tag: 'Raw shea',
    readingTime: '5 min read',
    date: 'Oct 12, 2026',
    title: 'Why unrefined northern Nigerian shea outperforms processed butter',
    excerpt:
      'Industrial refinement strips shea of its bioactive triterpenes and cinnamic acid esters. In our Ikoyi studio, we preserve the unbleached, smoky warmth of northern butter.',
    body: [
      'Commercial cosmetics predominantly utilize deodorized, white refined shea butter. While shelf-stable, high-temperature solvent extraction removes the native vitamins A and E, cinnamic acid esters, and phytosterols responsible for cellular barrier protection.',
      'Our northern Nigerian butter is extracted through cold-kneading by women-led artisanal cooperatives in Niger State. This preserves its natural golden-ivory tint, nutty aroma, and high unsaponifiable lipid fraction that melts instantly at body temperature without pore-clogging waxiness.',
      'For melanin-rich complexions prone to trans-epidermal moisture loss, this unrefined lipid matrix reinforces the stratum corneum, restoring suppleness without post-inflammatory irritation.',
    ],
  },
  {
    image: '/images/agarwood.jpg',
    imageAlt: 'Close-up of agarwood heartwood grain',
    tag: 'Aged oud',
    readingTime: '6 min read',
    date: 'Sep 28, 2026',
    title: 'The alchemy of aging pure agarwood oil in dark glass',
    excerpt:
      'Freshly distilled oud possesses green, sharp edges. Over six years in pharmaceutical glass, the molecules oxidize into balsamic, leathery, and dried-fruit harmonies.',
    body: [
      'Unlike synthetic fragrance molecules engineered for instant top-note flash, pure artisanal oud oil is a living botanical substance. Freshly distilled Aquilaria heartwood contains volatile terpenes that can smell pungent and sharp.',
      'By resting our pure Assam and Cambodian distillates in inert dark violet glass containers at steady room temperatures for six years, the volatile compounds polymerize. The sharp edges soften into notes of aged leather, dried dates, warm beeswax, and gentle woodsmoke.',
      'A single swipe of aged pure oud oil bonds to the skin’s personal pH, creating a tranquil, deeply intimate fragrance that radiates quietly for over twenty-four hours.',
    ],
  },
  {
    image: '/images/profile.jpg',
    imageAlt: 'Profile of a woman with glowing deep brown skin and eyes closed',
    tag: 'Barrier science',
    readingTime: '4 min read',
    date: 'Sep 10, 2026',
    title: 'Treating hyperpigmentation without barrier inflammation',
    excerpt:
      'Aggressive hydroquinones and extreme acids trigger secondary inflammation in deeper skin tones. Our studio pairs stabilized niacinamide with moringa and cold-pressed baobab.',
    body: [
      'Melanocytes in Fitzpatrick skin types IV–VI are biologically hyper-reactive. Traditional brightening regimens relying on harsh chemical peels or high-percentage hydroquinone often induce rebound post-inflammatory hyperpigmentation (PIH).',
      'Our formulation thesis centers on simultaneous tyrosinase mitigation and lipid replenishing. Stabilized niacinamide interrupts melanosome transfer, while cold-pressed moringa seed oil and baobab deliver oleic and linoleic fatty acids that reinforce cellular junctions.',
      'The outcome is a tranquil, even luminosity that develops patiently, protecting the skin’s innate moisture barrier without flaking, erythema, or sensitization.',
    ],
  },
];

export function StudioJournalSection() {
  const [openArticle, setOpenArticle] = useState<JournalArticle | null>(null);

  return (
    <Box id="journal" component="section" aria-labelledby="journal-heading" sx={{ py: { xs: 4, md: 8 }, scrollMarginTop: 96 }}>
      <Container maxWidth="lg">
        <AccentHeading id="journal-heading" component="h2" variant="h2" text="Notes from" accent="the studio." sx={{ mb: { xs: 2.5, md: 3 } }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
          {ARTICLES.map((article) => (
            <Box
              key={article.title}
              component="article"
              sx={{ display: 'flex', flexDirection: 'column', gap: 1.75, p: 1.25, pb: 2.75, borderRadius: '32px', bgcolor: 'background.paper' }}
            >
              <PhotoTile src={article.image} alt={article.imageAlt} height={200} radius="24px" sizes="(max-width: 900px) 92vw, 400px" />
              <Box sx={{ px: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25, flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Box sx={{ height: 26, px: 1.25, borderRadius: '999px', bgcolor: 'background.default', display: 'inline-flex', alignItems: 'center', fontSize: 11.5, fontWeight: 700 }}>
                    {article.tag}
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {article.readingTime} · {article.date}
                  </Typography>
                </Box>
                <Typography component="h3" variant="h3" sx={{ fontSize: 18 }}>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {article.excerpt}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => setOpenArticle(article)}
                  sx={{ alignSelf: 'flex-start', mt: 'auto', px: 0, minHeight: 40, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
                >
                  Read note
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>

      <Dialog open={Boolean(openArticle)} onClose={() => setOpenArticle(null)} maxWidth="sm" fullWidth aria-labelledby="journal-dialog-title">
        {openArticle ? (
          <DialogContent sx={{ p: { xs: 2, md: 3 } }}>
            <PhotoTile src={openArticle.image} alt={openArticle.imageAlt} height={220} radius="24px" sizes="600px" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2.5, gap: 2 }}>
              <Typography variant="caption" color="text.secondary">
                {openArticle.tag} · {openArticle.readingTime} · {openArticle.date}
              </Typography>
              <CircleIconButton label="Close note" onClick={() => setOpenArticle(null)} size={40}>
                <CloseRoundedIcon />
              </CircleIconButton>
            </Box>
            <Typography id="journal-dialog-title" component="h2" variant="h3" sx={{ mt: 1, mb: 2 }}>
              {openArticle.title}
            </Typography>
            {openArticle.body.map((paragraph) => (
              <Typography key={paragraph.slice(0, 24)} variant="body1" sx={{ mb: 1.75 }}>
                {paragraph}
              </Typography>
            ))}
          </DialogContent>
        ) : null}
      </Dialog>
    </Box>
  );
}
