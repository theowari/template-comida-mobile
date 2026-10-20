import { useEffect, useMemo, useState } from 'react';
import { railCategories } from '../../data/categories';
import { products } from '../../data/products';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { useOverlay } from '../../hooks/useOverlay';
import { filterProducts, priceRangeOptions, sortOptions } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import { pluralize } from '../../lib/format';
import type { CatalogFilters } from '../../types';
import { Button } from '../ui/Button';
import { ToggleChip } from '../ui/Chip';
import { Sheet, SheetFooter, SheetHeader } from '../ui/Sheet';

export function FilterSheet() {
  const overlay = useOverlay('filtros');
  const { filters, setFilters } = useCatalogFilters();
  const [draft, setDraft] = useState<CatalogFilters>(filters);

  // Start from the current filters every time the sheet opens.
  useEffect(() => {
    if (overlay.isOpen) setDraft(filters);
  }, [overlay.isOpen]);

  const count = useMemo(() => filterProducts(products, draft).length, [draft]);
  const patch = (value: Partial<CatalogFilters>) => setDraft((current) => ({ ...current, ...value }));

  return (
    <Sheet open={overlay.isOpen} onClose={overlay.close} labelledBy="filtros-titulo" width={480}>
      <SheetHeader
        titleId="filtros-titulo"
        title="Filtros"
        onClose={overlay.close}
        actions={
          <button
            type="button"
            onClick={() => setDraft((current) => ({ ...current, category: 'todas', priceRange: null, sort: 'relevancia' }))}
            className="h-11 rounded-full px-3 text-sm font-semibold text-brand-dark hover:bg-brand-50"
          >
            Limpar
          </button>
        }
      />
      <div className="sheet-body space-y-7 px-4 py-5 sm:px-5">
        <fieldset>
          <legend className="mb-3 text-[15px] font-bold">Categoria</legend>
          <div className="flex flex-wrap gap-2">
            {railCategories.map((category) => (
              <ToggleChip
                key={category.id}
                label={category.name}
                selected={draft.category === category.id}
                onClick={() => patch({ category: category.id })}
              />
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-[15px] font-bold">Faixa de preço</legend>
          <div className="flex flex-wrap gap-2">
            {priceRangeOptions.map((range) => (
              <ToggleChip
                key={range.id}
                label={range.label}
                selected={draft.priceRange === range.id}
                onClick={() => patch({ priceRange: draft.priceRange === range.id ? null : range.id })}
              />
            ))}
          </div>
          <p className="mt-2 text-[13px] text-ink-2">Considera o menor preço de cada produto.</p>
        </fieldset>

        <fieldset>
          <legend className="mb-1 text-[15px] font-bold">Ordenar por</legend>
          <div className="divide-y divide-line">
            {sortOptions.map((option) => (
              <label key={option.id} className="flex min-h-13 cursor-pointer items-center gap-3 py-2.5">
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-[15px]', draft.sort === option.id && 'font-semibold')}>{option.label}</span>
                  {option.hint ? <span className="block text-[13px] text-ink-2">{option.hint}</span> : null}
                </span>
                <input
                  type="radio"
                  name="ordenar"
                  value={option.id}
                  checked={draft.sort === option.id}
                  onChange={() => patch({ sort: option.id })}
                  className="size-5 shrink-0 accent-brand"
                />
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <SheetFooter>
        <Button
          size="lg"
          className="w-full"
          disabled={count === 0}
          onClick={() => {
            setFilters({ category: draft.category, priceRange: draft.priceRange, sort: draft.sort });
            overlay.close();
          }}
        >
          {count === 0 ? 'Nenhum produto com esses filtros' : `Ver ${pluralize(count, 'resultado', 'resultados')}`}
        </Button>
      </SheetFooter>
    </Sheet>
  );
}
