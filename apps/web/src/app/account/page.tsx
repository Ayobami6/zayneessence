'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import { useAuth } from '@/context/AuthContext';
import { useStoreData } from '@/context/StoreDataContext';
import { useWishlist } from '@/context/WishlistContext';
import { NIGERIA_STATES_AND_FCT } from '@/data/nigeria-states';
import { ProductTile } from '@/components/catalogue/ProductTile';
import { formatKoboToNgn } from '@/utils/currency';
import { formatNigerianPhone, isValidNigerianPhone } from '@/utils/phone';
import { OrderStatus } from '@/types/domain';

const ORDER_STEPS: OrderStatus[] = ['paid', 'packed', 'shipped', 'delivered'];

export default function AccountPage() {
  const {
    session,
    signInWithPhoneOtp,
    signInWithMagicLink,
    signOut,
    saveAddress,
    removeAddress,
  } = useAuth();
  const { orders, products } = useStoreData();
  const { savedIds } = useWishlist();

  const [authMethod, setAuthMethod] = useState<'phone_otp' | 'email_magic_link'>(
    'phone_otp'
  );
  const [phoneInput, setPhoneInput] = useState<string>('+234 803 456 7890');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('482910');
  const [emailInput, setEmailInput] = useState<string>('amara@zayneessence.com');
  const [nameInput, setNameInput] = useState<string>('Amara Danjuma');
  const [authError, setAuthError] = useState<string>('');

  // New address state
  const [addingAddress, setAddingAddress] = useState<boolean>(false);
  const [addrState, setAddrState] = useState<string>('Federal Capital Territory (Abuja)');
  const [addrCity, setAddrCity] = useState<string>('Maitama');
  const [addrStreet, setAddrStreet] = useState<string>('22 Pope John Paul II Street');

  const savedProducts = products.filter((p) => savedIds.includes(p.id));

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

  const handleSendOtp = () => {
    setAuthError('');
    if (!isValidNigerianPhone(phoneInput)) {
      setAuthError('Enter a valid Nigerian +234 mobile number to receive a code.');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (otpCode.trim().length < 4) {
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

  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 9 } }}>
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            bgcolor: 'background.paper',
          }}
        >
          <Typography variant="h2" component="h1" sx={{ mb: 1.5 }}>
            Sign in
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Access your order tracking, saved Nigerian delivery addresses and wishlist.
          </Typography>

          <ToggleButtonGroup
            exclusive
            fullWidth
            value={authMethod}
            onChange={(_e, next) => {
              if (next !== null) {
                setAuthMethod(next);
                setAuthError('');
              }
            }}
            aria-label="Sign in method"
            sx={{ mb: 3 }}
          >
            <ToggleButton value="phone_otp" data-testid="auth-tab-phone">
              Phone OTP (+234)
            </ToggleButton>
            <ToggleButton value="email_magic_link" data-testid="auth-tab-email">
              Email magic link
            </ToggleButton>
          </ToggleButtonGroup>

          {authMethod === 'phone_otp' ? (
            <Box component="form" onSubmit={handleVerifyOtp} noValidate>
              <Box sx={{ mb: 2 }}>
                <Typography
                  component="label"
                  htmlFor="account-name-phone"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Your name
                </Typography>
                <InputBase
                  id="account-name-phone"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  sx={inputBoxSx}
                />
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography
                  component="label"
                  htmlFor="account-phone-input"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Nigerian mobile number
                </Typography>
                <InputBase
                  id="account-phone-input"
                  type="tel"
                  value={phoneInput}
                  onChange={(e) => setPhoneInput(formatNigerianPhone(e.target.value))}
                  inputProps={{ 'data-testid': 'account-phone-input' }}
                  sx={inputBoxSx}
                />
              </Box>

              {!otpSent ? (
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSendOtp}
                  data-testid="send-otp-button"
                >
                  Send verification code
                </Button>
              ) : (
                <>
                  <Box sx={{ mb: 2.5 }}>
                    <Typography
                      component="label"
                      htmlFor="account-otp-input"
                      variant="body2"
                      sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                    >
                      6-digit code sent via SMS / WhatsApp
                    </Typography>
                    <InputBase
                      id="account-otp-input"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      inputProps={{ 'data-testid': 'account-otp-input' }}
                      sx={inputBoxSx}
                    />
                  </Box>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    data-testid="verify-otp-button"
                  >
                    Verify &amp; sign in
                  </Button>
                </>
              )}
            </Box>
          ) : (
            <Box component="form" onSubmit={handleMagicLinkSignIn} noValidate>
              <Box sx={{ mb: 2 }}>
                <Typography
                  component="label"
                  htmlFor="account-name-email"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Your name
                </Typography>
                <InputBase
                  id="account-name-email"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  sx={inputBoxSx}
                />
              </Box>

              <Box sx={{ mb: 2.5 }}>
                <Typography
                  component="label"
                  htmlFor="account-email-input"
                  variant="body2"
                  sx={{ display: 'block', mb: 0.75, color: 'text.secondary' }}
                >
                  Email address
                </Typography>
                <InputBase
                  id="account-email-input"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  inputProps={{ 'data-testid': 'account-email-input' }}
                  sx={inputBoxSx}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                data-testid="magic-link-signin-button"
              >
                Sign in with magic link
              </Button>
            </Box>
          )}

          {authError && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              {authError}
            </Typography>
          )}
        </Box>
      </Container>
    );
  }

  const selectedStateEntry =
    NIGERIA_STATES_AND_FCT.find((s) => s.name === addrState) || NIGERIA_STATES_AND_FCT[0];

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: 2,
          mb: 5,
        }}
      >
        <Box>
          <Typography variant="h2" component="h1" sx={{ mb: 0.5 }}>
            {session.name}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {session.phone} · {session.email}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button component={Link} href="/admin" variant="outlined" size="small">
            Studio admin
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={signOut}
            data-testid="sign-out-button"
          >
            Sign out
          </Button>
        </Box>
      </Box>

      {/* 1. Order history & tracking status */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" sx={{ mb: 2.5 }}>
          Order history and tracking
        </Typography>

        {orders.length === 0 ? (
          <Box
            sx={{
              p: 4,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
              You have not placed an order yet. Explore our skincare, pure oud oils and
              perfume collection.
            </Typography>
            <Button component={Link} href="/#catalogue" variant="contained" color="primary">
              Shop skincare
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {orders.map((order) => {
              const currentStepIdx = ORDER_STEPS.indexOf(order.status);
              return (
                <Box
                  key={order.id}
                  data-testid={`account-order-${order.orderNumber}`}
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
                    <Box>
                      <Typography variant="h4">
                        Order {order.orderNumber} · {formatKoboToNgn(order.totalKobo)}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Placed {new Date(order.createdAt).toLocaleDateString('en-NG')} ·{' '}
                        {order.address.cityOrLga}, {order.address.state}
                      </Typography>
                    </Box>

                    <Chip
                      label={`Status: ${order.status}`}
                      color="primary"
                      size="small"
                    />
                  </Box>

                  {/* Tracking status steps (paid -> packed -> shipped -> delivered) */}
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: 1,
                      my: 2.5,
                    }}
                  >
                    {ORDER_STEPS.map((step, idx) => {
                      const reached = idx <= currentStepIdx;
                      return (
                        <Box key={step}>
                          <Box
                            sx={{
                              height: 4,
                              borderRadius: 999,
                              bgcolor: reached ? 'primary.main' : 'divider',
                              mb: 0.75,
                            }}
                          />
                          <Typography
                            variant="caption"
                            sx={{
                              color: reached ? 'text.primary' : 'text.secondary',
                              fontWeight: reached ? 500 : 300,
                              textTransform: 'capitalize',
                            }}
                          >
                            {step}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>

                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Pieces:{' '}
                    {order.items
                      .map((i) => `${i.productName} (${i.sizeLabel}) × ${i.quantity}`)
                      .join(', ')}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* 2. Saved addresses */}
      <Box sx={{ mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2.5,
          }}
        >
          <Typography variant="h3">Saved addresses</Typography>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setAddingAddress((prev) => !prev)}
          >
            {addingAddress ? 'Cancel' : 'Add address'}
          </Button>
        </Box>

        {addingAddress && (
          <Box
            component="form"
            onSubmit={handleSaveNewAddress}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                State
              </Typography>
              <Box
                component="select"
                value={addrState}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const next = e.target.value;
                  setAddrState(next);
                  const st = NIGERIA_STATES_AND_FCT.find((s) => s.name === next);
                  if (st?.citiesOrLgas[0]) setAddrCity(st.citiesOrLgas[0]);
                }}
                sx={(theme) => ({
                  width: '100%',
                  height: 44,
                  px: 1.5,
                  borderRadius: '4px',
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                })}
              >
                {NIGERIA_STATES_AND_FCT.map((s) => (
                  <option key={s.code} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                City or LGA
              </Typography>
              <Box
                component="select"
                value={addrCity}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setAddrCity(e.target.value)
                }
                sx={(theme) => ({
                  width: '100%',
                  height: 44,
                  px: 1.5,
                  borderRadius: '4px',
                  border: `1px solid ${theme.palette.divider}`,
                  bgcolor: theme.palette.background.default,
                  color: theme.palette.text.primary,
                })}
              >
                {selectedStateEntry.citiesOrLgas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Box>
            </Box>

            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                Street address
              </Typography>
              <InputBase
                value={addrStreet}
                onChange={(e) => setAddrStreet(e.target.value)}
                placeholder="Street name and house number"
                sx={inputBoxSx}
              />
            </Box>

            <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
              <Button type="submit" variant="contained" color="primary" size="small">
                Save address
              </Button>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          {session.savedAddresses.map((addr) => (
            <Box
              key={addr.id}
              sx={{
                p: 2.5,
                borderRadius: 1,
                border: 1,
                borderColor: 'divider',
                bgcolor: 'background.paper',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 400 }}>
                  {addr.recipientName}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {addr.streetAddress}
                  <br />
                  {addr.cityOrLga}, {addr.state}
                  <br />
                  {addr.phone}
                </Typography>
              </Box>
              <Button
                size="small"
                color="inherit"
                onClick={() => removeAddress(addr.id)}
                sx={{ color: 'text.secondary', textDecoration: 'underline' }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 5 }} />

      {/* 3. Synced Wishlist */}
      <Box>
        <Typography variant="h3" sx={{ mb: 2.5 }}>
          Saved wishlist ({savedProducts.length})
        </Typography>

        {savedProducts.length === 0 ? (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Tap the heart on any piece to keep it here.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(3, minmax(0, 1fr))',
                lg: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 3,
            }}
          >
            {savedProducts.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}
