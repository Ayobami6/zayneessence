import { PaymentProvider } from '@/types/domain';

export interface PaymentRequestPayload {
  email: string;
  phone: string;
  amountKobo: number;
  provider: PaymentProvider;
  reference: string;
}

export function generatePaymentReference(provider: PaymentProvider): string {
  const prefix = provider === 'paystack' ? 'ZE-PSK' : 'ZE-FLW';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Checks whether a real non-placeholder Paystack public key is configured.
 */
export function hasLivePaystackKey(): boolean {
  const key = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
  return (
    (key.startsWith('pk_test_') || key.startsWith('pk_live_')) &&
    !key.includes('xxxxxxxx')
  );
}
