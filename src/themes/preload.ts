import { imageSizes } from '../lib/imageSizes';
import type { ResponsiveImage } from '../types';
import { featuredProducts, railCategories } from './index';
import type { ThemeDefinition } from './types';

const warmed = new Set<string>();

/** Starts the download of a photo the next theme shows right away; the browser cache does the rest. */
function warm(image: ResponsiveImage, sizes?: string) {
  if (typeof Image === 'undefined' || warmed.has(image.src)) return;
  warmed.add(image.src);
  const element = new Image();
  element.decoding = 'async';
  if (image.srcSet && sizes) {
    element.sizes = sizes;
    element.srcset = image.srcSet;
  }
  element.src = image.src;
}

/**
 * Loads a theme's fonts and warms the photos of the first viewport.
 * Resolves when the fonts are ready, so the switch never shows a fallback face.
 */
export function preloadTheme(theme: ThemeDefinition): Promise<void> {
  const [firstSlide] = theme.heroSlides;
  if (firstSlide) warm(firstSlide.image, imageSizes.hero);
  for (const category of railCategories(theme)) warm(category.image);
  for (const product of featuredProducts(theme)) warm(product.image, imageSizes.card);
  warm(theme.comboBanner.image, imageSizes.combo);

  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve();
  return Promise.all(theme.fonts.map((font) => document.fonts.load(font).catch(() => []))).then(() => undefined);
}
