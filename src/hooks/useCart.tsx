import { createContext, use, useCallback, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { getProduct } from '../data/products';
import { cartReducer, emptyCart, type CartState } from '../lib/cart';
import { computeTotals, evaluateCoupon, isValidSelection, type CartTotals, type CouponStatus } from '../lib/pricing';
import { readStorage, storageKeys, writeStorage } from '../lib/storage';
import type { CartItem, Selections } from '../types';
import { useCheckoutDraft } from './useCheckoutDraft';

interface CartContextValue {
  items: CartItem[];
  couponCode: string | null;
  totals: CartTotals;
  add: (productId: string, selections: Selections, notes: string, quantity: number) => void;
  update: (lineId: string, selections: Selections, notes: string, quantity: number) => void;
  setQuantity: (lineId: string, quantity: number) => void;
  /** Removes a line and returns what is needed to undo it. */
  remove: (lineId: string) => { item: CartItem; index: number } | null;
  restore: (item: CartItem, index: number) => void;
  clear: () => void;
  /** Applies the coupon only when it is valid now; returns the evaluation for feedback. */
  applyCoupon: (code: string) => CouponStatus;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

/** Drops lines whose product disappeared or whose options no longer match the catalog. */
function sanitize(state: CartState): CartState {
  return {
    couponCode: typeof state.couponCode === 'string' ? state.couponCode : null,
    items: (Array.isArray(state.items) ? state.items : []).filter((item) => {
      const product = getProduct(item?.productId);
      return (
        product?.available &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        isValidSelection(product, item.selections ?? {})
      );
    }),
  };
}

const loadCart = () => sanitize(readStorage<CartState>(storageKeys.cart, emptyCart));

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, loadCart);
  const { draft } = useCheckoutDraft();

  useEffect(() => {
    writeStorage(storageKeys.cart, state);
  }, [state]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKeys.cart) dispatch({ type: 'hydrate', state: loadCart() });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const totals = useMemo(
    () => computeTotals(state.items, getProduct, { mode: draft.mode, couponCode: state.couponCode }),
    [state.items, state.couponCode, draft.mode],
  );

  const add = useCallback(
    (productId: string, selections: Selections, notes: string, quantity: number) =>
      dispatch({ type: 'add', productId, selections, notes, quantity }),
    [],
  );
  const update = useCallback(
    (lineId: string, selections: Selections, notes: string, quantity: number) =>
      dispatch({ type: 'update', lineId, selections, notes, quantity }),
    [],
  );
  const setQuantity = useCallback(
    (lineId: string, quantity: number) => dispatch({ type: 'set-quantity', lineId, quantity }),
    [],
  );
  const remove = useCallback(
    (lineId: string) => {
      const index = state.items.findIndex((item) => item.lineId === lineId);
      if (index === -1) return null;
      dispatch({ type: 'remove', lineId });
      return { item: state.items[index], index };
    },
    [state.items],
  );
  const restore = useCallback((item: CartItem, index: number) => dispatch({ type: 'restore', item, index }), []);
  const clear = useCallback(() => dispatch({ type: 'clear' }), []);
  const applyCoupon = useCallback(
    (code: string) => {
      const status = evaluateCoupon(code.trim().toUpperCase(), totals.subtotal, totals.deliveryFee, draft.mode);
      if (status.state === 'applied') dispatch({ type: 'apply-coupon', code });
      return status;
    },
    [totals.subtotal, totals.deliveryFee, draft.mode],
  );
  const removeCoupon = useCallback(() => dispatch({ type: 'remove-coupon' }), []);

  const value = useMemo(
    () => ({
      items: state.items,
      couponCode: state.couponCode,
      totals,
      add,
      update,
      setQuantity,
      remove,
      restore,
      clear,
      applyCoupon,
      removeCoupon,
    }),
    [state, totals, add, update, setQuantity, remove, restore, clear, applyCoupon, removeCoupon],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = use(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
