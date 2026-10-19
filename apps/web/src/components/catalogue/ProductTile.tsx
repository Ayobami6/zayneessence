'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Product } from '@/types/domain';
import { SaveHeartButton } from '@/components/ui/SaveHeartButton';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { useBag } from '@/context/BagContext';

interface ProductTileProps {
  product: Product;
  isFeaturedSpan?: boolean;
}

export function ProductTile({ product, isFeaturedSpan = false }: ProductTileProps) {
  const { addToBag } = useBag();
  const [quickAdded, setQuickAdded] = useState(false);

  const primaryImage = product.images[0];
  const secondaryImage = product.images[1] || product.images[0];
  const lowestVariant = product.variants[0];
  const hasMultipleSizes = product.variants.length > 1;

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!lowestVariant) return;
    addToBag(product, lowestVariant, 1);
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 1700);
  };

  const categoryTag =
    product.category === 'Oud'
      ? 'Aged 6 Yrs · Pure Oud'
      : product.category === 'Roll-ons'
      ? 'Attar Roll-On'
      : product.category === 'Oils'
      ? 'Dry Savanna Oil'
      : product.category === 'Perfume'
      ? 'Eau de Parfum'
      : 'Active Skincare';

  return (
    <Box
      component="article"
      data-testid={`product-tile-${product.slug}`}
      sx={{
        gridColumn: isFeaturedSpan ? { xs: 'span 2', sm: 'span 2' } : 'span 1',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderRadius: 2,
        transition: 'transform 0.25s ease',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          component={Link}
          href={`/products/${product.slug}`}
          aria-label={`${product.name}, ${product.type}`}
          sx={(theme) => ({
            display: 'block',
            textDecoration: 'none',
            color: 'inherit',
            borderRadius: `${theme.palette.zayne.tileRadius}px`,
            '&:hover .tile-image-stage, &:focus-visible .tile-image-stage': {
              transform: 'translateY(-5px)',
            },
            '@media (hover: hover) and (pointer: fine)': {
              '&:hover .tile-secondary-img': {
                opacity: 1,
              },
            },
          })}
        >
          {/* Image stage with Parade-style 4:5 ratio, lift on hover, and inner backdrop */}
          <Box
            className="tile-image-stage"
            sx={(theme) => ({
              position: 'relative',
              aspectRatio: isFeaturedSpan ? { xs: '4 / 5', sm: '16 / 10' } : '4 / 5',
              width: '100%',
              borderRadius: 2,
              bgcolor: theme.palette.zayne.productTile,
              border: `1px solid ${theme.palette.divider}`,
              overflow: 'hidden',
              transition:
                'transform 0.38s cubic-bezier(0.2, 0.7, 0.2, 1), background-color 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)',
            })}
          >
            {primaryImage && (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={primaryImage.blurDataURL}
                sizes={
                  isFeaturedSpan
                    ? '(max-width: 600px) 96vw, (max-width: 1200px) 66vw, 580px'
                    : '(max-width: 600px) 48vw, (max-width: 1200px) 33vw, 340px'
                }
                style={{ objectFit: 'cover' }}
              />
            )}

            {/* Second image crossfade on desktop hover */}
            {secondaryImage && secondaryImage.id !== primaryImage?.id && (
              <Box
                className="tile-secondary-img"
                sx={{
                  position: 'absolute',
                  inset: 0,
                  opacity: 0,
                  transition: 'opacity 0.45s cubic-bezier(0.2, 0.7, 0.2, 1)',
                  pointerEvents: 'none',
                }}
              >
                <Image
                  src={secondaryImage.url}
                  alt={secondaryImage.alt}
                  fill
                  loading="lazy"
                  fetchPriority="low"
                  sizes={
                    isFeaturedSpan
                      ? '(max-width: 600px) 96vw, (max-width: 1200px) 66vw, 580px'
                      : '(max-width: 600px) 48vw, (max-width: 1200px) 33vw, 340px'
                  }
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            )}

            {/* Parade-style top floating metadata chip */}
            <Box
              sx={{
                position: 'absolute',
                top: 14,
                left: 14,
                px: 1.5,
                py: 0.5,
                borderRadius: 999,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  color: 'text.primary',
                  lineHeight: 1.2,
                }}
              >
                {categoryTag}
              </Typography>
            </Box>
          </Box>

          {/* Product details */}
          <Box sx={{ pt: 2, px: 0.25 }}>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                columnGap: 1.5,
                rowGap: 0.25,
              }}
            >
              <Typography
                component="h3"
                sx={{
                  fontFamily: 'var(--font-jost), "Jost", sans-serif',
                  fontSize: isFeaturedSpan
                    ? { xs: '1.5rem', sm: '1.85rem' }
                    : { xs: '1.3rem', sm: '1.5rem' },
                  fontWeight: 700,
                  letterSpacing: '-0.025em',
                  color: 'text.primary',
                }}
              >
                {product.name}
              </Typography>

              {lowestVariant && (
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'var(--font-jost), "Jost", sans-serif',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    fontSize: '1.15rem',
                    color: 'text.primary',
                  }}
                >
                  {hasMultipleSizes ? 'From ' : ''}
                  <AnimatedPrice kobo={lowestVariant.price_kobo} />
                </Typography>
              )}
            </Box>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                color: 'text.primary',
                opacity: 0.85,
                fontSize: '0.95rem',
                fontWeight: 400,
                mt: 0.5,
              }}
            >
              {product.type} · {product.variants.map((v) => v.label).join(' / ')}
            </Typography>
          </Box>
        </Box>

        {/* Heart save button in top-right corner */}
        <SaveHeartButton
          productId={product.id}
          productName={product.name}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 3,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            width: 36,
            height: 36,
            borderRadius: 999,
          }}
        />
      </Box>

      {/* Quick Add to bag action pill button */}
      <Box sx={{ mt: 1.75 }}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={handleQuickAdd}
          data-testid={`quick-add-${product.slug}`}
          sx={{
            py: 1,
            px: 2,
            fontSize: '0.9375rem',
            fontWeight: 600,
            borderRadius: 999,
          }}
        >
          {quickAdded
            ? '✓ Added to bag'
            : `Add to bag · ${lowestVariant?.label || ''}`}
        </Button>
      </Box>
    </Box>
  );
}
