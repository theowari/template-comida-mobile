import { UtensilsCrossed } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../../lib/cn';
import type { ResponsiveImage } from '../../types';

interface FoodImageProps {
  image: ResponsiveImage;
  className?: string;
  sizes?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

/** Product photo with a quiet fallback when the file fails to load. */
export function FoodImage({ image, className, sizes, priority = false, style }: FoodImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        role={image.alt ? 'img' : undefined}
        aria-label={image.alt || undefined}
        className={cn('grid place-items-center bg-ground-2 text-ink-2', className)}
      >
        <UtensilsCrossed className="size-1/4 max-h-10 max-w-10 opacity-60" strokeWidth={1.5} aria-hidden />
      </div>
    );
  }

  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      alt={image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
      className={className}
      style={style}
    />
  );
}
