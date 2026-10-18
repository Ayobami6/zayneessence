'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { useAuth } from '@/context/AuthContext';
import {
  DeliveryMethodId,
  OrderRecord,
  PaymentProvider,
} from '@/types/domain';
import { NIGERIA_STATES_AND_FCT, isLagosOrAbuja } from '@/data/nigeria-states';
import { calculateDeliveryFeeKobo } from '@/services/store-service';
import { createOrderNotifications } from '@/services/notification-service';
import { generatePaymentReference } from '@/services/payment-service';
import { formatKoboToNgn } from '@/utils/currency';
import {
  formatNigerianPhone,
  isValidNigerianPhone,
  toE164NigerianPhone,
} from '@/utils/phone';
import { AnimatedPrice } from '@/components/ui/AnimatedPrice';
import { PaystackMockDialog } from '@/components/checkout/PaystackMockDialog';

export default function CheckoutPage() {
  const { items, subtotalKobo, clearBag } = useBag();
  const { settings, addOrder } = useStoreData();
  const { session, signInWithMagicLink } = useAuth();

  const [checkoutMode, setCheckoutMode] = useState<'guest' | 'signin'>('guest');
  const [recipientName, setRecipientName] = useState<string>('Amara Danjuma');
  const [email, setEmail] = useState<string>('amara@zayneessence.com');
  const [phone, setPhone] = useState<string>('+234 803 456 7890');
  const [selectedState, setSelectedState] = useState<string>('Lagos');
  const [cityOrLga, setCityOrLga] = useState<string>('Ikoyi');
  const [streetAddress, setStreetAddress] = useState<string>('14 Bourdillon Road');
  const [landmark, setLandmark] = useState<string>('Near Falomo Roundabout');

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodId>('lagos_abuja');
  const [giftWrap, setGiftWrap] = useState<boolean>(false);
  const [giftNote, setGiftNote] = useState<string>('');
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('paystack');

  const [formError, setFormError] = useState<string>('');
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [activeReference, setActiveReference] = useState<string>('');
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  // Sync from signed-in session if present
  useEffect(() => {
    if (session) {
      setRecipientName(session.name);
      setEmail(session.email);
      setPhone(session.phone);
      const defaultAddr = session.savedAddresses[0];
      if (defaultAddr) {
        setSelectedState(defaultAddr.state);
        setCityOrLga(defaultAddr.cityOrLga);
        setStreetAddress(defaultAddr.streetAddress);
        setLandmark(defaultAddr.landmark || '');
      }
    }
  }, [session]);

  const currentStateObj = useMemo(
    () =>
      NIGERIA_STATES_AND_FCT.find((s) => s.name === selectedState) ||
      NIGERIA_STATES_AND_FCT[0],
    [selectedState]
  );

  // Update city/LGA list and automatic delivery zone when state changes
  const handleStateChange = (nextStateName: string) => {
    setSelectedState(nextStateName);
    const entry = NIGERIA_STATES_AND_FCT.find((s) => s.name === nextStateName);
    if (entry && entry.citiesOrLgas[0]) {
      setCityOrLga(entry.citiesOrLgas[0]);
    }
    if (deliveryMethod !== 'store_pickup') {
      setDeliveryMethod(isLagosOrAbuja(nextStateName) ? 'lagos_abuja' : 'rest_of_nigeria');
    }
  };

  const deliveryFeeKobo = useMemo(
    () => calculateDeliveryFeeKobo(deliveryMethod, subtotalKobo, settings),
    [deliveryMethod, subtotalKobo, settings]
  );

  const giftWrapFeeKobo = giftWrap ? settings.giftWrapFeeKobo : 0;
  const totalKobo = subtotalKobo + deliveryFeeKobo + giftWrapFeeKobo;

  const handleOpenPayment = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError('');

    if (!recipientName.trim()) {
      setFormError('Enter the recipient’s full name to continue.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setFormError('Enter a valid email address so we can send your receipt.');
      return;
    }
    if (!isValidNigerianPhone(phone)) {
      setFormError(
        'Enter a valid Nigerian mobile number starting with +234 (for example, +234 803 456 7890).'
      );
      return;
    }
    if (deliveryMethod !== 'store_pickup' && !streetAddress.trim()) {
      setFormError('Enter a street address for delivery, or choose Store pickup.');
      return;
    }

    const ref = generatePaymentReference(paymentProvider);
    setActiveReference(ref);
    setPaymentModalOpen(true);
  };

  const handlePaymentVerified = (result: {
    reference: string;
    channel: 'card' | 'bank_transfer' | 'ussd';
    provider: PaymentProvider;
  }) => {
    setPaymentModalOpen(false);

    const now = new Date().toISOString();
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `ZE-${Math.floor(100000 + Math.random() * 900000)}`;
    const normalizedPhone = toE164NigerianPhone(phone);

    const initialNotifications = createOrderNotifications(
      {
        id: orderId,
        orderNumber,
        customerEmail: email.trim(),
        customerPhone: normalizedPhone,
      },
      'paid',
      settings.whatsappUpdatesEnabled
    );

    const newOrder: OrderRecord = {
      id: orderId,
      orderNumber,
      customerEmail: email.trim(),
      customerPhone: normalizedPhone,
      customerName: recipientName.trim(),
      address: {
        id: `addr-${Date.now()}`,
        recipientName: recipientName.trim(),
        phone: normalizedPhone,
        state: selectedState,
        cityOrLga,
        streetAddress:
          deliveryMethod === 'store_pickup'
            ? 'Studio pickup (14 Bourdillon Road, Ikoyi / 22 Pope John Paul II St, Maitama)'
            : streetAddress.trim(),
        landmark: landmark.trim(),
      },
      deliveryMethod,
      deliveryFeeKobo,
      subtotalKobo,
      giftWrap,
      giftWrapFeeKobo,
      giftNote: giftWrap ? giftNote.trim() : '',
      totalKobo,
      status: 'paid',
      items: items.map((item, idx) => ({
        id: `oi-${Date.now()}-${idx}`,
        orderId,
        productId: item.productId,
        variantId: item.variantId,
        productName: item.name,
        sizeLabel: item.sizeLabel,
        priceKobo: item.priceKobo,
        quantity: item.quantity,
        thumbnailUrl: item.thumbnailUrl,
      })),
      payment: {
        id: `pay-${Date.now()}`,
        orderId,
        provider: result.provider,
        reference: result.reference,
        channel: result.channel,
        status: 'verified',
        amountKobo: totalKobo,
        verifiedByWebhook: true,
        createdAt: now,
      },
      notifications: initialNotifications,
      createdAt: now,
      updatedAt: now,
    };

    addOrder(newOrder);
    clearBag();
    setCompletedOrder(newOrder);
  };

  // Order confirmation screen
  if (completedOrder) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 9 } }}>
        <Box
          data-testid="order-confirmation-screen"
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Chip
            label={`Order ${completedOrder.orderNumber}`}
            size="small"
            sx={{ mb: 2.5 }}
          />
          <Typography
            variant="h2"
            component="h1"
            data-testid="order-confirmation-heading"
            sx={{ mb: 2 }}
          >
            Order placed. You’ll get a WhatsApp message when it leaves our studio.
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            We have sent a confirmation receipt via Resend to{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 400 }}>
              {completedOrder.customerEmail}
            </Box>{' '}
            and registered WhatsApp updates for{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 400 }}>
              {completedOrder.customerPhone}
            </Box>
            .
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 3,
              mb: 4,
            }}
          >
            <Box>
              <Typography variant="h4" sx={{ mb: 1, fontSize: '1.1rem' }}>
                Delivery details
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {completedOrder.customerName}
                <br />
                {completedOrder.address.streetAddress}
                <br />
                {completedOrder.address.cityOrLga}, {completedOrder.address.state}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h4" sx={{ mb: 1, fontSize: '1.1rem' }}>
                Payment verified
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Total paid: {formatKoboToNgn(completedOrder.totalKobo)}
                <br />
                Provider:{' '}
                {completedOrder.payment.provider === 'paystack'
                  ? 'Paystack'
                  : 'Flutterwave'}{' '}
                ({completedOrder.payment.channel.replace('_', ' ')})
                <br />
                Webhook reference: {completedOrder.payment.reference}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <Button
              component={Link}
              href="/account"
              variant="contained"
              color="primary"
            >
              Track order in account
            </Button>
            <Button component={Link} href="/" variant="outlined">
              Continue shopping
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" sx={{ mb: 2 }}>
          Your bag is empty
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, mx: 'auto' }}>
          Add skincare, pure oud oils or perfume to your bag before checking out.
        </Typography>
        <Button component={Link} href="/#catalogue" variant="contained" color="primary">
          Shop skincare
        </Button>
      </Container>
    );
  }

  const inputBoxSx = {
    px: 2,
    py: 1.25,
    borderRadius: 1,
    border: 1,
    borderColor: 'divider',
    bgcolor: 'background.default',
    width: '100%',
    fontSize: '0.95rem',
  };

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Typography variant="h2" component="h1" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Box
        component="form"
        onSubmit={handleOpenPayment}
        noValidate
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1.25fr 0.75fr' },
          gap: { xs: 4, md: 6 },
          alignItems: 'start',
        }}
      >
        {/* Left column: Guest/Sign-in, Contact, Nigerian Address, Delivery, Gift wrap, Payment */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* 1. Guest checkout or sign-in */}
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
                mb: 2,
              }}
            >
              <Typography variant="h3" sx={{ fontSize: '1.4rem' }}>
                1. Contact details
              </Typography>

              {!session && (
                <ToggleButtonGroup
                  size="small"
                  exclusive
                  value={checkoutMode}
                  onChange={(_e, val) => {
                    if (val !== null) setCheckoutMode(val);
                  }}
                  aria-label="Checkout mode"
                >
                  <ToggleButton value="guest">Guest checkout</ToggleButton>
                  <ToggleButton value="signin">Sign in</ToggleButton>
                </ToggleButtonGroup>
              )}
            </Box>

            {checkoutMode === 'signin' && !session && (
              <Box
                sx={{
                  p: 2,
                  mb: 2.5,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  border: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Typography variant="body2">
                  Sign in instantly with your email magic link to load saved addresses.
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    signInWithMagicLink(email || 'amara@zayneessence.com', recipientName);
                    setCheckoutMode('guest');
                  }}
                >
                  Send magic link &amp; sign in
                </Button>
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Typography
                  component="label"
                  htmlFor="checkout-name"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Full name
                </Typography>
                <InputBase
                  id="checkout-name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Amara Danjuma"
                  inputProps={{ 'data-testid': 'checkout-name-input' }}
                  sx={inputBoxSx}
                />
              </Box>

              <Box>
                <Typography
                  component="label"
                  htmlFor="checkout-phone"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Phone number (+234 for WhatsApp updates)
                </Typography>
                <InputBase
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatNigerianPhone(e.target.value))}
                  placeholder="+234 803 123 4567"
                  inputProps={{ 'data-testid': 'checkout-phone-input' }}
                  sx={inputBoxSx}
                />
              </Box>

              <Box>
                <Typography
                  component="label"
                  htmlFor="checkout-email"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Email address
                </Typography>
                <InputBase
                  id="checkout-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="amara@zayneessence.com"
                  inputProps={{ 'data-testid': 'checkout-email-input' }}
                  sx={inputBoxSx}
                />
              </Box>
            </Box>
          </Box>

          {/* 2. Delivery address with 36 states + FCT picker, then city or LGA */}
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '1.4rem', mb: 2 }}>
              2. Delivery address (Nigeria)
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
              <Box>
                <Typography
                  component="label"
                  htmlFor="checkout-state"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  State (36 states &amp; FCT)
                </Typography>
                <Box
                  component="select"
                  id="checkout-state"
                  data-testid="checkout-state-select"
                  value={selectedState}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    handleStateChange(e.target.value)
                  }
                  sx={(theme) => ({
                    width: '100%',
                    height: 48,
                    px: 2,
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                  })}
                >
                  {NIGERIA_STATES_AND_FCT.map((st) => (
                    <option key={st.code} value={st.name}>
                      {st.name}
                    </option>
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography
                  component="label"
                  htmlFor="checkout-city-lga"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  City or LGA
                </Typography>
                <Box
                  component="select"
                  id="checkout-city-lga"
                  data-testid="checkout-city-select"
                  value={cityOrLga}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCityOrLga(e.target.value)
                  }
                  sx={(theme) => ({
                    width: '100%',
                    height: 48,
                    px: 2,
                    borderRadius: '4px',
                    border: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.background.default,
                    color: theme.palette.text.primary,
                    fontFamily: 'inherit',
                    fontSize: '0.95rem',
                  })}
                >
                  {currentStateObj.citiesOrLgas.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </Box>
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Typography
                  component="label"
                  htmlFor="checkout-street"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Street address
                </Typography>
                <InputBase
                  id="checkout-street"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="14 Bourdillon Road"
                  inputProps={{ 'data-testid': 'checkout-street-input' }}
                  sx={inputBoxSx}
                />
              </Box>

              <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                <Typography
                  component="label"
                  htmlFor="checkout-landmark"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Nearest landmark or gate note (optional)
                </Typography>
                <InputBase
                  id="checkout-landmark"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="Opposite Falomo Gardens"
                  sx={inputBoxSx}
                />
              </Box>
            </Box>
          </Box>

          {/* 3. Delivery options */}
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '1.4rem', mb: 2 }}>
              3. Delivery method
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {[
                {
                  id: 'lagos_abuja' as DeliveryMethodId,
                  title: 'Lagos and Abuja',
                  subtitle: `1–2 days, free over ${formatKoboToNgn(
                    settings.freeDeliveryThresholdKobo
                  )}`,
                  feeLabel:
                    subtotalKobo >= settings.freeDeliveryThresholdKobo
                      ? 'Free'
                      : formatKoboToNgn(settings.lagosAbujaRateKobo),
                },
                {
                  id: 'rest_of_nigeria' as DeliveryMethodId,
                  title: 'Rest of Nigeria',
                  subtitle: '2–5 working days, tracked courier dispatch',
                  feeLabel: formatKoboToNgn(settings.restOfNigeriaRateKobo),
                },
                {
                  id: 'store_pickup' as DeliveryMethodId,
                  title: 'Store pickup',
                  subtitle: 'Collect from our Ikoyi (Lagos) or Maitama (Abuja) studio',
                  feeLabel: 'Free',
                },
              ].map((option) => {
                const selected = deliveryMethod === option.id;
                return (
                  <Box
                    key={option.id}
                    component="button"
                    type="button"
                    data-testid={`delivery-option-${option.id}`}
                    onClick={() => setDeliveryMethod(option.id)}
                    sx={(theme) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      textAlign: 'left',
                      p: 2,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      border: `1px solid ${
                        selected ? theme.palette.primary.main : theme.palette.divider
                      }`,
                      bgcolor: selected
                        ? theme.palette.zayne.productTile
                        : theme.palette.background.default,
                      color: theme.palette.text.primary,
                      fontFamily: 'inherit',
                      transition: theme.palette.zayne.modeTransition,
                    })}
                  >
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 400 }}>
                        {option.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {option.subtitle}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {option.feeLabel}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>

          {/* 4. Gift wrap and gift note */}
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="h3" sx={{ fontSize: '1.4rem' }}>
                  4. Gift wrap and note
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Wrapped in heavy plum linen paper with a wax-sealed card (
                  {settings.giftWrapFeeKobo === 0
                    ? 'Complimentary'
                    : formatKoboToNgn(settings.giftWrapFeeKobo)}
                  ).
                </Typography>
              </Box>
              <Chip
                label={giftWrap ? '✓ Gift wrap added' : 'Add gift wrap'}
                clickable
                color={giftWrap ? 'primary' : 'default'}
                data-active={giftWrap ? 'true' : 'false'}
                data-testid="gift-wrap-toggle"
                onClick={() => setGiftWrap((prev) => !prev)}
              />
            </Box>

            {giftWrap && (
              <Box sx={{ mt: 2.5 }}>
                <Typography
                  component="label"
                  htmlFor="checkout-gift-note"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Gift note (handwritten on our studio card)
                </Typography>
                <InputBase
                  id="checkout-gift-note"
                  multiline
                  rows={3}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Write your message here…"
                  inputProps={{ 'data-testid': 'gift-note-input' }}
                  sx={inputBoxSx}
                />
              </Box>
            )}
          </Box>

          {/* 5. Payment provider (Paystack primary, Flutterwave fallback) */}
          <Box
            sx={{
              p: 3,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="h3" sx={{ fontSize: '1.4rem', mb: 1 }}>
              5. Payment
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Pay securely in NGN via card, bank transfer or USSD. Payment status is
              confirmed via verified webhook signature.
            </Typography>

            <ToggleButtonGroup
              exclusive
              value={paymentProvider}
              onChange={(_e, next) => {
                if (next !== null) setPaymentProvider(next);
              }}
              aria-label="Payment gateway"
            >
              <ToggleButton value="paystack" data-testid="provider-paystack">
                Pay with Paystack (Card, Transfer, USSD)
              </ToggleButton>
              <ToggleButton value="flutterwave" data-testid="provider-flutterwave">
                Flutterwave (Fallback)
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Right column: Order summary & Place order button */}
        <Box
          sx={{
            position: { md: 'sticky' },
            top: { md: 100 },
            p: 3,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h3" sx={{ fontSize: '1.4rem', mb: 2.5 }}>
            Order summary
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {items.map((item) => (
              <Box
                key={item.id}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr auto',
                  gap: 1.5,
                  alignItems: 'center',
                }}
              >
                <Box
                  sx={(t) => ({
                    position: 'relative',
                    width: 56,
                    aspectRatio: '4 / 5',
                    borderRadius: `${t.palette.zayne.tileRadius}px`,
                    bgcolor: t.palette.zayne.productTile,
                    overflow: 'hidden',
                  })}
                >
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.thumbnailAlt}
                    fill
                    sizes="56px"
                    style={{ objectFit: 'cover' }}
                  />
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontFamily: 'var(--font-italiana), "Italiana", Georgia, serif',
                      fontSize: '1.05rem',
                    }}
                  >
                    {item.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {item.sizeLabel} × {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 400 }}>
                  {formatKoboToNgn(item.priceKobo * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Subtotal
              </Typography>
              <Typography variant="body2">{formatKoboToNgn(subtotalKobo)}</Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Delivery
              </Typography>
              <Typography variant="body2" data-testid="checkout-delivery-fee">
                {deliveryFeeKobo === 0 ? 'Free' : formatKoboToNgn(deliveryFeeKobo)}
              </Typography>
            </Box>

            {giftWrap && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Gift wrap
                </Typography>
                <Typography variant="body2">
                  {giftWrapFeeKobo === 0 ? 'Complimentary' : formatKoboToNgn(giftWrapFeeKobo)}
                </Typography>
              </Box>
            )}
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              mb: 3,
            }}
          >
            <Typography variant="h4" sx={{ fontSize: '1.2rem' }}>
              Total
            </Typography>
            <AnimatedPrice
              kobo={totalKobo}
              data-testid="checkout-total-amount"
              sx={{ fontSize: '1.4rem', fontWeight: 500 }}
            />
          </Box>

          {formError && (
            <Box
              role="alert"
              sx={{
                p: 1.5,
                mb: 2,
                borderRadius: 1,
                border: 1,
                borderColor: 'text.primary',
                bgcolor: 'background.default',
              }}
            >
              <Typography variant="body2">{formError}</Typography>
            </Box>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            data-testid="place-order-button"
            sx={{ py: 1.5 }}
          >
            Place order
          </Button>
        </Box>
      </Box>

      <PaystackMockDialog
        open={paymentModalOpen}
        provider={paymentProvider}
        email={email}
        amountKobo={totalKobo}
        reference={activeReference}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentVerified}
      />
    </Container>
  );
}
