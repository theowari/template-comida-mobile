import { describe, expect, it } from 'vitest';
import { products } from '../themes/pizzaria/products';
import { defaultFilters, filterProducts, isRefining, matchScore } from './catalog';
import { startingPrice } from './pricing';

const names = (query: string, extra = {}) =>
  filterProducts(products, { ...defaultFilters, query, ...extra }).map((product) => product.name);

describe('catalog search and filters', () => {
  it('finds products by part of the name, ignoring accents and case', () => {
    // Name matches first; the combo matches through its description.
    expect(names('pao')).toEqual(['Pão de Alho Especial', 'Pão de Alho Tradicional', 'Combo Família']);
    expect(names('QUATRO')[0]).toBe('Pizza Quatro Queijos');
    expect(names('gat')).toEqual(['Petit Gâteau']);
  });

  it('ranks name matches above description matches', () => {
    const results = names('queijo');
    expect(results[0]).toBe('Pizza Quatro Queijos');
    expect(results).toContain('Pão de Alho Especial');
  });

  it('requires every word of the query', () => {
    expect(names('pizza frango')).toEqual(['Pizza BBQ Especial']);
    expect(names('xyz')).toEqual([]);
  });

  it('combines category, price range and sort', () => {
    const results = filterProducts(products, { ...defaultFilters, category: 'bebidas', priceRange: 'ate-20', sort: 'menor-preco' });
    expect(results.map((product) => product.id)).toEqual(['refrigerante-lata', 'cha-gelado', 'limonada']);
    const prices = results.map(startingPrice);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  it('knows when the visitor is refining rather than browsing', () => {
    expect(isRefining(defaultFilters)).toBe(false);
    expect(isRefining({ ...defaultFilters, category: 'pizzas' })).toBe(false);
    expect(isRefining({ ...defaultFilters, query: 'pizza' })).toBe(true);
    expect(isRefining({ ...defaultFilters, sort: 'maior-preco' })).toBe(true);
  });

  it('scores an empty query as a match', () => {
    expect(matchScore(products[0], '   ')).toBeGreaterThan(0);
  });
});
