'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { formatKoboToNgn } from '@/utils/currency';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { ArcGauge, CircleIconButton, QuantityStepper } from '@/components/glow';

export function BagDrawer() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const { settings } = useStoreData();
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

  const threshold = formatKoboToNgn(settings.freeDeliveryThresholdKobo);

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
          width: isMobile ? '100%' : 460,
          maxHeight: isMobile ? '92dvh' : '100dvh',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 }, pb: 1.5 }}>
        <Box>
          <Typography component="h2" variant="h3" sx={{ fontSize: 22 }}>
            Your bag
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
          </Typography>
        </Box>
        <CircleIconButton label="Close bag" onClick={closeBag} data-testid="close-bag-button">
          <CloseRoundedIcon />
        </CircleIconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, md: 3 }, pb: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ p: 2, pb: 1.75, borderRadius: '32px', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
          <ArcGauge
            progress={freeDeliveryProgressPercent / 100}
            value={hasUnlockedFreeDelivery ? 'Unlocked' : formatKoboToNgn(remainingForFreeDeliveryKobo)}
            caption={hasUnlockedFreeDelivery ? 'Free Lagos & Abuja delivery' : 'to free delivery'}
            startLabel="₦0"
            endLabel={threshold}
            ariaLabel={
              hasUnlockedFreeDelivery
                ? 'Free delivery unlocked'
                : `${formatKoboToNgn(remainingForFreeDeliveryKobo)} left until free delivery at ${threshold}`
            }
            maxWidth={280}
          />
          <Typography
            role="status"
            aria-live="polite"
            data-testid="free-delivery-message"
            variant="body2"
            sx={{ fontWeight: 600, textAlign: 'center', mx: 'auto' }}
          >
            {hasUnlockedFreeDelivery
              ? 'You have complimentary delivery in Lagos and Abuja.'
              : `Add ${formatKoboToNgn(remainingForFreeDeliveryKobo)} more for free delivery in Lagos and Abuja.`}
          </Typography>
        </Box>

        {items.length === 0 ? (
          <Box sx={{ p: 4, borderRadius: '28px', bgcolor: 'background.paper', textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Your bag is empty</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Start with the consultation, or browse the collection.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                closeBag();
                router.push('/#catalogue');
              }}
            >
              Browse the collection
            </Button>
          </Box>
        ) : (
          <Box component="ul" aria-label="Pieces in your bag" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                component="li"
                data-testid={`bag-item-${item.slug}`}
                sx={{ display: 'flex', gap: 1.5, p: 1.25, borderRadius: '28px', bgcolor: 'background.paper' }}
              >
                <Box
                  component={Link}
                  href={`/products/${item.slug}`}
                  onClick={closeBag}
                  aria-label={item.name}
                  sx={{ position: 'relative', width: 84, height: 100, flexShrink: 0, borderRadius: '22px', overflow: 'hidden', bgcolor: 'glow.petal' }}
                >
                  <Image src={item.thumbnailUrl} alt={item.thumbnailAlt} fill sizes="84px" style={{ objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', py: 0.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontSize: 15, fontWeight: 700 }} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }} noWrap>
                        {item.type} · {item.sizeLabel}
                      </Typography>
                    </Box>
                    <CircleIconButton
                      label={`Remove ${item.name} from bag`}
                      tone="ground"
                      size={34}
                      onClick={() => removeItem(item.id)}
                      data-testid={`remove-${item.slug}`}
                    >
                      <CloseRoundedIcon />
                    </CircleIconButton>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                    <Typography variant="price" sx={{ fontSize: 16 }}>
                      <AnimatedPrice kobo={item.priceKobo * item.quantity} />
                    </Typography>
                    <QuantityStepper
                      size="sm"
                      value={item.quantity}
                      itemName={item.name}
                      max={item.maxQuantity}
                      onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                      onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                      testIdPrefix={`bag-qty-${item.slug}`}
                    />
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {items.length > 0 ? (
        <Box sx={{ px: { xs: 2, md: 3 }, pt: 1.5, pb: { xs: 'calc(16px + env(safe-area-inset-bottom, 0px))', md: 3 }, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Box sx={{ p: 2, borderRadius: '28px', bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="price" sx={{ fontSize: 16 }} data-testid="bag-subtotal">
                <AnimatedPrice kobo={subtotalKobo} />
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Delivery
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, textAlign: 'right' }}>
                {hasUnlockedFreeDelivery
                  ? 'Free in Lagos & Abuja'
                  : `Lagos & Abuja ${formatKoboToNgn(settings.lagosAbujaRateKobo)} · elsewhere ${formatKoboToNgn(settings.restOfNigeriaRateKobo)}`}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary' }}>
              <CardGiftcardOutlinedIcon sx={{ fontSize: 16 }} />
              <Typography variant="body2" color="text.secondary">
                Gift wrap and a handwritten note are added at checkout
                {settings.giftWrapFeeKobo === 0 ? ', complimentary' : ''}.
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={handleProceedToCheckout}
            startIcon={<LockOutlinedIcon />}
            data-testid="proceed-to-checkout-button"
          >
            Checkout · {formatKoboToNgn(subtotalKobo)}
          </Button>
          <Button variant="text" onClick={closeBag}>
            Continue shopping
          </Button>
        </Box>
      ) : null}
    </Drawer>
  );
}
