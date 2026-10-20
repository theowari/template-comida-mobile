import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { activeFilterCount, priceRangeLabel, sortLabel } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { categoryName } from '../../themes';
import { RemovableChip } from '../ui/Chip';

/** Active filters, each removable on its own, plus "clear all". */
export function ActiveFilters({ className }: { className?: string }) {
  const { filters, setFilters, resetFilters } = useCatalogFilters();
  if (activeFilterCount(filters) === 0) return null;

  return (
    <div className={cn('no-scrollbar -mx-4 flex items-center gap-2 overflow-x-auto px-4 py-1', className)}>
      <span className="sr-only">Filtros ativos:</span>
      {filters.category !== 'todas' ? (
        <RemovableChip label={categoryName(filters.category)} onRemove={() => setFilters({ category: 'todas' })} />
      ) : null}
      {filters.priceRange ? (
        <RemovableChip label={priceRangeLabel(filters.priceRange)} onRemove={() => setFilters({ priceRange: null })} />
      ) : null}
      {filters.sort !== 'relevancia' ? (
        <RemovableChip label={sortLabel(filters.sort)} onRemove={() => setFilters({ sort: 'relevancia' })} />
      ) : null}
      <button
        type="button"
        onClick={() => resetFilters()}
        className="h-9 shrink-0 rounded-full px-3 text-[13px] font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink"
      >
        Limpar tudo
      </button>
    </div>
  );
}
