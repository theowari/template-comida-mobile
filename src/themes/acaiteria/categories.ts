import type { Category, CategoryId } from '../../types';
import { image } from './images';

/** Rail order. */
export const categories: Category[] = [
  { id: 'todas', name: 'Todas', image: image('cat-todas', '') },
  { id: 'acai', name: 'Açaí', image: image('cat-acai', '') },
  { id: 'copos', name: 'Copos', image: image('cat-copos', '') },
  { id: 'bowls', name: 'Bowls', image: image('cat-bowls', '') },
  { id: 'smoothies', name: 'Smoothies', image: image('cat-smoothies', '') },
  { id: 'bebidas', name: 'Bebidas', image: image('cat-bebidas', '') },
  { id: 'combos', name: 'Combos', image: image('cat-todas', ''), hiddenFromRail: true },
];

/** Menu section order. */
export const menuSectionOrder: CategoryId[] = ['combos', 'acai', 'copos', 'bowls', 'smoothies', 'bebidas'];
