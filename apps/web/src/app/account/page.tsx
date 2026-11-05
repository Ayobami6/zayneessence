'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import { useAuth } from '@/context/AuthContext';
import { useStoreData } from '@/context/StoreDataContext';
import { useWishlist } from '@/context/WishlistContext';
import { useBag } from '@/context/BagContext';
import { useColorMode } from '@/theme/ThemeRegistry';
import { NIGERIA_STATES_AND_FCT } from '@/data/nigeria-states';
import { ProductTile } from '@/components/catalogue/ProductTile';
import { AccentHeading, CircleIconButton, PhotoTile, RingGauge } from '@/components/glow';
import { formatKoboToNgn } from '@/utils/currency';
import { formatNigerianPhone, isValidNigerianPhone } from '@/utils/phone';
import { ORDER_STEPS, OrderRecord, OrderStatus } from '@/types/domain';

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: 'Paid',
  packed: 'Packed',
  shipped: 'Shipped',
  delivered: 'Delivered',
};

function OrderTimeline({ status }: { status: OrderStatus }) {
  const current = ORDER_STEPS.indexOf(status);
  return (
    <Box sx={{ position: 'relative', flex: '1 1 320px', minWidth: 0 }}>
      <Box aria-hidden="true" sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', left: '12.5%', right: '12.5%', top: 14, height: 4, borderRadius: '999px', bgcolor: 'glow.petal' }} />
      <Box
        aria-hidden="true"
        sx={{ display: { xs: 'none', sm: 'block' }, position: 'absolute', left: '12.5%', width: `${(current / (ORDER_STEPS.length - 1)) * 75}%`, top: 14, height: 4, borderRadius: '999px', bgcolor: 'glow.accent' }}
      />
      <Box
        component="ol"
        aria-label="Order progress"
        sx={{ position: 'relative', m: 0, p: 0, listStyle: 'none', display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: 1.25, sm: 0 } }}
      >
        {ORDER_STEPS.map((step, idx) => {
          const done = idx < current;
          const active = idx === current;
          return (
            <Box
              key={step}
              component="li"
              aria-current={active ? 'step' : undefined}
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', sm: 'column' },
                alignItems: 'center',
                gap: 1,
                fontSize: 14,
                fontWeight: active ? 800 : 600,
                color: !done && !active ? 'text.secondary' : 'text.primary',
              }}
            >
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: '999px',
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: done ? 'glow.accent' : active ? 'primary.main' : 'background.paper',
                  color: done ? '#FFFFFF' : 'primary.contrastText',
                  border: (t) => (!done && !active ? `2px solid ${t.palette.glow.mauve}` : 'none'),
                }}
              >
                {done ? <CheckRoundedIcon sx={{ fontSize: 16 }} /> : active ? <Box sx={{ width: 10, height: 10, borderRadius: '999px', bgcolor: 'primary.contrastText' }} /> : null}
              </Box>
              {STATUS_LABEL[step]}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default function AccountPage() {
  const { session, signInWithPhoneOtp, signInWithMagicLink, signOut, saveAddress, removeAddress } = useAuth();
  const { orders, products } = useStoreData();
  const { savedIds } = useWishlist();
  const { addToBag } = useBag();
  const { mode, setColorMode } = useColorMode();

  const [authMethod, setAuthMethod] = useState<'phone_otp' | 'email_magic_link'>('phone_otp');
  const [phoneInput, setPhoneInput] = useState<string>('+234 803 456 7890');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('482910');
  const [emailInput, setEmailInput] = useState<string>('amara@zayneessence.com');
  const [nameInput, setNameInput] = useState<string>('Amara Danjuma');
  const [authError, setAuthError] = useState<string>('');

  const [addingAddress, setAddingAddress] = useState<boolean>(false);
  const [addrState, setAddrState] = useState<string>('Federal Capital Territory (Abuja)');
  const [addrCity, setAddrCity] = useState<string>('Maitama');
  const [addrStreet, setAddrStreet] = useState<string>('22 Pope John Paul II Street');

  const savedProducts = products.filter((p) => p.is_published && savedIds.includes(p.id));
  const addrStateObj = NIGERIA_STATES_AND_FCT.find((s) => s.name === addrState) || NIGERIA_STATES_AND_FCT[0];

  const handleSendOtp = () => {
    setAuthError('');
    if (!isValidNigerianPhone(phoneInput)) {
      setAuthError('Enter a valid Nigerian +234 mobile number to receive a code.');
      return;
    }
    setPhoneInput(formatNigerianPhone(phoneInput));
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setAuthError('Enter the 6-digit verification code sent to your phone.');
      return;
    }
    signInWithPhoneOtp(phoneInput, nameInput);
  };

  const handleMagicLinkSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!emailInput.includes('@')) {
      setAuthError('Enter a valid email address to receive your sign-in link.');
      return;
    }
    signInWithMagicLink(emailInput, nameInput);
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !addrStreet.trim()) return;
    saveAddress({
      id: `addr-${Date.now()}`,
      recipientName: session.name,
      phone: session.phone,
      state: addrState,
      cityOrLga: addrCity,
      streetAddress: addrStreet.trim(),
    });
    setAddingAddress(false);
    setAddrStreet('');
  };

  const handleBuyAgain = (order: OrderRecord) => {
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.productId);
      const variant = product?.variants.find((v) => v.id === item.variantId);
      if (product && variant && variant.stock > 0) addToBag(product, variant, item.quantity);
    });
  };

  if (!session) {
    return (
      <Container maxWidth="lg" sx={{ pt: { xs: 1, md: 2 }, pb: { xs: 2, md: 4 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, md: 3 }, alignItems: 'stretch' }}>
          <PhotoTile
            src="/images/calm.jpg"
            alt="Woman with deep brown skin, eyes closed, hands resting on her shoulders"
            height={{ xs: 200, md: 'auto' }}
            radius={{ xs: '36px', md: '44px' }}
            priority
            sizes="(max-width: 900px) 92vw, 640px"
            objectPosition="50% 24%"
            sx={{ flex: '1 1 460px', width: 'auto', minWidth: 0, minHeight: { md: 640 } }}
          >
            <Box component="svg" viewBox="0 0 330 170" aria-hidden="true" sx={{ position: 'absolute', left: '10%', width: '80%', top: { xs: '30%', md: '40%' } }}>
              <path d="M15 165a150 150 0 0 1 300 0" fill="none" stroke="#FFFFFF" strokeWidth={2} strokeDasharray="2 8" strokeLinecap="round" />
              <path d="M15 165a150 150 0 0 1 225 -130" fill="none" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.9} />
              <circle cx={240} cy={35} r={6} fill="#FFFFFF" />
            </Box>
            {[
              { label: 'Track every order', sx: { left: 16, top: 16 } },
              { label: 'Saved Nigerian addresses', sx: { right: 16, top: { xs: 60, md: 84 } } },
              { label: 'Wishlist synced across devices', sx: { left: 16, bottom: 16 } },
            ].map((chip) => (
              <Box key={chip.label} sx={{ position: 'absolute', height: 32, px: 1.5, borderRadius: '999px', bgcolor: 'glow.scrim', display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 600, ...chip.sx }}>
                {chip.label}
              </Box>
            ))}
          </PhotoTile>

          <Box
            component="section"
            aria-labelledby="sign-in-heading"
            sx={{ flex: '1 1 420px', minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2.5, p: { xs: 2.5, md: 6 }, borderRadius: { xs: '32px', md: '44px' }, bgcolor: 'background.paper' }}
          >
            <Box>
              <AccentHeading id="sign-in-heading" component="h1" variant="h1" text="Welcome" accent="back." sx={{ fontSize: { xs: 30, md: 'clamp(36px, 4vw, 52px)' } }} />
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                No password needed. We send a code to your phone or a link to your email.
              </Typography>
            </Box>

            <ToggleButtonGroup
              exclusive
              fullWidth
              value={authMethod}
              onChange={(_e, val) => {
                if (val !== null) {
                  setAuthMethod(val);
                  setAuthError('');
                }
              }}
              aria-label="Sign-in method"
              sx={{ bgcolor: 'background.default' }}
            >
              <ToggleButton value="phone_otp" data-testid="auth-tab-phone">
                Phone OTP (+234)
              </ToggleButton>
              <ToggleButton value="email_magic_link" data-testid="auth-tab-email">
                Email magic link
              </ToggleButton>
            </ToggleButtonGroup>

            {authMethod === 'phone_otp' ? (
              !otpSent ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                  <TextField label="Your name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoComplete="name" fullWidth />
                  <TextField
                    label="Nigerian mobile number"
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    autoComplete="tel"
                    inputProps={{ 'data-testid': 'account-phone-input' }}
                    fullWidth
                  />
                  <Button variant="contained" size="large" onClick={handleSendOtp} data-testid="send-otp-button" startIcon={<PhoneIphoneOutlinedIcon />}>
                    Send verification code
                  </Button>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleVerifyOtp} sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                  <Typography variant="body2" color="text.secondary">
                    Enter the 6-digit code we sent by SMS to {phoneInput}.
                  </Typography>
                  <TextField
                    label="Verification code"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    autoComplete="one-time-code"
                    inputProps={{
                      'data-testid': 'account-otp-input',
                      inputMode: 'numeric',
                      maxLength: 6,
                      style: { textAlign: 'center', fontSize: 26, fontWeight: 800, letterSpacing: '0.6em', paddingLeft: '0.6em' },
                    }}
                    fullWidth
                  />
                  <Button type="submit" variant="contained" size="large" data-testid="verify-otp-button">
                    Verify &amp; continue
                  </Button>
                  <Button variant="text" onClick={() => setOtpSent(false)}>
                    Change number
                  </Button>
                </Box>
              )
            ) : (
              <Box component="form" onSubmit={handleMagicLinkSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
                <TextField label="Your name" value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoComplete="name" fullWidth />
                <TextField
                  label="Email address"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  autoComplete="email"
                  inputProps={{ 'data-testid': 'account-email-input' }}
                  fullWidth
                />
                <Button type="submit" variant="contained" size="large" data-testid="magic-link-signin-button">
                  Email me a magic link
                </Button>
              </Box>
            )}

            {authError ? (
              <Box role="alert" sx={{ p: 1.75, borderRadius: '18px', bgcolor: 'background.default', border: (t) => `1.5px solid ${t.palette.glow.accent}` }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {authError}
                </Typography>
              </Box>
            ) : null}

            <Typography variant="body2" color="text.secondary">
              New here? Signing in creates your account. You can also{' '}
              <Box component={Link} href="/checkout" sx={{ color: 'text.primary', fontWeight: 700 }}>
                check out as a guest
              </Box>
              .
            </Typography>
          </Box>
        </Box>
      </Container>
    );
  }

  const [latestOrder, ...pastOrders] = orders;
  const firstName = session.name.split(' ')[0];

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 1, md: 2 }, pb: { xs: 2, md: 4 } }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'flex-start' }}>
        <Box
          component="aside"
          sx={{ flex: '1 1 260px', maxWidth: { md: 320 }, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2, p: { xs: 2.25, md: 3 }, borderRadius: '32px', bgcolor: 'background.paper', position: { md: 'sticky' }, top: { md: 104 } }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
            <Box sx={{ width: 60, height: 60, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 700, flexShrink: 0 }}>
              {firstName.charAt(0).toUpperCase()}
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 17, fontWeight: 700 }} noWrap>
                {session.name}
              </Typography>
              <Box sx={{ display: 'inline-flex', height: 24, px: 1.25, mt: 0.5, borderRadius: '999px', bgcolor: 'background.default', alignItems: 'center', fontSize: 11.5, fontWeight: 600 }}>
                Signed in with {session.authMethod === 'phone_otp' ? 'phone' : 'email link'}
              </Box>
            </Box>
          </Box>
          <Box component="nav" aria-label="Account" sx={{ display: { xs: 'none', md: 'flex' }, flexDirection: 'column', gap: 0.5 }}>
            {[
              { href: '#orders', label: 'Orders', count: orders.length },
              { href: '#addresses', label: 'Delivery addresses', count: session.savedAddresses.length },
              { href: '#saved', label: 'Saved pieces', count: savedProducts.length },
            ].map((link) => (
              <Box
                key={link.href}
                component="a"
                href={link.href}
                sx={{ height: 44, px: 2, borderRadius: '999px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 14.5, fontWeight: 600, textDecoration: 'none', color: 'text.primary', '&:hover': { bgcolor: 'background.default' } }}
              >
                {link.label}
                <Box component="span" sx={{ fontSize: 12, color: 'text.secondary' }}>
                  {link.count}
                </Box>
              </Box>
            ))}
          </Box>
          <Box sx={{ height: '1px', bgcolor: 'divider' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pl: { md: 2 } }}>
            <Typography component="label" htmlFor="account-dark-mode" sx={{ fontSize: 14.5, fontWeight: 600 }}>
              Dark mode
            </Typography>
            <Switch id="account-dark-mode" checked={mode === 'dark'} onChange={(e) => setColorMode(e.target.checked ? 'dark' : 'light')} />
          </Box>
          {session.role === 'admin' ? (
            <Button component={Link} href="/admin" variant="text" sx={{ justifyContent: 'flex-start', bgcolor: 'background.default' }}>
              Studio admin
            </Button>
          ) : null}
          <Button variant="text" onClick={signOut} data-testid="sign-out-button" sx={{ justifyContent: { md: 'flex-start' }, color: 'text.secondary' }}>
            Sign out
          </Button>
        </Box>

        <Box sx={{ flex: '999 1 600px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
          {latestOrder ? (
            <AccentHeading component="h1" variant="h1" text="Your orders," accent="on their way." sx={{ fontSize: { xs: 30, md: 'clamp(36px, 4vw, 54px)' } }} />
          ) : (
            <AccentHeading component="h1" variant="h1" text="Hello," accent={`${firstName}.`} sx={{ fontSize: { xs: 30, md: 'clamp(36px, 4vw, 54px)' } }} />
          )}

          <Box id="orders" component="section" aria-labelledby="orders-heading" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, scrollMarginTop: 104 }}>
            <Typography id="orders-heading" component="h2" variant="h3" sx={{ fontSize: 19 }}>
              Orders
            </Typography>
            {!latestOrder ? (
              <Box sx={{ p: 3, borderRadius: '28px', bgcolor: 'background.paper' }}>
                <Typography sx={{ fontWeight: 600, mb: 1.5 }}>No orders yet. Your first ritual starts with the consultation.</Typography>
                <Button component={Link} href="/consultation" variant="contained">
                  Start skin consultation
                </Button>
              </Box>
            ) : (
              <Box
                data-testid={`account-order-${latestOrder.orderNumber}`}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, p: { xs: 2.25, md: 3.25 }, borderRadius: '36px', bgcolor: 'background.paper' }}
              >
                <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
                  <Box>
                    <Typography sx={{ fontSize: 19, fontWeight: 700 }}>Order {latestOrder.orderNumber}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {latestOrder.items.reduce((n, i) => n + i.quantity, 0)} pieces · {formatKoboToNgn(latestOrder.totalKobo)} · {latestOrder.address.cityOrLga}, {latestOrder.address.state}
                    </Typography>
                  </Box>
                  <Box sx={{ height: 32, px: 1.75, borderRadius: '999px', bgcolor: 'primary.main', color: 'primary.contrastText', display: 'inline-flex', alignItems: 'center', fontSize: 12.5, fontWeight: 700 }}>
                    {STATUS_LABEL[latestOrder.status]}
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: { xs: 2.5, md: 4 } }}>
                  <Box sx={{ width: 140, height: 140, flexShrink: 0, borderRadius: '999px', bgcolor: 'background.default', display: 'grid', placeItems: 'center' }}>
                    <RingGauge
                      value={(ORDER_STEPS.indexOf(latestOrder.status) + 1) / ORDER_STEPS.length}
                      size={122}
                      stroke={9}
                      filled
                      label={`${ORDER_STEPS.indexOf(latestOrder.status) + 1}/${ORDER_STEPS.length}`}
                      caption={STATUS_LABEL[latestOrder.status]}
                      ariaLabel={`Order is at step ${ORDER_STEPS.indexOf(latestOrder.status) + 1} of ${ORDER_STEPS.length}: ${STATUS_LABEL[latestOrder.status]}`}
                    />
                  </Box>
                  <OrderTimeline status={latestOrder.status} />
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, py: 1.25, pl: 2, pr: 1.25, borderRadius: '999px', bgcolor: 'background.default' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13.5, fontWeight: 600 }}>
                    <WhatsAppIcon sx={{ fontSize: 18 }} />
                    {latestOrder.notifications.some((n) => n.channel === 'whatsapp_cloud') ? 'WhatsApp updates on for this order' : 'Email updates on for this order'}
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.75 }}>
                    {latestOrder.items.slice(0, 4).map((item) => (
                      <Box key={item.id} sx={{ position: 'relative', width: 40, height: 46, borderRadius: '14px', overflow: 'hidden', bgcolor: 'glow.petal' }}>
                        <Image src={item.thumbnailUrl} alt={item.productName} fill sizes="40px" style={{ objectFit: 'cover' }} />
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {pastOrders.map((order) => (
              <Box
                key={order.id}
                data-testid={`account-order-${order.orderNumber}`}
                sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.75, p: 1.25, pr: 2, borderRadius: '28px', bgcolor: 'background.paper' }}
              >
                <Box sx={{ position: 'relative', width: 64, height: 72, flexShrink: 0, borderRadius: '18px', overflow: 'hidden', bgcolor: 'glow.petal' }}>
                  {order.items[0] ? <Image src={order.items[0].thumbnailUrl} alt="" fill sizes="64px" style={{ objectFit: 'cover' }} /> : null}
                </Box>
                <Box sx={{ flex: '1 1 160px', minWidth: 0 }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 700 }} noWrap>
                    {order.items.map((i) => i.productName).join(', ')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.orderNumber} · {formatKoboToNgn(order.totalKobo)}
                  </Typography>
                </Box>
                <Box sx={{ height: 28, px: 1.25, borderRadius: '999px', bgcolor: 'background.default', display: 'inline-flex', alignItems: 'center', fontSize: 12, fontWeight: 700 }}>
                  {STATUS_LABEL[order.status]}
                </Box>
                <Button size="small" variant="contained" onClick={() => handleBuyAgain(order)}>
                  Buy again
                </Button>
              </Box>
            ))}
          </Box>

          <Box id="addresses" component="section" aria-labelledby="addresses-heading" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, scrollMarginTop: 104 }}>
            <Typography id="addresses-heading" component="h2" variant="h3" sx={{ fontSize: 19 }}>
              Delivery addresses
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fill, minmax(220px, 1fr))' }, gap: 1.5 }}>
              {session.savedAddresses.map((addr, idx) => {
                const isDefault = idx === 0;
                return (
                  <Box
                    key={addr.id}
                    sx={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 1, p: 2.5, borderRadius: '28px', bgcolor: isDefault ? 'glow.inverse' : 'background.paper', color: isDefault ? 'glow.inverseText' : 'text.primary' }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <PlaceOutlinedIcon />
                      {isDefault ? (
                        <Box sx={{ height: 24, px: 1.25, borderRadius: '999px', bgcolor: 'rgba(255,255,255,0.16)', display: 'inline-flex', alignItems: 'center', fontSize: 11, fontWeight: 700 }}>
                          Default
                        </Box>
                      ) : (
                        <CircleIconButton label={`Remove address in ${addr.cityOrLga}`} tone="ground" size={34} onClick={() => removeAddress(addr.id)}>
                          <CloseRoundedIcon />
                        </CircleIconButton>
                      )}
                    </Box>
                    <Typography sx={{ fontSize: 15.5, fontWeight: 700 }}>{addr.recipientName}</Typography>
                    <Typography variant="body2" sx={{ color: isDefault ? 'glow.inverseMuted' : 'text.secondary' }}>
                      {addr.streetAddress}
                      <br />
                      {addr.cityOrLga}, {addr.state}
                    </Typography>
                  </Box>
                );
              })}
              {!addingAddress ? (
                <Button
                  onClick={() => setAddingAddress(true)}
                  startIcon={<AddRoundedIcon />}
                  sx={{ minHeight: 130, borderRadius: '28px', border: (t) => `2px dashed ${t.palette.glow.mauve}`, bgcolor: 'transparent', '&:hover': { bgcolor: 'background.paper' } }}
                >
                  Add an address
                </Button>
              ) : null}
            </Box>
            {addingAddress ? (
              <Box component="form" onSubmit={handleSaveNewAddress} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, p: 2.5, borderRadius: '28px', bgcolor: 'background.paper' }}>
                <TextField
                  select
                  label="State"
                  value={addrState}
                  onChange={(e) => {
                    setAddrState(e.target.value);
                    const entry = NIGERIA_STATES_AND_FCT.find((s) => s.name === e.target.value);
                    if (entry?.citiesOrLgas[0]) setAddrCity(entry.citiesOrLgas[0]);
                  }}
                  fullWidth
                >
                  {NIGERIA_STATES_AND_FCT.map((s) => (
                    <MenuItem key={s.name} value={s.name}>
                      {s.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField select label="City or LGA" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} fullWidth>
                  {addrStateObj.citiesOrLgas.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField label="Street address" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} fullWidth sx={{ gridColumn: { sm: 'span 2' } }} />
                <Box sx={{ display: 'flex', gap: 1, gridColumn: { sm: 'span 2' } }}>
                  <Button type="submit" variant="contained">
                    Save address
                  </Button>
                  <Button variant="text" onClick={() => setAddingAddress(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : null}
          </Box>

          <Box id="saved" component="section" aria-labelledby="saved-heading" sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, scrollMarginTop: 104 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Typography id="saved-heading" component="h2" variant="h3" sx={{ fontSize: 19 }}>
                Saved pieces
              </Typography>
              <Box component={Link} href="/saved" sx={{ fontSize: 13.5, fontWeight: 600, color: 'text.secondary' }}>
                View all
              </Box>
            </Box>
            {savedProducts.length === 0 ? (
              <Box sx={{ p: 3, borderRadius: '28px', bgcolor: 'background.paper' }}>
                <Typography variant="body2" color="text.secondary">
                  Tap the heart on any piece to keep it here, synced to your account.
                </Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 1.5 }}>
                {savedProducts.slice(0, 4).map((product) => (
                  <ProductTile key={product.id} product={product} compact />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Container>
  );
}
