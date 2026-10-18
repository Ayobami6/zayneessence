import { NotificationDispatchLog, OrderRecord, OrderStatus } from '@/types/domain';

const STATUS_MESSAGES: Record<OrderStatus, string> = {
  paid: 'Order placed and payment confirmed. Our studio is preparing your pieces.',
  packed: 'Your order has been hand-packed in our studio and wrapped in tissue.',
  shipped: 'Your order has left our studio and is on its way to you.',
  delivered: 'Your order has been delivered. Enjoy your ritual.',
};

export function createOrderNotifications(
  order: Pick<OrderRecord, 'id' | 'orderNumber' | 'customerEmail' | 'customerPhone'>,
  status: OrderStatus,
  whatsappEnabled: boolean
): NotificationDispatchLog[] {
  const now = new Date().toISOString();
  const logs: NotificationDispatchLog[] = [
    {
      id: `notif-email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId: order.id,
      channel: 'email_resend',
      recipient: order.customerEmail,
      status,
      message: `[Resend] zayneessence order ${order.orderNumber} (${status}): ${STATUS_MESSAGES[status]}`,
      timestamp: now,
    },
  ];

  const envFlag =
    typeof process !== 'undefined' &&
    process.env.NEXT_PUBLIC_ENABLE_WHATSAPP_UPDATES === 'true';

  if (whatsappEnabled || envFlag) {
    logs.push({
      id: `notif-wa-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      orderId: order.id,
      channel: 'whatsapp_cloud',
      recipient: order.customerPhone,
      status,
      message: `[WhatsApp Cloud API] zayneessence order ${order.orderNumber}: ${STATUS_MESSAGES[status]}`,
      timestamp: now,
    });
  }

  return logs;
}
