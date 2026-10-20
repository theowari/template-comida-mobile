import type { Coupon } from '../types';

/*
 * DEMO COUPONS, shared by every theme. Discounts are demonstrative until a
 * real promotion is configured in the backend. Banners and combos belong to
 * each theme (src/themes/<id>/index.ts).
 */
export const coupons: Coupon[] = [
  {
    code: 'BEMVINDO10',
    kind: 'percent',
    value: 10,
    maxDiscount: 1500,
    minSubtotal: 4000,
    description: '10% de desconto em pedidos a partir de R$ 40,00 (até R$ 15,00).',
    isDemo: true,
  },
  {
    code: 'FRETEGRATIS',
    kind: 'free-delivery',
    value: 0,
    minSubtotal: 6000,
    description: 'Entrega grátis em pedidos a partir de R$ 60,00.',
    isDemo: true,
  },
];

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return coupons.find((coupon) => coupon.code === normalized);
}
