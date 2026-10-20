import { categoryName } from '../data/categories';
import type { CatalogFilters, PriceRange, Product, SortOption } from '../types';
import { normalizeText } from './format';
import { startingPrice } from './pricing';

export const defaultFilters: CatalogFilters = {
  query: '',
  category: 'todas',
  priceRange: null,
  sort: 'relevancia',
};

export const priceRangeOptions: { id: PriceRange; label: string; min: number; max: number }[] = [
  { id: 'ate-20', label: 'Até R$ 20', min: 0, max: 2000 },
  { id: '20-40', label: 'R$ 20 a R$ 40', min: 2001, max: 4000 },
  { id: 'acima-40', label: 'Acima de R$ 40', min: 4001, max: Number.POSITIVE_INFINITY },
];

export const sortOptions: { id: SortOption; label: string; hint?: string }[] = [
  { id: 'relevancia', label: 'Relevância' },
  { id: 'menor-preco', label: 'Menor preço' },
  { id: 'maior-preco', label: 'Maior preço' },
  { id: 'mais-pedidos', label: 'Mais pedidos', hint: 'Ordem demonstrativa, sem dados reais de vendas' },
];

export function priceRangeLabel(id: PriceRange): string {
  return priceRangeOptions.find((option) => option.id === id)?.label ?? id;
}

export function sortLabel(id: SortOption): string {
  return sortOptions.find((option) => option.id === id)?.label ?? id;
}

function searchableText(product: Product): { name: string; rest: string } {
  return {
    name: normalizeText(product.name),
    rest: normalizeText([product.description, categoryName(product.categoryId), ...(product.tags ?? [])].join(' ')),
  };
}

/** 0 = no match. Higher = better. Every word of the query must appear somewhere. */
export function matchScore(product: Product, query: string): number {
  const terms = normalizeText(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 1;
  const { name, rest } = searchableText(product);
  let score = 0;
  for (const term of terms) {
    if (name.split(/\s+/).some((word) => word.startsWith(term))) score += 3;
    else if (name.includes(term)) score += 2;
    else if (rest.includes(term)) score += 1;
    else return 0;
  }
  return score;
}

/** True when the visitor is searching or refining (not just browsing a category). */
export function isRefining(filters: CatalogFilters): boolean {
  return filters.query.trim() !== '' || filters.priceRange !== null || filters.sort !== 'relevancia';
}

export function activeFilterCount(filters: CatalogFilters): number {
  return (
    (filters.category !== 'todas' ? 1 : 0) + (filters.priceRange ? 1 : 0) + (filters.sort !== 'relevancia' ? 1 : 0)
  );
}

export function filterProducts(products: Product[], filters: CatalogFilters): Product[] {
  const range = priceRangeOptions.find((option) => option.id === filters.priceRange);

  const scored = products
    .map((product, index) => ({ product, index, score: matchScore(product, filters.query) }))
    .filter(({ product, score }) => {
      if (!product.available || score === 0) return false;
      if (filters.category !== 'todas' && product.categoryId !== filters.category) return false;
      if (range) {
        const price = startingPrice(product);
        if (price < range.min || price > range.max) return false;
      }
      return true;
    });

  scored.sort((a, b) => {
    switch (filters.sort) {
      case 'menor-preco':
        return startingPrice(a.product) - startingPrice(b.product) || a.index - b.index;
      case 'maior-preco':
        return startingPrice(b.product) - startingPrice(a.product) || a.index - b.index;
      case 'mais-pedidos':
        return b.product.popularity - a.product.popularity || a.index - b.index;
      default:
        return b.score - a.score || a.index - b.index;
    }
  });

  return scored.map(({ product }) => product);
}
