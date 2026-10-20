import type { ResponsiveImage } from '../types';

/**
 * Central image registry. Every photo is an Unsplash photo (Unsplash License),
 * downloaded to /public/images so the app does not depend on a remote CDN.
 * `source` keeps the original Unsplash photo id for provenance and re-downloads.
 */
interface ImageEntry {
  base: string;
  sizes: number[];
  source: string;
}

const UNSPLASH = (id: string) => `https://images.unsplash.com/photo-${id}`;

const registry = {
  // Products (square, 400 and 800 px)
  'pizza-suprema': { base: '/images/products/pizza-suprema', sizes: [400, 800], source: UNSPLASH('1604382354936-07c5d9983bd3') },
  'pizza-quatro-queijos': { base: '/images/products/pizza-quatro-queijos', sizes: [400, 800], source: UNSPLASH('1773620496832-9b62e8912452') },
  'pizza-bbq-especial': { base: '/images/products/pizza-bbq-especial', sizes: [400, 800], source: UNSPLASH('1565299624946-b28f40a0ae38') },
  'pizza-pepperoni': { base: '/images/products/pizza-pepperoni', sizes: [400, 800], source: UNSPLASH('1628840042765-356cda07504e') },
  'pizza-margherita': { base: '/images/products/pizza-margherita', sizes: [400, 800], source: UNSPLASH('1595854341625-f33ee10dbf94') },
  'pizza-mediterranea': { base: '/images/products/pizza-mediterranea', sizes: [400, 800], source: UNSPLASH('1681567604770-0dc826c870ae') },
  'pao-de-alho-especial': { base: '/images/products/pao-de-alho-especial', sizes: [400, 800], source: UNSPLASH('1761344788266-5f6957aeea33') },
  'pao-de-alho-tradicional': { base: '/images/products/pao-de-alho-tradicional', sizes: [400, 800], source: UNSPLASH('1619535860434-ba1d8fa12536') },
  'frango-empanado': { base: '/images/products/frango-empanado', sizes: [400, 800], source: UNSPLASH('1562967914-608f82629710') },
  'batata-parmesao': { base: '/images/products/batata-parmesao', sizes: [400, 800], source: UNSPLASH('1573080496219-bb080dd4f877') },
  'refrigerante-lata': { base: '/images/products/refrigerante-lata', sizes: [400, 800], source: UNSPLASH('1629654613528-5d0a2e4166de') },
  limonada: { base: '/images/products/limonada', sizes: [400, 800], source: UNSPLASH('1621263764928-df1444c5e859') },
  'cha-gelado': { base: '/images/products/cha-gelado', sizes: [400, 800], source: UNSPLASH('1581636625402-29b2a704ef13') },
  brownie: { base: '/images/products/brownie', sizes: [400, 800], source: UNSPLASH('1636743715220-d8f8dd900b87') },
  'petit-gateau': { base: '/images/products/petit-gateau', sizes: [400, 800], source: UNSPLASH('1624353365286-3f8d62daad51') },
  'combo-familia': { base: '/images/products/combo-familia', sizes: [400, 800], source: UNSPLASH('1621510564330-c87695020b53') },
  'combo-casal': { base: '/images/products/combo-casal', sizes: [400, 800], source: UNSPLASH('1615719413546-198b25453f85') },

  // Banners (4:3, 800 and 1400 px)
  'hero-queijo': { base: '/images/banners/hero-queijo', sizes: [800, 1400], source: UNSPLASH('1769458313988-2cd932ab2777') },
  'hero-pepperoni': { base: '/images/banners/hero-pepperoni', sizes: [800, 1400], source: UNSPLASH('1777891258113-fa2b0e8edc5f') },
  'hero-sobremesa': { base: '/images/banners/hero-sobremesa', sizes: [800, 1400], source: UNSPLASH('1654796605330-8a1248a2cb07') },
  'banner-combo': { base: '/images/banners/combo', sizes: [800, 1400], source: UNSPLASH('1506354666786-959d6d497f1a') },

  // Category thumbnails (192 px)
  'cat-todas': { base: '/images/categories/todas', sizes: [], source: UNSPLASH('1611915365928-565c527a0590') },
  'cat-pizzas': { base: '/images/categories/pizzas', sizes: [], source: UNSPLASH('1777891257674-36c5532e6654') },
  'cat-paes-de-alho': { base: '/images/categories/paes-de-alho', sizes: [], source: UNSPLASH('1587676353811-1708ddf47031') },
  'cat-acompanhamentos': { base: '/images/categories/acompanhamentos', sizes: [], source: UNSPLASH('1585703900468-13c7a978ad86') },
  'cat-bebidas': { base: '/images/categories/bebidas', sizes: [], source: UNSPLASH('1636144832475-0d81f893354d') },
  'cat-sobremesas': { base: '/images/categories/sobremesas', sizes: [], source: UNSPLASH('1605807646983-377bc5a76493') },
} satisfies Record<string, ImageEntry>;

export type ImageKey = keyof typeof registry;

export function image(key: ImageKey, alt: string): ResponsiveImage {
  const entry: ImageEntry = registry[key];
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

export const imageSources = Object.fromEntries(
  Object.entries(registry).map(([key, entry]) => [key, entry.source]),
) as Record<ImageKey, string>;
