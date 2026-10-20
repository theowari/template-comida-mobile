import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct } from '../data/products';
import { readStorage, storageKeys, writeStorage } from '../lib/storage';

interface FavoritesContextValue {
  ids: string[];
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() =>
    readStorage<string[]>(storageKeys.favorites, [], isStringList).filter((id) => getProduct(id)),
  );

  useEffect(() => {
    writeStorage(storageKeys.favorites, ids);
  }, [ids]);

  const isFavorite = useCallback((productId: string) => ids.includes(productId), [ids]);

  const toggle = useCallback(
    (productId: string) => {
      const next = !ids.includes(productId);
      setIds((current) => (next ? [...current, productId] : current.filter((id) => id !== productId)));
      return next;
    },
    [ids],
  );

  const remove = useCallback((productId: string) => setIds((current) => current.filter((id) => id !== productId)), []);

  const value = useMemo(() => ({ ids, isFavorite, toggle, remove }), [ids, isFavorite, toggle, remove]);

  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}

export function useFavorites(): FavoritesContextValue {
  const context = use(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used inside FavoritesProvider');
  return context;
}
