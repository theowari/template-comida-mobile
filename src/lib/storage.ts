/**
 * localStorage access that never throws: private windows, blocked storage
 * and corrupted values fall back to the default.
 */
export const storageKeys = {
  cart: 'seu-negocio:cart:v1',
  favorites: 'seu-negocio:favorites:v1',
  checkout: 'seu-negocio:checkout:v1',
  orders: 'seu-negocio:orders:v1',
} as const;

export function readStorage<T>(key: string, fallback: T, isValid?: (value: unknown) => value is T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const parsed: unknown = JSON.parse(raw);
    if (isValid && !isValid(parsed)) return fallback;
    return parsed as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked: the app keeps working in memory.
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
