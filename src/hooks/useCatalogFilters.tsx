import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react';
import { defaultFilters, filterProducts } from '../lib/catalog';
import { ALL_CATEGORIES } from '../themes';
import type { CatalogFilters, Product } from '../types';
import { useTheme } from './useTheme';

interface CatalogFiltersContextValue {
  filters: CatalogFilters;
  results: Product[];
  setFilters: (patch: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
}

const CatalogFiltersContext = createContext<CatalogFiltersContextValue | null>(null);

export function CatalogFiltersProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const [filters, setState] = useState<CatalogFilters>(defaultFilters);
  const [filteredTheme, setFilteredTheme] = useState(theme.id);

  // A new theme keeps the search, price range and sort, but a category it does not have goes back to "Todas".
  if (filteredTheme !== theme.id) {
    setFilteredTheme(theme.id);
    if (!theme.catalog.categories.some((category) => category.id === filters.category)) {
      setState((current) => ({ ...current, category: ALL_CATEGORIES }));
    }
  }

  const setFilters = useCallback((patch: Partial<CatalogFilters>) => setState((current) => ({ ...current, ...patch })), []);
  const resetFilters = useCallback(() => setState(defaultFilters), []);
  const results = useMemo(() => filterProducts(theme.catalog.products, filters), [theme, filters]);

  const value = useMemo(() => ({ filters, results, setFilters, resetFilters }), [filters, results, setFilters, resetFilters]);

  return <CatalogFiltersContext value={value}>{children}</CatalogFiltersContext>;
}

export function useCatalogFilters(): CatalogFiltersContextValue {
  const context = use(CatalogFiltersContext);
  if (!context) throw new Error('useCatalogFilters must be used inside CatalogFiltersProvider');
  return context;
}
