import { railCategories } from '../../data/categories';
import { useCatalogFilters } from '../../hooks/useCatalogFilters';
import { cn } from '../../lib/cn';
import type { CategoryFilter } from '../../types';
import { FoodImage } from '../ui/FoodImage';

interface CategoryListProps {
  /** tiles: photo tiles (home). chips: compact pills (menu). */
  variant?: 'tiles' | 'chips';
  onSelect?: (category: CategoryFilter) => void;
  className?: string;
}

/** Category rail. Selecting a category filters the product list in place. */
export function CategoryList({ variant = 'tiles', onSelect, className }: CategoryListProps) {
  const { filters, setFilters } = useCatalogFilters();

  const select = (id: CategoryFilter) => {
    setFilters({ category: id });
    onSelect?.(id);
  };

  return (
    <nav aria-label="Categorias" className={className}>
      <ul
        className={cn(
          'no-scrollbar -mx-4 flex overflow-x-auto px-4',
          variant === 'tiles' ? 'gap-2.5 py-1.5 lg:mx-0 lg:gap-4 lg:px-0' : 'gap-2 py-1',
        )}
      >
        {railCategories.map((category) => {
          const active = filters.category === category.id;
          return (
            <li key={category.id} className="shrink-0">
              {variant === 'tiles' ? (
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(category.id)}
                  className="press group flex min-w-[76px] flex-col items-center gap-1.5 rounded-2xl px-0.5 pb-1 lg:min-w-[104px]"
                >
                  <span
                    className={cn(
                      'grid size-[72px] place-items-center rounded-[18px] bg-surface shadow-tile ring-2 transition-[box-shadow] duration-150 lg:size-[92px] lg:rounded-[22px]',
                      active ? 'ring-brand' : 'ring-transparent group-hover:ring-line-strong',
                    )}
                  >
                    <FoodImage image={category.image} className="size-[58px] rounded-[13px] object-cover lg:size-[76px] lg:rounded-[16px]" />
                  </span>
                  <span
                    className={cn(
                      'text-center text-[12px] leading-tight whitespace-nowrap lg:text-sm',
                      active ? 'font-bold text-brand-dark' : 'font-medium text-ink',
                    )}
                  >
                    {category.name}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => select(category.id)}
                  className={cn(
                    'press flex h-10 items-center gap-2 rounded-full border-[1.5px] pr-4 pl-1 text-sm transition-[background-color,border-color,color] duration-150',
                    active
                      ? 'border-brand bg-brand-50 font-bold text-brand-dark'
                      : 'border-transparent bg-surface font-medium text-ink shadow-tile hover:border-line-strong',
                  )}
                >
                  <FoodImage image={category.image} className="size-8 rounded-full object-cover" />
                  {category.name}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
