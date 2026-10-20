import { useCallback } from 'react';
import { initialSelections, requiresChoice } from '../lib/pricing';
import type { Product } from '../types';
import { useCart } from './useCart';
import { useOverlay } from './useOverlay';
import { useToast } from './useToast';

export function addedMessage(product: Product, quantity: number) {
  return `Adicionado à sacola: ${quantity > 1 ? `${quantity}x ` : ''}${product.name}`;
}

/** Same behavior for every "+" button: quick add, or open the options first. */
export function useProductActions() {
  const productSheet = useOverlay('produto');
  const bag = useOverlay('sacola');
  const cart = useCart();
  const toast = useToast();

  const openDetails = useCallback((product: Product) => productSheet.open(product.id), [productSheet]);

  const quickAdd = useCallback(
    (product: Product) => {
      if (requiresChoice(product)) {
        productSheet.open(product.id);
        return;
      }
      cart.add(product.id, initialSelections(product), '', 1);
      toast.show({ message: addedMessage(product, 1), action: { label: 'Ver sacola', onClick: () => bag.open() } });
    },
    [bag, cart, productSheet, toast],
  );

  return { openDetails, quickAdd };
}
