import type { CartItem, Selections } from '../types';
import { createId } from './id';

export interface CartState {
  items: CartItem[];
  couponCode: string | null;
}

export type CartAction =
  | { type: 'add'; productId: string; selections: Selections; notes: string; quantity: number }
  | { type: 'update'; lineId: string; selections: Selections; notes: string; quantity: number }
  | { type: 'set-quantity'; lineId: string; quantity: number }
  | { type: 'remove'; lineId: string }
  | { type: 'restore'; item: CartItem; index: number }
  | { type: 'clear' }
  | { type: 'apply-coupon'; code: string }
  | { type: 'remove-coupon' }
  | { type: 'hydrate'; state: CartState };

export const MAX_QUANTITY = 20;

export const emptyCart: CartState = { items: [], couponCode: null };

const clampQuantity = (quantity: number) => Math.min(MAX_QUANTITY, Math.max(0, Math.round(quantity)));

/** Stable key: same product + same choices + same notes = same line. */
export function lineSignature(productId: string, selections: Selections, notes: string): string {
  const normalized = Object.keys(selections)
    .sort()
    .map((groupId) => `${groupId}=${[...selections[groupId]].sort().join(',')}`)
    .join('|');
  return `${productId}::${normalized}::${notes.trim().toLowerCase()}`;
}

const signatureOf = (item: CartItem) => lineSignature(item.productId, item.selections, item.notes);

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'add': {
      const quantity = clampQuantity(action.quantity);
      if (quantity === 0) return state;
      const signature = lineSignature(action.productId, action.selections, action.notes);
      const existing = state.items.find((item) => signatureOf(item) === signature);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item === existing ? { ...item, quantity: clampQuantity(item.quantity + quantity) } : item,
          ),
        };
      }
      const item: CartItem = {
        lineId: createId(),
        productId: action.productId,
        selections: action.selections,
        notes: action.notes.trim(),
        quantity,
      };
      return { ...state, items: [...state.items, item] };
    }

    case 'update': {
      const current = state.items.find((item) => item.lineId === action.lineId);
      if (!current) return state;
      const updated: CartItem = {
        ...current,
        selections: action.selections,
        notes: action.notes.trim(),
        quantity: clampQuantity(action.quantity),
      };
      if (updated.quantity === 0) {
        return { ...state, items: state.items.filter((item) => item.lineId !== action.lineId) };
      }
      // Editing can make this line identical to another one: merge them.
      const twin = state.items.find(
        (item) => item.lineId !== action.lineId && signatureOf(item) === signatureOf(updated),
      );
      if (twin) {
        return {
          ...state,
          items: state.items
            .filter((item) => item.lineId !== action.lineId)
            .map((item) =>
              item === twin ? { ...item, quantity: clampQuantity(item.quantity + updated.quantity) } : item,
            ),
        };
      }
      return { ...state, items: state.items.map((item) => (item.lineId === action.lineId ? updated : item)) };
    }

    case 'set-quantity': {
      const quantity = clampQuantity(action.quantity);
      if (quantity === 0) {
        return { ...state, items: state.items.filter((item) => item.lineId !== action.lineId) };
      }
      return {
        ...state,
        items: state.items.map((item) => (item.lineId === action.lineId ? { ...item, quantity } : item)),
      };
    }

    case 'remove':
      return { ...state, items: state.items.filter((item) => item.lineId !== action.lineId) };

    case 'restore': {
      if (state.items.some((item) => item.lineId === action.item.lineId)) return state;
      const items = [...state.items];
      items.splice(Math.min(action.index, items.length), 0, action.item);
      return { ...state, items };
    }

    case 'clear':
      return { items: [], couponCode: state.couponCode };

    case 'apply-coupon':
      return { ...state, couponCode: action.code.trim().toUpperCase() || null };

    case 'remove-coupon':
      return { ...state, couponCode: null };

    case 'hydrate':
      return action.state;
  }
}
