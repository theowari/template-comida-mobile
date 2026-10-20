import { findCoupon } from '../data/promotions';
import { store } from '../data/store';
import type { CartItem, Cents, Coupon, FulfillmentMode, OptionGroup, Product, Selections } from '../types';

/* ---------------------------------------------------------------- *
 * Selections
 * ---------------------------------------------------------------- */

export function initialSelections(product: Product): Selections {
  const selections: Selections = {};
  for (const group of product.optionGroups ?? []) {
    selections[group.id] = [...(group.defaultChoiceIds ?? [])];
  }
  return selections;
}

/** True when the product cannot be added without the customer choosing something. */
export function requiresChoice(product: Product): boolean {
  return (product.optionGroups ?? []).some(
    (group) => group.min > 0 && (group.defaultChoiceIds?.length ?? 0) < group.min,
  );
}

export function hasOptions(product: Product): boolean {
  return (product.optionGroups?.length ?? 0) > 0;
}

/** True when a required choice changes the price ("a partir de"). */
export function hasVariablePrice(product: Product): boolean {
  return (product.optionGroups ?? []).some(
    (group) => group.min > 0 && new Set(group.choices.map((choice) => choice.priceDelta)).size > 1,
  );
}

export function groupError(group: OptionGroup, chosen: string[] = []): string | null {
  if (chosen.length < group.min) {
    return group.min === 1 ? 'Escolha 1 opção' : `Escolha pelo menos ${group.min} opções`;
  }
  if (chosen.length > group.max) {
    return `Escolha no máximo ${group.max}`;
  }
  return null;
}

/** groupId -> message, only for groups that are not valid. */
export function validateSelections(product: Product, selections: Selections): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const group of product.optionGroups ?? []) {
    const known = new Set(group.choices.map((choice) => choice.id));
    const chosen = (selections[group.id] ?? []).filter((id) => known.has(id));
    const error = groupError(group, chosen);
    if (error) errors[group.id] = error;
  }
  return errors;
}

export function isValidSelection(product: Product, selections: Selections): boolean {
  return Object.keys(validateSelections(product, selections)).length === 0;
}

/* ---------------------------------------------------------------- *
 * Prices
 * ---------------------------------------------------------------- */

export function unitPrice(product: Product, selections: Selections): Cents {
  let price = product.basePrice;
  for (const group of product.optionGroups ?? []) {
    const chosen = selections[group.id] ?? [];
    for (const choice of group.choices) {
      if (chosen.includes(choice.id)) price += choice.priceDelta;
    }
  }
  return price;
}

/** Lowest price a customer can pay for one unit (what the card shows). */
export function startingPrice(product: Product): Cents {
  let price = product.basePrice;
  for (const group of product.optionGroups ?? []) {
    if (group.min === 0) continue;
    const defaults = group.defaultChoiceIds ?? [];
    if (defaults.length >= group.min) {
      price += group.choices
        .filter((choice) => defaults.includes(choice.id))
        .reduce((sum, choice) => sum + choice.priceDelta, 0);
    } else {
      const cheapest = [...group.choices].map((choice) => choice.priceDelta).sort((a, b) => a - b);
      price += cheapest.slice(0, group.min).reduce((sum, delta) => sum + delta, 0);
    }
  }
  return price;
}

export function discountPercent(product: Product): number | null {
  if (!product.compareAtPrice || product.compareAtPrice <= product.basePrice) return null;
  return Math.round((1 - product.basePrice / product.compareAtPrice) * 100);
}

/* ---------------------------------------------------------------- *
 * Human-readable summary of a configured item
 * ---------------------------------------------------------------- */

const neutralChoiceIds = new Set(['inteira', 'sem-borda']);

export function describeSelections(product: Product, selections: Selections): string[] {
  const lines: string[] = [];
  for (const group of product.optionGroups ?? []) {
    const chosen = group.choices.filter((choice) => (selections[group.id] ?? []).includes(choice.id));
    if (chosen.length === 0) continue;
    const names = chosen.map((choice) => choice.name);

    switch (group.kind) {
      case 'size':
        lines.push(`Tamanho ${names[0].toLowerCase()}`);
        break;
      case 'crust':
        lines.push(`Massa ${names[0].toLowerCase()}`);
        break;
      case 'flavor':
      case 'border': {
        const visible = chosen.filter((choice) => !neutralChoiceIds.has(choice.id)).map((choice) => choice.name);
        if (visible.length > 0) lines.push(visible.join(', '));
        break;
      }
      case 'remove':
        lines.push(names.map((name, index) => (index === 0 ? name : name.toLowerCase())).join(', '));
        break;
      case 'extra':
      case 'choice':
        lines.push(`${group.title.replace(/\?$/, '')}: ${names.join(', ')}`);
        break;
    }
  }
  return lines;
}

/* ---------------------------------------------------------------- *
 * Totals
 * ---------------------------------------------------------------- */

export type CouponStatus =
  | { state: 'none' }
  | { state: 'invalid'; code: string }
  | { state: 'below-minimum'; coupon: Coupon; missing: Cents }
  | { state: 'not-applicable'; coupon: Coupon; reason: string }
  | { state: 'applied'; coupon: Coupon; discount: Cents };

export interface CartTotals {
  itemCount: number;
  subtotal: Cents;
  deliveryFee: Cents;
  discount: Cents;
  total: Cents;
  coupon: CouponStatus;
  /** Amount missing to reach the store's minimum order. 0 when reached. */
  missingForMinimum: Cents;
}

export function lineTotal(product: Product, item: CartItem): Cents {
  return unitPrice(product, item.selections) * item.quantity;
}

export function evaluateCoupon(code: string | null, subtotal: Cents, deliveryFee: Cents, mode: FulfillmentMode): CouponStatus {
  if (!code) return { state: 'none' };
  const coupon = findCoupon(code);
  if (!coupon) return { state: 'invalid', code };
  if (subtotal < coupon.minSubtotal) {
    return { state: 'below-minimum', coupon, missing: coupon.minSubtotal - subtotal };
  }
  if (coupon.kind === 'free-delivery') {
    if (mode === 'retirada' || deliveryFee === 0) {
      return { state: 'not-applicable', coupon, reason: 'Este cupom vale só para pedidos com entrega.' };
    }
    return { state: 'applied', coupon, discount: deliveryFee };
  }
  const raw = Math.round((subtotal * coupon.value) / 100);
  return { state: 'applied', coupon, discount: Math.min(raw, coupon.maxDiscount ?? raw) };
}

export function computeTotals(
  items: CartItem[],
  getProduct: (id: string) => Product | undefined,
  options: { mode: FulfillmentMode; couponCode: string | null },
): CartTotals {
  let subtotal = 0;
  let itemCount = 0;
  for (const item of items) {
    const product = getProduct(item.productId);
    if (!product) continue;
    subtotal += lineTotal(product, item);
    itemCount += item.quantity;
  }

  const deliveryFee = options.mode === 'entrega' && itemCount > 0 ? store.delivery.fee : 0;
  const coupon = itemCount > 0 ? evaluateCoupon(options.couponCode, subtotal, deliveryFee, options.mode) : { state: 'none' as const };
  const discount = coupon.state === 'applied' ? coupon.discount : 0;

  return {
    itemCount,
    subtotal,
    deliveryFee,
    discount,
    total: Math.max(0, subtotal + deliveryFee - discount),
    coupon,
    missingForMinimum: Math.max(0, store.delivery.minOrder - subtotal),
  };
}
