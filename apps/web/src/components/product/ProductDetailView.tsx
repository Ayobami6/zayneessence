'use client';

import React, { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Divider from '@mui/material/Divider';
import ExpandMoreOutlinedIcon from '@mui/icons-material/ExpandMoreOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { Product } from '@/types/domain';
import { ArchedWindow } from '@/components/ui/ArchedWindow';
import { SaveHeartButton } from '@/components/ui/SaveHeartButton';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { ProductTile } from '@/components/catalogue/ProductTile';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';

interface ProductDetailViewProps {
  product: Product;
  onCloseModal?: () => void;
}

export function ProductDetailView({ product, onCloseModal }: ProductDetailViewProps) {
  const { addToBag } = useBag();
  const { publishedProducts } = useStoreData();

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [addedFeedback, setAddedFeedback] = useState<boolean>(false);

  const touchStartX = useRef<number | null>(null);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];

  const totalLinePriceKobo = (selectedVariant?.price_kobo || 0) * quantity;

  const isFragrance =
    product.category === 'Perfume' ||
    product.category === 'Oud' ||
    product.category === 'Roll-ons';

  const relatedProducts = useMemo(() => {
    const sameCategory = publishedProducts.filter(
      (p) => p.id !== product.id && p.category === product.category
    );
    const others = publishedProducts.filter(
      (p) => p.id !== product.id && p.category !== product.category
    );
    return [...sameCategory, ...others].slice(0, 4);
  }, [publishedProducts, product.id, product.category]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
    const deltaX = endX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        setActiveImageIndex((idx) => (idx + 1) % product.images.length);
      } else {
        setActiveImageIndex(
          (idx) => (idx - 1 + product.images.length) % product.images.length
        );
      }
    }
    touchStartX.current = null;
  };

  const handleAddToBag = () => {
    if (!selectedVariant) return;
    addToBag(product, selectedVariant, quantity);
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1700);
  };

  const currentImage = product.images[activeImageIndex] || product.images[0];

  return (
    <Box sx={{ py: { xs: 2, md: 4 } }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1.05fr' },
          gap: { xs: 4, md: 7 },
          alignItems: 'start',
        }}
      >
        {/* Left: Swipeable image gallery in the arched window, with dot indicators and save (heart) button */}
        <Box sx={{ position: 'relative', maxWidth: 520, width: '100%', mx: 'auto' }}>
          <Box
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            sx={{ position: 'relative' }}
          >
            <ArchedWindow>
              {currentImage && (
                <Image
                  key={currentImage.id}
                  src={currentImage.url}
                  alt={currentImage.alt}
                  fill
                  priority
                  placeholder="blur"
                  blurDataURL={currentImage.blurDataURL}
                  sizes="(max-width: 900px) 92vw, 520px"
                  style={{ objectFit: 'cover' }}
                />
              )}
            </ArchedWindow>

            {/* Save (heart) button */}
            <SaveHeartButton
              productId={product.id}
              productName={product.name}
              sx={{
                position: 'absolute',
                top: 24,
                right: 24,
                zIndex: 3,
              }}
            />

            {/* Gallery prev/next buttons when multiple images exist */}
            {product.images.length > 1 && (
              <>
                <IconButton
                  size="small"
                  aria-label="Previous product image"
                  onClick={() =>
                    setActiveImageIndex(
                      (idx) => (idx - 1 + product.images.length) % product.images.length
                    )
                  }
                  sx={{
                    position: 'absolute',
                    left: 18,
                    bottom: 24,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ChevronLeftOutlinedIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  aria-label="Next product image"
                  onClick={() =>
                    setActiveImageIndex((idx) => (idx + 1) % product.images.length)
                  }
                  sx={{
                    position: 'absolute',
                    right: 18,
                    bottom: 24,
                    bgcolor: 'background.paper',
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <ChevronRightOutlinedIcon fontSize="small" />
                </IconButton>
              </>
            )}
          </Box>

          {/* Dot indicators */}
          {product.images.length > 1 && (
            <Box
              role="tablist"
              aria-label="Product gallery images"
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1.25,
                mt: 2,
              }}
            >
              {product.images.map((img, idx) => {
                const isSelected = idx === activeImageIndex;
                return (
                  <Box
                    key={img.id}
                    component="button"
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    aria-label={`View image ${idx + 1} of ${product.images.length}: ${img.alt}`}
                    onClick={() => setActiveImageIndex(idx)}
                    sx={(theme) => ({
                      width: isSelected ? 24 : 8,
                      height: 8,
                      borderRadius: 999,
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      bgcolor: isSelected
                        ? theme.palette.primary.main
                        : theme.palette.divider,
                      transition: 'all 0.3s cubic-bezier(0.2, 0.7, 0.2, 1)',
                    })}
                  />
                );
              })}
            </Box>
          )}
        </Box>

        {/* Right: Product type, name, price, description, size selector, notes/ingredients, stepper, Add to bag, accordions */}
        <Box>
          <Typography
            variant="body2"
            sx={{ color: 'text.secondary', mb: 0.75, fontWeight: 400 }}
          >
            {product.type}
          </Typography>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: 2,
              mb: 2,
            }}
          >
            <Typography variant="h2" component="h1">
              {product.name}
            </Typography>

            {selectedVariant && (
              <AnimatedPrice
                kobo={selectedVariant.price_kobo}
                data-testid="product-detail-price"
                sx={{
                  fontSize: { xs: '1.35rem', md: '1.6rem' },
                  fontWeight: 400,
                  whiteSpace: 'nowrap',
                }}
              />
            )}
          </Box>

          <Typography variant="body1" sx={{ color: 'text.primary', mb: 3.5 }}>
            {product.description}
          </Typography>

          {/* Size selector (pill ToggleButtons) */}
          <Box sx={{ mb: 3.5 }}>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 1.25, fontWeight: 400 }}
            >
              Size
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={selectedVariant?.id}
              onChange={(_event, nextId) => {
                if (nextId !== null) {
                  setSelectedVariantId(nextId);
                }
              }}
              aria-label="Choose size"
            >
              {product.variants.map((variant) => (
                <ToggleButton
                  key={variant.id}
                  value={variant.id}
                  data-testid={`size-option-${variant.label.replace(/\s+/g, '-')}`}
                >
                  {variant.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>

          {/* Scent notes in three rows (Top, Heart, Base) for fragrances */}
          {product.notes && (
            <Box
              sx={{
                mb: 3.5,
                p: 2.5,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h4" sx={{ mb: 1.5, fontSize: '1.15rem' }}>
                Scent architecture
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '76px 1fr',
                    gap: 1.5,
                    pb: 1.25,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    Top
                  </Typography>
                  <Typography variant="body2">{product.notes.top}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '76px 1fr',
                    gap: 1.5,
                    pb: 1.25,
                    borderBottom: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    Heart
                  </Typography>
                  <Typography variant="body2">{product.notes.heart}</Typography>
                </Box>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '76px 1fr',
                    gap: 1.5,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                    Base
                  </Typography>
                  <Typography variant="body2">{product.notes.base}</Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Key ingredients for skincare & botanical oils */}
          {product.ingredients && product.ingredients.length > 0 && (
            <Box
              sx={{
                mb: 3.5,
                p: 2.5,
                borderRadius: 1,
                bgcolor: 'background.paper',
                border: 1,
                borderColor: 'divider',
              }}
            >
              <Typography variant="h4" sx={{ mb: 1.25, fontSize: '1.15rem' }}>
                Key ingredients
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  pl: 2.5,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 0.75,
                }}
              >
                {product.ingredients.map((ingredient) => (
                  <Typography key={ingredient} component="li" variant="body2">
                    {ingredient}
                  </Typography>
                ))}
              </Box>
            </Box>
          )}

          {/* Quantity stepper + "Add to bag, ₦X" button */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 4,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                border: 1,
                borderColor: 'divider',
                borderRadius: 999,
                bgcolor: 'background.paper',
                px: 1,
                height: 48,
              }}
            >
              <IconButton
                size="small"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
              >
                <RemoveOutlinedIcon fontSize="small" />
              </IconButton>
              <Typography
                key={quantity}
                component="span"
                data-testid="product-quantity-value"
                sx={{
                  px: 2,
                  minWidth: 36,
                  textAlign: 'center',
                  fontWeight: 400,
                  animation: 'priceFadeUp 0.25s cubic-bezier(0.2, 0.7, 0.2, 1)',
                }}
              >
                {quantity}
              </Typography>
              <IconButton
                size="small"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
              >
                <AddOutlinedIcon fontSize="small" />
              </IconButton>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleAddToBag}
              disabled={!selectedVariant || selectedVariant.stock <= 0}
              data-testid="add-to-bag-button"
              sx={{
                height: 48,
                fontSize: '0.96rem',
              }}
            >
              {selectedVariant && selectedVariant.stock <= 0 ? (
                'Out of stock'
              ) : addedFeedback ? (
                '✓ Added to bag'
              ) : (
                <>
                  Add to bag, {formatKoboToNgn(totalLinePriceKobo)}
                </>
              )}
            </Button>
          </Box>

          {/* Accordions for "How to wear" or "How to use", and for "Delivery and returns" */}
          <Box>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreOutlinedIcon />}
                aria-controls="how-to-use-content"
                id="how-to-use-header"
              >
                <Typography variant="h4" sx={{ fontSize: '1.1rem' }}>
                  {isFragrance ? 'How to wear' : 'How to use'}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {product.how_to_use}
                </Typography>
              </AccordionDetails>
            </Accordion>

            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreOutlinedIcon />}
                aria-controls="delivery-returns-content"
                id="delivery-returns-header"
              >
                <Typography variant="h4" sx={{ fontSize: '1.1rem' }}>
                  Delivery and returns
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                  Lagos and Abuja orders arrive within 1–2 days, with complimentary
                  delivery on orders over ₦150,000. Rest of Nigeria orders arrive in
                  2–5 working days. Same-day studio pickup is available in Ikoyi and
                  Maitama.
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Unopened pieces in their original sealed box may be returned within
                  14 days of delivery. Due to the intimate nature of pure oud oils and
                  attars, opened flacons cannot be exchanged.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>
      </Box>

      {/* "You may also like" row of related products */}
      {relatedProducts.length > 0 && (
        <Box sx={{ mt: { xs: 6, md: 9 } }}>
          <Divider sx={{ mb: { xs: 4, md: 6 } }} />
          <Typography variant="h3" sx={{ mb: 3 }}>
            You may also like
          </Typography>
          <Box
            onClick={() => {
              // If user clicks a related item inside the modal, allow navigation to update smoothly
              if (onCloseModal) {
                // Keep modal open as URL updates to the new product slug
              }
            }}
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                md: 'repeat(4, minmax(0, 1fr))',
              },
              gap: { xs: 2.5, sm: 3 },
            }}
          >
            {relatedProducts.map((related) => (
              <ProductTile key={related.id} product={related} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
