import { Pizza } from 'lucide-react';
import { comboDiscountPercent } from '../catalog';
import type { ThemeDefinition } from '../types';
import { categories, menuSectionOrder } from './categories';
import { image } from './images';
import { featuredProductIds, products } from './products';

const comboDiscount = comboDiscountPercent(products);

/** The original identity, and the default theme. Its tokens are the @theme values in src/index.css. */
export const pizzaria: ThemeDefinition = {
  id: 'pizzaria',
  label: 'Pizzaria',
  swatches: { brand: '#d71935', oven: '#17110f', ground: '#f7f3ef' },
  fonts: ['400 16px "Inter Variable"', '800 16px "Barlow Condensed"', 'italic 800 16px "Barlow Condensed"'],
  brand: {
    name: ['Seu', 'negócio'],
    tagline: 'Sabor que chega até você.',
    segment: 'Pizzas e delivery',
    description: 'Seu negócio: pizzas, pães de alho, acompanhamentos, bebidas e sobremesas com entrega ou retirada.',
    homeHeading: 'pizzas, lanches e bebidas com entrega ou retirada',
    searchPlaceholder: 'Busque sua pizza favorita...',
    notesPlaceholder: 'Ex.: cortar em 8 pedaços, molho à parte',
    openingHours: 'Todos os dias, das 18h às 23h30',
    greetingIcon: Pizza,
    mark: 'slice',
  },
  catalog: { products, categories, menuSectionOrder, featuredProductIds },
  heroSlides: [
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
  ],
  comboBanner: {
    badge: 'Combos exclusivos',
    title: `Até ${comboDiscount}% de desconto`,
    description: 'Aproveite nossas combinações especiais.',
    cta: 'Pedir agora',
    to: '/ofertas#combos',
    sticker: `${comboDiscount}%`,
    image: image('banner-combo', 'Pizza de pepperoni vista de cima ao lado de um copo de bebida gelada'),
    focus: '40% 50%',
  },
};
