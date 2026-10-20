import type { Category, CategoryId } from '../types';
import { image } from './images';

export const categories: Category[] = [
  { id: 'todas', name: 'Todas', image: image('cat-todas', '') },
  { id: 'pizzas', name: 'Pizzas', image: image('cat-pizzas', '') },
  { id: 'paes-de-alho', name: 'Pães de alho', image: image('cat-paes-de-alho', '') },
  { id: 'acompanhamentos', name: 'Acompanhamentos', image: image('cat-acompanhamentos', '') },
  { id: 'bebidas', name: 'Bebidas', image: image('cat-bebidas', '') },
  { id: 'sobremesas', name: 'Sobremesas', image: image('cat-sobremesas', '') },
  { id: 'combos', name: 'Combos', image: image('cat-todas', ''), hiddenFromRail: true },
];

/** Category rail order (brief: Todas, Pizzas, Pães de alho, Acompanhamentos, Bebidas, Sobremesas). */
export const railCategories = categories.filter((category) => !category.hiddenFromRail);

/** Menu section order. */
export const menuSectionOrder: CategoryId[] = [
  'combos',
  'pizzas',
  'paes-de-alho',
  'acompanhamentos',
  'bebidas',
  'sobremesas',
];

export function categoryName(id: string): string {
  return categories.find((category) => category.id === id)?.name ?? id;
}
