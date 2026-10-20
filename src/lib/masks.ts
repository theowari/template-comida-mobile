export const onlyDigits = (value: string) => value.replace(/\D/g, '');

/** "11987654321" -> "(11) 98765-4321" */
export function formatPhone(value: string): string {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length === 0) return '';
  if (digits.length <= 2) return `(${digits}`;
  const area = digits.slice(0, 2);
  const rest = digits.slice(2);
  if (rest.length <= 4) return `(${area}) ${rest}`;
  const split = rest.length === 9 ? 5 : 4;
  return `(${area}) ${rest.slice(0, split)}-${rest.slice(split)}`;
}

export function isValidPhone(value: string): boolean {
  const digits = onlyDigits(value);
  return digits.length === 10 || (digits.length === 11 && digits[2] === '9');
}

/** "01234567" -> "01234-567" */
export function formatCep(value: string): string {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export const isValidCep = (value: string) => onlyDigits(value).length === 8;

/** "50" -> 5000, "50,5" -> 5050, "1.234,56" -> 123456 */
export function parseMoneyInput(value: string): number | null {
  const cleaned = value.replace(/[^\d,]/g, '');
  if (!cleaned) return null;
  const [integer, fraction = ''] = cleaned.split(',');
  const cents = Number(integer || '0') * 100 + Number((fraction + '00').slice(0, 2));
  return Number.isFinite(cents) ? cents : null;
}
