const ngnFormatter = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formats an integer amount in kobo as Nigerian Naira using the en-NG locale (e.g., 18500000 -> "₦185,000").
 */
export function formatKoboToNgn(kobo: number): string {
  const naira = Math.round(kobo / 100);
  return ngnFormatter.format(naira);
}

/**
 * Converts a whole Naira amount to integer kobo (e.g., 85000 -> 8500000).
 */
export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

/**
 * Converts integer kobo to whole Naira.
 */
export function koboToNaira(kobo: number): number {
  return Math.round(kobo / 100);
}
