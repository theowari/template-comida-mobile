import { Heart, Plus, Star } from 'lucide-react';
import { store } from '../../data/store';
import { useFavorites } from '../../hooks/useFavorites';
import { useProductActions } from '../../hooks/useProductActions';
import { cn } from '../../lib/cn';
import { formatBRL, formatRating } from '../../lib/format';
import { imageSizes } from '../../lib/imageSizes';
import { discountPercent, hasVariablePrice, requiresChoice, startingPrice } from '../../lib/pricing';
import type { Product, ProductBadge } from '../../types';
import { FoodImage } from '../ui/FoodImage';

const badgeLabels: Record<ProductBadge, string> = {
  'mais-vendido': 'Mais vendido',
  popular: 'Popular',
  novidade: 'Novidade',
};

interface ProductCardProps {
  product: Product;
  /** card: photo on top (home grid). row: photo on the right (menu list on phones). */
  layout?: 'card' | 'row';
  /** Load the photo eagerly (first visible cards). */
  priority?: boolean;
  headingLevel?: 'h3' | 'h2';
}

export function ProductCard({ product, layout = 'card', priority, headingLevel = 'h3' }: ProductCardProps) {
  const { openDetails, quickAdd } = useProductActions();
  const Heading = headingLevel;
  const discount = discountPercent(product);

  const title = (
    <Heading className="text-[15px] leading-snug font-semibold tracking-[-0.005em] text-ink">
      <button
        type="button"
        onClick={() => openDetails(product)}
        className="text-left after:absolute after:inset-0 after:z-[1] after:rounded-card focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ink"
      >
        {product.name}
      </button>
    </Heading>
  );

  const badge = product.badge ? (
    <span className="rounded-full bg-brand px-2 py-[3px] text-[10px] leading-none font-bold tracking-[0.06em] text-white uppercase">
      {badgeLabels[product.badge]}
    </span>
  ) : discount ? (
    <span className="rounded-full bg-brand px-2 py-[3px] text-[10px] leading-none font-bold tracking-[0.06em] text-white uppercase">
      -{discount}%
    </span>
  ) : null;

  if (layout === 'row') {
    return (
      <article className="relative flex gap-3 rounded-card bg-surface p-3 shadow-card transition-shadow hover:shadow-card-hover">
        <div className="flex min-w-0 flex-1 flex-col">
          {badge ? <div className="mb-1.5 flex">{badge}</div> : null}
          {title}
          <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-2">{product.description}</p>
          <ProductRating product={product} />
          <div className="mt-auto pt-2">
            <ProductPrice product={product} />
          </div>
        </div>
        <div className="relative size-[108px] shrink-0">
          <FoodImage
            image={product.image}
            sizes={imageSizes.row}
            priority={priority}
            className="size-full rounded-xl bg-ground-2 object-cover"
          />
          <FavoriteButton product={product} className="absolute top-1.5 right-1.5" small />
          <AddButton product={product} onAdd={() => quickAdd(product)} className="absolute -right-1.5 -bottom-1.5" />
        </div>
      </article>
    );
  }

  return (
    <article className="relative flex flex-col rounded-card bg-surface p-2 shadow-card transition-shadow hover:shadow-card-hover">
      <div className="relative aspect-[5/4] overflow-hidden rounded-xl bg-ground-2">
        <FoodImage
          image={product.image}
          sizes={imageSizes.card}
          priority={priority}
          className="absolute inset-0 size-full object-cover"
        />
        {badge ? <div className="absolute top-2 left-2 flex">{badge}</div> : null}
      </div>
      <FavoriteButton product={product} className="absolute top-3.5 right-3.5" />
      <div className="flex flex-1 flex-col px-1.5 pt-2.5 pb-1">
        {title}
        <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-2">{product.description}</p>
        <ProductRating product={product} />
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <ProductPrice product={product} />
          <AddButton product={product} onAdd={() => quickAdd(product)} className="relative" />
        </div>
      </div>
    </article>
  );
}

export function ProductPrice({ product, className }: { product: Product; className?: string }) {
  return (
    <p className={cn('leading-tight', className)}>
      {hasVariablePrice(product) ? <span className="block text-[11px] font-medium text-ink-2">a partir de</span> : null}
      {product.compareAtPrice ? (
        <s className="tabular block text-[12px] text-ink-2">
          <span className="sr-only">De </span>
          {formatBRL(product.compareAtPrice)}
        </s>
      ) : null}
      <span className="tabular text-[17px] font-bold tracking-[-0.01em] text-ink">
        {product.compareAtPrice ? <span className="sr-only">por </span> : null}
        {formatBRL(startingPrice(product))}
      </span>
    </p>
  );
}

export function ProductRating({ product }: { product: Product }) {
  if (!product.rating || !store.showDemoRatings) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-[12px] text-ink-2">
      <Star className="size-3.5 fill-star text-star" aria-hidden />
      <span className="font-semibold text-ink">
        <span className="sr-only">Avaliação demonstrativa: </span>
        {formatRating(product.rating.value)}
      </span>
      <span aria-hidden>· demo</span>
    </p>
  );
}

interface FavoriteButtonProps {
  product: Product;
  className?: string;
  small?: boolean;
}

export function FavoriteButton({ product, className, small }: FavoriteButtonProps) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(product.id);
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={`Favoritar ${product.name}`}
      onClick={() => toggle(product.id)}
      className={cn(
        'press z-[2] grid place-items-center rounded-full bg-surface/95 shadow-float transition-colors before:absolute before:-inset-1 hover:bg-surface',
        small ? 'size-8' : 'size-9',
        className,
      )}
    >
      <Heart
        className={cn(
          'transition-[fill,color] duration-150',
          small ? 'size-4' : 'size-[18px]',
          active ? 'fill-brand text-brand' : 'fill-transparent text-ink',
        )}
        strokeWidth={2}
        aria-hidden
      />
    </button>
  );
}

interface AddButtonProps {
  product: Product;
  onAdd: () => void;
  className?: string;
}

export function AddButton({ product, onAdd, className }: AddButtonProps) {
  const needsChoice = requiresChoice(product);
  return (
    <button
      type="button"
      onClick={onAdd}
      aria-label={needsChoice ? `Escolher opções de ${product.name}` : `Adicionar ${product.name} à sacola`}
      className={cn(
        'press z-[2] grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white shadow-brand-sm transition-colors before:absolute before:-inset-1 hover:bg-brand-dark',
        className,
      )}
    >
      <Plus className="size-[22px]" strokeWidth={2.5} aria-hidden />
    </button>
  );
}
