import type { ResponsiveImage } from '../types';

/**
 * Image registries. Every photo is an Unsplash photo (Unsplash License),
 * downloaded to /public/images so the app does not depend on a remote CDN.
 * `source` keeps the original Unsplash photo id for provenance and re-downloads.
 */
export interface ImageEntry {
  base: string;
  sizes: number[];
  source: string;
}

export const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}`;

/** Typed `image(key, alt)` for one theme's registry, plus the Unsplash source of each key. */
export function defineImages<Key extends string>(registry: Record<Key, ImageEntry>) {
  function image(key: Key, alt: string): ResponsiveImage {
    const entry = registry[key];
    if (entry.sizes.length === 0) {
      return { src: `${entry.base}.webp`, alt };
    }
    const [smallest] = entry.sizes;
    return {
      src: `${entry.base}-${smallest}.webp`,
      srcSet: entry.sizes.map((size) => `${entry.base}-${size}.webp ${size}w`).join(', '),
      alt,
    };
  }

  const sources = Object.fromEntries(Object.entries<ImageEntry>(registry).map(([key, entry]) => [key, entry.source])) as Record<
    Key,
    string
  >;

  return { image, sources };
}

/** Product photos: square, 400 and 800 px. */
export const productSizes = [400, 800];
/** Banners: 4:3, 800 and 1400 px. */
export const bannerSizes = [800, 1400];
/** Category thumbnails: one 192 px file. */
export const thumbSizes: number[] = [];
