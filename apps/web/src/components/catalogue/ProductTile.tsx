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
          {/* Image stage with 4px radius and 5px lift on hover/focus */}
          <Box
            className="tile-image-stage"
            sx={(theme) => ({
              position: 'relative',
              aspectRatio: isFeaturedSpan ? { xs: '4 / 5', sm: '16 / 10' } : '4 / 5',
              width: '100%',
              borderRadius: `${theme.palette.zayne.tileRadius}px`,
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
                    : '(max-width: 600px) 48vw, (max-width: 1200px) 33vw, 280px'
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
                      : '(max-width: 600px) 48vw, (max-width: 1200px) 33vw, 280px'
                  }
                  style={{ objectFit: 'cover' }}
                />
              </Box>
            )}
          </Box>

          {/* Product details */}
          <Box sx={{ pt: 1.75, px: 0.25 }}>
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
                variant="h4"
                component="h3"
                sx={{
                  fontSize: isFeaturedSpan
                    ? { xs: '1.35rem', sm: '1.6rem' }
                    : { xs: '1.15rem', sm: '1.35rem' },
                }}
              >
                {product.name}
              </Typography>

              {lowestVariant && (
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 400, whiteSpace: 'nowrap', fontSize: '0.9375rem' }}
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
                color: 'text.secondary',
                mt: 0.35,
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
            zIndex: 2,
          }}
        />
      </Box>

      {/* Quick Add to bag / Choose size action bar */}
      <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
        <Button
          size="small"
          variant="outlined"
          fullWidth
          onClick={handleQuickAdd}
          data-testid={`quick-add-${product.slug}`}
          sx={{
            py: 0.75,
            px: 2,
            fontSize: '0.84rem',
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
