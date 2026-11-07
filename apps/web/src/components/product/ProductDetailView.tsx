'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import { CATEGORY_META, Product } from '@/types/domain';
import { SaveHeartButton } from '@/components/ui/SaveHeartButton';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { AccentHeading, CircleIconButton, QuantityStepper, RingGauge, StatDisc } from '@/components/glow';
import { rovingRadioProps } from '@/components/glow/rovingRadio';
import { GLOW_BLUR_DATA_URL } from '@/data/blur';
import { MAX_UNITS_PER_LINE, useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

interface ProductDetailViewProps {
  product: Product;
  /** Present when rendered inside the slide-up product dialog. */
  onCloseModal?: () => void;
}

/** Oud maturation arc: distilled → aged in glass → bottled, one dot per year. */
function MaturationArc({ years }: { years: number }) {
  const dots = Array.from({ length: Math.max(0, years - 1) }, (_, i) => {
    const t = (i + 1) / years;
    const phi = Math.PI - t * Math.PI;
    return { x: 165 + 145 * Math.cos(phi), y: 180 - 145 * Math.sin(phi) };
  });
  return (
    <Box
      component="svg"
      viewBox="0 0 330 190"
      role="img"
      aria-label={`Maturation: distilled, then aged ${years} years in glass before bottling`}
      sx={{ position: 'absolute', left: '7%', width: '86%', top: '17%', pointerEvents: 'none' }}
    >
      <path d="M20 180a145 145 0 0 1 290 0" fill="none" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" opacity={0.75} />
      <path d="M20 180a145 145 0 0 1 290 0" fill="none" stroke="#9C3F71" strokeWidth={3} strokeLinecap="round" />
      <circle cx={20} cy={180} r={5} fill="#9C3F71" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={3.5} fill="#9C3F71" />
      ))}
      <circle cx={310} cy={180} r={7} fill="#150C14" />
    </Box>
  );
}

export function ProductDetailView({ product, onCloseModal }: ProductDetailViewProps) {
  const { addToBag } = useBag();
  const { publishedProducts, settings } = useStoreData();
  const meta = CATEGORY_META[product.category];
  const inModal = Boolean(onCloseModal);

  const [selectedVariantId, setSelectedVariantId] = useState<string>(product.variants[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);
  const touchStartX = useRef<number | null>(null);

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const outOfStock = !selectedVariant || selectedVariant.stock <= 0;
  // The stepper never offers more than the selected size has in stock.
  const maxQuantity = Math.max(1, Math.min(MAX_UNITS_PER_LINE, selectedVariant?.stock ?? 1));
  const totalLinePriceKobo = (selectedVariant?.price_kobo || 0) * quantity;
  const variantIds = product.variants.map((v) => v.id);

  const chooseVariant = (id: string) => {
    setSelectedVariantId(id);
    const stock = product.variants.find((v) => v.id === id)?.stock ?? 1;
    setQuantity((q) => Math.min(q, Math.max(1, Math.min(MAX_UNITS_PER_LINE, stock))));
  };
  const images = product.images.length > 0 ? product.images : [];
  const currentImage = images[activeImageIndex] || images[0];

  const relatedProducts = useMemo(() => {
    const sameCategory = publishedProducts.filter((p) => p.id !== product.id && p.category === product.category);
    const others = publishedProducts.filter((p) => p.id !== product.id && p.category !== product.category);
    return [...sameCategory, ...others].slice(0, 4);
  }, [publishedProducts, product.id, product.category]);

  const [firstWord, ...restWords] = product.name.split(' ');

  const goToImage = (delta: number) => {
    if (images.length < 2) return;
    setActiveImageIndex((i) => (i + delta + images.length) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(delta) > 40) goToImage(delta < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  const handleAddToBag = () => {
    if (!selectedVariant || outOfStock) return;
    const { addedUnits } = addToBag(product, selectedVariant, quantity);
    if (addedUnits === 0) return;
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1700);
  };

  const threshold = formatKoboToNgn(settings.freeDeliveryThresholdKobo);

  return (
    <Box sx={{ pb: { xs: inModal ? 12 : 4, md: 2 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 0, md: 6 }, alignItems: 'flex-start' }}>
        {/* Gallery */}
        <Box component="section" aria-label="Product photos" sx={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              borderRadius: { xs: '36px', md: '44px' },
              bgcolor: 'glow.petal',
              height: { xs: 440, sm: 520, md: 'clamp(460px, 44vw, 640px)' },
            }}
          >
            {currentImage ? (
              <Image
                key={currentImage.id}
                src={currentImage.url}
                alt={currentImage.alt}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 640px"
                placeholder="blur"
                blurDataURL={currentImage.blurDataURL || GLOW_BLUR_DATA_URL}
                style={{ objectFit: 'cover', animation: 'glowRise 0.35s ease' }}
              />
            ) : null}
            {product.aged_years && activeImageIndex === 0 ? (
              <>
                <MaturationArc years={product.aged_years} />
                <Box sx={{ position: 'absolute', left: 16, bottom: { xs: 76, md: 20 }, height: 30, px: 1.25, borderRadius: '999px', bgcolor: 'glow.scrim', display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 700, color: 'text.secondary' }}>
                  Distilled
                </Box>
                <Box sx={{ position: 'absolute', right: 16, bottom: { xs: 76, md: 20 }, height: 30, px: 1.25, borderRadius: '999px', bgcolor: 'glow.scrim', display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
                  Bottled · year {product.aged_years}
                </Box>
              </>
            ) : null}
            <Box sx={{ position: 'absolute', left: 16, top: 16, height: 34, px: 1.75, borderRadius: '999px', bgcolor: 'glow.scrim', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600 }}>
              {meta.label}
              {product.is_sample ? ' · sample' : ''}
            </Box>
            {images.length > 1 ? (
              <>
                <CircleIconButton
                  label="Previous product image"
                  tone="scrim"
                  onClick={() => goToImage(-1)}
                  sx={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', display: { xs: 'none', md: 'inline-flex' } }}
                >
                  <ChevronLeftRoundedIcon />
                </CircleIconButton>
                <CircleIconButton
                  label="Next product image"
                  tone="scrim"
                  onClick={() => goToImage(1)}
                  sx={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', display: { xs: 'none', md: 'inline-flex' } }}
                >
                  <ChevronRightRoundedIcon />
                </CircleIconButton>
                <Box
                  role="tablist"
                  aria-label="Product gallery images"
                  sx={{ position: 'absolute', left: 0, right: 0, bottom: { xs: 60, md: 16 }, display: { xs: 'flex', md: 'none' }, justifyContent: 'center', gap: 0.75 }}
                >
                  {images.map((img, idx) => (
                    <ButtonBase
                      key={img.id}
                      role="tab"
                      aria-selected={idx === activeImageIndex}
                      aria-label={`View image ${idx + 1} of ${images.length}`}
                      onClick={() => setActiveImageIndex(idx)}
                      sx={{ width: idx === activeImageIndex ? 20 : 8, height: 8, borderRadius: '999px', bgcolor: idx === activeImageIndex ? 'primary.main' : 'glow.scrim', transition: 'width 0.25s ease' }}
                    />
                  ))}
                </Box>
              </>
            ) : null}
          </Box>

          {images.length > 1 ? (
            <Box sx={{ display: { xs: 'none', md: 'grid' }, gridTemplateColumns: `repeat(${Math.min(images.length, 4)}, minmax(0, 1fr))`, gap: 1.5 }}>
              {images.slice(0, 4).map((img, idx) => (
                <ButtonBase
                  key={img.id}
                  aria-label={`View image ${idx + 1} of ${images.length}: ${img.alt}`}
                  aria-pressed={idx === activeImageIndex}
                  onClick={() => setActiveImageIndex(idx)}
                  sx={{
                    position: 'relative',
                    height: 110,
                    borderRadius: '22px',
                    overflow: 'hidden',
                    bgcolor: 'glow.petal',
                    outline: (t) => (idx === activeImageIndex ? `2px solid ${t.palette.text.primary}` : 'none'),
                    outlineOffset: 2,
                  }}
                >
                  <Image src={img.url} alt="" fill sizes="160px" style={{ objectFit: 'cover' }} />
                </ButtonBase>
              ))}
            </Box>
          ) : null}
        </Box>

        {/* Details */}
        <Box component="section" aria-label="Product details" sx={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {product.highlights && product.highlights.length > 0 ? (
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'flex-end', gap: 1.5, mt: { xs: -6.5, md: 0 }, position: 'relative', zIndex: 1 }}>
              {product.highlights.map((h, i) =>
                product.aged_years && i === 1 ? (
                  <Box key={h.label} sx={{ width: 116, height: 116, borderRadius: '999px', bgcolor: 'background.paper', boxShadow: (t) => t.palette.glow.shadowStrong, display: 'grid', placeItems: 'center' }}>
                    <RingGauge value={1} size={100} stroke={7} label={h.value} caption={h.label} ariaLabel={`${h.value} ${h.label}`} />
                  </Box>
                ) : (
                  <StatDisc key={h.label} value={h.value} label={h.label} size={88} />
                )
              )}
            </Box>
          ) : null}

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: { xs: product.highlights?.length ? 0 : 2.5, md: 0 } }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {product.type}
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 1.5 }}>
              <AccentHeading
                component={inModal ? 'h2' : 'h1'}
                variant="h1"
                text={restWords.length ? firstWord : product.name}
                accent={restWords.length ? restWords.join(' ') : undefined}
                sx={{ fontSize: { xs: 32, md: 'clamp(38px, 4vw, 56px)' } }}
              />
              <Typography variant="price" component="p" sx={{ fontSize: { xs: 22, md: 28 } }} data-testid="product-detail-price">
                <AnimatedPrice kobo={selectedVariant?.price_kobo || 0} />
              </Typography>
            </Box>
            {product.is_sample ? (
              <Box sx={{ alignSelf: 'flex-start', height: 28, px: 1.25, borderRadius: '999px', bgcolor: 'glow.petal', display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
                Sample listing · details to be confirmed
              </Box>
            ) : null}
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              {product.description}
            </Typography>
          </Box>

          {product.variants.length > 0 ? (
            <Box component="fieldset" sx={{ m: 0, p: 0, border: 0, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              <Typography component="legend" variant="h5" sx={{ mb: 1.25 }}>
                Size
              </Typography>
              <Box role="radiogroup" aria-label="Choose size" sx={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(product.variants.length, 3)}, minmax(0, 1fr))`, gap: 1.25 }}>
                {product.variants.map((variant) => {
                  const active = variant.id === selectedVariant?.id;
                  return (
                    <ButtonBase
                      key={variant.id}
                      {...rovingRadioProps(variantIds, selectedVariant?.id, chooseVariant, variant.id)}
                      onClick={() => chooseVariant(variant.id)}
                      data-testid={`size-option-${variant.label.replace(/\s+/g, '-')}`}
                      sx={{
                        height: 72,
                        borderRadius: '22px',
                        flexDirection: 'column',
                        gap: 0.25,
                        bgcolor: active ? 'primary.main' : 'background.paper',
                        color: active ? 'primary.contrastText' : 'text.primary',
                        transition: 'background-color 0.25s ease',
                      }}
                    >
                      <Box component="span" sx={{ fontSize: 16, fontWeight: 700 }}>
                        {variant.label}
                      </Box>
                      <Box component="span" sx={{ fontSize: 12.5, fontWeight: 600, opacity: 0.8 }}>
                        {variant.stock <= 0 ? 'Sold out' : formatKoboToNgn(variant.price_kobo)}
                      </Box>
                    </ButtonBase>
                  );
                })}
              </Box>
            </Box>
          ) : null}

          <Box
            sx={(t) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              position: { xs: 'sticky', md: 'static' },
              bottom: { xs: inModal ? 12 : 'calc(96px + env(safe-area-inset-bottom, 0px))', md: 'auto' },
              zIndex: 2,
              p: { xs: 0.75, md: 0 },
              borderRadius: { xs: '999px', md: 0 },
              bgcolor: { xs: t.palette.background.paper, md: 'transparent' },
              boxShadow: { xs: t.palette.glow.shadowStrong, md: 'none' },
            })}
          >
            <QuantityStepper
              value={quantity}
              itemName={product.name}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
              max={maxQuantity}
              testIdPrefix="product-quantity"
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleAddToBag}
              disabled={outOfStock}
              data-testid="add-to-bag-button"
              sx={{ flex: 1, px: 2 }}
            >
              {outOfStock ? 'Out of stock' : addedFeedback ? '✓ Added to bag' : `Add to bag · ${formatKoboToNgn(totalLinePriceKobo)}`}
            </Button>
            <SaveHeartButton productId={product.id} productName={product.name} sx={{ display: { xs: 'none', md: 'inline-flex' }, width: 56, height: 56 }} />
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {[
              { icon: <LocalShippingOutlinedIcon sx={{ fontSize: 16 }} />, label: `Free Lagos & Abuja delivery over ${threshold}` },
              ...(settings.giftWrapFeeKobo === 0 ? [{ icon: <CardGiftcardOutlinedIcon sx={{ fontSize: 16 }} />, label: 'Complimentary gift wrap' }] : []),
            ].map((chip) => (
              <Box key={chip.label} sx={{ height: 38, pl: 0.75, pr: 1.75, borderRadius: '999px', bgcolor: 'background.paper', display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 13, fontWeight: 600 }}>
                <Box sx={{ width: 28, height: 28, borderRadius: '999px', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>{chip.icon}</Box>
                {chip.label}
              </Box>
            ))}
          </Box>

          <Box sx={{ borderRadius: '28px', bgcolor: 'background.paper', px: 2.75, py: 0.5 }}>
            {product.notes ? (
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>Scent notes</AccordionSummary>
                <AccordionDetails>
                  <Box component="dl" sx={{ m: 0, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' }, gap: 1.25 }}>
                    {(['top', 'heart', 'base'] as const).map((tier) => (
                      <Box key={tier} sx={{ p: 1.75, borderRadius: '20px', bgcolor: 'background.default' }}>
                        <Typography component="dt" variant="eyebrow" sx={{ textTransform: 'capitalize' }}>
                          {tier}
                        </Typography>
                        <Typography component="dd" variant="body2" sx={{ m: 0, mt: 0.5 }}>
                          {product.notes?.[tier]}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ) : null}
            {product.ingredients && product.ingredients.length > 0 ? (
              <Accordion defaultExpanded={!product.notes}>
                <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>Key ingredients</AccordionSummary>
                <AccordionDetails>
                  <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
                    {product.ingredients.map((ing) => (
                      <Typography key={ing} component="li" variant="body2">
                        {ing}
                      </Typography>
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ) : null}
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>{meta.usageHeading}</AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {product.how_to_use}
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreRoundedIcon />}>Delivery &amp; returns</AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.25 }}>
                  Lagos and Abuja orders arrive within 1–2 days, with complimentary delivery on orders over {threshold}. Rest of
                  Nigeria orders arrive in 2–5 working days. Same-day studio pickup is available in Ikoyi and Maitama.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Unopened pieces in their original sealed box may be returned within 14 days of delivery. Because of their
                  intimate nature, opened oud oils, attars, bakhoor and supplements can’t be exchanged.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>

      {relatedProducts.length > 0 ? (
        <Box component="section" aria-labelledby={`related-${product.id}`} sx={{ mt: { xs: 5, md: 8 } }}>
          <AccentHeading id={`related-${product.id}`} component="h2" variant="h3" text="Layer it" accent="with" sx={{ mb: 2, fontSize: { md: 24 } }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5 }}>
            {relatedProducts.map((related) => (
              <Box
                key={related.id}
                component={Link}
                href={`/products/${related.slug}`}
                scroll={!inModal}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.25, pr: 2, borderRadius: '28px', bgcolor: 'background.paper', textDecoration: 'none', color: 'text.primary' }}
              >
                <Box sx={{ position: 'relative', width: 72, height: 84, flexShrink: 0, borderRadius: '20px', overflow: 'hidden', bgcolor: 'glow.petal' }}>
                  <Image src={related.images[0]?.url || '/products/serum-lumiere/1.jpg'} alt="" fill sizes="72px" style={{ objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="glow.accent" noWrap component="p">
                    {CATEGORY_META[related.category].shortLabel}
                  </Typography>
                  <Typography sx={{ fontSize: 15, fontWeight: 700 }} noWrap>
                    {related.name}
                  </Typography>
                  <Typography variant="price" sx={{ fontSize: 14 }}>
                    {related.variants.length > 1 ? 'From ' : ''}
                    {formatKoboToNgn(related.variants[0]?.price_kobo || 0)}
                  </Typography>
                </Box>
                <ChevronRightRoundedIcon aria-hidden="true" />
              </Box>
            ))}
          </Box>
        </Box>
      ) : null}
    </Box>
  );
}
