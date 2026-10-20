import { createContext, use, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { readStorage, storageKeys, writeStorage } from '../lib/storage';
import { getProduct, themeStorageKey } from '../themes';
import { useTheme } from './useTheme';

interface FavoritesContextValue {
  ids: string[];
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => boolean;
  remove: (productId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const isStringList = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const loadFavorites = (key: string) => readStorage<string[]>(key, [], isStringList).filter((id) => getProduct(id));

/** One favorites list per theme, like the bag. */
export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const key = themeStorageKey(storageKeys.favorites, theme.id);
  const [ids, setIds] = useState<string[]>(() => loadFavorites(key));
  const [loadedKey, setLoadedKey] = useState(key);

  if (loadedKey !== key) {
    setLoadedKey(key);
    setIds(loadFavorites(key));
  }

  useEffect(() => {
    writeStorage(loadedKey, ids);
  }, [ids, loadedKey]);

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
