import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { products } from '../data/products';
import { defaultFilters, filterProducts } from '../lib/catalog';
import type { CatalogFilters, Product } from '../types';

interface CatalogFiltersContextValue {
  filters: CatalogFilters;
  results: Product[];
  setFilters: (patch: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
}

const CatalogFiltersContext = createContext<CatalogFiltersContextValue | null>(null);

export function CatalogFiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setState] = useState<CatalogFilters>(defaultFilters);

  const setFilters = useCallback((patch: Partial<CatalogFilters>) => setState((current) => ({ ...current, ...patch })), []);
  const resetFilters = useCallback(() => setState(defaultFilters), []);
  const results = useMemo(() => filterProducts(products, filters), [filters]);

  const value = useMemo(() => ({ filters, results, setFilters, resetFilters }), [filters, results, setFilters, resetFilters]);

  return <CatalogFiltersContext value={value}>{children}</CatalogFiltersContext>;
}

export function useCatalogFilters(): CatalogFiltersContextValue {
  const context = use(CatalogFiltersContext);
  if (!context) throw new Error('useCatalogFilters must be used inside CatalogFiltersProvider');
  return context;
}
