import { describe, expect, it } from 'vitest';
import indexCss from '../index.css?raw';
import type { ResponsiveImage } from '../types';
import {
  ALL_CATEGORIES,
  categoryName,
  defaultTheme,
  featuredProducts,
  getProduct,
  getTheme,
  getThemeProduct,
  initialThemeId,
  railCategories,
  themes,
  themeStorageKey,
} from './index';
import themesCss from './themes.css?raw';

/** Every photo file shipped in /public (keys only, nothing is loaded). */
const publicFiles = new Set(
  Object.keys(import.meta.glob('../../public/images/**/*.webp')).map((path) => path.replace('../../public', '')),
);

const files = (image: ResponsiveImage) => [image.src, ...(image.srcSet?.split(', ').map((entry) => entry.split(' ')[0]) ?? [])];

/** The value of a token in the first `selector {…}` block that declares it. */
function token(css: string, selector: string, name: string): string | undefined {
  for (let start = css.indexOf(`${selector} {`); start !== -1; start = css.indexOf(`${selector} {`, start + 1)) {
    const block = css.slice(start, css.indexOf('}', start));
    const value = block.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1];
    if (value) return value.trim().toLowerCase();
  }
  return undefined;
}

describe('theme registry', () => {
  it('starts on Pizzaria and opens a segment from ?tema=', () => {
    expect(defaultTheme.id).toBe('pizzaria');
    expect(initialThemeId('')).toBe('pizzaria');
    expect(initialThemeId('?tema=cafeteria')).toBe('cafeteria');
    expect(initialThemeId('?tema=padaria')).toBe('pizzaria');
  });

  it('keeps the original storage keys for Pizzaria and separate ones for the others', () => {
    expect(themeStorageKey('seu-negocio:cart:v1', 'pizzaria')).toBe('seu-negocio:cart:v1');
    expect(themeStorageKey('seu-negocio:cart:v1', 'acaiteria')).toBe('seu-negocio:cart:v1:acaiteria');
  });

  it('has product ids that are unique across every theme', () => {
    const ids = themes.flatMap((theme) => theme.catalog.products.map((product) => product.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives a category shared by two themes the same name', () => {
    for (const theme of themes) {
      for (const category of theme.catalog.categories) {
        expect(categoryName(category.id), `${theme.id}/${category.id}`).toBe(category.name);
      }
    }
  });

  it('never opens another brand’s product in the product sheet', () => {
    expect(getThemeProduct(getTheme('cafeteria'), 'cappuccino')?.name).toBe('Cappuccino');
    expect(getThemeProduct(getTheme('pizzaria'), 'cappuccino')).toBeUndefined();
    expect(getProduct('cappuccino')?.name).toBe('Cappuccino');
  });
});

describe.each(themes.map((theme) => [theme.id, theme] as const))('theme %s', (_id, theme) => {
  const categoryIds = theme.catalog.categories.map((category) => category.id);

  it('fills the same template slots as every other theme', () => {
    expect(theme.heroSlides).toHaveLength(defaultTheme.heroSlides.length);
    expect(railCategories(theme)).toHaveLength(railCategories(defaultTheme).length);
    expect(railCategories(theme)[0].id).toBe(ALL_CATEGORIES);
    expect(featuredProducts(theme)).toHaveLength(defaultTheme.catalog.featuredProductIds.length);
    expect(theme.catalog.categories.find((category) => category.id === 'combos')?.hiddenFromRail).toBe(true);
    expect(theme.catalog.products.filter((product) => product.categoryId === 'combos')).toHaveLength(2);
  });

  it('places every product in a category of its own menu', () => {
    for (const product of theme.catalog.products) {
      expect(categoryIds, product.id).toContain(product.categoryId);
      expect(theme.catalog.menuSectionOrder, product.id).toContain(product.categoryId);
    }
  });

  it('points banners at categories and routes that exist', () => {
    for (const slide of theme.heroSlides) {
      if (slide.target.kind === 'category') expect(categoryIds).toContain(slide.target.category);
      else expect(slide.target.to).toMatch(/^\/(ofertas|cardapio)/);
    }
  });

  it('ships every photo it references', () => {
    const images = [
      ...theme.catalog.products.map((product) => product.image),
      ...theme.catalog.categories.map((category) => category.image),
      ...theme.heroSlides.map((slide) => slide.image),
      theme.comboBanner.image,
    ];
    for (const file of images.flatMap(files)) expect(publicFiles, file).toContain(file);
    for (const product of theme.catalog.products) expect(product.image.alt, product.id).not.toBe('');
  });

  it('shows switcher swatches that match its CSS tokens', () => {
    const css = theme.id === defaultTheme.id ? indexCss : themesCss;
    const selector = theme.id === defaultTheme.id ? '@theme' : `[data-theme='${theme.id}']`;
    expect(token(css, selector, '--color-brand')).toBe(theme.swatches.brand);
    expect(token(css, selector, '--color-oven')).toBe(theme.swatches.oven);
    expect(token(css, selector, '--color-ground')).toBe(theme.swatches.ground);
  });

  it('never claims a bigger combo discount than its combos give', () => {
    const percent = Number(theme.comboBanner.sticker.replace('%', ''));
    const best = Math.max(
      ...theme.catalog.products
        .filter((product) => product.compareAtPrice)
        .map((product) => Math.round((1 - product.basePrice / (product.compareAtPrice as number)) * 100)),
    );
    expect(percent).toBe(best);
    expect(theme.comboBanner.title).toContain(`${percent}%`);
  });
});
