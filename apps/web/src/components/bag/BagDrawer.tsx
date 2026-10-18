'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import { useBag } from '@/context/BagContext';
import { formatKoboToNgn } from '@/utils/currency';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';

export function BagDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const {
    items,
    totalCount,
    subtotalKobo,
    remainingForFreeDeliveryKobo,
    hasUnlockedFreeDelivery,
    freeDeliveryProgressPercent,
    isBagOpen,
    closeBag,
    updateQuantity,
    removeItem,
  } = useBag();

  const handleProceedToCheckout = () => {
    closeBag();
    router.push('/checkout');
  };

  return (
    <Drawer
      anchor={isMobile ? 'bottom' : 'right'}
      open={isBagOpen}
      onClose={closeBag}
      PaperProps={{
        'aria-label': 'Shopping bag',
        sx: {
          width: isMobile ? '100%' : 440,
          maxHeight: isMobile ? '88vh' : '100vh',
          borderTopLeftRadius: isMobile ? 20 : 0,
          borderTopRightRadius: isMobile ? 20 : 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h3" sx={{ fontSize: '1.65rem' }}>
          Your bag{totalCount > 0 ? ` (${totalCount})` : ''}
        </Typography>
        <IconButton onClick={closeBag} aria-label="Close bag" data-testid="close-bag-button">
          <CloseOutlinedIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Free delivery progress bar */}
      <Box
        sx={{
          px: 3,
          py: 2,
          bgcolor: 'background.default',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography
          variant="body2"
          sx={{ fontSize: '0.9375rem', mb: 1, color: 'text.primary' }}
          data-testid="free-delivery-message"
        >
          {hasUnlockedFreeDelivery
            ? 'You have complimentary delivery in Lagos and Abuja.'
            : `Add ${formatKoboToNgn(remainingForFreeDeliveryKobo)} more for free delivery`}
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 4,
            borderRadius: 999,
            bgcolor: 'divider',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${freeDeliveryProgressPercent}%`,
              height: '100%',
              bgcolor: 'primary.main',
              transition: 'width 0.35s cubic-bezier(0.2, 0.7, 0.2, 1)',
            }}
          />
        </Box>
      </Box>

      {/* Line items */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 3, py: 2 }}>
        {items.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Your bag is empty. Explore skincare, pure oud oils or perfume to begin.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                closeBag();
                router.push('/#catalogue');
              }}
            >
              Shop skincare
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                data-testid={`bag-item-${item.slug}`}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '76px 1fr',
                  gap: 2,
                  pb: 2.5,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Box
                  component={Link}
                  href={`/products/${item.slug}`}
                  onClick={closeBag}
                  sx={(t) => ({
                    position: 'relative',
                    aspectRatio: '4 / 5',
                    width: 76,
                    borderRadius: `${t.palette.zayne.tileRadius}px`,
                    bgcolor: t.palette.zayne.productTile,
                    overflow: 'hidden',
                    display: 'block',
                  })}
                >
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.thumbnailAlt}
                    fill
                    sizes="76px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 1,
                    }}
                  >
                    <Box>
                      <Typography
                        component={Link}
                        href={`/products/${item.slug}`}
                        onClick={closeBag}
                        sx={{
                          fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
                          fontSize: '1.2rem',
                          color: 'text.primary',
                          textDecoration: 'none',
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
                        {item.sizeLabel} · {item.type}
                      </Typography>
                    </Box>

                    <AnimatedPrice
                      kobo={item.priceKobo * item.quantity}
                      sx={{ fontWeight: 400, fontSize: '0.95rem' }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mt: 1,
                    }}
                  >
                    {/* Quantity stepper */}
                    <Box
                      sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 999,
                        px: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <RemoveOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography
                        key={item.quantity}
                        component="span"
                        sx={{
                          px: 1.5,
                          fontSize: '0.875rem',
                          animation: 'priceFadeUp 0.25s cubic-bezier(0.2, 0.7, 0.2, 1)',
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <AddOutlinedIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>

                    <Button
                      size="small"
                      color="inherit"
                      onClick={() => removeItem(item.id)}
                      sx={{
                        color: 'text.secondary',
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.8125rem',
                        textDecoration: 'underline',
                        textUnderlineOffset: '3px',
                      }}
                    >
                      Remove
                    </Button>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Footer with Subtotal & Checkout button */}
      {items.length > 0 && (
        <Box
          sx={{
            px: 3,
            pt: 2.5,
            pb: isMobile ? 'calc(20px + env(safe-area-inset-bottom, 0px))' : 3,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 400 }}>
              Subtotal
            </Typography>
            <AnimatedPrice
              kobo={subtotalKobo}
              data-testid="bag-subtotal"
              sx={{ fontSize: '1.15rem', fontWeight: 500 }}
            />
          </Box>
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2 }}>
            Delivery and complimentary gift wrapping are selected at checkout.
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleProceedToCheckout}
            data-testid="proceed-to-checkout-button"
            sx={{ py: 1.5 }}
          >
            Continue to checkout · {formatKoboToNgn(subtotalKobo)}
          </Button>
        </Box>
      )}
    </Drawer>
  );
}
