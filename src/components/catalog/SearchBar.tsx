import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { useOverlay } from '../../hooks/useOverlay';
import { useTheme } from '../../hooks/useTheme';
import { activeFilterCount } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { CountBadge } from '../ui/IconTile';

interface SearchBarProps {
  className?: string;
  /** Smaller variant for the desktop header. */
  compact?: boolean;
}

const searchPages = ['/', '/cardapio'];

export function SearchBar({ className, compact = false }: SearchBarProps) {
  const { filters, setFilters } = useCatalogFilters();
  const { theme } = useTheme();
  const filterSheet = useOverlay('filtros');
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const count = activeFilterCount(filters);

  const goToResults = () => {
    if (!searchPages.includes(location.pathname)) navigate('/cardapio');
  };

  return (
    <div role="search" className={cn('flex items-center gap-2.5', className)}>
      <div className="relative min-w-0 flex-1">
        <Search
          className={cn('pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink', compact ? 'size-[18px]' : 'size-5')}
          strokeWidth={2}
          aria-hidden
        />
        <input
          ref={inputRef}
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          aria-label="Buscar no cardápio"
          placeholder={compact ? 'Buscar no cardápio...' : theme.brand.searchPlaceholder}
          value={filters.query}
          onChange={(event) => {
            setFilters({ query: event.target.value });
            goToResults();
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              goToResults();
              inputRef.current?.blur();
            }
          }}
          className={cn(
            'w-full rounded-full border border-transparent bg-surface pl-12 text-ink shadow-tile transition-[border-color,box-shadow] duration-150 outline-none placeholder:text-ink-2 hover:border-line-strong focus:border-ink focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--color-ink)_10%,transparent)] focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden',
            compact ? 'h-11' : 'h-12',
            filters.query ? 'pr-12' : 'pr-4',
          )}
        />
        {filters.query ? (
          <button
            type="button"
            onClick={() => {
              setFilters({ query: '' });
              inputRef.current?.focus();
            }}
            aria-label="Limpar busca"
            className="press absolute top-1/2 right-1 grid size-10 -translate-y-1/2 place-items-center rounded-full text-ink-2 hover:bg-ground-2 hover:text-ink"
          >
            <X className="size-[18px]" aria-hidden />
          </button>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => filterSheet.open()}
        aria-label={count ? `Filtros, ${count} ativos` : 'Filtros'}
        className={cn(
          'press relative grid shrink-0 place-items-center rounded-full bg-surface text-ink shadow-tile transition-shadow hover:shadow-lift',
          compact ? 'size-11' : 'size-12',
        )}
      >
        <SlidersHorizontal className="size-5" strokeWidth={1.9} aria-hidden />
        {count ? <CountBadge count={count} className="absolute -top-1 -right-1" /> : null}
      </button>
    </div>
  );
}
