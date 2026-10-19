'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import InputBase from '@mui/material/InputBase';

interface JournalArticle {
  tag: string;
  readingTime: string;
  date: string;
  title: string;
  excerpt: string;
  body: string[];
}

const ARTICLES: JournalArticle[] = [
  {
    tag: 'Raw Shea',
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
    tag: 'Aged Oud',
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
    tag: 'Barrier Science',
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
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  return (
    <Box
      id="journal"
      component="section"
      aria-label="Studio journal notes"
      sx={{
        py: { xs: 8, md: 13 },
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        {/* Eyebrow */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 4,
            borderBottom: 1,
            borderColor: 'divider',
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 600,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'text.primary',
              opacity: 0.85,
            }}
          >
            (Studio journal)
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--font-jost), "Jost", sans-serif',
              fontSize: '0.9375rem',
              fontWeight: 500,
              color: 'text.primary',
              opacity: 0.85,
            }}
          >
            Formulation Dispatches
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'flex-end' },
            gap: 2,
            mb: { xs: 5, md: 7 },
          }}
        >
          <Box sx={{ maxWidth: '44ch' }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: { xs: '2.4rem', sm: '3rem', md: '3.8rem' },
                fontWeight: 700,
                letterSpacing: '-0.04em',
                lineHeight: 1.05,
                color: 'text.primary',
                mb: 1.5,
              }}
            >
              Notes from the studio.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                opacity: 0.88,
                fontSize: { xs: '1.0625rem', md: '1.2rem' },
                lineHeight: 1.65,
              }}
            >
              Insights into savanna botanicals, pure agarwood distillation, and the barrier biology of melanin-rich skin.
            </Typography>
          </Box>
        </Box>

        {/* 3 Journal Cards (Parade's "Notes from the studio" 3-column format) */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
            gap: { xs: 3, md: 4 },
          }}
        >
          {ARTICLES.map((article) => (
            <Box
              key={article.title}
              onClick={() => setActiveArticle(article)}
              sx={{
                p: { xs: 3.5, md: 4 },
                borderRadius: 2,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                transition: 'border-color 0.25s ease, transform 0.25s ease',
                '&:hover': {
                  borderColor: 'text.primary',
                  transform: 'translateY(-3px)',
                },
              }}
            >
              <Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      color: 'text.primary',
                      textTransform: 'uppercase',
                    }}
                  >
                    {article.tag}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '0.84375rem',
                      fontWeight: 500,
                      color: 'text.primary',
                      opacity: 0.75,
                    }}
                  >
                    {article.readingTime} · {article.date}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    fontFamily: 'var(--font-jost), "Jost", sans-serif',
                    fontSize: { xs: '1.35rem', md: '1.55rem' },
                    fontWeight: 700,
                    lineHeight: 1.25,
                    letterSpacing: '-0.025em',
                    color: 'text.primary',
                    mb: 2,
                  }}
                >
                  {article.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.primary',
                    opacity: 0.85,
                    fontSize: '1rem',
                    lineHeight: 1.65,
                    mb: 3,
                  }}
                >
                  {article.excerpt}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: '0.96875rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  textDecoration: 'underline',
                  textUnderlineOffset: '4px',
                }}
              >
                Read note →
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Newsletter Signup Row */}
        <Box
          sx={{
            mt: { xs: 6, md: 8 },
            p: { xs: 3.5, md: 5 },
            borderRadius: 2,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            justifyContent: 'space-between',
            gap: 3,
          }}
        >
          <Box sx={{ maxWidth: '44ch' }}>
            <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: 'text.primary', mb: 0.75 }}>
              The Studio Dispatch
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.primary',
                opacity: 0.85,
                fontSize: '1rem',
                lineHeight: 1.6,
              }}
            >
              Subtle dispatches on rare agarwood harvests, harvest yields, and private client studio appointments.
            </Typography>
          </Box>

          {newsletterSubscribed ? (
            <Typography sx={{ fontWeight: 600, fontSize: '1.05rem', color: 'text.primary' }}>
              ✓ You are subscribed to our private studio dispatch.
            </Typography>
          ) : (
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{
                display: 'flex',
                gap: 1.5,
                width: { xs: '100%', md: 'auto' },
                maxWidth: 440,
                flexGrow: { md: 1 },
              }}
            >
              <InputBase
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                inputProps={{ 'aria-label': 'Email address for studio dispatch' }}
                sx={{
                  px: 2.5,
                  py: 1.25,
                  borderRadius: 999,
                  border: 1,
                  borderColor: 'divider',
                  bgcolor: 'background.default',
                  flexGrow: 1,
                  fontSize: '0.96875rem',
                  fontWeight: 500,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ flexShrink: 0, px: 3.5, fontSize: '0.96875rem', fontWeight: 600 }}
              >
                Join list
              </Button>
            </Box>
          )}
        </Box>
      </Container>

      {/* Slide-up reading dialog */}
      <Dialog
        open={Boolean(activeArticle)}
        onClose={() => setActiveArticle(null)}
        maxWidth="sm"
        fullWidth
      >
        {activeArticle && (
          <DialogContent sx={{ p: { xs: 3.5, md: 5 } }}>
            <Typography
              sx={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                color: 'text.secondary',
                mb: 1.5,
              }}
            >
              {activeArticle.tag} · {activeArticle.readingTime}
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: 'var(--font-jost), "Jost", sans-serif',
                fontSize: '1.85rem',
                fontWeight: 600,
                lineHeight: 1.2,
                mb: 3,
              }}
            >
              {activeArticle.title}
            </Typography>
            {activeArticle.body.map((paragraph, idx) => (
              <Typography key={idx} variant="body1" sx={{ mb: 2.5, lineHeight: 1.7 }}>
                {paragraph}
              </Typography>
            ))}
            <Button variant="outlined" onClick={() => setActiveArticle(null)} sx={{ mt: 2 }}>
              Close note
            </Button>
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
