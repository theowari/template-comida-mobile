import { UtensilsCrossed } from 'lucide-react';
import { useState, type SyntheticEvent } from 'react';
import { cn } from '../../lib/cn';
import type { ResponsiveImage } from '../../types';

interface FoodImageProps {
  image: ResponsiveImage;
  /** The frame: position, size, radius, mask, placeholder background. */
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Applied to the photo itself (object-position). */
  style?: React.CSSProperties;
}

interface Layer {
  id: number;
  image: ResponsiveImage;
  visible: boolean;
  failed: boolean;
}

/** Crossfade length, plus a margin for the safety net that clears covered layers. */
const FADE_MS = 420;

const sameImage = (a: ResponsiveImage, b: ResponsiveImage) => a.src === b.src && a.srcSet === b.srcSet;

/**
 * Product photo with a quiet fallback when the file fails to load.
 * When the photo changes (a new theme), the new one is stacked on top, waits
 * until it has loaded and decoded, then fades in over the old one: the frame
 * is never empty, and repeated changes simply stack.
 */
export function FoodImage({ image, className, sizes, priority = false, style }: FoodImageProps) {
  const [layers, setLayers] = useState<Layer[]>(() => [{ id: 0, image, visible: true, failed: false }]);
  const top = layers[layers.length - 1];

  if (!sameImage(top.image, image)) {
    setLayers([...layers, { id: top.id + 1, image, visible: false, failed: false }]);
  }

  // Once a layer is fully in, the ones under it are covered for good.
  const settle = (id: number) =>
    setLayers((current) => {
      const index = current.findIndex((layer) => layer.id === id);
      return index > 0 ? current.slice(index) : current;
    });

  const reveal = (id: number, failed = false) => {
    setLayers((current) => current.map((layer) => (layer.id === id ? { ...layer, visible: true, failed } : layer)));
    window.setTimeout(() => settle(id), FADE_MS + 200);
  };

  const onLoad = (layer: Layer) => (event: SyntheticEvent<HTMLImageElement>) => {
    if (layer.visible) return;
    // Decode first so the fade never starts on a half-painted photo.
    const element = event.currentTarget;
    void Promise.resolve(element.decode?.())
      .catch(() => undefined)
      .then(() => reveal(layer.id));
  };

  return (
    // Layers share one grid cell instead of being absolutely positioned: a positioned photo
    // would change how nearby text is rasterized (no subpixel antialiasing in sticky bars).
    <span className={cn('grid grid-cols-1 grid-rows-1 overflow-hidden', className)}>
      {layers.map((layer, index) => {
        const isTop = index === layers.length - 1;
        const layerClass = cn(
          'col-start-1 row-start-1 size-full min-h-0 min-w-0 rounded-[inherit] object-cover transition-opacity duration-[420ms] ease-out motion-reduce:duration-200',
          layer.visible ? 'opacity-100' : 'opacity-0',
        );
        const onTransitionEnd = (event: React.TransitionEvent) => {
          if (event.propertyName === 'opacity' && layer.visible) settle(layer.id);
        };

        if (layer.failed) {
          return (
            <span
              key={layer.id}
              role={isTop && image.alt ? 'img' : undefined}
              aria-label={isTop ? image.alt || undefined : undefined}
              aria-hidden={isTop ? undefined : true}
              className={cn(layerClass, 'grid place-items-center bg-ground-2 text-ink-2')}
              onTransitionEnd={onTransitionEnd}
            >
              <UtensilsCrossed className="size-1/4 max-h-10 max-w-10 opacity-60" strokeWidth={1.5} aria-hidden />
            </span>
          );
        }

        return (
          <img
            key={layer.id}
            src={layer.image.src}
            srcSet={layer.image.srcSet}
            sizes={layer.image.srcSet ? sizes : undefined}
            alt={isTop ? image.alt : ''}
            aria-hidden={isTop ? undefined : true}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
            draggable={false}
            onLoad={onLoad(layer)}
            onError={() => reveal(layer.id, true)}
            onTransitionEnd={onTransitionEnd}
            className={layerClass}
            style={style}
          />
        );
      })}
    </span>
  );
}
