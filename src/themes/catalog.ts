import type { Product } from '../types';

/** Highest combo discount, computed from the catalog so a banner never overstates it. */
export function comboDiscountPercent(products: Product[]): number {
  return Math.round(
    Math.max(
      0,
      ...products
        .filter((product) => product.categoryId === 'combos' && product.compareAtPrice)
        .map((product) => 1 - product.basePrice / (product.compareAtPrice as number)),
    ) * 100,
  );
}
