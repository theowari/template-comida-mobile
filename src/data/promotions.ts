import type { CategoryFilter, Coupon } from '../types';
import { image } from './images';
import { products } from './products';

/*
 * DEMO PROMOTIONS. Banners, discounts and coupons are demonstrative
 * until a real promotion is configured in the backend.
 */

export type BannerTarget =
  | { kind: 'category'; category: CategoryFilter }
  | { kind: 'route'; to: string };

export interface HeroSlide {
  id: string;
  badge: string;
  titleLines: [string, string];
  description: string;
  cta: string;
  target: BannerTarget;
  image: ReturnType<typeof image>;
  /** CSS object-position for the photo. */
  focus: string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 'mais-sabor',
    badge: 'Oferta por tempo limitado',
    titleLines: ['Mais sabor.', 'Mais felicidade.'],
    description: 'Pizzas deliciosas, preparadas com carinho para você.',
    cta: 'Pedir agora',
    target: { kind: 'category', category: 'pizzas' },
    image: image('hero-queijo', 'Fatia de pizza sendo servida com queijo derretido'),
    focus: '60% 45%',
  },
  {
    id: 'combos',
    badge: 'Para dividir',
    titleLines: ['Pizza e refri', 'num combo só.'],
    description: 'Combos para casal e família com preço especial.',
    cta: 'Ver combos',
    target: { kind: 'route', to: '/ofertas#combos' },
    image: image('hero-pepperoni', 'Fatia de pizza de pepperoni sendo levantada com queijo puxando'),
    focus: '55% 50%',
  },
  {
    id: 'sobremesas',
    badge: 'Sobremesas',
    titleLines: ['Feche o pedido', 'com um doce.'],
    description: 'Brownie e petit gâteau para terminar bem.',
    cta: 'Ver sobremesas',
    target: { kind: 'category', category: 'sobremesas' },
    image: image('hero-sobremesa', 'Brownie com sorvete e calda de chocolate'),
    focus: '50% 50%',
  },
];

/** Highest combo discount, computed from the catalog so the banner never overstates it. */
export const maxComboDiscountPercent = Math.round(
  Math.max(
    0,
    ...products
      .filter((product) => product.categoryId === 'combos' && product.compareAtPrice)
      .map((product) => 1 - product.basePrice / (product.compareAtPrice as number)),
  ) * 100,
);

export const comboBanner = {
  badge: 'Combos exclusivos',
  title: `Até ${maxComboDiscountPercent}% de desconto`,
  description: 'Aproveite nossas combinações especiais.',
  cta: 'Pedir agora',
  to: '/ofertas#combos',
  sticker: `${maxComboDiscountPercent}%`,
  image: image('banner-combo', 'Pizza de pepperoni vista de cima ao lado de um copo de bebida gelada'),
};

export const coupons: Coupon[] = [
  {
    code: 'BEMVINDO10',
    kind: 'percent',
    value: 10,
    maxDiscount: 1500,
    minSubtotal: 4000,
    description: '10% de desconto em pedidos a partir de R$ 40,00 (até R$ 15,00).',
    isDemo: true,
  },
  {
    code: 'FRETEGRATIS',
    kind: 'free-delivery',
    value: 0,
    minSubtotal: 6000,
    description: 'Entrega grátis em pedidos a partir de R$ 60,00.',
    isDemo: true,
  },
];

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return coupons.find((coupon) => coupon.code === normalized);
}
