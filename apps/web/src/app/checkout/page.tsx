'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ButtonBase from '@mui/material/ButtonBase';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import TagRoundedIcon from '@mui/icons-material/TagRounded';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import CardGiftcardOutlinedIcon from '@mui/icons-material/CardGiftcardOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useBag } from '@/context/BagContext';
import { useStoreData } from '@/context/StoreDataContext';
import { useAuth } from '@/context/AuthContext';
import {
  DeliveryMethodId,
  OrderRecord,
  PaymentProvider,
} from '@/types/domain';
import { NIGERIA_STATES_AND_FCT, isLagosOrAbuja } from '@/data/nigeria-states';
import { calculateDeliveryFeeKobo, getFreeDeliveryProgress } from '@/services/store-service';
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
import { AccentHeading, ArcGauge, QuantityStepper, RingGauge } from '@/components/glow';

type PaymentChannel = 'card' | 'bank_transfer' | 'ussd';

export default function CheckoutPage() {
  const { items, subtotalKobo, clearBag, updateQuantity } = useBag();
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
  const [paymentChannel, setPaymentChannel] = useState<PaymentChannel>('card');
  const [whatsappUpdates, setWhatsappUpdates] = useState<boolean>(true);

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
      settings.whatsappUpdatesEnabled && whatsappUpdates
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

  const delivery = getFreeDeliveryProgress(subtotalKobo, settings);
  const threshold = formatKoboToNgn(settings.freeDeliveryThresholdKobo);
  const zoneLabel =
    deliveryMethod === 'store_pickup'
      ? 'Studio pickup · Ikoyi or Maitama'
      : deliveryMethod === 'lagos_abuja'
        ? delivery.unlocked
          ? 'Lagos & Abuja · free delivery unlocked'
          : 'Lagos & Abuja zone · 1–2 days'
        : 'Rest of Nigeria · 2–5 working days';
  const providerName = paymentProvider === 'paystack' ? 'Paystack' : 'Flutterwave';
  const channelName = { card: 'card', bank_transfer: 'bank transfer', ussd: 'USSD' }[paymentChannel];

  const cardSx = {
    p: { xs: 2.25, md: 3.25 },
    borderRadius: '32px',
    bgcolor: 'background.paper',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  } as const;

  const StepTitle = ({ n, title, id }: { n: string; title: string; id: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{ width: 32, height: 32, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 14, fontWeight: 800 }}>
        {n}
      </Box>
      <Typography id={id} component="h2" variant="h3" sx={{ fontSize: 19 }}>
        {title}
      </Typography>
    </Box>
  );

  // Order confirmation screen
  if (completedOrder) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 7 } }}>
        <Box data-testid="order-confirmation-screen" sx={{ p: { xs: 2.5, md: 5 }, borderRadius: { xs: '32px', md: '40px' }, bgcolor: 'background.paper', display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 2, md: 3 }, flexWrap: 'wrap' }}>
            <Box sx={{ width: 128, height: 128, borderRadius: '999px', bgcolor: 'background.default', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <RingGauge value={0.25} size={112} stroke={9} label="1/4" caption="Paid" filled ariaLabel="Order is at step 1 of 4: paid" />
            </Box>
            <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
              <Box sx={{ display: 'inline-flex', height: 30, px: 1.5, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', alignItems: 'center', fontSize: 12.5, fontWeight: 700, mb: 1.5 }}>
                Order {completedOrder.orderNumber}
              </Box>
              <Typography variant="h2" component="h1" data-testid="order-confirmation-heading" sx={{ fontSize: { xs: 24, md: 34 } }}>
                Order placed. You’ll get a WhatsApp message when it leaves our studio.
              </Typography>
            </Box>
          </Box>
          <Typography color="text.secondary">
            We sent your receipt to{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {completedOrder.customerEmail}
            </Box>{' '}
            and set up WhatsApp updates for{' '}
            <Box component="span" sx={{ color: 'text.primary', fontWeight: 600 }}>
              {formatNigerianPhone(completedOrder.customerPhone)}
            </Box>
            .
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
            <Box sx={{ p: 2.25, borderRadius: '24px', bgcolor: 'background.default' }}>
              <Typography variant="h5" component="h2" sx={{ mb: 0.75 }}>
                Delivery details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {completedOrder.customerName}
                <br />
                {completedOrder.address.streetAddress}
                <br />
                {completedOrder.address.cityOrLga}, {completedOrder.address.state}
              </Typography>
            </Box>
            <Box sx={{ p: 2.25, borderRadius: '24px', bgcolor: 'background.default' }}>
              <Typography variant="h5" component="h2" sx={{ mb: 0.75 }}>
                Payment verified
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total paid: {formatKoboToNgn(completedOrder.totalKobo)}
                <br />
                {completedOrder.payment.provider === 'paystack' ? 'Paystack' : 'Flutterwave'} · {completedOrder.payment.channel.replace('_', ' ')}
                <br />
                Reference {completedOrder.payment.reference}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {completedOrder.items.map((item) => (
              <Box key={item.id} sx={{ position: 'relative', width: 56, height: 64, borderRadius: '16px', overflow: 'hidden', bgcolor: 'glow.petal' }}>
                <Image src={item.thumbnailUrl} alt={item.productName} fill sizes="56px" style={{ objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25 }}>
            <Button component={Link} href="/account" variant="contained" size="large">
              Track order in account
            </Button>
            <Button component={Link} href="/" variant="text" size="large" sx={{ bgcolor: 'background.default' }}>
              Continue shopping
            </Button>
          </Box>
        </Box>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ p: { xs: 3, md: 6 }, borderRadius: '40px', bgcolor: 'background.paper', textAlign: 'center' }}>
          <AccentHeading component="h1" variant="h2" text="Your bag is" accent="empty." sx={{ mb: 1.5 }} />
          <Typography color="text.secondary" sx={{ mb: 3, mx: 'auto' }}>
            Add skincare, pure oud, bakhoor or supplements to your bag before checking out.
          </Typography>
          <Button component={Link} href="/#catalogue" variant="contained" size="large">
            Browse the collection
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 1, md: 2 }, pb: { xs: 14, md: 4 } }}>
      <AccentHeading component="h1" variant="h1" text="Almost" accent="yours." sx={{ fontSize: { xs: 30, md: 'clamp(36px, 4vw, 56px)' }, mb: { xs: 2, md: 3 } }} />

      <Box component="form" noValidate onSubmit={handleOpenPayment} sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 1.75, md: 3 }, alignItems: 'flex-start' }}>
        <Box sx={{ flex: '999 1 560px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: { xs: 1.75, md: 2 } }}>
          <Box component="section" aria-labelledby="checkout-contact" sx={cardSx}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
              <StepTitle n="1" title="Contact" id="checkout-contact" />
              {!session ? (
                <ToggleButtonGroup
                  exclusive
                  value={checkoutMode}
                  onChange={(_e, val) => {
                    if (val !== null) setCheckoutMode(val);
                  }}
                  aria-label="Checkout mode"
                  sx={{ bgcolor: 'background.default' }}
                >
                  <ToggleButton value="guest">Guest checkout</ToggleButton>
                  <ToggleButton value="signin">Sign in</ToggleButton>
                </ToggleButtonGroup>
              ) : (
                <Box sx={{ height: 30, px: 1.5, borderRadius: '999px', bgcolor: 'background.default', display: 'inline-flex', alignItems: 'center', fontSize: 12.5, fontWeight: 600 }}>
                  Signed in as {session.name}
                </Box>
              )}
            </Box>

            {checkoutMode === 'signin' && !session ? (
              <Box sx={{ p: 2, borderRadius: '20px', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1.5 }}>
                <Typography variant="body2">Sign in with an email link to load your saved addresses.</Typography>
                <Button
                  variant="contained"
                  size="small"
                  onClick={() => {
                    signInWithMagicLink(email || 'amara@zayneessence.com', recipientName);
                    setCheckoutMode('guest');
                  }}
                >
                  Send link &amp; sign in
                </Button>
              </Box>
            ) : null}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.75 }}>
              <TextField
                label="Full name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                autoComplete="name"
                inputProps={{ 'data-testid': 'checkout-name-input' }}
                fullWidth
              />
              <TextField
                label="Nigerian mobile number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => isValidNigerianPhone(phone) && setPhone(formatNigerianPhone(phone))}
                autoComplete="tel"
                type="tel"
                inputProps={{ 'data-testid': 'checkout-phone-input' }}
                fullWidth
              />
              <TextField
                label="Email for your receipt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                type="email"
                inputProps={{ 'data-testid': 'checkout-email-input' }}
                fullWidth
                sx={{ gridColumn: { sm: 'span 2' } }}
              />
            </Box>
          </Box>

          <Box component="section" aria-labelledby="checkout-delivery" sx={cardSx}>
            <StepTitle n="2" title="Delivery" id="checkout-delivery" />
            <Box role="radiogroup" aria-label="Delivery method" sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
              {[
                { id: 'ship', label: 'Deliver to me', icon: <LocalShippingOutlinedIcon />, active: deliveryMethod !== 'store_pickup' },
                { id: 'store_pickup', label: 'Studio pickup', icon: <StorefrontOutlinedIcon />, active: deliveryMethod === 'store_pickup' },
              ].map((opt) => (
                <ButtonBase
                  key={opt.id}
                  role="radio"
                  aria-checked={opt.active}
                  data-testid={`delivery-option-${opt.id}`}
                  onClick={() =>
                    setDeliveryMethod(
                      opt.id === 'store_pickup' ? 'store_pickup' : isLagosOrAbuja(selectedState) ? 'lagos_abuja' : 'rest_of_nigeria'
                    )
                  }
                  sx={{
                    height: 56,
                    borderRadius: '20px',
                    gap: 1,
                    fontSize: 14,
                    fontWeight: 700,
                    bgcolor: opt.active ? 'primary.main' : 'background.default',
                    color: opt.active ? 'primary.contrastText' : 'text.primary',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {opt.icon}
                  {opt.label}
                </ButtonBase>
              ))}
            </Box>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.75 }}>
              <TextField
                select
                label="State (36 states + FCT)"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 360, borderRadius: '20px' } } } }}
                inputProps={{ 'data-testid': 'checkout-state-select' }}
                fullWidth
              >
                {NIGERIA_STATES_AND_FCT.map((s) => (
                  <MenuItem key={s.name} value={s.name}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="City or LGA"
                value={cityOrLga}
                onChange={(e) => setCityOrLga(e.target.value)}
                SelectProps={{ MenuProps: { PaperProps: { sx: { maxHeight: 360, borderRadius: '20px' } } } }}
                inputProps={{ 'data-testid': 'checkout-city-select' }}
                fullWidth
              >
                {currentStateObj.citiesOrLgas.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
              {deliveryMethod !== 'store_pickup' ? (
                <>
                  <TextField
                    label="Street address"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    autoComplete="street-address"
                    inputProps={{ 'data-testid': 'checkout-street-input' }}
                    fullWidth
                  />
                  <TextField label="Landmark (optional)" value={landmark} onChange={(e) => setLandmark(e.target.value)} fullWidth />
                </>
              ) : null}
            </Box>
            <Box
              aria-live="polite"
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1.25, pl: 1.25, pr: 2.25, borderRadius: '999px', bgcolor: 'glow.inverse', color: 'glow.inverseText' }}
            >
              <Box sx={{ width: 38, height: 38, borderRadius: '999px', bgcolor: 'rgba(255,255,255,0.14)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                {deliveryMethod === 'store_pickup' ? <StorefrontOutlinedIcon sx={{ fontSize: 19 }} /> : <LocalShippingOutlinedIcon sx={{ fontSize: 19 }} />}
              </Box>
              <Typography sx={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{zoneLabel}</Typography>
              <Typography sx={{ fontSize: 16, fontWeight: 800 }}>{deliveryFeeKobo === 0 ? 'Free' : formatKoboToNgn(deliveryFeeKobo)}</Typography>
            </Box>
            <FormControlLabel
              control={<Checkbox checked={whatsappUpdates} onChange={(e) => setWhatsappUpdates(e.target.checked)} />}
              label={
                <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, fontSize: 14, fontWeight: 600 }}>
                  <WhatsAppIcon sx={{ fontSize: 18 }} /> Send order updates on WhatsApp
                </Box>
              }
            />
          </Box>

          <Box component="section" aria-labelledby="checkout-gift" sx={cardSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: '999px', bgcolor: 'background.default', color: 'glow.accent', display: 'grid', placeItems: 'center' }}>
                  <CardGiftcardOutlinedIcon sx={{ fontSize: 17 }} />
                </Box>
                <Box>
                  <Typography id="checkout-gift" component="h2" variant="h3" sx={{ fontSize: 19 }}>
                    Gift wrap
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                    Linen paper and a wax-sealed card ·{' '}
                    {settings.giftWrapFeeKobo === 0 ? 'complimentary' : formatKoboToNgn(settings.giftWrapFeeKobo)}
                  </Typography>
                </Box>
              </Box>
              <ButtonBase
                role="switch"
                aria-checked={giftWrap}
                aria-label="Gift wrap"
                data-testid="gift-wrap-toggle"
                onClick={() => setGiftWrap((prev) => !prev)}
                sx={{ position: 'relative', width: 52, height: 32, flexShrink: 0, borderRadius: '999px', bgcolor: giftWrap ? 'primary.main' : 'glow.mauve', transition: 'background-color 0.25s ease' }}
              >
                <Box
                  component="span"
                  sx={{ position: 'absolute', top: 3, left: giftWrap ? 23 : 3, width: 26, height: 26, borderRadius: '999px', bgcolor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.25)', transition: 'left 0.25s ease' }}
                />
              </ButtonBase>
            </Box>
            {giftWrap ? (
              <TextField
                label="Handwritten note (optional)"
                multiline
                minRows={2}
                value={giftNote}
                onChange={(e) => setGiftNote(e.target.value)}
                placeholder="A few words for the card"
                inputProps={{ 'data-testid': 'gift-note-input' }}
                fullWidth
              />
            ) : null}
          </Box>

          <Box component="section" aria-labelledby="checkout-payment" sx={cardSx}>
            <StepTitle n="3" title="Payment" id="checkout-payment" />
            <Box role="radiogroup" aria-label="Payment channel" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1.25 }}>
              {[
                { id: 'card' as PaymentChannel, label: 'Card', icon: <CreditCardRoundedIcon /> },
                { id: 'bank_transfer' as PaymentChannel, label: 'Transfer', icon: <AccountBalanceOutlinedIcon /> },
                { id: 'ussd' as PaymentChannel, label: 'USSD', icon: <TagRoundedIcon /> },
              ].map((ch) => {
                const active = paymentChannel === ch.id;
                return (
                  <ButtonBase
                    key={ch.id}
                    role="radio"
                    aria-checked={active}
                    data-testid={`checkout-channel-${ch.id}`}
                    onClick={() => setPaymentChannel(ch.id)}
                    sx={{
                      height: 88,
                      borderRadius: '24px',
                      flexDirection: 'column',
                      gap: 1,
                      fontSize: 14,
                      fontWeight: 700,
                      bgcolor: active ? 'primary.main' : 'background.default',
                      color: active ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    {ch.icon}
                    {ch.label}
                  </ButtonBase>
                );
              })}
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 360 }}>
                Paystack secures every payment, confirmed by a verified webhook. Flutterwave stands by as a fallback.
              </Typography>
              <ToggleButtonGroup
                exclusive
                value={paymentProvider}
                onChange={(_e, next) => {
                  if (next !== null) setPaymentProvider(next);
                }}
                aria-label="Payment gateway"
                sx={{ bgcolor: 'background.default' }}
              >
                <ToggleButton value="paystack" data-testid="provider-paystack">
                  Paystack
                </ToggleButton>
                <ToggleButton value="flutterwave" data-testid="provider-flutterwave">
                  Flutterwave
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Box>

        <Box
          component="aside"
          aria-labelledby="checkout-summary"
          sx={{ flex: '1 1 360px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1.75, p: { xs: 2.25, md: 3.25 }, borderRadius: { xs: '32px', md: '36px' }, bgcolor: 'background.paper', position: { md: 'sticky' }, top: { md: 104 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography id="checkout-summary" component="h2" variant="h3" sx={{ fontSize: 19 }}>
              Your bag
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {items.reduce((n, i) => n + i.quantity, 0)} pieces
            </Typography>
          </Box>
          <Box sx={{ p: 1.5, pb: 1, borderRadius: '28px', bgcolor: 'background.default' }}>
            <ArcGauge
              progress={delivery.progress}
              value={delivery.unlocked ? 'Unlocked' : formatKoboToNgn(delivery.remainingKobo)}
              caption={delivery.unlocked ? 'Free Lagos & Abuja delivery' : 'to free delivery'}
              startLabel="₦0"
              endLabel={threshold}
              ariaLabel={delivery.unlocked ? 'Free delivery unlocked' : `${formatKoboToNgn(delivery.remainingKobo)} left until free delivery at ${threshold}`}
              maxWidth={250}
            />
          </Box>
          <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 1.25 }}>
            {items.map((item) => (
              <Box key={item.id} component="li" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ position: 'relative', width: 64, height: 76, flexShrink: 0, borderRadius: '18px', overflow: 'hidden', bgcolor: 'glow.petal' }}>
                  <Image src={item.thumbnailUrl} alt={item.thumbnailAlt} fill sizes="64px" style={{ objectFit: 'cover' }} />
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: 14.5, fontWeight: 700 }} noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12.5 }}>
                    {item.sizeLabel}
                  </Typography>
                  <Typography variant="price" sx={{ fontSize: 14 }}>
                    {formatKoboToNgn(item.priceKobo * item.quantity)}
                  </Typography>
                </Box>
                <QuantityStepper
                  size="sm"
                  value={item.quantity}
                  itemName={item.name}
                  max={9}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                />
              </Box>
            ))}
          </Box>
          <Box sx={{ height: '1px', bgcolor: 'divider' }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {formatKoboToNgn(subtotalKobo)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Delivery
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }} data-testid="checkout-delivery-fee">
                {deliveryFeeKobo === 0 ? 'Free' : formatKoboToNgn(deliveryFeeKobo)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Gift wrap
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {giftWrap ? (giftWrapFeeKobo === 0 ? 'Complimentary' : formatKoboToNgn(giftWrapFeeKobo)) : 'Not added'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', pt: 0.5 }}>
              <Typography sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="price" sx={{ fontSize: 24 }} data-testid="checkout-total-amount">
                <AnimatedPrice kobo={totalKobo} />
              </Typography>
            </Box>
          </Box>

          {formError ? (
            <Box role="alert" sx={{ p: 1.75, borderRadius: '18px', bgcolor: 'background.default', border: (t) => `1.5px solid ${t.palette.glow.accent}` }}>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {formError}
              </Typography>
            </Box>
          ) : null}

          <Box
            sx={(t) => ({
              position: { xs: 'fixed', md: 'static' },
              left: { xs: 16, md: 'auto' },
              right: { xs: 16, md: 'auto' },
              bottom: { xs: 'calc(16px + env(safe-area-inset-bottom, 0px))', md: 'auto' },
              zIndex: t.zIndex.appBar,
              borderRadius: '999px',
              boxShadow: { xs: t.palette.glow.shadowStrong, md: 'none' },
            })}
          >
            <Button type="submit" fullWidth variant="contained" size="large" startIcon={<LockOutlinedIcon />} data-testid="place-order-button">
              Pay {formatKoboToNgn(totalKobo)} with {channelName}
            </Button>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Secured by {providerName} · prices in Naira
          </Typography>
        </Box>
      </Box>

      <PaystackMockDialog
        open={paymentModalOpen}
        provider={paymentProvider}
        email={email}
        amountKobo={totalKobo}
        reference={activeReference}
        initialChannel={paymentChannel}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={handlePaymentVerified}
      />
    </Container>
  );
}
