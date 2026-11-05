'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import NativeSelect from '@mui/material/NativeSelect';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { AccentHeading, PhotoTile } from '@/components/glow';
import { ProductGrid } from './ProductGrid';
import { useStoreData } from '@/context/StoreDataContext';
import { filterProducts } from '@/services/store-service';
import { CATEGORY_META, PRODUCT_CATEGORIES, ProductCategory } from '@/types/domain';
import { formatKoboToNgn } from '@/utils/currency';

const HEADINGS: Record<ProductCategory, [string, string]> = {
  Skincare: ['Skincare for', 'melanin-rich skin.'],
  Perfume: ['Eau de', 'parfum.'],
  Oud: ['Pure', 'aged oud.'],
  'Roll-ons': ['Attar', 'roll-ons.'],
  Oils: ['Body &', 'fragrance oils.'],
  Bakhoor: ['Bakhoor &', 'turaren wuta.'],
  Supplements: ['Daily', 'supplements.'],
};

const HERO_IMAGES: Record<ProductCategory, { src: string; alt: string; caption: string }> = {
  Skincare: { src: '/images/apply.jpg', alt: 'Woman with deep brown skin pressing cream into her cheek', caption: 'Zero white cast on melanin-rich skin' },
  Perfume: { src: '/products/nuit-doud/1.jpg', alt: 'Slim bottle of amber perfume glowing against a dark backdrop', caption: 'Built on pure oud and Taif rose' },
  Oud: { src: '/products/oud-mubakhar/1.jpg', alt: 'Faceted attar bottle of amber oud oil', caption: 'Aged in dark glass before bottling' },
  'Roll-ons': { src: '/products/rose-taifi/1.jpg', alt: 'Two slim attar vials among pink and cream roses', caption: 'Alcohol-free, close to the skin' },
  Oils: { src: '/products/huile-precieuse/1.jpg', alt: 'Golden body oil in a dropper bottle among dried flowers', caption: 'Dry savanna oils with a satin finish' },
  Bakhoor: { src: '/products/bakhoor-malaki/1.jpg', alt: 'Bronze burner with glowing bakhoor chips and rising smoke', caption: 'Burned over charcoal in a mabkhara' },
  Supplements: { src: '/products/moringa-pure/1.jpg', alt: 'Bowl of bright green moringa powder on a blush pink surface', caption: 'Moringa, baobab, black seed and hibiscus' },
};

type PriceBand = 'all' | 'under-25' | '25-50' | 'over-50';
type SortKey = 'featured' | 'price-asc' | 'price-desc';

const PRICE_BANDS: Array<{ id: PriceBand; label: string; test: (kobo: number) => boolean }> = [
  { id: 'all', label: 'Any price', test: () => true },
  { id: 'under-25', label: 'Under ₦25,000', test: (k) => k < 2500000 },
  { id: '25-50', label: '₦25,000 – ₦50,000', test: (k) => k >= 2500000 && k <= 5000000 },
  { id: 'over-50', label: 'Over ₦50,000', test: (k) => k > 5000000 },
];

const BURN_STEPS = [
  {
    title: 'Light the charcoal',
    body: 'Hold a charcoal disc with tongs over a flame until its edges turn grey, then set it in the mabkhara.',
  },
  { title: 'Add one piece', body: 'Place a single chip, or a pinch of turaren wuta, on the coal. A little goes a long way.' },
  {
    title: 'Let it drift',
    body: 'Waft the smoke through clothes, hair and rooms. Keep it clear of fabrics and never leave it burning unattended.',
  },
];

export function CategoryPageClient({ category }: { category: ProductCategory }) {
  const { publishedProducts } = useStoreData();
  const [priceBand, setPriceBand] = useState<PriceBand>('all');
  const [sort, setSort] = useState<SortKey>('featured');
  const meta = CATEGORY_META[category];
  const [lead, accent] = HEADINGS[category];
  const hero = HERO_IMAGES[category];

  const inCategory = useMemo(() => filterProducts(publishedProducts, { category }), [publishedProducts, category]);
  const visible = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.id === priceBand) ?? PRICE_BANDS[0];
    const list = inCategory.filter((p) => band.test(p.variants[0]?.price_kobo ?? 0));
    if (sort === 'featured') return list;
    const dir = sort === 'price-asc' ? 1 : -1;
    return [...list].sort((a, b) => dir * ((a.variants[0]?.price_kobo ?? 0) - (b.variants[0]?.price_kobo ?? 0)));
  }, [inCategory, priceBand, sort]);

  const pairings = useMemo(
    () => (category === 'Bakhoor' ? filterProducts(publishedProducts, { category: 'Oud' }).concat(filterProducts(publishedProducts, { category: 'Perfume' }).slice(0, 1)) : []),
    [category, publishedProducts]
  );

  const counts = useMemo(() => {
    const map = new Map<ProductCategory, number>();
    PRODUCT_CATEGORIES.forEach((c) => map.set(c, publishedProducts.filter((p) => p.category === c).length));
    return map;
  }, [publishedProducts]);

  return (
    <Box sx={{ pb: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg">
        <Box component="nav" aria-label="Breadcrumb" sx={{ display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 13, fontWeight: 600, color: 'text.secondary', pt: { xs: 1, md: 2 } }}>
          <Box component={Link} href="/" sx={{ color: 'inherit' }}>
            Shop
          </Box>
          <ChevronRightRoundedIcon sx={{ fontSize: 16 }} aria-hidden="true" />
          <Box component="span" aria-current="page" sx={{ color: 'text.primary' }}>
            {meta.label}
          </Box>
        </Box>

        <Box component="section" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 2.5, md: 7 }, py: { xs: 2.5, md: 5 } }}>
          <Box sx={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ alignSelf: 'flex-start', height: 32, px: 1.75, borderRadius: '999px', bgcolor: 'background.paper', display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 12.5, fontWeight: 600 }}>
              <Box component="span" sx={{ width: 7, height: 7, borderRadius: '999px', bgcolor: 'glow.accent' }} />
              {inCategory.length} {inCategory.length === 1 ? 'piece' : 'pieces'}
              {inCategory.some((p) => p.is_sample) ? ' · samples' : ''}
            </Box>
            <AccentHeading component="h1" variant="h1" text={lead} accent={accent} sx={{ fontSize: { xs: 36, md: 'clamp(44px, 5vw, 72px)' } }} />
            <Typography color="text.secondary" sx={{ fontSize: { md: 17 }, maxWidth: 480 }}>
              {meta.intro}
            </Typography>
            {category === 'Bakhoor' ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
                <Button component="a" href="#burn" variant="contained" size="large">
                  How to burn bakhoor
                </Button>
                <Button component={Link} href="/shop/oud" variant="outlined" size="large">
                  Pair with pure oud
                </Button>
              </Box>
            ) : null}
          </Box>
          <PhotoTile
            src={hero.src}
            alt={hero.alt}
            height={{ xs: 260, md: 420 }}
            radius={{ xs: '32px', md: '44px' }}
            priority
            sizes="(max-width: 900px) 92vw, 620px"
            sx={{ flex: '1 1 480px', width: 'auto', minWidth: 0 }}
          >
            <Box sx={{ position: 'absolute', left: 16, bottom: 16, height: 38, px: 1.75, borderRadius: '999px', bgcolor: 'glow.scrim', display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 13, fontWeight: 600 }}>
              <Box component="span" sx={{ width: 7, height: 7, borderRadius: '999px', bgcolor: 'glow.gold' }} />
              {hero.caption}
            </Box>
          </PhotoTile>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
          <Box
            component="aside"
            aria-label="Filters"
            sx={{
              display: { xs: 'none', md: 'flex' },
              flex: '0 0 270px',
              flexDirection: 'column',
              gap: 2.25,
              p: 2.75,
              borderRadius: '28px',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 104,
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography component="h2" variant="h5" sx={{ mb: 0.5 }}>
                Category
              </Typography>
              {PRODUCT_CATEGORIES.map((c) => {
                const active = c === category;
                return (
                  <Box
                    key={c}
                    component={Link}
                    href={`/shop/${CATEGORY_META[c].slug}`}
                    aria-current={active ? 'page' : undefined}
                    sx={{
                      height: 40,
                      px: 1.75,
                      borderRadius: '999px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: 14,
                      fontWeight: 600,
                      textDecoration: 'none',
                      color: active ? 'primary.contrastText' : 'text.primary',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      '&:hover': { bgcolor: active ? 'primary.main' : 'background.default' },
                    }}
                  >
                    {CATEGORY_META[c].label}
                    <Box component="span" sx={{ fontSize: 12, opacity: 0.75 }}>
                      {counts.get(c) ?? 0}
                    </Box>
                  </Box>
                );
              })}
            </Box>
            <Box sx={{ height: '1px', bgcolor: 'divider' }} />
            <Box component="fieldset" sx={{ m: 0, p: 0, border: 0, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Typography component="legend" variant="h5" sx={{ mb: 1 }}>
                Price
              </Typography>
              {PRICE_BANDS.map((band) => (
                <Box key={band.id} component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 14, cursor: 'pointer', minHeight: 32 }}>
                  <input
                    type="radio"
                    name="price-band"
                    checked={priceBand === band.id}
                    onChange={() => setPriceBand(band.id)}
                    style={{ width: 18, height: 18, accentColor: 'currentColor' }}
                  />
                  {band.label}
                </Box>
              ))}
            </Box>
          </Box>

          <Box component="section" aria-label={`${meta.label} pieces`} sx={{ flex: '999 1 560px', minWidth: 0 }}>
            <Box
              sx={{
                display: { xs: 'flex', md: 'none' },
                gap: 1,
                overflowX: 'auto',
                mx: -2,
                px: 2,
                pb: 1,
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {PRODUCT_CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  component={Link}
                  href={`/shop/${CATEGORY_META[c].slug}`}
                  clickable
                  label={CATEGORY_META[c].shortLabel}
                  data-active={c === category ? 'true' : 'false'}
                  sx={{ flexShrink: 0 }}
                />
              ))}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, mt: { xs: 1, md: 0 } }}>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                  {visible.length} {visible.length === 1 ? 'piece' : 'pieces'}
                </Typography>
                <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, flexWrap: 'wrap' }}>
                  {PRICE_BANDS.slice(1).map((band) => (
                    <Chip
                      key={band.id}
                      size="small"
                      clickable
                      label={band.label}
                      data-active={priceBand === band.id ? 'true' : 'false'}
                      onClick={() => setPriceBand(priceBand === band.id ? 'all' : band.id)}
                    />
                  ))}
                </Box>
              </Box>
              <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13, fontWeight: 600 }}>
                Sort by
                <NativeSelect
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  disableUnderline
                  sx={{ height: 42, px: 2, borderRadius: '999px', bgcolor: 'background.paper', fontSize: 14, fontWeight: 600, '& select': { py: 0 } }}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price, low to high</option>
                  <option value="price-desc">Price, high to low</option>
                </NativeSelect>
              </Box>
            </Box>
            {visible.length > 0 ? (
              <ProductGrid products={visible} featureFirst={false} />
            ) : (
              <Box sx={{ mt: 3, p: 5, borderRadius: '32px', bgcolor: 'background.paper', textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 600, mb: 2, mx: 'auto' }}>Nothing in that price range yet.</Typography>
                <Button variant="contained" onClick={() => setPriceBand('all')}>
                  Show every price
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {category === 'Bakhoor' ? (
          <Box
            id="burn"
            component="section"
            aria-labelledby="burn-heading"
            sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'stretch', mt: { xs: 4, md: 8 }, p: { xs: 2.5, md: 6 }, borderRadius: { xs: '32px', md: '44px' }, bgcolor: 'background.paper', scrollMarginTop: 96 }}
          >
            <Box sx={{ flex: '999 1 520px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Typography variant="eyebrow" component="p">
                  The ritual · three steps
                </Typography>
                <AccentHeading id="burn-heading" component="h2" variant="h2" text="How to burn" accent="bakhoor." sx={{ mt: 1 }} />
              </Box>
              <Box component="ol" sx={{ m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 2 }}>
                {BURN_STEPS.map((step, i) => (
                  <Box key={step.title} component="li" sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, p: 2.25, borderRadius: '26px', bgcolor: 'background.default' }}>
                    <Box sx={{ width: 40, height: 40, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800 }}>
                      {String(i + 1).padStart(2, '0')}
                    </Box>
                    <Typography component="h3" variant="h4">
                      {step.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {step.body}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <PhotoTile
              src="/products/mabkhara/1.jpg"
              alt="Ornate incense burner releasing a thin ribbon of smoke"
              height={{ xs: 240, md: 'auto' }}
              radius="32px"
              sizes="(max-width: 900px) 92vw, 360px"
              sx={{ flex: '1 1 300px', width: 'auto', minWidth: 0, minHeight: { md: 300 } }}
            />
          </Box>
        ) : null}

        {category === 'Supplements' ? (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, p: 2.5, borderRadius: '24px', bgcolor: 'background.paper', maxWidth: 'none' }}>
            Food supplements support, and don’t replace, a varied diet. If you are pregnant, breastfeeding, taking medication or
            under medical care, speak to your doctor before use.
          </Typography>
        ) : null}

        {pairings.length > 0 ? (
          <Box component="section" aria-labelledby="pair-heading" sx={{ mt: { xs: 4, md: 8 } }}>
            <AccentHeading id="pair-heading" component="h2" variant="h3" text="Layer it with" accent="pure oud" sx={{ mb: 2, fontSize: { md: 24 } }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(260px, 1fr))' }, gap: 2 }}>
              {pairings.map((p) => (
                <Box
                  key={p.id}
                  component={Link}
                  href={`/products/${p.slug}`}
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.75, p: 1.25, pr: 2.25, borderRadius: '28px', bgcolor: 'background.paper', textDecoration: 'none', color: 'text.primary' }}
                >
                  <Box sx={{ position: 'relative', width: 84, height: 96, flexShrink: 0, borderRadius: '20px', overflow: 'hidden' }}>
                    <Image src={p.images[0].url} alt="" fill sizes="84px" style={{ objectFit: 'cover' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700 }}>{p.name}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                      {p.type}
                    </Typography>
                    <Typography variant="price" sx={{ fontSize: 14, mt: 0.5, display: 'block' }}>
                      {p.variants.length > 1 ? 'From ' : ''}
                      {formatKoboToNgn(p.variants[0]?.price_kobo ?? 0)}
                    </Typography>
                  </Box>
                  <ChevronRightRoundedIcon aria-hidden="true" />
                </Box>
              ))}
            </Box>
          </Box>
        ) : null}
      </Container>
    </Box>
  );
}
