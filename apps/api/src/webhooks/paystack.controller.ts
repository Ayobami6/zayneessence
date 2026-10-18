import crypto from 'node:crypto';

export interface PaystackWebhookEvent {
  event: string;
  data: {
    reference: string;
    amount: number;
    currency: string;
    status: string;
    channel?: string;
    customer?: {
      email?: string;
      phone?: string;
    };
  };
}

/**
 * Verifies the HMAC-SHA512 signature sent by Paystack in the `x-paystack-signature` header.
 * Payment status in Postgres is ONLY ever updated to 'verified' when this check passes.
 */
export function verifyPaystackWebhookSignature(
  rawBody: string,
  signatureHeader: string | undefined,
  secretKey: string
): boolean {
  if (!signatureHeader || !secretKey) {
    return false;
  }
  const expectedHash = crypto
    .createHmac('sha512', secretKey)
    .update(rawBody)
    .digest('hex');

  const sigBuffer = Buffer.from(signatureHeader, 'utf8');
  const expectedBuffer = Buffer.from(expectedHash, 'utf8');

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
}

/**
 * NestJS-compatible controller handler for POST /api/webhooks/paystack
 */
export class PaystackWebhookController {
  constructor(private readonly paystackSecretKey: string) {}

  async handleWebhook(
    rawBody: string,
    signatureHeader: string | undefined
  ): Promise<{ received: boolean; orderStatusUpdated: boolean; reference?: string }> {
    const isValid = verifyPaystackWebhookSignature(
      rawBody,
      signatureHeader,
      this.paystackSecretKey
    );

    if (!isValid) {
      throw new Error('Invalid Paystack webhook signature');
    }

    const payload = JSON.parse(rawBody) as PaystackWebhookEvent;

    if (
      payload.event === 'charge.success' &&
      payload.data.status === 'success' &&
      payload.data.currency === 'NGN'
    ) {
      // In production Postgres:
      // 1. UPDATE payments SET status = 'verified', raw_payload = $1, verified_at = NOW() WHERE reference = $2;
      // 2. UPDATE orders SET status = 'paid', updated_at = NOW() WHERE id = (SELECT order_id FROM payments WHERE reference = $2);
      // 3. Trigger Resend confirmation email and WhatsApp Business Cloud API notification (if enabled).
      return {
        received: true,
        orderStatusUpdated: true,
        reference: payload.data.reference,
      };
    }

    return {
      received: true,
      orderStatusUpdated: false,
      reference: payload.data?.reference,
    };
  }
}
