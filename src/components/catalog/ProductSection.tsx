import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { cn } from '../../lib/cn';
import type { Product } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  columns?: 3 | 4;
  /** Phones: cards in two columns or full-width rows. */
  mobileLayout?: 'card' | 'row';
  priorityCount?: number;
}

export function ProductGrid({ products, columns = 4, mobileLayout = 'card', priorityCount = 0 }: ProductGridProps) {
  if (mobileLayout === 'row') {
    return (
      <>
        <ul className="grid gap-3 sm:hidden">
          {products.map((product, index) => (
            <li key={product.id}>
              <ProductCard product={product} layout="row" priority={index < priorityCount} />
            </li>
          ))}
        </ul>
        <ul className={cn('hidden gap-4 sm:grid sm:grid-cols-3', columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3')}>
          {products.map((product, index) => (
            <li key={product.id} className="flex">
              <ProductCard product={product} priority={index < priorityCount} />
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <ul className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4', columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3 lg:gap-5')}>
      {products.map((product, index) => (
        <li key={product.id} className="flex [&>article]:w-full">
          <ProductCard product={product} priority={index < priorityCount} />
        </li>
      ))}
    </ul>
  );
}

interface ProductSectionProps {
  id?: string;
  title: string;
  titleId?: string;
  link?: { to: string; label: string };
  aside?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ProductSection({ id, title, titleId, link, aside, children, className }: ProductSectionProps) {
  const headingId = titleId ?? `${id ?? title}-titulo`;
  return (
    <section id={id} aria-labelledby={headingId} className={cn('scroll-mt-24 lg:scroll-mt-28', className)}>
      <div className="mb-3 flex items-end justify-between gap-3 lg:mb-4">
        <div className="min-w-0">
          <h2 id={headingId} className="text-xl leading-tight font-bold tracking-[-0.015em] lg:text-2xl">
            {title}
          </h2>
          {aside}
        </div>
        {link ? (
          <Link
            to={link.to}
            className="-mr-2 inline-flex h-10 shrink-0 items-center gap-1 rounded-full px-2 text-[14px] font-semibold text-brand-dark hover:bg-brand-50"
          >
            {link.label}
            <ArrowRight className="size-4" strokeWidth={2.25} aria-hidden />
          </Link>
        ) : null}
      </div>
      {children}
    </section>
  );
}
