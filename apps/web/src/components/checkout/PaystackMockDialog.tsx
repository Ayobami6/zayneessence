'use client';

import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { PaymentProvider } from '@/types/domain';
import { formatKoboToNgn } from '@/utils/currency';

interface PaystackMockDialogProps {
  open: boolean;
  provider: PaymentProvider;
  email: string;
  amountKobo: number;
  reference: string;
  onClose: () => void;
  onSuccess: (result: {
    reference: string;
    channel: 'card' | 'bank_transfer' | 'ussd';
    provider: PaymentProvider;
  }) => void;
}

export function PaystackMockDialog({
  open,
  provider,
  email,
  amountKobo,
  reference,
  onClose,
  onSuccess,
}: PaystackMockDialogProps) {
  const [channel, setChannel] = useState<'card' | 'bank_transfer' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess({
        reference,
        channel,
        provider,
      });
    }, 350);
  };

  return (
    <Dialog
      open={open}
      onClose={isProcessing ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      aria-label={`${provider === 'paystack' ? 'Paystack' : 'Flutterwave'} checkout`}
      data-testid="payment-gateway-dialog"
    >
      <DialogContent sx={{ p: 3.5 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="h4">
            {provider === 'paystack' ? 'Paystack checkout' : 'Flutterwave checkout'}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Test mode
          </Typography>
        </Box>

        <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary', mb: 2.5 }}>
          {email} · Ref: {reference}
        </Typography>

        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 1,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Amount due
          </Typography>
          <Typography variant="h3" sx={{ fontSize: '1.4rem' }}>
            {formatKoboToNgn(amountKobo)}
          </Typography>
        </Box>

        <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
          Payment channel
        </Typography>
        <ToggleButtonGroup
          exclusive
          fullWidth
          value={channel}
          onChange={(_e, next) => {
            if (next !== null) setChannel(next);
          }}
          aria-label="Choose payment channel"
          sx={{ mb: 3 }}
        >
          <ToggleButton value="card" data-testid="paystack-channel-card" sx={{ flex: 1 }}>
            Card
          </ToggleButton>
          <ToggleButton
            value="bank_transfer"
            data-testid="paystack-channel-transfer"
            sx={{ flex: 1 }}
          >
            Bank transfer
          </ToggleButton>
          <ToggleButton value="ussd" data-testid="paystack-channel-ussd" sx={{ flex: 1 }}>
            USSD
          </ToggleButton>
        </ToggleButtonGroup>

        {channel === 'card' && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mb: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 400, mb: 0.5 }}>
              Test Visa / Verve / Mastercard
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Card: 4084 08•• •••• 4081 · Expiry 08/29 · CVV 408
            </Typography>
          </Box>
        )}

        {channel === 'bank_transfer' && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mb: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 400, mb: 0.5 }}>
              Paystack-Titan virtual account
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Account: 9920 1482 01 · Beneficiary: zayneessence Studio Ltd
            </Typography>
          </Box>
        )}

        {channel === 'ussd' && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              border: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
              mb: 3,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 400, mb: 0.5 }}>
              GTBank / Zenith / Access USSD
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
              Dial *737*000*8921# on your registered +234 line to authorise.
            </Typography>
          </Box>
        )}

        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            disabled={isProcessing}
            onClick={handleConfirmPayment}
            data-testid="confirm-mock-payment-button"
          >
            {isProcessing
              ? 'Verifying webhook signature…'
              : `Authorise ${formatKoboToNgn(amountKobo)}`}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            disabled={isProcessing}
            onClick={onClose}
          >
            Cancel
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
