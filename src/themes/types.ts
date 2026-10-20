import type { LucideIcon } from 'lucide-react';
import type { Category, CategoryFilter, CategoryId, Product, ResponsiveImage } from '../types';

/** Also the value of `?tema=` and of `data-theme` on <html>. */
export type ThemeId = 'pizzaria' | 'confeitaria' | 'cafeteria' | 'acaiteria';

/** Symbol drawn inside the logo tile (see components/ui/Logo). */
export type LogoMarkId = 'slice' | 'cupcake' | 'bean' | 'bowl';

export type BannerTarget = { kind: 'category'; category: CategoryFilter } | { kind: 'route'; to: string };

export interface HeroSlide {
  id: string;
  badge: string;
  titleLines: [string, string];
  description: string;
  cta: string;
  target: BannerTarget;
  image: ResponsiveImage;
  /** CSS object-position for the photo. */
  focus: string;
}

export interface ComboBanner {
  badge: string;
  title: string;
  description: string;
  cta: string;
  to: string;
  sticker: string;
  image: ResponsiveImage;
  /** CSS object-position for the photo. */
  focus: string;
}

/** Brand copy and identity. Generic interface copy stays in the components. */
export interface ThemeBrand {
  /** Wordmark: the first part in ink, the second in the brand color. */
  name: readonly [string, string];
  tagline: string;
  /** Page title after the name: "Seu negócio · Pizzas e delivery". */
  segment: string;
  /** Meta description. */
  description: string;
  /** Screen-reader heading of the home page, after the name. */
  homeHeading: string;
  searchPlaceholder: string;
  notesPlaceholder: string;
  openingHours: string;
  greetingIcon: LucideIcon;
  mark: LogoMarkId;
}

export interface ThemeCatalog {
  products: Product[];
  /** Rail order. Categories with `hiddenFromRail` only appear as menu sections. */
  categories: Category[];
  /** Menu section order. */
  menuSectionOrder: CategoryId[];
  /** "Mais pedidos" on the home page, in order. */
  featuredProductIds: string[];
}

/**
 * One brand of the template. Colors and type live in CSS (src/themes/themes.css)
 * under [data-theme='<id>']; everything here is content and identity.
 */
export interface ThemeDefinition {
  id: ThemeId;
  /** Segment name in the switcher. */
  label: string;
  /** Palette chips for the switcher, in the order brand, banner, ground. Tested against the CSS tokens. */
  swatches: { brand: string; oven: string; ground: string };
  /** CSS font shorthands loaded before the switch, so text never flashes a fallback face. */
  fonts: string[];
  brand: ThemeBrand;
  catalog: ThemeCatalog;
  heroSlides: HeroSlide[];
  comboBanner: ComboBanner;
}
