import type { Category, CategoryId } from '../../types';
import { image } from './images';

/** Rail order. */
export const categories: Category[] = [
  { id: 'todas', name: 'Todas', image: image('cat-todas', '') },
  { id: 'bolos', name: 'Bolos', image: image('cat-bolos', '') },
  { id: 'tortas', name: 'Tortas', image: image('cat-tortas', '') },
  { id: 'docinhos', name: 'Docinhos', image: image('cat-docinhos', '') },
  { id: 'cupcakes', name: 'Cupcakes', image: image('cat-cupcakes', '') },
  { id: 'bebidas', name: 'Bebidas', image: image('cat-bebidas', '') },
  { id: 'combos', name: 'Combos', image: image('cat-todas', ''), hiddenFromRail: true },
];

/** Menu section order. */
export const menuSectionOrder: CategoryId[] = ['combos', 'bolos', 'tortas', 'docinhos', 'cupcakes', 'bebidas'];
