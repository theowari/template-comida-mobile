import type { Category, CategoryId } from '../../types';
import { image } from './images';

/** Rail order. */
export const categories: Category[] = [
  { id: 'todas', name: 'Todas', image: image('cat-todas', '') },
  { id: 'cafes', name: 'Cafés', image: image('cat-cafes', '') },
  { id: 'gelados', name: 'Gelados', image: image('cat-gelados', '') },
  { id: 'salgados', name: 'Salgados', image: image('cat-salgados', '') },
  { id: 'doces', name: 'Doces', image: image('cat-doces', '') },
  { id: 'graos', name: 'Grãos', image: image('cat-graos', '') },
  { id: 'combos', name: 'Combos', image: image('cat-todas', ''), hiddenFromRail: true },
];

/** Menu section order. */
export const menuSectionOrder: CategoryId[] = ['combos', 'cafes', 'gelados', 'salgados', 'doces', 'graos'];
