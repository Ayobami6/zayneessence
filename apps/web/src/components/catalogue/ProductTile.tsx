'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CATEGORY_META, Product } from '@/types/domain';
import { SaveHeartButton } from '@/components/ui/SaveHeartButton';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { PhotoTile } from '@/components/glow';
import { useBag } from '@/context/BagContext';

interface ProductTileProps {
  product: Product;
  /** First tile of the full catalogue spans two columns with a wide photo. */
  isFeaturedSpan?: boolean;
  /** Tighter type for horizontal rows on phones. */
  compact?: boolean;
}

export function ProductTile({ product, isFeaturedSpan = false, compact = false }: ProductTileProps) {
  const { addToBag } = useBag();
  const [quickAdded, setQuickAdded] = useState(false);

  const primaryImage = product.images[0];
  const entryVariant = product.variants[0];
  const hasMultipleSizes = product.variants.length > 1;
  // Quick-add takes the first size that's in stock, so a sold-out entry size never reaches the bag.
  const quickAddVariant = product.variants.find((v) => v.stock > 0);
  const outOfStock = !quickAddVariant;

  const handleQuickAdd = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!quickAddVariant) return;
    const { addedUnits } = addToBag(product, quickAddVariant, 1);
    if (addedUnits === 0) return;
    setQuickAdded(true);
    setTimeout(() => setQuickAdded(false), 1700);
  };

  return (
    <Box
      component="article"
      data-testid={`product-tile-${product.slug}`}
      sx={{
        position: 'relative',
        gridColumn: isFeaturedSpan ? { xs: 'span 2', sm: 'span 2' } : 'span 1',
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 1 : 1.25,
        p: 1,
        pb: compact ? 1.5 : 2,
        borderRadius: compact ? '26px' : '30px',
        bgcolor: 'background.paper',
        minWidth: 0,
        animation: 'glowRise 0.45s ease both',
        '&:hover img': { transform: 'scale(1.03)' },
        '& img': { transition: 'transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)' },
      }}
    >
      <Box
        component={Link}
        href={`/products/${product.slug}`}
        aria-label={`${product.name}, ${product.type}`}
        sx={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
      >
        <PhotoTile
          src={primaryImage?.url || '/products/serum-lumiere/1.jpg'}
          alt={primaryImage?.alt || product.name}
          blurDataURL={primaryImage?.blurDataURL}
          aspectRatio={isFeaturedSpan ? { xs: '4 / 5', sm: '16 / 10' } : '4 / 5'}
          radius={compact ? '20px' : '24px'}
          badge={!compact}
          sizes={
            isFeaturedSpan
              ? '(max-width: 600px) 92vw, (max-width: 1200px) 60vw, 640px'
              : '(max-width: 600px) 46vw, (max-width: 1200px) 30vw, 300px'
          }
        />
      </Box>

      <SaveHeartButton
        productId={product.id}
        productName={product.name}
        size="small"
        sx={{ position: 'absolute', top: compact ? 14 : 18, right: compact ? 14 : 18 }}
      />

      <Box sx={{ px: 0.75, display: 'flex', flexDirection: 'column', gap: 0.25, minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {product.is_sample ? 'Sample · ' : ''}
          {compact ? product.type : `${CATEGORY_META[product.category].tileTag} · ${product.type}`}
        </Typography>
        <Typography component="h3" variant="h4" sx={{ fontSize: compact ? 14.5 : { xs: 15, md: 17 } }} noWrap>
          {product.name}
        </Typography>
      </Box>

      <Box sx={{ mt: 'auto', pl: 0.75, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
        {entryVariant ? (
          <Typography variant="price" sx={{ fontSize: compact ? 14 : { xs: 14.5, md: 17 } }}>
            {hasMultipleSizes ? 'From ' : ''}
            <AnimatedPrice kobo={entryVariant.price_kobo} />
          </Typography>
        ) : (
          <span />
        )}
        <Button
          variant="contained"
          size="small"
          onClick={handleQuickAdd}
          disabled={outOfStock}
          data-testid={`quick-add-${product.slug}`}
          aria-label={
            outOfStock ? `${product.name} is out of stock` : `Add ${product.name} ${quickAddVariant.label} to bag`
          }
          sx={{ minWidth: 0, px: compact ? 1.5 : 2 }}
        >
          {outOfStock ? 'Sold out' : quickAdded ? '✓ Added' : 'Add'}
        </Button>
      </Box>
    </Box>
  );
}
