/**
 * Formats a user-entered Nigerian phone string into a clean +234 display format
 * e.g. "08031234567" -> "+234 803 123 4567"
 */
export function formatNigerianPhone(rawInput: string): string {
  const digits = rawInput.replace(/\D/g, '');

  let localTen = '';
  if (digits.startsWith('234')) {
    localTen = digits.slice(3, 13);
  } else if (digits.startsWith('0')) {
    localTen = digits.slice(1, 11);
  } else {
    localTen = digits.slice(0, 10);
  }

  if (!localTen) {
    return '+234 ';
  }

  const part1 = localTen.slice(0, 3);
  const part2 = localTen.slice(3, 6);
  const part3 = localTen.slice(6, 10);

  return ['+234', part1, part2, part3].filter(Boolean).join(' ');
}

/**
 * Validates that a phone number is a valid Nigerian mobile number (+234 followed by 10 digits starting with 70, 80, 81, 90, or 91).
 */
export function isValidNigerianPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, '');
  let normalized = digits;

  if (digits.startsWith('0') && digits.length === 11) {
    normalized = `234${digits.slice(1)}`;
  } else if (digits.length === 10) {
    normalized = `234${digits}`;
  }

  return /^234(70|80|81|90|91)\d{8}$/.test(normalized);
}

/**
 * Normalizes a valid Nigerian phone number to E.164 (+234XXXXXXXXXX).
 */
export function toE164NigerianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('234') && digits.length === 13) {
    return `+${digits}`;
  }
  if (digits.startsWith('0') && digits.length === 11) {
    return `+234${digits.slice(1)}`;
  }
  if (digits.length === 10) {
    return `+234${digits}`;
  }
  return `+${digits}`;
}
