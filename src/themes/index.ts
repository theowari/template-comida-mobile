import type { Category, Product } from '../types';
import { acaiteria } from './acaiteria';
import { cafeteria } from './cafeteria';
import { confeitaria } from './confeitaria';
import { pizzaria } from './pizzaria';
import type { ThemeDefinition, ThemeId } from './types';

/**
 * Every brand of the template, in switcher order. Adding one takes a folder
 * like src/themes/confeitaria (content, catalog, photos), its token block in
 * src/themes/themes.css and an entry here; no component changes.
 */
export const themes: ThemeDefinition[] = [pizzaria, confeitaria, cafeteria, acaiteria];

/** The original identity: what every visit starts on. */
export const defaultTheme = pizzaria;

/** Category filter value that means "the whole catalog". */
export const ALL_CATEGORIES = 'todas';

const byId = new Map(themes.map((theme) => [theme.id, theme]));

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && byId.has(value as ThemeId);
}

export function getTheme(id: ThemeId): ThemeDefinition {
  return byId.get(id) ?? defaultTheme;
}

/** `?tema=cafeteria` opens the site on that theme, so a prospect can get a link to their segment. */
export function initialThemeId(search = typeof window === 'undefined' ? '' : window.location.search): ThemeId {
  const requested = new URLSearchParams(search).get('tema');
  return isThemeId(requested) ? requested : defaultTheme.id;
}

/**
 * localStorage key for data that belongs to one brand (bag, favorites).
 * The default theme keeps the original keys, so existing bags survive.
 */
export function themeStorageKey(key: string, id: ThemeId): string {
  return id === defaultTheme.id ? key : `${key}:${id}`;
}

/* Product ids are unique across themes (tested), so bag lines, favorites and order lines always resolve. */
const productIndex = new Map(themes.flatMap((theme) => theme.catalog.products.map((product) => [product.id, product] as const)));

export function getProduct(id: string | null | undefined): Product | undefined {
  return id ? productIndex.get(id) : undefined;
}

/** A product of this theme only (the product sheet never opens another brand's item). */
export function getThemeProduct(theme: ThemeDefinition, id: string | null | undefined): Product | undefined {
  const product = getProduct(id);
  return product && theme.catalog.products.includes(product) ? product : undefined;
}

/* A category id shared by two themes keeps the same name (tested). */
const categoryNames = new Map(themes.flatMap((theme) => theme.catalog.categories.map((category) => [category.id, category.name] as const)));

export function categoryName(id: string): string {
  return categoryNames.get(id) ?? id;
}

/** Categories shown in the rail and the filter sheet. */
export function railCategories(theme: ThemeDefinition): Category[] {
  return theme.catalog.categories.filter((category) => !category.hiddenFromRail);
}

/** "Mais pedidos", without unavailable products. */
export function featuredProducts(theme: ThemeDefinition): Product[] {
  return theme.catalog.featuredProductIds
    .map((id) => getProduct(id))
    .filter((product): product is Product => Boolean(product?.available));
}

export type { ThemeDefinition, ThemeId } from './types';
